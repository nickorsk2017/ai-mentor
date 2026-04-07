export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8001" ;
import { getOrCreateUserId, getUpdatedAtTimestamp, setUpdatedAtTimestamp } from "./mainService";


export type CVResponse = {
  id: string;
  user_id: string;
  cv_text: string;
  created_at: string;
};

export async function saveCV(cvText: string): Promise<CVResponse> {
  const userId = getOrCreateUserId();
  setUpdatedAtTimestamp();
  
  const res = await fetch(`${API_URL}/cvs`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, cv_text: cvText }),
  });

  if (!res.ok) {
    throw new Error(`Save CV failed (${res.status})`);
  }

  const data = (await res.json()) as CVResponse;
  return data;
}

export async function getCV(): Promise<CVResponse | null> {
  if (typeof window === "undefined") return null;
  const cvID = getOrCreateUserId()
  if (!cvID) return null;

  const res = await fetch(`${API_URL}/cvs/${cvID}`);
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`Load CV failed (${res.status})`);
  }
  return (await res.json()) as CVResponse;
}

