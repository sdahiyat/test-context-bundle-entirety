'use client';

import { useState, useEffect, useRef } from 'react';
import { searchFoods, type FoodItem } from '@/api/foodsApi';

interface UseFoodSearchOptions {
  debounceMs?: number;
}

interface UseFoodSearchResult {
  query: string;
  setQuery: (q: string) => void;
  results: FoodItem[];
  isLoading: boolean;
  error: string;
}

export default function useFoodSearch(
  { debounceMs = 350 }: UseFoodSearchOptions = {}
): UseFoodSearchResult {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const cache = useRef<Map<string, FoodItem[]>>(new Map());

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    // Check cache first
    if (cache.current.has(query)) {
      setResults(cache.current.get(query)!);
      return;
    }

    setIsLoading(true);
    setError('');

    const timeoutId = setTimeout(async () => {
      try {
        const data = await searchFoods(query);
        cache.current.set(query, data.results);
        setResults(data.results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed');
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [query, debounceMs]);

  return { query, setQuery, results, isLoading, error };
}
