"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

export function AppProviders({ children }: { children: ReactNode }) {
  // Instancio el QueryClient solo una vez porque quiero conservar el cache entre renders del layout.
  const [queryClient] = useState(() => new QueryClient());

  // Expongo el proveedor para que cualquier componente cliente pueda consumir React Query sin volver a configurarlo.
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
