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

// Normalizo los nombres porque la API entrega los segmentos por separado y quiero mostrar un string limpio.
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
  // Pido la pagina de curiosidades en paralelo con la de usuarios para parearlos por indice.
  const factsResponse = await fetch(
    `${CAT_FACTS_ENDPOINT}?limit=${CAT_FACTS_PAGE_SIZE}&page=${page}`,
    { signal },
  );

  if (!factsResponse.ok) {
    // Propago un mensaje claro para que el componente muestre el error en pantalla.
    throw new Error("No pude cargar las curiosidades felinas en este momento.");
  }

  const factsPayload = (await factsResponse.json()) as CatFactsApiResponse;
  const numberOfFacts = factsPayload.data.length || CAT_FACTS_PAGE_SIZE;

  const usersResponse = await fetch(
    `${RANDOM_USER_ENDPOINT}?inc=name,picture,login&results=${numberOfFacts}`,
    { signal },
  );

  if (!usersResponse.ok) {
    throw new Error("No pude cargar los perfiles aleatorios en este momento.");
  }

  const usersPayload = (await usersResponse.json()) as RandomUserApiResponse;

  const fallbackUser = usersPayload.results[0];

  // Construyo la lista de items reusando el primer usuario como respaldo para no dejar tarjetas sin datos.
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

  // Indico la siguiente pagina solo si el backend reporta que aun quedan datos.
  return {
    items,
    nextPage: hasNextPage ? factsPayload.current_page + 1 : undefined,
  };
}
