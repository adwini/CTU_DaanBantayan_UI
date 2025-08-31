"use client";
import { useEffect, useState } from "react";
import Footer from "@/components/footer/footer.component";
import Header from "@/components/header/header.component";
import LandingPage from "@/components/landing page/landing-body";

export default function Home() {
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.body.scrollHeight;

      if (scrollY + windowHeight >= documentHeight - 10) {
        setShowFooter(true);
      } else {
        setShowFooter(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Header />
      <LandingPage />

      <div className="mt-16">{showFooter && <Footer />}</div>
    </>
  );
}
