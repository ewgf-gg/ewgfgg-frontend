'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface EWGFLoadingAnimationProps {
  className?: string;
  inline?: boolean;
  variant?: 'loading' | 'searching';
  size?: 'small' | 'medium' | 'large';
}

const EWGFLoadingAnimation: React.FC<EWGFLoadingAnimationProps> = ({ 
  className, 
  inline = false,
  variant = 'loading',
  size = 'medium'
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
 
  const inputs = [
    '/static/tekken-inputs/f.webp',
    '/static/tekken-inputs/n.webp',
    '/static/tekken-inputs/d.webp',
    '/static/tekken-inputs/df.webp',
    '/static/tekken-inputs/2.webp'
  ];

  // Preload images on component mount
  useEffect(() => {
    inputs.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % (inputs.length + 1));
    }, 100); // Standardized to 100ms for all animations

    const handleResize = () => {
      if (!inline) {
        setWindowWidth(window.innerWidth);
      }
    };

    if (!inline) {
      window.addEventListener('resize', handleResize);
    }

    return () => {
      clearInterval(interval);
      if (!inline) {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, [inputs.length, inline]);

  // Determine image size based on props
  const getImageSize = () => {
    if (inline) return 16;
    if (size === 'small') return 24;
    if (size === 'large') return Math.min(windowWidth / 16, 50);
    return 32; // medium
  };

  const imageSize = getImageSize();
  const text = variant === 'searching' ? 'Searching...' : 'Loading...';

  // Create empty slots for consistent width (only for non-inline search variant)
  const emptySlots = (!inline && variant === 'searching') 
    ? Array(inputs.length - currentStep).fill(null) 
    : [];

  if (inline) {
    return (
      <div className={`flex items-center ml-2 ${className || ''}`}>
        {inputs.slice(0, currentStep).map((input, index) => (
          <Image
            key={`input-${index}`}
            src={input}
            alt={`Input ${index + 1}`}
            width={imageSize}
            height={imageSize}
            className="inline-block transition-all duration-300 ease-in-out mx-0.5"
            priority 
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className || ''}`}>
      <div className={`flex items-center justify-center ${size === 'large' ? 'h-16 mb-2' : 'h-6'} ${variant === 'searching' ? 'min-w-[120px]' : ''}`}>
        {inputs.slice(0, currentStep).map((input, index) => (
          <Image
            key={`input-${index}`}
            src={input}
            alt={`Input ${index + 1}`}
            width={imageSize}
            height={imageSize}
            className="inline-block transition-all duration-300 ease-in-out mx-1"
            priority 
          />
        ))}
        {/* Add invisible placeholders to maintain width for search variant */}
        {emptySlots.map((_, index) => (
          <div
            key={`placeholder-${index}`}
            className={`inline-block w-[${imageSize}px] h-[${imageSize}px] mx-1 invisible`}
            style={{ width: `${imageSize}px`, height: `${imageSize}px` }}
          />
        ))}
      </div>
      <p className={`${size === 'large' ? 'text-md' : 'text-sm'} text-gray-${size === 'large' ? '300' : '400'} mt-2`}>
        {text}
      </p>
    </div>
  );
};

export default EWGFLoadingAnimation;
