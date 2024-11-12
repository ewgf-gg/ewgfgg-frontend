import React, { useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from 'next/navigation';
import debounce from 'lodash/debounce';
import { PlayerSearchResult } from '@/app/state/types/tekkenTypes';

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
      player => player.name.toLowerCase() === currentValue.toLowerCase()
    );
    if (selectedPlayer) {
      setOpen(false);
      setSearchQuery('');
      router.push(`/player/${encodeURIComponent(selectedPlayer.tekkenId || selectedPlayer.name)}`);
    }
  }, [searchResults, router]);

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
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setOpen(e.target.value.length >= 3);
              }}
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
              <CommandEmpty>
                {isLoading ? (
                  <div className="flex items-center justify-center py-6 text-sm text-gray-400">
                    Searching...
                  </div>
                ) : (
                  <div className="py-6 text-sm text-gray-400">
                    No players found.
                  </div>
                )}
              </CommandEmpty>
              <CommandGroup heading="Players">
                {searchResults.map((player) => (
                  <CommandItem
                    key={player.id}
                    value={player.name}
                    onSelect={handleSelect}
                    className="flex flex-col items-start py-3 cursor-pointer hover:bg-gray-100/10"
                  >
                    <div className="font-medium">{player.name}</div>
                    {player.tekkenId && (
                      <div className="text-sm text-gray-400">
                        {player.tekkenId}
                      </div>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default SearchBar;