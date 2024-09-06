import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ReferendumData } from "./types";
import { TEST_SUBSCAN_NETWORK } from "./consts";

export function isEnvTest() {
  return process.env.NODE_ENV === "test";
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getVotesByPollIndex(proxyAddress: string, accountAddress: string, pollIndex: number) {
  const SUBSCAN_API_KEY = process.env.SUBSCAN_API_KEY;
  if (!SUBSCAN_API_KEY) {
    throw new Error("SUBSCAN_API_KEY is not set");
  }


  const headers = new Headers({
    "Content-Type": "application/json",
    "X-API-Key": SUBSCAN_API_KEY
  });
  const body = JSON.stringify({
    "row": 100,
    "account": accountAddress,
    "valid": "valid",
  });

  const requestOptions = {
    method: 'POST',
    headers,
    body
  };

  let result;
  try {
    const response = await fetch(`https://${ TEST_SUBSCAN_NETWORK }.api.subscan.io/api/scan/referenda/votes`, requestOptions);
    result = await response.json();
  } catch (error) {
    console.error("Error fetching referendum votes:", error);
  }

  return result.data && result.data.list;
}

export async function getReferendaList(): Promise<ReferendumData[]> {
  const SUBSCAN_API_KEY = process.env.SUBSCAN_API_KEY;
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
    const response = await fetch(`https://${ TEST_SUBSCAN_NETWORK }.api.subscan.io/api/scan/referenda/referendums`, requestOptions);
    result = await response.json();
  } catch (error) {
    console.error("Error fetching referenda list:", error);
  }

  return result.data.list;
}

