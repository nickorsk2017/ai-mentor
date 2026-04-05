import HomePage from "@/components/features/home/HomePage";

// SSR wrapper only: route remains a server component.
export default function Page() {
  return <HomePage />;
}
