"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function CTUThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return <div suppressHydrationWarning>{children}</div>;
  }

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      themes={["light"]}
      enableSystem={false}
      disableTransitionOnChange={false}>
      <ThemeSync />
      {children}
    </NextThemesProvider>
  );
}

// Component to sync daisyUI themes with shadcn/ui themes
function ThemeSync() {
  React.useEffect(() => {
    // Always set to light theme
    const html = document.documentElement;
    html.setAttribute("data-theme", "ctu-light");
    html.classList.remove("dark");
    html.classList.add("light");
  }, []);

  return null;
}

// Legacy wrapper for backward compatibility
export default function ThemeProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CTUThemeProvider>{children}</CTUThemeProvider>;
}
