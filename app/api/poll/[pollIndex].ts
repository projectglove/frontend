import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { pollIndex } = req.query;

  console.log('Poll Index:', pollIndex);

  try {
    const response = await fetch(`https://enclave.test.projectglove.io/poll-info/${ pollIndex }`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log({ response });
    if (!response.ok) {
      throw new Error(`Failed to fetch data for poll index ${ pollIndex }`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ message: 'Error fetching poll data', error: (error as Error).message });
  }
}