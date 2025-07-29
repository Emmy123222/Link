import { randomInt } from "node:crypto";
import { requireAuth } from "../auth/authMiddleware.ts";
import { supabase, supabaseServer } from "../config.ts";
import { privacy_agreement, user_agreement } from "../constants.ts";
import { createCrezcoPaymentDemand } from "../crezco/crezco_utils.ts";
import { TABLES } from "../db.ts";
import { PhoneVerificationData } from "../types/phone.ts";
import { fetchHTML, send_email } from "../email_sending/index.ts";
import {
  BadRequestException,
  handleException,
  MethodNotAllowedException,
} from "../exceptions.ts";
import { send_sms } from "../sms_sending/index.ts";
import { updateExistingUserToNotGuest } from "./user_utils.ts";

const crezcoPaylistsUserId = Deno.env.get("CREZCO_PAYLISTS_USER_ID")!;

// Types
interface UserData {
  name: string;
  email: string;
  id: string;
  uid: string;
}

interface PlanData {
  uid: string;
  plan: string;
}

interface FeedbackData {
  name: string;
  email: string;
  subject: string;
  feedback: string;
}

interface PhoneCodeVerificationData extends PhoneVerificationData {
  code: string;
}

Deno.serve((req) => handleException(async () => {
  if (req.method == "OPTIONS") return null;

  if (req.method == "POST") {
    const { action, data } = await req.json();

    switch (action) {
      case "create_doc_after_registration":
        return handle_create_doc_after_registration(req, data as UserData);
      case "change_password":
        return handle_change_password(req, data);
      case "reset_password_email":
        return handle_reset_password_email(data);
      case "get_user_by_id":
        return handle_get_user_by_id(data);
      case "create_user":
        return handle_create_user(data);
      case "send_phone_verification_sms":
        return handle_send_phone_verification_sms(req, data as PhoneVerificationData);
      case "send_verify_email":
        return handle_send_verify_email(data);
      case "verify_phone_code":
        return handle_verify_phone_code(req, data as PhoneCodeVerificationData);
      case "select_payment_plan":
        return handle_select_payment_plan(req, data as PlanData);
      case "send_feedback":
        return handle_send_feedback(req, data as FeedbackData);
      default:
        throw new BadRequestException(`Unknown action: ${action}`);
    }
  }
  throw new MethodNotAllowedException("Method not allowed");
}));

async function handle_create_doc_after_registration(req: Request, data: UserData) {
  const { email, id } = data;

  const udata = await supabaseServer.auth.admin.updateUserById(id, { email_confirm: false });

  const { error: createUserError } = await supabase
    .from(TABLES.Users)
    .insert({
      id,
      email,
      guest_user: true
    });

  if (createUserError) throw new Error(createUserError.message);

  // Create legal agreements
  const { error: createLegalAgreementsError } = await supabase
    .from(TABLES.LegalAgreements)
    .insert([
      {
        user_id: id,
        ...user_agreement,
        agreed_on: new Date().toISOString()
      },
      {
        user_id: id,
        ...privacy_agreement,
        agreed_on: new Date().toISOString()
      }
    ]);

  if (createLegalAgreementsError) throw new Error(createLegalAgreementsError.message);

  return { success: true };
}

async function handle_get_user_by_id(id: string) {
  const { data: user, error } = await supabase.from(TABLES.Users).select('*').eq('id', id).single();
  if (error) console.log(error);
  return user;
}

async function handle_change_password(data: { newPassword: string; uid: string }) {
  const { newPassword, uid } = data;

  const { error } = await supabase.auth.admin.updateUserById(
    uid,
    { password: newPassword }
  );

  if (error) throw new BadRequestException(error.message);

  return { success: true };
}

async function handle_reset_password_email(data: { userEmail: string }) {

  const { userEmail } = data;
  const APP_DOMAIN = Deno.env.get("APP_DOMAIN");

  const { data: resetLink, error } = await supabaseServer.auth.admin.generateLink({
    type: 'recovery',
    email: userEmail,
    options: {
      redirectTo: `https://${APP_DOMAIN}/my-account`
    }
  });

  if (error) throw new BadRequestException(error.message);
  const html = await fetchHTML(
    "reset_password_email",
    [
      {
        patternToReplace: "%%reset_url%%",
        replaceWith: resetLink.properties.action_link,
      },
    ]
  )

  await send_email({
    to: userEmail,
    subject: "Paylists password reset",
    html: html,
    business_name: "",
    senderBusinessName: "",
    replyTo: ""
  });


  return { status: "success" };
}

