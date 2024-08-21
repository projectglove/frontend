import { GLOVE_URL } from "@/lib/consts";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const request = await req.json();
    console.log('POST request:', request);
    const response: Response = await fetch(`${ GLOVE_URL }/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request),
    });
    console.log('/vote', response);
    if (!response.ok) {
      const error = response.status + ' ' + response.statusText;
      throw new Error(error);
    } else {
      return NextResponse.json(response);
    }
  } catch (error) {
    console.log(error);
    if (error) {
      return NextResponse.json({ message: (error as any).message, error: (error as any).message }, { status: 500 });
    }
  }
}
