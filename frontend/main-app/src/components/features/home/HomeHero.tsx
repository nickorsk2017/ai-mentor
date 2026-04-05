import Image from "next/image";
import Link from "next/link";

export function HomeHero() {
  return (
    <section className="mb-8 grid items-center gap-6 rounded-3xl border border-zinc-200 bg-gradient-to-br from-violet-40 to-white p-6 shadow-sm lg:grid-cols-[1.1fr_1fr]">
      <div className="flex flex-col gap-4">
        <h1 className="max-w-xl text-3xl font-semibold leading-tight text-zinc-900 md:text-5xl">
          AI Career Mentor for your career growth
        </h1>
        <p className="max-w-xl text-xl leading-relaxed text-zinc-600 md:text-2xl">
          Turn your CV into a smart career strategy. Track opportunities, manage
          interviews, and let AI guide you toward roles that truly match your
          experience and goals.
        </p>
        <div>
          <Link
            href="/my-cv"
            className="inline-flex items-center rounded-2xl bg-violet-600 px-5 py-3 text-lg font-semibold text-white shadow-sm transition hover:bg-violet-700"
          >
            Get Started with Your CV
          </Link>
        </div>
      </div>

      <div className="mb-8 flex justify-center lg:justify-end">
        <Image
          src="/main-page-hero.png"
          alt="AI career mentor dashboard illustration"
          width={620}
          height={410}
          className="h-auto w-full max-w-[620px]"
          priority
        />
      </div>
    </section>
  );
}
