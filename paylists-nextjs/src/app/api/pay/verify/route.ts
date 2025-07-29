export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const paymentId = searchParams.get("paymentId");

  if (!paymentId) {
    return new Response(JSON.stringify({ error: "Missing paymentId" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const crezcoRes = await fetch(
      `${process.env.CREZCO_API_URL}/v1/payments/${paymentId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.CREZCO_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await crezcoRes.json();

    if (!crezcoRes.ok) {
      return new Response(
        JSON.stringify({ error: data.message || "Error verifying payment" }),
        {
          status: crezcoRes.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Verification Error:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
