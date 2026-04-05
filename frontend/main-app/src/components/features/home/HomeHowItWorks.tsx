import Link from "next/link";
import {
  BriefcaseIcon,
  FileTextIcon,
  IconBadge,
  RankingAdviceIcon,
} from "@/components/common/icons";

export function HomeHowItWorks() {
  return (
    <>
      <h2 className="mb-8 text-4xl font-semibold text-zinc-900">
        How it works
      </h2>
      <section className="mb-8 grid gap-4 md:grid-cols-3">
        <Link
          href="/my-cv"
          className="group rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md"
        >
          <IconBadge className="bg-indigo-100 text-indigo-700">
            <FileTextIcon className="text-indigo-700" />
          </IconBadge>
          <h2 className="mb-1 text-2xl font-semibold text-zinc-900">
            1. Paste your CV
          </h2>
          <p className="text-xl leading-relaxed text-zinc-600">
            Paste your CV in the rich editor
          </p>
        </Link>

        <Link
          href="/vacancies"
          className="group rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md"
        >
          <IconBadge className="bg-emerald-100 text-emerald-700">
            <BriefcaseIcon className="text-emerald-700" />
          </IconBadge>
          <h2 className="mb-1 text-2xl font-semibold text-zinc-900">
            2. Track vacancies
          </h2>
          <p className="text-xl leading-relaxed text-zinc-600">
            Add roles you are applying for, manage stages, and log notes on
            success or failure.
          </p>
        </Link>

        <Link
          href="/matching"
          className="group rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md"
        >
          <IconBadge className="bg-amber-100 text-amber-700">
            <RankingAdviceIcon className="text-amber-700" />
          </IconBadge>
          <h2 className="mb-1 text-2xl font-semibold text-zinc-900">
            3. Get ranking & advice
          </h2>
          <p className="text-xl leading-relaxed text-zinc-600">
            See which roles are the best fit and which technologies to improve
            for your target position.
          </p>
        </Link>
      </section>
    </>
  );
}
