import { VacanciesPage } from "./children/VacanciesPage";

// SSR wrapper only: route remains a server component.
export default function Page() {
  return <VacanciesPage />;
}

