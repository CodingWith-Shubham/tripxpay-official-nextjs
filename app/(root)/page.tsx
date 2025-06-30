"use client";
import Hero from "@/components/Hero";
import TrustedSection from "@/components/TrustedSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function HomePage() {
  const router = useRouter();

  useEffect(() => {
  }, [router]);

  return (
      <>
        <div className="absolute inset-0 bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none z-0" />
        <div className="absolute top-0 left-0 w-[500px] h-[300px] bg-gradient-to-br from-[#00ffb4]/40 to-transparent rotate-12 blur-[120px] rounded-[30%] pointer-events-none z-0" />
        {/* Top-right spread glow */}
        {/* Mid-left yellow glow */}
        {/* Bottom-right yellow glow */}
        <div className="absolute right-0 w-[550px] h-[300px] md:bg-gradient-to-tr from-yellow-400/30 to-transparent rotate-180 blur-[120px] rounded-[20%] pointer-events-none z-0 top-[1.5%]" />
            <Hero />
            <TrustedSection />
            <TestimonialsSection />
            <CTASection />
      </>
);
}

export default HomePage;