async function handle_create_user(data: { email: string; password: string }) {
  const { email, password } = data;

  const { data: existingUser } = await supabase
    .from(TABLES.Users)
    .select()
    .eq('email', email)
    .single();

  if (existingUser) {
    const isGuestUser = await updateExistingUserToNotGuest(existingUser.id);

    if (isGuestUser) {
      const { error } = await supabase.auth.admin.updateUserById(
        existingUser.id,
        { password }
      );

      if (error) throw new BadRequestException(error.message);

      // Update guest's payment requests
      await supabase
        .from(TABLES.DocumentHeader)
        .update({ guest_user: null })
        .eq('guest_user', existingUser.id);

      return { success: true, user: existingUser };
    }
  }

  const { data: newUser, error } = await supabaseServer.auth.admin.createUser({
    email,
    password,
    email_confirm: false
  });

  if (error) throw new BadRequestException(error.message);

  if (newUser.user) {
    await supabase
      .from(TABLES.Users)
      .insert({
        id: newUser.user.id,
        email: newUser.user.email
      });

    return { success: true, user: newUser.user };
  }

  throw new BadRequestException("Failed to create user");
}

async function handle_send_phone_verification_sms(req: Request, to: string) {
  const { supabase, user } = await requireAuth(req);
  const code = randomInt(100000, 999999).toString();
  await send_sms({
    body: `Your Paylists verification code is: ${code}`,
    to,
    from: "Paylists"
  });

  const { data: res, error } = await supabase
    .from(TABLES.UserPhoneVerification)
    .insert({
      user_id: user.id,
      phone_number: to,
      code,
      created_at: new Date().toISOString()
    }).select().single();
  if (error) throw new Error(error.message)
  return { success: "true" };
}

async function handle_send_verify_email(data: { userEmail: string }) {
  const { userEmail } = data;
  const APP_DOMAIN = Deno.env.get("APP_DOMAIN");

  const { data: verificationLink, error } = await supabaseServer.auth.admin.generateLink({
    type: 'signup',
    email: userEmail,
    options: {
      redirectTo: `https://${APP_DOMAIN}/onboarding`
    }
  });

  console.log(verificationLink.properties.action_link)

  const html = await fetchHTML(
    "verify_account_email",
    [
      {
        patternToReplace: "%%verify_url%%",
        replaceWith: verificationLink.properties.action_link,
      },
    ]
  );

  if (error) throw new BadRequestException(error.message);

  await send_email({
    to: userEmail,
    subject: "Paylists account verification",
    html: html,
    business_name: "",
    senderBusinessName: "",
    replyTo: "",
  });


  return { status: "success" };
}

async function handle_verify_phone_code(req: Request, data: PhoneCodeVerificationData) {

  const { mobileCodeArea, phoneNumber, code, user_id } = data;
  const to = mobileCodeArea ? `${mobileCodeArea}${phoneNumber}` : phoneNumber;
  console.log(mobileCodeArea, phoneNumber, code, user_id)
  const { data: verification } = await supabase
    .from(TABLES.UserPhoneVerification)
    .select()
    .eq('phone_number', to)
    .eq('user_id', user_id)
    .eq('code', code)
    .single();

  if (!verification || verification.code !== code) {
    throw new BadRequestException("Invalid verification code");
  }

  await supabase
    .from(TABLES.UserPhoneVerification)
    .delete()
    .eq('id', verification.id);

  return { status: "success" };
}

async function handle_select_payment_plan(data: PlanData) {
  const { uid, plan } = data;
  const APP_DOMAIN = Deno.env.get("APP_DOMAIN");

  const statusUri = `https://${APP_DOMAIN}/pricing?plan=${plan}`;
  const errorUri = encodeURIComponent(`${statusUri}&status=error`);
  const successUri = encodeURIComponent(`${statusUri}&status=success`);

  const { data: vatStatic } = await supabase
    .from('static_data')
    .select('value')
    .eq('key', 'vat')
    .single();

  if (!vatStatic) throw new BadRequestException("VAT configuration not found");

  const subtotal = 10; // Default plan amount
  const vat = (subtotal * vatStatic.value) / 100;
  const total = subtotal + vat;

  return await createCrezcoPaymentDemand(
    crezcoPaylistsUserId,
    total,
    `${plan} PACKAGE`,
    "GBP",
    {
      user_id: uid,
      user_plan: plan
    },
    successUri,
    errorUri,
    "BankSelection"
  );
}

async function handle_send_feedback(data: FeedbackData) {
  const { name, email, subject, feedback } = data;

  const { data: feedbackEmail } = await supabase
    .from('static_data')
    .select('value')
    .eq('key', 'feedback_email')
    .single();

  if (!feedbackEmail) throw new BadRequestException("Feedback email not configured");

  await send_email({
    to: feedbackEmail.value,
    subject: `User feedback : ${subject}${name ? ` - from ${name}` : ""}`,
    html: `
      <div style="font-size:18px">
        <div>A new feedback was received from Paylists app:</div>
        <br/>
        <div>Name: ${name}</div>
        <div>Email: ${email}</div>
        <div>Subject: ${subject}</div>
        <div>Feedback: ${feedback}</div>
      </div>
    `,
    business_name: "",
    senderBusinessName: "",
    replyTo: ""
  });

  return { status: "success" };
}
