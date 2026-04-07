import { v4 as uuidv4 } from "uuid";

const USER_ID_KEY = "ai_mentor_user_id";
const UPDATED_CV_TIME_KEY = "ai_mentor_cv_updated_time";
const UPDATED_VACANCIES_TIME_KEY = "ai_mentor_vacancies_updated_time";

function parseStoredTimestamp(raw: string | null): number | null {
  if (raw == null || raw === "") return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export function getOrCreateUserId(): string {
  const existing = window.localStorage.getItem(USER_ID_KEY);
  if (existing) return existing;

  const created = uuidv4();
  window.localStorage.setItem(USER_ID_KEY, created);
  return created;
}

export function setValueToLocalStorage(key: string, value: string) {
  window.localStorage.setItem(key, value);
}

export function setUpdateTimeCV() {
  setValueToLocalStorage(UPDATED_CV_TIME_KEY, Date.now().toString());
}

export function getUpdateTimeCV(): number | null {
  if (typeof window === "undefined") return null;
  return parseStoredTimestamp(window.localStorage.getItem(UPDATED_CV_TIME_KEY));
}

export function setUpdateTimeVacancies() {
  setValueToLocalStorage(UPDATED_VACANCIES_TIME_KEY, Date.now().toString());
}

export function getUpdateTimeVacancies(): number | null {
  if (typeof window === "undefined") return null;
  return parseStoredTimestamp(window.localStorage.getItem(UPDATED_VACANCIES_TIME_KEY));
}

