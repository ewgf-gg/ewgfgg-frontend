'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface SearchLoadingAnimationProps {
  inline?: boolean;
}

const SearchLoadingAnimation: React.FC<SearchLoadingAnimationProps> = ({ inline }) => {
  const [currentStep, setCurrentStep] = useState(0);
 
  const inputs = [
    '/static/tekken-inputs/f.png',
    '/static/tekken-inputs/n.png',
    '/static/tekken-inputs/d.png',
    '/static/tekken-inputs/df.png',
    '/static/tekken-inputs/2.png'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % (inputs.length + 1));
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Create an array of empty slots to maintain consistent width
  const emptySlots = Array(inputs.length - currentStep).fill(null);

  if (inline) {
    return (
      <div className="flex items-center ml-2">
        {inputs.slice(0, currentStep).map((input, index) => (
          <Image
            key={`input-${index}`}
            src={input}
            alt={`Input ${index + 1}`}
            width={16}
            height={16}
            className="inline-block transition-all duration-300 ease-in-out mx-0.5"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-6">
      <div className="flex items-center justify-center h-6 min-w-[120px]">
        {inputs.slice(0, currentStep).map((input, index) => (
          <Image
            key={`input-${index}`}
            src={input}
            alt={`Input ${index + 1}`}
            width={24}
            height={24}
            className="inline-block transition-all duration-300 ease-in-out mx-1"
          />
        ))}
        {/* Add invisible placeholders to maintain width */}
        {emptySlots.map((_, index) => (
          <div
            key={`placeholder-${index}`}
            className="inline-block w-[24px] h-[24px] mx-1 invisible"
          />
        ))}
      </div>
      <p className="text-sm text-gray-400 mt-2">Searching...</p>
    </div>
  );
};

export default SearchLoadingAnimation;
