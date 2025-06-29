"use client";
import React from "react";
import { motion } from "framer-motion";

interface BenefitCardProps {
  icon: string;
  title: string;
  description: string;
}

const BenefitCard: React.FC<BenefitCardProps> = ({ icon, title, description }) => {
  const renderIcon = () => {
    const commonSvgProps = {
      className: "w-10 h-10 text-teal-500",
      fill: "none",
      stroke: "currentColor",
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg",
    };

    const wrapWithMotionSvg = (children: React.ReactNode) => (
      <motion.svg
        {...commonSvgProps}
        initial={{ opacity: 0, scale: 0.6 }}
        whileInView={{
          opacity: 1,
          scale: 1,
          transition: {
            duration: 0.9,
            type: "spring",
            stiffness: 80,
          },
        }}
        viewport={{ once: true, amount: 0.2 }}
        whileHover={{
          scale: 1.1,
          rotate: 5,
          transition: {
            duration: 0.8,
            type: "spring",
            stiffness: 300,
          },
        }}
      >
        {children}
      </motion.svg>
    );

    const pathAnimationProps = {
      initial: { pathLength: 0, opacity: 0 },
      whileInView: {
        pathLength: 1,
        opacity: 1,
        transition: {
          duration: 0.9,
          delay: 0.1,
        },
      },
      viewport: { once: true, amount: 0.2 },
    };

    switch (icon) {
      case "shield-check":
        return wrapWithMotionSvg(
          <motion.path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            {...pathAnimationProps}
          />
        );

      case "lock-closed":
        return wrapWithMotionSvg(
          <motion.path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            {...pathAnimationProps}
          />
        );

      case "chart-bar":
        return wrapWithMotionSvg(
          <motion.path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            {...pathAnimationProps}
          />
        );

      case "credit-card":
        return wrapWithMotionSvg(
          <motion.path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            {...pathAnimationProps}
          />
        );

      case "user":
        return wrapWithMotionSvg(
          <motion.path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            {...pathAnimationProps}
          />
        );

      case "globe":
        return wrapWithMotionSvg(
          <>
            <motion.circle
              cx="12"
              cy="12"
              r="10"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              {...pathAnimationProps}
            />
            <motion.path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2 12h20M12 2v20"
              {...pathAnimationProps}
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center text-center p-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: { duration: 0.6 },
      }}
      viewport={{ once: true, amount: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <motion.div
        className="bg-gray-800 rounded-full p-4 mb-4"
        whileHover={{
          boxShadow: "0px 0px 8px rgba(56, 178, 172, 0.6)",
          transition: { duration: 0.3 },
        }}
      >
        {renderIcon()}
      </motion.div>
      <h2 className="text-lg md:text-[23px] font-bold mb-2">{title}</h2>
      <p className="text-gray-400 text-sm">{description}</p>
    </motion.div>
  );
};

export default BenefitCard;
