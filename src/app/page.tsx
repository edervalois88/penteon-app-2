"use client";

import dynamic from "next/dynamic";
import { CAT_FACTS_PAGE_SIZE } from "@/lib/cat-facts";

// Decidi cargar el feed de manera dinamica sin SSR porque confia en APIs del navegador y eventos solo del cliente.
const CatFactFeed = dynamic(() => import("@/components/cat-fact-feed"), {
  ssr: false,
  loading: () => (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: CAT_FACTS_PAGE_SIZE }).map((_, index) => (
        <article
          key={index}
          className="flex items-start gap-4 rounded-2xl border border-transparent bg-white/70 p-5"
        >
          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-slate-200" />
          <div className="flex-1 space-y-3">
            <div className="h-4 w-32 rounded-full bg-slate-200" />
            <div className="space-y-2">
              <div className="h-3 w-full rounded-full bg-slate-200" />
              <div className="h-3 w-4/5 rounded-full bg-slate-200" />
              <div className="h-3 w-3/4 rounded-full bg-slate-200" />
            </div>
          </div>
        </article>
      ))}
    </div>
  ),
});

export default function Home() {
  return (
    <div className="relative min-h-dvh bg-slate-100 text-slate-900">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-r from-orange-400 via-pink-500 to-indigo-500 opacity-50 blur-3xl" />
      <div className="relative mx-auto flex min-h-dvh max-w-3xl flex-col gap-10 px-4 pb-16 pt-14 sm:px-6 lg:px-0">
        <header className="rounded-3xl border border-white/40 bg-white/80 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.12)] backdrop-blur">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">
                reto-personal
              </p>
              <h1 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">
                Curiosidades felinas + personas aleatorias
              </h1>
              <p className="mt-2 max-w-xl text-sm text-slate-600">
                Comparto curiosidades de gatos combinadas con perfiles generados
                aleatoriamente para practicar React Query y manejo de paginacion.
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Hecha por mi con dedicacion y mucho cafe. Codigo abierto en{" "}
                <a
                  className="font-semibold text-orange-500 underline"
                  href="https://github.com/edervalois88/penteon-app-2"
                  rel="noreferrer"
                  target="_blank"
                >
                  github.com/edervalois88/penteon-app-2
                </a>
                .
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right text-xs font-medium text-slate-500 shadow-inner">
              <p>Satack Solicitado:</p>
              <p className="mt-1 text-sm font-semibold text-slate-700">
                Next.js / React Query / TailwindCSS
              </p>
            </div>
          </div>
        </header>

        <main className="flex-1 rounded-3xl border border-white/40 bg-white/80 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.12)] backdrop-blur">
          {/* Aqui delego el contenido al feed porque encapsula la logica de paginacion y estados asincronos. */}
          <CatFactFeed />
        </main>
      </div>
    </div>
  );
}
