import axios from "npm:axios";
import { v1 as uuid } from "npm:uuid";
import { BadRequestException } from "../exceptions.ts";

const NEXT_PUBLIC_SUPABASE_URL = Deno.env.get("NEXT_PUBLIC_SUPABASE_URL")!;
const CREZCO_API_KEY = Deno.env.get("CREZCO_API_KEY")!;
const CREZCO_API_URL = Deno.env.get("CREZCO_API_URL")!;
const APP_DOMAIN = Deno.env.get("APP_DOMAIN")!;
const IS_PROD = Deno.env.get("ENVIRONMENT") === 'production';

export const CrezcoConfig = {
  headers: {
    "X-Crezco-Key": CREZCO_API_KEY,
  },
};

export async function createCrezcoPaymentDemand(
  crezcoUser: string,
  amount: number,
  reference: string,
  currency: string,
  metadata: any,
  successUri: string,
  errorUri: string,
  initialScreen: "DetailsCheck" | "BankSelection" | "ContinueToBank"
) {
  try {
    // Create payment demand
    const demandResult = await axios.post(
      `${CREZCO_API_URL}/v1/users/${crezcoUser}/pay-demands`,
      {
        request: {
          useDefaultBeneficiaryAccount: true,
          reference,
          currency,
          amount,
          metadata,
        },
        idempotencyId: uuid({
          msecs: new Date().getTime(),
          nsecs: 5678,
        }),
      },
      CrezcoConfig
    );

    if (demandResult.status === 201) {
      // Create payment with the demand
      const paymentResult = await axios.post(
        `${CREZCO_API_URL}/v1/users/${crezcoUser}/pay-demands/${demandResult.data}/payment?initialScreen=${initialScreen}&finalScreen=PaymentStatus&successCallbackUri=${successUri}&failureCallbackUri=${errorUri}`,
        {},
        CrezcoConfig
      );

      if (paymentResult.status !== 200) {
        console.error('Payment creation failed:', paymentResult);
        throw new BadRequestException("Failed to create payment");
      }

      // Check and setup webhook if needed
      const webhookResult = await axios.get(
        `${CREZCO_API_URL}/v1/webhooks`,
        CrezcoConfig
      );

      // Determine callback URL based on environment
      const callbackUrl = IS_PROD
        ? `https://${APP_DOMAIN}/crezco_webhook_callback`
        : `${NEXT_PUBLIC_SUPABASE_URL}/functions/v1/crezco_webhook_callback`;

      // Create webhook if it doesn't exist
      if (
        webhookResult.status === 200 &&
        (!webhookResult.data ||
          webhookResult.data.length == 0 ||
          !webhookResult.data.some((wh: any) => wh.callback === callbackUrl))
      ) {
        await axios.post(
          `${CREZCO_API_URL}/v1/webhooks`,
          {
            type: "Payment",
            eventType: "PaymentAll",
            callback: callbackUrl,
          },
          CrezcoConfig
        );
      }

      return {
        status: "success",
        paymentUri: paymentResult.data.redirect,
      };
    }

    console.error('Payment demand creation failed:', demandResult);
    throw new BadRequestException("Failed to create payment demand");
  } catch (error) {
    console.error('Crezco payment creation error:', error);
    return {
      status: "error",
      reason: error instanceof BadRequestException ? error.message : "Unexpected error occurred"
    };
  }
}
