import { Buffer } from "node:buffer";
import { supabase } from "../db.ts";
import { fetchHTML, send_email } from "../email_sending/index.ts";
import { BadRequestException, handleException } from "../exceptions.ts";
import { createLog } from "./changesLog.ts";

interface LetterData {
  letterBase64: string;
  letterName: string;
}

interface LatePaymentLetterData {
  debtorDetails: {
    email: string;
    business_name: string;
  };
  requestBusinessDetails: {
    business_name: string;
    email: string;
  };
  reqId: string;
  businessId: string;
  letterUrl: string;
  letterName: string;
  letterTemplate?: string;
}

Deno.serve(async (req: Request) => {
  const body = await req.json();
  const { action, data } = body;

  return handleException(async () => {
    switch (action) {
      case "generate_late_payment_letter":
        return handle_generate_late_payment_letter(data as LetterData);
      case "log_late_payment_letter":
        return handle_log_late_payment_letter(data as LatePaymentLetterData);
      default:
        throw new BadRequestException(`Unknown action: ${action}`);
    }
  });
});

async function handle_generate_late_payment_letter({ letterBase64, letterName }: LetterData) {
  const { error } = await supabase.storage
    .from('letters')
    .upload(`${letterName}.pdf`, Buffer.from(letterBase64, 'base64'), {
      contentType: 'application/pdf'
    });

  if (error) throw new BadRequestException(error.message);
  return { success: true };
}
