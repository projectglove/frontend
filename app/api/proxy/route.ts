export async function GET(req: Request) {
  try {
    const response = await fetch('https://enclave.test.projectglove.io/info', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Failed to fetch data', error: (error as Error).message }), { status: 500 });
  }
}