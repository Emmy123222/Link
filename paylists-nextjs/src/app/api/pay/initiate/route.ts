export async function POST(req: Request) {
  try {
    const body = await req.json();

    const response = await fetch(`${process.env.CREZCO_API_URL}/v1/payments`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.CREZCO_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Crezco Payment Error:', data);
      return new Response(JSON.stringify({ error: data.message || 'Crezco error' }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Initiation Error:', err);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}