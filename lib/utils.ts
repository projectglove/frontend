import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getReferendaList(): Promise<any> {
  const SUBSCAN_API_KEY = process.env.NEXT_PUBLIC_SUBSCAN_API_KEY;
  if (!SUBSCAN_API_KEY) {
    throw new Error("SUBSCAN_API_KEY is not set");
  }

  const headers = new Headers({
    "Content-Type": "application/json",
    "X-API-Key": SUBSCAN_API_KEY
  });

  const body = JSON.stringify({
    "row": 100,
    "status": "active"
  });

  const requestOptions = {
    method: 'POST',
    headers,
    body,
  };

  let data;
  try {
    const response = await fetch("https://rococo.api.subscan.io/api/scan/referenda/referendums", requestOptions);
    data = await response.json();
  } catch (error) {
    console.error("Error fetching referenda list:", error);
  }

  return data;
}

export async function getReferendumTracks(): Promise<any> {
  const SUBSCAN_API_KEY = process.env.NEXT_PUBLIC_SUBSCAN_API_KEY;
  if (!SUBSCAN_API_KEY) {
    throw new Error("SUBSCAN_API_KEY is not set");
  }

  const headers = new Headers({
    "Content-Type": "application/json",
    "X-API-Key": SUBSCAN_API_KEY
  });

  const requestOptions = {
    method: 'GET',
    headers,
  };

  let data;
  try {
    const response = await fetch(`https://rococo.api.subscan.io/api/scan/referenda/tracks`, requestOptions);
    data = response;
  } catch (error) {
    console.error("Error fetching referendum tracks:", error);
  }

  return data;
}
