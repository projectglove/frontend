import { GLOVE_URL } from '@/lib/consts';

export async function POST(req: Request) {
  const request = await req.json();
  let pollIndex;

  if (request && request.index) {
    pollIndex = request.index;
  } else {
    throw new Error('No poll index provided');
  }

  try {
    const response = await fetch(`${ GLOVE_URL }/poll-info/${ pollIndex }`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch data for poll index ${ pollIndex }`);
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    return Response.json({ message: 'Error fetching poll data', error: (error as Error).message }, { status: 500 });
  }
}