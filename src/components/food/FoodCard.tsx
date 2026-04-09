'use client';

import type { FoodSearchResult } from '@/types/food';

interface FoodCardProps {
  food: FoodSearchResult;
  onClick?: (food: FoodSearchResult) => void;
  selected?: boolean;
  className?: string;
}

export default function FoodCard({
  food,
  onClick,
  selected = false,
  className = '',
}: FoodCardProps) {
  const handleClick = () => {
    if (onClick) onClick(food);
  };

  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleClick();
        }
      }}
      className={[
        'relative border rounded-lg p-3 transition-colors',
        onClick ? 'cursor-pointer hover:bg-gray-50' : '',
        selected ? 'ring-2 ring-primary-500 border-primary-500' : 'border-gray-200',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Category badge – top-right */}
      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 capitalize">
        {food.category}
      </span>

      {/* Food name */}
      <h3 className="font-medium text-gray-900 pr-16 leading-snug">{food.name}</h3>

      {/* Serving info */}
      <p className="text-sm text-gray-500 mt-0.5">
        {food.serving_size} {food.serving_unit} per serving
      </p>

      {/* Macro badges */}
      <div className="flex flex-wrap gap-1.5 mt-2">
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
          {food.calories_per_serving} cal
        </span>
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {food.protein_per_serving}g protein
        </span>
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          {food.carbs_per_serving}g carbs
        </span>
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          {food.fat_per_serving}g fat
        </span>
      </div>
    </div>
  );
}
