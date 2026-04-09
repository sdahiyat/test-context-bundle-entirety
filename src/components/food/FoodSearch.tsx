'use client';

import { useEffect, useRef, useState } from 'react';
import type { FoodCategory, FoodSearchResult } from '@/types/food';
import { FOOD_CATEGORIES, FOOD_CATEGORY_LABELS } from '@/types/food';
import FoodCard from '@/components/food/FoodCard';

export interface FoodSearchProps {
  onFoodSelect: (food: FoodSearchResult) => void;
  initialQuery?: string;
  showCategoryFilter?: boolean;
  className?: string;
}

export default function FoodSearch({
  onFoodSelect,
  initialQuery = '',
  showCategoryFilter = false,
  className = '',
}: FoodSearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<FoodCategory | ''>('');
  const [results, setResults] = useState<FoodSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Keep a ref to the current debounce timer so we can clear it on cleanup
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Cancel any pending request
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.trim().length < 2) {
      setResults([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    debounceRef.current = setTimeout(async () => {
      try {
        const params = new URLSearchParams({ q: query.trim() });
        if (category) params.set('category', category);

        const res = await fetch(`/api/foods/search?${params.toString()}`);

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? `Request failed (${res.status})`);
        }

        const body = await res.json();
        setResults(body.foods ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    // Cleanup on unmount or next effect run
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, category]);

  const showEmpty = !isLoading && query.trim().length >= 2 && results.length === 0 && !error;

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* Search input + optional category filter */}
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search foods…"
          aria-label="Search foods"
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                     placeholder-gray-400 bg-white"
        />

        {showCategoryFilter && (
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as FoodCategory | '')}
            aria-label="Filter by category"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white
                       focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                       text-gray-700"
          >
            <option value="">All categories</option>
            {FOOD_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {FOOD_CATEGORY_LABELS[cat]}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Loading spinner */}
      {isLoading && (
        <div className="flex items-center justify-center py-6" aria-label="Loading">
          <div className="h-6 w-6 rounded-full border-2 border-primary-500 border-t-transparent animate-spin" />
        </div>
      )}

      {/* Error message */}
      {error && !isLoading && (
        <p className="text-sm text-red-600 px-1">{error}</p>
      )}

      {/* Empty state */}
      {showEmpty && (
        <p className="text-sm text-gray-500 text-center py-6">
          No foods found for &ldquo;{query}&rdquo;
          {category ? ` in ${FOOD_CATEGORY_LABELS[category as FoodCategory]}` : ''}.
        </p>
      )}

      {/* Results list */}
      {!isLoading && results.length > 0 && (
        <ul className="flex flex-col gap-2" role="list">
          {results.map((food) => (
            <li key={food.id}>
              <FoodCard food={food} onClick={onFoodSelect} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
