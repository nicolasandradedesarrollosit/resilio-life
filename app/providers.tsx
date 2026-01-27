"use client";

import type { ThemeProviderProps } from "next-themes";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { ToastProvider } from "@heroui/toast";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Provider } from "react-redux";

import { store } from "@/redux/store";
import { useUserData } from "@/hooks/useUserHook";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

function InitialDataLoader({ children }: { children: React.ReactNode }) {
  useUserData();

  return <>{children}</>;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <Provider store={store}>
      <HeroUIProvider navigate={router.push}>
        <ToastProvider />
        <NextThemesProvider {...themeProps}>
          <InitialDataLoader>{children}</InitialDataLoader>
        </NextThemesProvider>
      </HeroUIProvider>
    </Provider>
  );
}
