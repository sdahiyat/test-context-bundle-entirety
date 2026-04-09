'use client';

import { useState } from 'react';
import Link from 'next/link';
import FoodSearch from '@/components/food/FoodSearch';
import type { FoodSearchResult } from '@/types/food';
import { FOOD_CATEGORY_LABELS } from '@/types/food';
import type { FoodCategory } from '@/types/food';

export default function FoodsPage() {
  const [selectedFood, setSelectedFood] = useState<FoodSearchResult | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            ← Back to Home
          </Link>
          <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
            NutriTrack
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Food Database</h1>
          <p className="mt-2 text-gray-600">
            Search our library of common foods to view their nutritional information.
            Select a food to see its full macro breakdown.
          </p>
        </div>

        {/* Search component */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Search Foods</h2>
          <FoodSearch
            onFoodSelect={(food) => setSelectedFood(food)}
            showCategoryFilter={true}
          />
        </div>

        {/* Selected food detail panel */}
        {selectedFood && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedFood.name}</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Serving: {selectedFood.serving_size} {selectedFood.serving_unit}
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 capitalize">
                {FOOD_CATEGORY_LABELS[selectedFood.category as FoodCategory] ?? selectedFood.category}
              </span>
            </div>

            {/* Calorie highlight */}
            <div className="flex items-center justify-center bg-amber-50 rounded-lg py-4 mb-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-amber-600">
                  {selectedFood.calories_per_serving}
                </p>
                <p className="text-sm text-amber-700 font-medium mt-1">calories per serving</p>
              </div>
            </div>

            {/* Macros grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center bg-blue-50 rounded-lg p-4">
                <p className="text-2xl font-bold text-blue-700">
                  {selectedFood.protein_per_serving}g
                </p>
                <p className="text-xs text-blue-600 font-medium mt-1 uppercase tracking-wide">
                  Protein
                </p>
              </div>
              <div className="flex flex-col items-center bg-green-50 rounded-lg p-4">
                <p className="text-2xl font-bold text-green-700">
                  {selectedFood.carbs_per_serving}g
                </p>
                <p className="text-xs text-green-600 font-medium mt-1 uppercase tracking-wide">
                  Carbs
                </p>
              </div>
              <div className="flex flex-col items-center bg-red-50 rounded-lg p-4">
                <p className="text-2xl font-bold text-red-700">
                  {selectedFood.fat_per_serving}g
                </p>
                <p className="text-xs text-red-600 font-medium mt-1 uppercase tracking-wide">
                  Fat
                </p>
              </div>
            </div>

            {/* Macro % of calories breakdown */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center">
                Macro split (approx.) &nbsp;·&nbsp;
                Protein:{' '}
                {Math.round(
                  ((selectedFood.protein_per_serving * 4) / selectedFood.calories_per_serving) * 100
                )}
                % &nbsp;·&nbsp; Carbs:{' '}
                {Math.round(
                  ((selectedFood.carbs_per_serving * 4) / selectedFood.calories_per_serving) * 100
                )}
                % &nbsp;·&nbsp; Fat:{' '}
                {Math.round(
                  ((selectedFood.fat_per_serving * 9) / selectedFood.calories_per_serving) * 100
                )}
                %
              </p>
            </div>

            {/* Dismiss */}
            <button
              onClick={() => setSelectedFood(null)}
              className="mt-4 w-full text-sm text-gray-400 hover:text-gray-600 transition-colors py-1"
            >
              Clear selection
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
