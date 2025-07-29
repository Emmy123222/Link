import { serve } from "https://deno.land/std/http/server.ts";

serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return new Response("Missing required fields", { status: 400 });
    }

    const supabaseUrl = Deno.env.get("NEXT_PUBLIC_SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const { createClient } = await import("https://esm.sh/@supabase/supabase-js");
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error } = await supabase.from("contacts").insert([{ name, email, subject, message }]);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
