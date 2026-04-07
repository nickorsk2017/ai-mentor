const USER_ID_KEY = "ai_mentor_user_id";
const UPDATED_CV_TIME_KEY = "ai_mentor_cv_updated_time";
const UPDATED_VACANCIES_TIME_KEY = "ai_mentor_vacancies_updated_time";
import { v4 as uuidv4 } from "uuid";

export function getOrCreateUserId(): string {

    const existing = window.localStorage.getItem(USER_ID_KEY);
    if (existing) return existing;
  
    const created = uuidv4();
    window.localStorage.setItem(USER_ID_KEY, created);
    return created;
  }

export function getValueFromLocalStorage(key: string): number | null {
    return Number(window.localStorage.getItem(key));
}

export function setValueToLocalStorage(key: string, value: string) {
    window.localStorage.setItem(key, value);
}

export function setUpdateTimeCV() {
    setValueToLocalStorage(UPDATED_CV_TIME_KEY, Date.now().toString());
}

export function getUpdateTimeCV(): number | null {
    return Number(getValueFromLocalStorage(UPDATED_CV_TIME_KEY));
}

export function setUpdateTimeVacancies() {
    setValueToLocalStorage(UPDATED_VACANCIES_TIME_KEY, Date.now().toString());
}

export function getUpdateTimeVacancies(): number | null {
    return Number(getValueFromLocalStorage(UPDATED_VACANCIES_TIME_KEY));
}

