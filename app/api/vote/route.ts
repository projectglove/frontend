import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const request = await req.json();
    console.log('POST request:', request);
    const response: Response = await fetch('https://enclave.test.projectglove.io/vote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      console.log(JSON.stringify(response.body));
      console.log(response.status, response.statusText);
      throw new Error('Could not post data');
    } else {
      const data = await response.json();
      console.log({ data });
      return NextResponse.json(response);
    }
  } catch (error) {
    if (error) {
      return NextResponse.json({ message: 'POST Error', error: (error as any).message }, { status: 500 });
    }
  }
}
