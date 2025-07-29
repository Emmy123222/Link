import email_client from "npm:@sendgrid/mail";
import { emailFromChat } from "./templates/email_from_chat.ts";
import { latePayment } from "./templates/late_payment.ts";
import { paymentRequestCustomerEmail } from "./templates/payment_request_customer_email.ts";
import { paymentRequestCustomerEmailWithItems } from "./templates/payment_request_customer_email_with_items.ts";
import { paymentRequestUpdate } from "./templates/payment_request_update.ts";
import { paymentRequestUpdateForVendor } from "./templates/payment_request_update_for_vendor.ts";
import { resetPasswordEmail } from "./templates/reset_password_email.ts";
import { verifyAccountEmail } from "./templates/verify_account_email.ts";
import { verifyBusinessEmail } from "./templates/verify_business_email.ts";

const sendgridApiKey = Deno.env.get("SENDGRID_API_KEY")!;

export async function send_email({
  to,
  subject,
  html, replyTo,
  business_name,
  senderBusinessName,
  attachments = [],
}: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
  business_name?: string;
  senderBusinessName?: string;
  attachments?: any[];
}) {
  try {
    email_client.setApiKey(sendgridApiKey);
    await email_client.send({
      personalizations: [{ to: [{ email: to, name: business_name }] }],
      from: {
        email: "no-reply@paylists.co.uk",
        name: senderBusinessName || "Paylists",
      },
      replyTo: replyTo ? { email: replyTo, name: senderBusinessName } : { email: "no-reply@paylists.co.uk", name: "Paylists" },
      subject,
      content: [{ type: "text/html", value: html }],
      attachments,
    });
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export async function fetchHTML(templateName: string, replace: any[] = []) {
  let htmlString = (() => {
    switch (templateName) {
      case "email_from_chat":
        return emailFromChat;
      case "late_payment":
        return latePayment;
      case "payment_request_customer_email_with_items":
        return paymentRequestCustomerEmailWithItems;
      case "payment_request_customer_email":
        return paymentRequestCustomerEmail;
      case "payment_request_update_for_vendor":
        return paymentRequestUpdateForVendor;
      case "payment_request_update":
        return paymentRequestUpdate;
      case "reset_password_email":
        return resetPasswordEmail;
      case "verify_account_email":
        return verifyAccountEmail;
      case "verify_business_email":
        return verifyBusinessEmail;
      default:
        throw new Error(`Template ${templateName} not found`);
    }
  })();
  replace.forEach(({ patternToReplace, replaceWith }) => {
    if (patternToReplace && replaceWith) {
      htmlString = htmlString.replaceAll(patternToReplace, replaceWith);
    }
  });

  return htmlString;
}
