'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { characterEnumMap } from '@/app/state/types/tekkenTypes';

interface Character {
  name: string;
  displayName: string;
  icon: string;
  isRandom?: boolean;
}

// Organized to match in-game roster layout
const characterRows: Character[][] = [
  // Row 1
  [
    { name: 'Armor King', displayName: 'Armor King', icon: '/static/circular_character_icons/armor_king.webp' },
    { name: 'Eddy', displayName: 'Eddy', icon: '/static/circular_character_icons/eddy.webp' },
    { name: 'Claudio', displayName: 'Claudio', icon: '/static/circular_character_icons/claudio.webp' },
    { name: 'Zafina', displayName: 'Zafina', icon: '/static/circular_character_icons/zafina.webp' },
    { name: 'Paul', displayName: 'Paul', icon: '/static/circular_character_icons/paul.webp' },
    { name: 'Raven', displayName: 'Raven', icon: '/static/circular_character_icons/raven.webp' },
    { name: 'Victor', displayName: 'Victor', icon: '/static/circular_character_icons/victor.webp' },
    { name: 'Reina', displayName: 'Reina', icon: '/static/circular_character_icons/reina.webp' },
    { name: 'Azucena', displayName: 'Azucena', icon: '/static/circular_character_icons/azucena.webp' },
    { name: 'Shaheen', displayName: 'Shaheen', icon: '/static/circular_character_icons/shaheen.webp' },
    { name: 'Law', displayName: 'Law', icon: '/static/circular_character_icons/law.webp' },
    { name: 'Leroy', displayName: 'Leroy', icon: '/static/circular_character_icons/leroy.webp' },
    { name: 'Leo', displayName: 'Leo', icon: '/static/circular_character_icons/leo.webp' },
    { name: 'Lidia', displayName: 'Lidia', icon: '/static/circular_character_icons/lidia.webp' },
  ],
  // Row 2
  [
    { name: 'Heihachi', displayName: 'Heihachi', icon: '/static/circular_character_icons/heihachi.webp' },
    { name: 'Panda', displayName: 'Panda', icon: '/static/circular_character_icons/panda.webp' },
    { name: 'Asuka', displayName: 'Asuka', icon: '/static/circular_character_icons/asuka.webp' },
    { name: 'Lee', displayName: 'Lee', icon: '/static/circular_character_icons/lee.webp' },
    { name: 'Xiaoyu', displayName: 'Xiaoyu', icon: '/static/circular_character_icons/xiaoyu.webp' },
    { name: 'Jin', displayName: 'Jin', icon: '/static/circular_character_icons/jin.webp' },
    { name: 'random', displayName: 'Random', icon: '', isRandom: true },
    { name: 'Kazuya', displayName: 'Kazuya', icon: '/static/circular_character_icons/kazuya.webp' },
    { name: 'Nina', displayName: 'Nina', icon: '/static/circular_character_icons/nina.webp' },
    { name: 'Hwoarang', displayName: 'Hwoarang', icon: '/static/circular_character_icons/hwoarang.webp' },
    { name: 'Feng', displayName: 'Feng', icon: '/static/circular_character_icons/feng.webp' },
    { name: 'Yoshimitsu', displayName: 'Yoshimitsu', icon: '/static/circular_character_icons/yoshimitsu.webp' },
    { name: 'Clive', displayName: 'Clive', icon: '/static/circular_character_icons/clive.webp' },
  ],
  // Row 3
  [
    { name: 'Anna', displayName: 'Anna', icon: '/static/circular_character_icons/anna.webp' },
    { name: 'Kuma', displayName: 'Kuma', icon: '/static/circular_character_icons/kuma.webp' },
    { name: 'Lili', displayName: 'Lili', icon: '/static/circular_character_icons/lili.webp' },
    { name: 'Alisa', displayName: 'Alisa', icon: '/static/circular_character_icons/alisa.webp' },
    { name: 'Lars', displayName: 'Lars', icon: '/static/circular_character_icons/lars.webp' },
    { name: 'Jun', displayName: 'Jun', icon: '/static/circular_character_icons/jun.webp' },
    { name: 'Devil Jin', displayName: 'Devil Jin', icon: '/static/circular_character_icons/devil_jin.webp' },
    { name: 'Jack-8', displayName: 'Jack-8', icon: '/static/circular_character_icons/jack-8.webp' },
    { name: 'King', displayName: 'King', icon: '/static/circular_character_icons/king.webp' },
    { name: 'Steve', displayName: 'Steve', icon: '/static/circular_character_icons/steve.webp' },
    { name: 'Dragunov', displayName: 'Dragunov', icon: '/static/circular_character_icons/dragunov.webp' },
    { name: 'Bryan', displayName: 'Bryan', icon: '/static/circular_character_icons/bryan.webp' },
    { name: 'Fahkumram', displayName: 'Fahkumram', icon: '/static/circular_character_icons/fahkumram.webp' },
  ],
];

