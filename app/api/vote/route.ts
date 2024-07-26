export async function POST(req: Request) {
  try {
    const body = await req.json();
    const response = await fetch('https://enclave.test.projectglove.io/vote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    if (!response.ok) {
      throw new Error('Failed to post data');
    }
    const data = await response.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Failed to post data', error: (error as Error).message }), { status: 500 });
  }
}
