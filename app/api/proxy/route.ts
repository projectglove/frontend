import { NextResponse } from "next/server";

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
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: 'GET Error', error }, { status: 500 });
  }
}