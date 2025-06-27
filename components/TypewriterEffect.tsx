"use client";

import React, { useState, useEffect, useCallback } from "react";

interface TypewriterEffectProps {
  text?: string;
  texts?: string[];
  typeDelay?: number;
  backspaceDelay?: number;
  pauseDelay?: number;
  className?: string;
}

const TypewriterEffect: React.FC<TypewriterEffectProps> = ({
  text = "",
  texts = [],
  typeDelay = 100,
  backspaceDelay = 50,
  pauseDelay = 1000,
  className = "",
}) => {
  const [displayedText, setDisplayedText] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isTyping, setIsTyping] = useState<boolean>(true);
  const [textIndex, setTextIndex] = useState<number>(0);

  // Use texts array if provided, otherwise fallback to single text
  const textArray: string[] = texts.length > 0 ? texts : [text];
  const currentText: string = textArray[textIndex] || "";

  const resetAnimation = useCallback(() => {
    setDisplayedText("");
    setCurrentIndex(0);
    setIsTyping(true);
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isTyping) {
      // Typing phase
      if (currentIndex < currentText.length) {
        timeoutId = setTimeout(() => {
          setDisplayedText((prev) => prev + currentText[currentIndex]);
          setCurrentIndex((prev) => prev + 1);
        }, typeDelay);
      } else {
        // Finished typing, pause then start backspacing
        timeoutId = setTimeout(() => {
          setIsTyping(false);
        }, pauseDelay);
      }
    } else {
      // Backspacing phase
      if (currentIndex > 0) {
        timeoutId = setTimeout(() => {
          setDisplayedText((prev) => prev.slice(0, -1));
          setCurrentIndex((prev) => prev - 1);
        }, backspaceDelay);
      } else {
        // Finished backspacing, move to next text and start typing again
        timeoutId = setTimeout(() => {
          setTextIndex((prev) => (prev + 1) % textArray.length);
          resetAnimation();
        }, pauseDelay);
      }
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [
    currentIndex,
    isTyping,
    currentText,
    typeDelay,
    backspaceDelay,
    pauseDelay,
    textArray.length,
    resetAnimation,
  ]);

  // Reset animation when text array changes
  useEffect(() => {
    resetAnimation();
    setTextIndex(0);
  }, [texts, text, resetAnimation]);

  return (
    <span className={className}>
      {displayedText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

export default TypewriterEffect;
