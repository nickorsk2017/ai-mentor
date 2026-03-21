import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI HR Mentor",
  description: "Your personal AI mentor for CVs and vacancies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-[#f4f3ff] via-[#f9fafb] to-[#eef5ff] text-zinc-900`}
      >
        <Providers>
          <div className="min-h-screen flex items-start px-4 py-4 text-sm text-zinc-800">
            {/* Sidebar */}
            <aside className="bg-gray-300 sticky top-4 mr-4 flex h-[calc(100vh-2rem)] w-60 flex-col rounded-3xl p-4 shadow-sm ring-1 ring-zinc-100 backdrop-blur">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#7c5cff] to-[#f973ff] text-lg font-semibold ">
                  AI
                </div>
                <div className="flex flex-col">
                
                  <span className="text-lg font-semibold text-zinc-800">
                    Carrier Mentor
                  </span>
                </div>
              </div>

              <nav className="flex flex-1 flex-col gap-1 text-lg">
                <span className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
                  Main
                </span>
                <Link
                  href="/"
                  className="flex items-center gap-2 rounded-xl px-2 py-1.5  hover:bg-zinc-50 hover:text-zinc-900"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span>Home</span>
                </Link>
                <Link
                  href="/my-cv"
                  className="flex items-center gap-2 rounded-xl px-2 py-1.5  hover:bg-zinc-50 hover:text-zinc-900"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                  <span>My CV</span>
                </Link>
                <Link
                  href="/vacancies"
                  className="flex items-center gap-2 rounded-xl px-2 py-1.5  hover:bg-zinc-50 hover:text-zinc-900"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                  <span>Vacancies</span>
                </Link>
                <Link
                  href="/matching"
                  className="flex items-center gap-2 rounded-xl px-2 py-1.5  hover:bg-zinc-50 hover:text-zinc-900"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  <span>Matching</span>
                </Link>

              </nav>
            </aside>

            {/* Main content area */}
            <main className="flex-1 px-6 py-4">
                <div className="mx-auto max-w-6xl relative">{children}</div>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}

