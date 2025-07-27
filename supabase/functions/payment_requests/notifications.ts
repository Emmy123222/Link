import { supabase, TABLES } from "../db.ts";
import { BadRequestException } from "../exceptions.ts";

interface NotificationBody {
  created_at?: number;
  description: string;
  reqId: string;
}

export async function create_notification({ body, businessId }: { body: NotificationBody; businessId: string }) {
  if (!body.created_at) body.created_at = new Date().getTime();

  const { error } = await supabase
    .from(TABLES.Business)
    .update({
      notifications: supabase.raw(`COALESCE(notifications, '[]'::jsonb) || '${JSON.stringify(body)}'::jsonb`)
    })
    .eq('id', businessId);

  if (error) throw new BadRequestException(error.message);
} 