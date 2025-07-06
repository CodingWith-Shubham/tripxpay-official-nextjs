"use client";
import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

interface TestimonialCardProps {
  quote: string;
  name: string;
  title: string;
  avatarColor: string;
  index: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ 
  quote, 
  name, 
  title, 
  avatarColor, 
  index 
}) => {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [inView, controls]);

  const variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: "easeOut" as const,
        delay: index * 0.3,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      className="flex flex-col h-full"
    >
      <div className="bg-teal-600 rounded-lg p-10 flex-grow">
        <div className="text-2xl text-white mb-2">"</div>
        <p className="text-white text-md">{quote}</p>
      </div>
      <div className="flex items-center mt-4 px-4">
        <div
          className={`${avatarColor} w-10 h-10 rounded-full flex items-center justify-center text-white font-medium`}
        >
          {name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
        <div className="ml-3">
          <h4 className="font-medium">{name}</h4>
          <p className="text-gray-400 text-xs">{title}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;