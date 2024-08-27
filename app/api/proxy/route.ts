import { GLOVE_URL } from "@/lib/consts";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const response = await fetch(`${ GLOVE_URL }/info`, {
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
    console.log(error);
    return NextResponse.json({ message: 'GET Error', error }, { status: 500 });
  }
}
