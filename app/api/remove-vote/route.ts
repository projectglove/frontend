import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const request = await req.json();
    console.log('POST request:', request);
    const response: Response = await fetch('https://enclave.test.projectglove.io/remove-vote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      console.log(JSON.stringify(response.body));
      console.log(response.status, response.statusText);
      const error = response.status + ' ' + response.statusText;
      throw new Error(error);
    } else {
      return NextResponse.json(response);
    }
  } catch (error) {
    console.log(error);
    if (error) {
      return NextResponse.json({ message: (error as any).message, error: (error as any).message }, { status: 400 });
    }
  }
}
