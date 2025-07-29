import twilio from "npm:twilio";

const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID")!;
const authToken = Deno.env.get("TWILIO_AUTH_TOKEN")!;

const client = twilio(accountSid, authToken);

async function send_sms({ body, to, from }: { body: string; to: string; from: string }) {
  console.log(body, to, from)
  await client.messages.create({
    body,
    from: "Paylists",
    to,
  });
  return { success: true };
}

export { send_sms };
