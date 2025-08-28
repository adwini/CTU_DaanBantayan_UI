"use client";

import { ThemeProvider } from "next-themes";
import React from "react";

export default function ThemeProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="data-theme"
      enableSystem={false}
      defaultTheme="light">
      {children}
    </ThemeProvider>
  );
}
