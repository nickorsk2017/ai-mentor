import { API_BASE, getOrCreateUserId } from "./cvApi";

export type VacancyBackendRecord = {
  id: string;
  user_id: string;
  title: string;
  company: string | null;
  description: string;
  created_at: string;
};

export async function createVacancyOnBackend(payload: {
  title: string;
  company?: string;
  description?: string;
}): Promise<VacancyBackendRecord> {
  const userId = getOrCreateUserId();

  const res = await fetch(`${API_BASE}/vacancies`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: userId,
      title: payload.title,
      company: payload.company ?? "",
      description: payload.description ?? "",
    }),
  });

  if (!res.ok) {
    throw new Error(`Create vacancy failed (${res.status})`);
  }

  return (await res.json()) as VacancyBackendRecord;
}

