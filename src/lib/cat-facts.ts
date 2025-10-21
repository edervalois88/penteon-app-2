"use client";

const CAT_FACTS_ENDPOINT = "https://catfact.ninja/facts";
const RANDOM_USER_ENDPOINT = "https://randomuser.me/api/";
export const CAT_FACTS_PAGE_SIZE = 10;

type CatFactsApiResponse = {
  current_page: number;
  data: Array<{
    fact: string;
    length: number;
  }>;
  last_page: number;
};

type RandomUserApiResponse = {
  results: Array<{
    login: { uuid: string };
    name: { title: string; first: string; last: string };
    picture: { large: string; medium: string; thumbnail: string };
  }>;
};

export type CatFactWithPerson = {
  id: string;
  fact: string;
  person: {
    name: string;
    avatar?: string;
  };
};

export type CatFactsPage = {
  items: CatFactWithPerson[];
  nextPage?: number;
};

function normalizeName({
  title,
  first,
  last,
}: RandomUserApiResponse["results"][number]["name"]) {
  const segments = [title, first, last].filter(Boolean);
  return segments.join(" ").replace(/\s+/g, " ").trim();
}

export async function fetchCatFactsPage(
  page: number,
  signal?: AbortSignal,
): Promise<CatFactsPage> {
  const factsResponse = await fetch(
    `${CAT_FACTS_ENDPOINT}?limit=${CAT_FACTS_PAGE_SIZE}&page=${page}`,
    { signal },
  );

  if (!factsResponse.ok) {
    throw new Error("We could not load cat facts right now.");
  }

  const factsPayload = (await factsResponse.json()) as CatFactsApiResponse;
  const numberOfFacts = factsPayload.data.length || CAT_FACTS_PAGE_SIZE;

  const usersResponse = await fetch(
    `${RANDOM_USER_ENDPOINT}?inc=name,picture,login&results=${numberOfFacts}`,
    { signal },
  );

  if (!usersResponse.ok) {
    throw new Error("We could not load random profiles right now.");
  }

  const usersPayload = (await usersResponse.json()) as RandomUserApiResponse;

  const fallbackUser = usersPayload.results[0];

  const items: CatFactsPage["items"] = factsPayload.data.map((fact, index) => {
    const user = usersPayload.results[index] ?? fallbackUser;
    const id =
      user?.login.uuid ??
      `cat-fact-${factsPayload.current_page}-${index}-${fact.length}`;

    return {
      id,
      fact: fact.fact,
      person: {
        name: user ? normalizeName(user.name) : "Anonymous Cat Enthusiast",
        avatar: user?.picture.medium,
      },
    };
  });

  const hasNextPage = factsPayload.current_page < factsPayload.last_page;

  return {
    items,
    nextPage: hasNextPage ? factsPayload.current_page + 1 : undefined,
  };
}
