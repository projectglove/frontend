import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ReferendumData } from "./types";
import { decodeAddress } from "@polkadot/util-crypto";

export function isEnvTest() {
  return process.env.NODE_ENV === "test";
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getPollTimeRemaining(index: number) {
  const response = await fetch(`https://enclave.test.projectglove.io/poll-info/${ index }`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  console.log('getPollTimeRemaining', { response });
  if (!response.ok) {
    throw new Error("Error fetching poll time remaining");
  }
  let result;
  try {
    result = await response.json();
  } catch (error) {
    console.error("Error fetching poll time remaining:", error);
    throw new Error("Poll is not active");
  }
  return result;
}

export async function getReferendaList(): Promise<ReferendumData[]> {
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

  let result;
  try {
    const response = await fetch("https://rococo.api.subscan.io/api/scan/referenda/referendums", requestOptions);
    result = await response.json();
  } catch (error) {
    console.error("Error fetching referenda list:", error);
  }

  return result.data.list;
}

// export async function getReferendumTracks(): Promise<any> {
//   const SUBSCAN_API_KEY = process.env.NEXT_PUBLIC_SUBSCAN_API_KEY;
//   if (!SUBSCAN_API_KEY) {
//     throw new Error("SUBSCAN_API_KEY is not set");
//   }

//   const headers = new Headers({
//     "Content-Type": "application/json",
//     "X-API-Key": SUBSCAN_API_KEY
//   });

//   const requestOptions = {
//     method: 'GET',
//     headers,
//   };

//   let data;
//   try {
//     const response = await fetch(`https://rococo.api.subscan.io/api/scan/referenda/tracks`, requestOptions);
//     data = response;
//   } catch (error) {
//     console.error("Error fetching referendum tracks:", error);
//   }

//   return data;
// }

