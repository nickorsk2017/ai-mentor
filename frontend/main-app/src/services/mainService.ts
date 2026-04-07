const USER_ID_KEY = "ai_mentor_user_id";
const UPDATED_TIME_KEY = "ai_mentor_updated_time";
import { v4 as uuidv4 } from "uuid";

export function getOrCreateUserId(): string {

    const existing = window.localStorage.getItem(USER_ID_KEY);
    if (existing) return existing;
  
    const created = uuidv4();
    window.localStorage.setItem(USER_ID_KEY, created);
    return created;
  }

export function getUpdatedAtTimestamp(): number | null {
    return Number(window.localStorage.getItem(UPDATED_TIME_KEY));
}

export function setUpdatedAtTimestamp() {
    window.localStorage.setItem(UPDATED_TIME_KEY, Date.now().toString());
}