// Function to get a random character
const getRandomCharacter = () => {
  const allCharacters = characterRows.flat().filter(c => !c.isRandom);
  const randomChar = allCharacters[Math.floor(Math.random() * allCharacters.length)];
  const enumValue = characterEnumMap[randomChar.name];
  return `/character/${enumValue}`;
};

export function CharacterIconGallery() {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleRandomClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = getRandomCharacter();
  };

  return (
    <div className="w-full py-12">
      {/* Mobile: Rotated 90 degrees - rows become vertical columns */}
      <div className="flex md:hidden gap-2 justify-center max-w-7xl mx-auto px-4">
        {characterRows.map((row, rowIndex) => (
          <div key={`col-${rowIndex}`} className="flex flex-col gap-2">
            {row.map((character, charIndex) => {
              const animationDelay = (rowIndex * row.length + charIndex) * 30;

              if (character.isRandom) {
                return (
                  <button
                    key="random"
                    onClick={handleRandomClick}
                    className="character-icon transition-all duration-700 ease-out hover:scale-110 hover:z-10"
                    style={{
                      opacity: isAnimated ? 1 : 0,
                      transform: isAnimated ? 'scale(1)' : 'scale(0)',
                      transitionDelay: `${animationDelay}ms`,
                    }}
                  >
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-700 hover:border-blue-500 transition-colors shadow-lg bg-gray-800 flex items-center justify-center">
                      <span className="text-3xl font-bold text-gray-400">?</span>
                    </div>
                  </button>
                );
              }

              return (
                <Link
                  key={character.name}
                  href={`/character/${characterEnumMap[character.name]}`}
                  className="character-icon transition-all duration-700 ease-out hover:scale-110 hover:z-10"
                  style={{
                    opacity: isAnimated ? 1 : 0,
                    transform: isAnimated ? 'scale(1)' : 'scale(0)',
                    transitionDelay: `${animationDelay}ms`,
                  }}
                >
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-700 hover:border-blue-500 transition-colors shadow-lg">
                    <Image
                      src={character.icon}
                      alt={character.displayName}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Desktop: Row-based layout */}
      <div className="hidden md:flex flex-col items-end gap-2 max-w-7xl mx-auto px-4">
        {characterRows.map((row, rowIndex) => {
          // Center column is at index 6 (Reina, Random, Devil Jin)
          const centerColumnIndex = 6;
          // Center row is row 1 (middle row)
          const centerRowIndex = 1;
          
          return (
            <div key={`row-${rowIndex}`} className="flex justify-end items-center gap-2">
              {row.map((character, charIndex) => {
                // Calculate distance from center position (row 1, column 6) for fan-out animation
                const horizontalDistance = Math.abs(charIndex - centerColumnIndex);
                const verticalDistance = Math.abs(rowIndex - centerRowIndex);
                // Use Euclidean distance for radial fan-out effect
                const distanceFromCenter = Math.sqrt(
                  horizontalDistance * horizontalDistance + 
                  verticalDistance * verticalDistance
                );
                const animationDelay = distanceFromCenter * 70;

                if (character.isRandom) {
                  return (
                    <button
                      key="random"
                      onClick={handleRandomClick}
                      className="character-icon transition-all duration-700 ease-out hover:scale-110 hover:z-10"
                      style={{
                        opacity: isAnimated ? 1 : 0,
                        transform: isAnimated ? 'scale(1)' : 'scale(0)',
                        transitionDelay: `${animationDelay}ms`,
                      }}
                    >
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-gray-700 hover:border-blue-500 transition-colors shadow-lg bg-gray-800 flex items-center justify-center">
                        <span className="text-3xl sm:text-4xl font-bold text-gray-400">?</span>
                      </div>
                    </button>
                  );
                }

                return (
                  <Link
                    key={character.name}
                    href={`/character/${characterEnumMap[character.name]}`}
                    className="character-icon transition-all duration-700 ease-out hover:scale-110 hover:z-10"
                    style={{
                      opacity: isAnimated ? 1 : 0,
                      transform: isAnimated ? 'scale(1)' : 'scale(0)',
                      transitionDelay: `${animationDelay}ms`,
                    }}
                  >
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-gray-700 hover:border-blue-500 transition-colors shadow-lg">
                      <Image
                        src={character.icon}
                        alt={character.displayName}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 64px, 80px"
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .character-icon {
          will-change: transform, opacity;
        }
      `}</style>
    </div>
  );
}
