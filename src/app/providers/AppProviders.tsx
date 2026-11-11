import type { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { TDSMobileAITProvider } from "@toss/tds-mobile-ait";

import { queryClient } from "@/shared/api";

interface AppProvidersProps {
  children: ReactNode;
}

const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <TDSMobileAITProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </TDSMobileAITProvider>
  );
};

export default AppProviders;
