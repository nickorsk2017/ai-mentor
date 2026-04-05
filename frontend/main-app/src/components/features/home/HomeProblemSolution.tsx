import Image from "next/image";

export function HomeProblemSolution() {
  return (
    <section
      className="mb-8 grid gap-6 lg:grid-cols-2"
      aria-labelledby="problem-solution-heading"
    >
      <h2 id="problem-solution-heading" className="sr-only">
        Problem and solution
      </h2>
      <div className="flex flex-col gap-4 rounded-3xl border border-rose-200/80 bg-gradient-to-br from-rose-50/90 to-white p-5 shadow-sm md:p-6">
        <div className="flex min-h-[120px] items-center gap-4 md:min-h-[150px]">
          <Image
            src="/icon-problem.png"
            alt="Problem"
            width={100}
            height={100}
            className="h-auto w-[120px] md:w-[150px]"
          />
          <h3 className="text-2xl font-semibold text-zinc-900 md:text-4xl">
            Problem
          </h3>
        </div>
        <p className="text-lg font-medium leading-relaxed text-zinc-800 md:text-xl">
          Finding the right job is overwhelming.
        </p>
        <p className="text-lg leading-relaxed text-zinc-600 md:text-xl">
          Job searching shouldn&apos;t feel like guesswork.
        </p>
        <p className="text-lg leading-relaxed text-zinc-600 md:text-xl">
          Don&apos;t waste hours on irrelevant roles—most platforms rely on
          keywords, ignoring your real experience and career direction.
        </p>
      </div>
      <div className="flex flex-col gap-5 rounded-3xl border border-violet-200/80 bg-gradient-to-br from-violet-50/90 to-white p-5 shadow-sm md:p-6">
        <div className="flex min-h-[120px] items-center gap-6 md:min-h-[150px]">
          <Image
            src="/icon-robot.png"
            alt="Solution"
            width={150}
            height={150}
            className="h-auto w-[120px] md:w-[150px]"
          />
          <h3 className="text-2xl font-semibold text-zinc-900 md:text-4xl">
            Solution
          </h3>
        </div>
        <p className="text-lg font-medium leading-relaxed text-zinc-800 md:text-xl">
          We do the thinking for you.
        </p>
        <p className="text-lg leading-relaxed text-zinc-600 md:text-xl">
          Our AI analyzes your CV and ranks vacancies based on real fit—not
          just keywords.
        </p>
        <ul className="space-y-3 border-t border-violet-100 pt-4 text-lg leading-relaxed text-zinc-700 md:text-xl">
          <li className="flex gap-3">
            <span className="shrink-0" aria-hidden="true">
              🎯
            </span>
            <span>Discover the most relevant roles instantly</span>
          </li>
          <li className="flex gap-3">
            <span className="shrink-0" aria-hidden="true">
              ⚡
            </span>
            <span>Save hours of manual searching</span>
          </li>
          <li className="flex gap-3">
            <span className="shrink-0" aria-hidden="true">
              📈
            </span>
            <span>Focus on jobs you&apos;re most likely to get</span>
          </li>
        </ul>
      </div>
    </section>
  );
}
