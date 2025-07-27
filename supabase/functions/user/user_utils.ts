import { TABLES } from "../db.ts";
import { supabase } from "../config.ts";

export interface UserPackage {
  id: string;
  plan: string;
  created_date: string;
  active: boolean;
  transactions: number;
  sms?: number;
}

export async function getUserActivePlans(userId: string): Promise<UserPackage[]> {
  try {
    const { data: plans } = await supabase
      .from(TABLES.UserPlans)
      .select()
      .eq('user_id', userId)
      .eq('active', true)
      .gt('transactions', 0);

    const { data: smsPlans } = await supabase
      .from(TABLES.UserPlans)
      .select()
      .eq('user_id', userId)
      .gt('sms', 0);

    const result: UserPackage[] = [];

    if (plans && plans.length > 0) {
      result.push(...plans.map(plan => ({
        id: plan.id,
        plan: plan.plan,
        created_date: plan.created_date,
        active: plan.active,
        transactions: plan.transactions
      })));
    }

    if (smsPlans && smsPlans.length > 0) {
      result.push(...smsPlans.map(plan => ({
        id: plan.id,
        plan: plan.plan,
        created_date: plan.created_date,
        active: plan.active,
        transactions: plan.transactions,
        sms: plan.sms
      })));
    }

    return result;
  } catch (e) {
    return [];
  }
}

export const createGuestUser = async (userEmail: string): Promise<string | null> => {
  try {
    // Check if user exists
    const { data: existingUser } = await supabase
      .from(TABLES.Users)
      .select()
      .eq('email', userEmail)
      .single();

    if (existingUser && existingUser.guest_user) {
      return existingUser.id;
    }

    // Create new guest user
    const { data: newUser, error } = await supabase.auth.signUp({
      email: userEmail,
      password: crypto.randomUUID(), // Generate random password
    });

    if (error) throw error;

    if (newUser.user) {
      await supabase
        .from(TABLES.Users)
        .insert({
          id: newUser.user.id,
          email: newUser.user.email,
          guest_user: true
        });

      return newUser.user.id;
    }

    return null;
  } catch (e) {
    console.error('Error creating guest user:', e);
    return null;
  }
};

export const updateExistingUserToNotGuest = async (uid: string): Promise<boolean> => {
  try {
    const { data: existingUser } = await supabase
      .from(TABLES.Users)
      .select()
      .eq('id', uid)
      .single();

    if (!existingUser) return false;

    const isGuestUser = existingUser.email && existingUser.guest_user;

    if (isGuestUser) {
      await supabase
        .from(TABLES.Users)
        .update({ guest_user: false })
        .eq('id', uid);
    }

    return isGuestUser;
  } catch (e) {
    console.error('Error updating user guest status:', e);
    return false;
  }
};
