"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";
import {
  CAT_FACTS_PAGE_SIZE,
  type CatFactWithPerson,
  fetchCatFactsPage,
} from "@/lib/cat-facts";

function getInitials(name: string) {
  const [first = "", second = ""] = name.split(" ");
  return `${first.charAt(0)}${second.charAt(0)}`.trim().toUpperCase() || "??";
}

function FactCard({ item }: { item: CatFactWithPerson }) {
  return (
    <article className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm transition-shadow duration-200 hover:shadow-lg">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
        {item.person.avatar ? (
          <Image
            alt={`${item.person.name}'s avatar`}
            className="object-cover"
            fill
            sizes="56px"
            src={item.person.avatar}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-orange-200 to-pink-200 text-sm font-semibold uppercase text-slate-700">
            {getInitials(item.person.name)}
          </div>
        )}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-slate-900">{item.person.name}</h3>
        <p className="mt-1 text-sm leading-relaxed text-slate-600">
          {item.fact}
        </p>
      </div>
    </article>
  );
}

function FactCardSkeleton() {
  return (
    <article className="flex items-start gap-4 rounded-2xl border border-transparent bg-white/70 p-5">
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
  );
}

export function CatFactFeed() {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchingNextPage,
    isPending,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["cat-facts"],
    queryFn: ({ pageParam = 1 }) => fetchCatFactsPage(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
    retry: 1,
    staleTime: 1000 * 30,
  });

  const items = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  );

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const isVisible = entries[0]?.isIntersecting;
        if (isVisible && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "256px 0px" },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const showSkeleton = isPending && items.length === 0;
  const showInitialError = isError && items.length === 0;
  const showInlineError = isError && items.length > 0;

  return (
    <div className="space-y-6">
      {showInitialError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50/80 p-6 text-center">
          <p className="text-sm font-medium text-red-700">
            {error instanceof Error
              ? error.message
              : "Something went wrong while loading cat facts."}
          </p>
          <button
            className="mt-4 inline-flex items-center rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
            onClick={() => refetch()}
            type="button"
          >
            Try again
          </button>
        </div>
      ) : null}

      {items.map((item) => (
        <FactCard item={item} key={item.id} />
      ))}

      {showSkeleton ? (
        <div className="space-y-4 animate-pulse">
          {Array.from({ length: CAT_FACTS_PAGE_SIZE }).map((_, index) => (
            <FactCardSkeleton key={index} />
          ))}
        </div>
      ) : null}

      {showInlineError ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-center text-sm text-amber-700">
          Something went wrong while loading more cat facts.
          <button
            className="ml-3 inline-flex items-center rounded-full bg-amber-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-amber-500"
            onClick={() => fetchNextPage()}
            type="button"
          >
            Retry
          </button>
        </div>
      ) : null}

      <div ref={loadMoreRef} className="h-1" />

      {!hasNextPage && !isPending && items.length > 0 ? (
        <p className="pb-2 text-center text-xs uppercase tracking-wide text-slate-400">
          You&apos;re all caught up on cat facts.
        </p>
      ) : null}

      {isFetchingNextPage ? (
        <div className="space-y-4 animate-pulse">
          {Array.from({ length: 3 }).map((_, index) => (
            <FactCardSkeleton key={`next-${index}`} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default CatFactFeed;
