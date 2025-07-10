"use client";
import { motion } from "framer-motion";
import { FaQuoteLeft } from "react-icons/fa";
import TestimonialCard from "./TestimonialCard";

interface Testimonial {
  quote: string;
  name: string;
  title: string;
  initials: string;
  avatarColor: string;
}

const TestimonialsSection: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      quote:
        "TripxPay transformed how I manage travel expenses. The installment option made my dream vacation possible without financial stress.",
      name: "Jamie Doe",
      title: "Solo Traveler",
      initials: "JD",
      avatarColor: "bg-purple-500",
    },
    {
      quote:
        "The automatic currency conversion feature saved me so much time and money during my international trips. Absolutely essential for global travelers.",
      name: "Alex Smith",
      title: "Business Tourist",
      initials: "AS",
      avatarColor: "bg-pink-500",
    },
    {
      quote:
        "The rewards program is incredible! I've earned enough points from my travels to cover a weekend getaway. TripXpay pays for itself.",
      name: "Morgan Johnson",
      title: "Travel Blogger",
      initials: "MJ",
      avatarColor: "bg-yellow-500",
    },
  ];

  return (
    <div className="w-full py-20 px-6 md:px-12 text-white">
      <div className="max-w-6xl mx-auto text-center">
        <FaQuoteLeft className="text-4xl mx-auto text-gray-600 mb-4" />
        <h2 className="text-2xl md:text-4xl font-bold mb-2">What Our Clients Say</h2>
        <p className="text-gray-400 mb-16 max-w-xl mx-auto">
          Don't just take our word for it — here's what travel agencies are saying about TripX Pay.
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-12">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              className="bg-[#101010] rounded-xl p-6 w-full md:w-1/3 shadow-lg border border-gray-800 relative"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.3, duration: 0.9, ease: "easeOut" }}
              viewport={{ once: false, amount: 0.2 }}
            >
              <FaQuoteLeft className="text-cyan-400 text-2xl mb-4" />
              <p className="text-sm text-gray-300 mb-6">{t.quote}</p>
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 flex items-center justify-center text-sm font-bold text-white rounded-full ${t.avatarColor}`}>
                  {t.initials}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-white text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs">{t.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;