import React, { useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';
import { Input } from './ui/input';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from './ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { useRouter } from 'next/navigation';
import debounce from 'lodash/debounce';
import { PlayerSearchResult, Regions, characterIconMap, rankIconMap } from '../app/state/types/tekkenTypes';
import SearchLoadingAnimation from './SearchLoadingAnimation';

export function SearchBar() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PlayerSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const debouncedFetch = useCallback(
    debounce(async (query: string) => {
      if (query.length < 3) {
        setSearchResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/search?query=${encodeURIComponent(query)}`,
          {
            headers: {
              'Accept': 'application/json',
            },
            cache: 'no-store'
          }
        );

        if (!response.ok) {
          throw new Error('Search failed');
        }

        const data = await response.json();
        setSearchResults(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch search results:', error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedFetch(searchQuery);
    return () => {
      debouncedFetch.cancel();
    };
  }, [searchQuery, debouncedFetch]);

  const handleSelect = useCallback((currentValue: string) => {
    const selectedPlayer = searchResults.find(
      player => player.id === currentValue
    );
    if (selectedPlayer) {
      setOpen(false);
      setSearchQuery('');
      router.push(`/player/${encodeURIComponent(selectedPlayer.tekkenId || selectedPlayer.name)}`);
    }
  }, [searchResults, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= 20) {  // Only update if within 20 character limit
      setSearchQuery(newValue);
      setOpen(newValue.length >= 3);
    }
  };

  return (
    <div className="w-full max-w-xl relative">
      <Popover 
        open={open && searchQuery.length >= 3} 
        onOpenChange={(newOpen) => {
          if (searchQuery.length >= 3) {
            setOpen(newOpen);
          } else {
            setOpen(false);
          }
        }}
      >
        <PopoverTrigger asChild>
          <div className="relative w-full">
            <Input
              type="text"
              placeholder="Search player... (Player name / TEKKEN-ID)"
              className="w-full h-10 pl-10 pr-4 text-sm bg-gray-700/50 text-white border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 rounded-lg transition-all hover:bg-gray-700/70"
              value={searchQuery}
              onChange={handleInputChange}
              maxLength={20}  
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  e.preventDefault();
                  router.push(`/player/${encodeURIComponent(searchQuery.trim())}`);
                  setOpen(false);
                  setSearchQuery('');
                }
              }}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          </div>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[--radix-popover-trigger-width] p-0" 
          align="start"
          sideOffset={5}
          onOpenAutoFocus={(e) => e.preventDefault()} 
        >
          <Command className="w-full" shouldFilter={false}>
            <CommandList>
              {isLoading ? (
                <div className="py-2">
                  <SearchLoadingAnimation />
                </div>
              ) : (
                <>
                  <CommandEmpty>
                    <div className="py-6 text-sm text-gray-400">
                      No players found.
                    </div>
                  </CommandEmpty>
                  <CommandGroup heading="Players">
                    {searchResults.map((player) => (
                      <CommandItem
                        key={player.id}
                        value={player.id}
                        onSelect={handleSelect}
                        className="flex flex-col items-start py-3 cursor-pointer hover:bg-gray-100/10"
                      >
                        <div className="flex items-center gap-2 w-full">
                          {/* Main Character Icon */}
                          {player.mostPlayedCharacter && (
                            <img
                              src={characterIconMap[player.mostPlayedCharacter]}
                              alt={player.mostPlayedCharacter}
                              className="w-10 h-15"
                            />
                          )}
                          <div className="flex flex-col flex-grow">
                            <div className="font-medium">{player.name}</div>
                            <div className="text-sm text-gray-400 flex items-center gap-2">
                              {player.tekkenId}
                              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700">
                                {Regions[player.regionId]}
                              </span>
                            </div>
                          </div>
                          {/* Rank Icon */}
                          {player.danRankName && (
                            <img
                              src={rankIconMap[player.danRankName]}
                              alt={player.danRankName}
                              className="w-15 h-10"
                            />
                          )}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default SearchBar;
