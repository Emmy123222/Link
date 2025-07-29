import { supabase } from "../config.ts";
import { TABLES } from "../db.ts";
import { BadRequestException } from "../exceptions.ts";

interface ChangeLog {
  request_id?: number;
  sender_id: string;
  message: string;
  type: string;
}

export async function createLog({ change }: { change: ChangeLog }) {
  console.log(change);
  const { error: insertError } = await supabase.from(TABLES.Messages).upsert({
    message: change.message,
    sender_id: change.sender_id,
    request_id: change.request_id,
    type: change.type,
  });

  if (insertError) {
    console.error("Insert error:", insertError);
    throw new BadRequestException(insertError.message);
  }

  return { success: true };
}
