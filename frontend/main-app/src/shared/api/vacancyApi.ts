import { API_BASE, getOrCreateUserId } from "./cvApi";
import type { Vacancy, VacancyStage } from "../../app/mentor-context";

export type VacancyApiRecord = {
  id: string;
  user_id: string;
  title: string;
  company: string | null;
  description: string;
  planned_stages: number;
  created_at: string;
  stages?: Array<{
    id: string;
    name: string;
    status: string;
    notes: string;
  }>;
};

function isStageStatus(s: string): s is VacancyStage["status"] {
  return s === "pending" || s === "done" || s === "failed";
}

export function mapVacancyFromApi(data: VacancyApiRecord): Vacancy {
  return {
    id: data.id,
    title: data.title,
    company: data.company ?? undefined,
    description: data.description,
    planned_stages: data.planned_stages,
    created_at: data.created_at,
    stages: (data.stages ?? []).map((s) => ({
      id: s.id,
      name: s.name,
      status: isStageStatus(s.status) ? s.status : "pending",
      notes: s.notes ?? "",
    })),
  };
}

export async function createVacancyOnBackend(payload: {
  title: string;
  company?: string;
  description?: string;
}): Promise<Vacancy> {
  const userId = getOrCreateUserId();

  const res = await fetch(`${API_BASE}/vacancies`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: userId,
      title: payload.title,
      company: payload.company ?? "",
      description: payload.description ?? "",
      stages: [],
      planned_stages: 1,
    }),
  });

  if (!res.ok) {
    throw new Error(`Create vacancy failed (${res.status})`);
  }

  const raw = (await res.json()) as VacancyApiRecord;
  return mapVacancyFromApi(raw);
}

export async function getVacanciesOnBackend(): Promise<Vacancy[]> {
  const userId = getOrCreateUserId();

  const res = await fetch(`${API_BASE}/vacancies?user_id=${userId}`);

  if (!res.ok) {
    throw new Error(`Get vacancies failed (${res.status})`);
  }

  const data = await res.json();

  return (data.vacancies as VacancyApiRecord[]).map(mapVacancyFromApi);
}

export async function updateVacancyOnBackend(
  vacancyId: string,
  payload: {
    title: string;
    company?: string;
    description: string;
    planned_stages: number;
    stages: VacancyStage[];
  }
): Promise<Vacancy> {
  const userId = getOrCreateUserId();

  const res = await fetch(`${API_BASE}/vacancies/${vacancyId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: userId,
      title: payload.title,
      company: payload.company ?? "",
      description: payload.description,
      planned_stages: payload.planned_stages,
      stages: payload.stages.map((s) => ({
        id: s.id,
        name: s.name,
        status: s.status,
        notes: s.notes,
      })),
    }),
  });

  if (!res.ok) {
    throw new Error(`Save vacancy failed (${res.status})`);
  }

  const raw = (await res.json()) as VacancyApiRecord;
  return mapVacancyFromApi(raw);
}

export async function deleteVacancyOnBackend(vacancyId: string): Promise<void> {
  const userId = getOrCreateUserId();
  const res = await fetch(`${API_BASE}/vacancies/${vacancyId}?user_id=${userId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error(`Delete vacancy failed (${res.status})`);
  }
}
