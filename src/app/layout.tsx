import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer/footer.component";
import Header from "@/components/header/header.component";
import ThemeProviderWrapper from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/auth.context";
import ProfileGuard from "@/components/profile/profile-guard";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CTU - Daan Bantayan Campus",
  description:
    "Cebu Technological University - Daan Bantayan Campus Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProviderWrapper>
          <AuthProvider>
            <ProfileGuard>
              {children}
              <div className="pb-15" />
              <Footer />
            </ProfileGuard>
            <Toaster />
          </AuthProvider>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
