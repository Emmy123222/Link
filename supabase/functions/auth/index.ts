import axios from "npm:axios";
import { supabase } from "../config.ts";
import { parseJwt } from "./authUtils.ts";
import { TABLES } from "../db.ts";

const XERO_CLIENT_ID = Deno.env.get("XERO_CLIENT_ID");
const XERO_CLIENT_SECRET = Deno.env.get("XERO_CLIENT_SECRET");

export const get_user_exists_by_email = async (email: string) => {
  const { data: { users }, error } = await supabase.auth.admin.listUsers();
  if (error) return false;
  return users.some(user => user.email === email);
};

export const sign_in_with_xero = unAuthenticatedCallableReq(async ({ xeroCode, redirectUri }: { xeroCode: string; redirectUri: string }) => {
  try {
    const identityRes = await axios.post(
      "https://identity.xero.com/connect/token",
      {
        grant_type: "authorization_code",
        code: xeroCode,
        redirect_uri: redirectUri,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          authorization:
            "Basic " +
            btoa(
              XERO_CLIENT_ID +
              ":" +
              XERO_CLIENT_SECRET
            ),
        },
      }
    );

    const xeroIdToken = parseJwt(identityRes.data.id_token);

    try {
      // Check if user exists in Supabase
      const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();
      if (userError) throw userError;

      const existingUser = users.find(u => u.email === xeroIdToken.email);

      if (existingUser) {
        const uid = existingUser.id;

        // Check if user has businesses
        const { data: userBusinesses, error: businessError } = await supabase
          .from(TABLES.Business)
          .select()
          .eq('owner_id', uid)
          .eq('active', true);

        if (businessError) throw businessError;

        const userHasBusinesses = userBusinesses?.length > 0;

        // Create session for existing user
        const { data: { session }, error: sessionError } = await supabase.auth.signInWithPassword({
          email: xeroIdToken.email,
          password: crypto.randomUUID() // Generate a new random password for Xero sign-in
        });

        if (sessionError) throw sessionError;

        return {
          status: "success",
          token: session?.access_token,
          newUser: false,
          userHasBusinesses
        };
      } else {
        // Create new user
        const password = crypto.randomUUID(); // Generate random password
        const { data: { user }, error: createError } = await supabase.auth.signUp({
          email: xeroIdToken.email,
          password,
          options: {
            data: {
              name: xeroIdToken.given_name,
              lastname: xeroIdToken.family_name,
              xero_userid: xeroIdToken.xero_userid
            }
          }
        });

        if (createError) throw createError;

        if (user) {
          // Sign in the new user
          const { data: { session }, error: signInError } = await supabase.auth.signInWithPassword({
            email: xeroIdToken.email,
            password
          });

          if (signInError) throw signInError;

          return {
            status: "success",
            token: session?.access_token,
            newUser: true,
            userHasBusinesses: false
          };
        }

        throw new Error("Failed to create user");
      }
    } catch (err) {
      handleError(err);
      return { status: "error", reason: err };
    }
  } catch (err) {
    handleError(err);
    return { status: "error", reason: err };
  }
});
