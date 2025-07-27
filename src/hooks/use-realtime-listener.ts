import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { TABLES } from "@/constants/tables";

type RealtimeOptions = {
  channelName: string;
  table: string;
  event?: "INSERT" | "UPDATE" | "DELETE" | "*";
  schema?: string;
  filter?: string; // e.g. "user_id=eq.123"
  onChange: (payload: any) => void;
};

export function useRealtimeListener({
  channelName,
  table,
  event = "*",
  schema = "public",
  filter,
  onChange,
}: RealtimeOptions) {
  useEffect(() => {
    if (!table || !onChange) return;

    const channel = supabase
      .channel(`${channelName}`)
      .on(
        "postgres_changes" as any,
        {
          event,
          schema,
          table,
          ...(filter ? { filter } : {}),
        },
        async (payload: any) => {
          if (table !== "Messages") {
            return onChange(payload.new);
          }
          const { data: user } = await supabase
            .from(TABLES.Users)
            .select("id, name")
            .eq("id", payload.new.sender_id)
            .single();
          onChange({ ...payload, user });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, event, schema, filter, onChange]);
}
