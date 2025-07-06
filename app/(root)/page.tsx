"use client";
import Hero from "@/components/Hero";
import TrustedSection from "@/components/TestimonialsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function HomePage() {
    const router = useRouter();

    useEffect(() => {
        // You may need to adapt this logic for Next.js
        // For example, check query params or use a global state/store
    }, [router]);

    return (
        <>
            <Hero />
            <TrustedSection />
            <TestimonialsSection />
            <CTASection />
        </>
    );
}

export default HomePage;

