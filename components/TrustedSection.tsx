"use client";
import BenefitCard from "./BenefitCard";

interface Benefit {
  icon: string;
  title: string;
  description: string;
}

const TrustedSection: React.FC = () => {
  const benefits: Benefit[] = [
    {
      icon: "shield-check",
      title: "100% Payment Guarantee",
      description: "We pay travel suppliers on your behalf with our financial net.",
    },
    {
      icon: "lock-closed",
      title: "Book-Level Security",
      description: "Your data stays safe with bank-level, industry-standard encryption.",
    },
    {
      icon: "chart-bar",
      title: "Built for Growth",
      description: "Our intuitive platform handles everything whether you handle 10 or 10,000 trips a month.",
    },
    {
      icon: "credit-card",
      title: "Smart Credit Decisions",
      description: "Instant KYC and credit checks with competitive rates and no guesswork, only growth.",
    },
    {
      icon: "user",
      title: "Always Here for You",
      description: "24/7 support to assist you with any queries, anytime.",
    },
    {
      icon: "globe",
      title: "Travel Anywhere",
      description: "Travel around the globe and we will take care of the rest.",
    },
  ];
  
  return (
    <div className="w-full py-16 px-6 md:px-12 mt-16 md:mt-0">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">Trusted by Agencies Nationwide</h2>
        <p className="text-gray-400 text-center text-sm mb-12">
          "Built for Your Growth — Backed by Strong Fundamentals"
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <BenefitCard key={index} icon={benefit.icon} title={benefit.title} description={benefit.description} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustedSection;