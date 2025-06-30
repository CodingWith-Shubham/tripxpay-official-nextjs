// TypewriterEffect.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';

interface TypewriterEffectProps {
  text?: string;
  texts?: string[];
  typeDelay?: number;
  backspaceDelay?: number;
  pauseDelay?: number;
  loop?: boolean;
  className?: string;
  cursor?: boolean;
  cursorStyle?: string;
}

const TypewriterEffect: React.FC<TypewriterEffectProps> = ({
  text = '',
  texts = [],
  typeDelay = 100,
  backspaceDelay = 50,
  pauseDelay = 1000,
  loop = true,
  className = '',
  cursor = true,
  cursorStyle = 'animate-pulse',
}) => {
  // Combine single text and texts array into one array
  const textArray = texts.length > 0 ? texts : [text];
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const currentText = textArray[currentTextIndex] ?? '';

  const typeText = useCallback(() => {
    if (currentCharIndex < currentText.length) {
      setDisplayedText(prev => prev + currentText[currentCharIndex]);
      setCurrentCharIndex(prev => prev + 1);
    } else {
      // Finished typing current text
      setIsTyping(false);
      setTimeout(() => {
        if (loop || currentTextIndex < textArray.length - 1) {
          setIsDeleting(true);
        }
      }, pauseDelay);
    }
  }, [currentCharIndex, currentText, pauseDelay, loop, currentTextIndex, textArray.length]);

  const deleteText = useCallback(() => {
    if (displayedText.length > 0) {
      setDisplayedText(prev => prev.slice(0, -1));
    } else {
      // Finished deleting current text
      setIsDeleting(false);
      const nextTextIndex = (currentTextIndex + 1) % textArray.length;
      
      if (loop || nextTextIndex !== 0) {
        setCurrentTextIndex(nextTextIndex);
        setCurrentCharIndex(0);
        setIsTyping(true);
      }
    }
  }, [displayedText, currentTextIndex, textArray.length, loop]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isTyping) {
      timeout = setTimeout(typeText, typeDelay);
    } else if (isDeleting) {
      timeout = setTimeout(deleteText, backspaceDelay);
    }

    return () => clearTimeout(timeout);
  }, [isTyping, isDeleting, typeText, deleteText, typeDelay, backspaceDelay]);

  // Reset when texts prop changes
  useEffect(() => {
    setCurrentTextIndex(0);
    setCurrentCharIndex(0);
    setDisplayedText('');
    setIsTyping(true);
    setIsDeleting(false);
  }, [texts, text]);

  return (
    <span className={className}>
      {displayedText}
      {cursor && <span className={cursorStyle}>|</span>}
    </span>
  );
};

export default TypewriterEffect;