'use client';

import React from 'react';
import {
  AppShell,
  Badge,
  Card,
  CardBody,
  CardHeader,
  MacroRing,
  ProgressBar,
} from '@/components';

const macros = [
  {
    label: 'Calories',
    consumed: 1450,
    goal: 2000,
    color: '#f97316',
    unit: 'kcal',
    progressColor: 'orange' as const,
  },
  {
    label: 'Protein',
    consumed: 85,
    goal: 150,
    color: '#3b82f6',
    unit: 'g',
    progressColor: 'blue' as const,
  },
  {
    label: 'Carbs',
    consumed: 180,
    goal: 250,
    color: '#22c55e',
    unit: 'g',
    progressColor: 'green' as const,
  },
  {
    label: 'Fat',
    consumed: 55,
    goal: 65,
    color: '#a855f7',
    unit: 'g',
    progressColor: 'primary' as const,
  },
];

const mealPlaceholders = [
  { name: 'Breakfast', time: '8:00 AM', calories: 420, items: 3 },
  { name: 'Lunch', time: '12:30 PM', calories: 680, items: 5 },
  { name: 'Snack', time: '3:15 PM', calories: 180, items: 2 },
  { name: 'Dinner', time: 'Not logged', calories: 0, items: 0 },
];

export default function DashboardPage() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <AppShell
      title="Today"
      subtitle={today}
      rightAction={
        <Badge variant="primary" dot>
          Day 12
        </Badge>
      }
    >
      <div className="p-4 space-y-4">
        {/* Macro Rings */}
        <Card variant="default" padding="md">
          <CardHeader title="Nutrition Summary" subtitle="Today's progress" />
          <CardBody>
            <div className="flex items-center justify-around flex-wrap gap-4">
              {macros.map((macro) => (
                <MacroRing
                  key={macro.label}
                  consumed={macro.consumed}
                  goal={macro.goal}
                  label={macro.label}
                  color={macro.color}
                  size="md"
                  showLabel
                />
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Progress bars */}
        <Card variant="default" padding="md">
          <CardHeader title="Macro Breakdown" />
          <CardBody>
            <div className="space-y-4">
              {macros.map((macro) => (
                <ProgressBar
                  key={macro.label}
                  value={macro.consumed}
                  max={macro.goal}
                  label={macro.label}
                  sublabel={`${macro.consumed}${macro.unit} / ${macro.goal}${macro.unit}`}
                  color={macro.progressColor}
                  size="md"
                  showPercentage
                />
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Meal cards */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 px-1">Meals</h3>
          {mealPlaceholders.map((meal) => (
            <Card key={meal.name} variant="default" padding="md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 text-sm">
                    {meal.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{meal.time}</p>
                </div>
                <div className="text-right">
                  {meal.calories > 0 ? (
                    <>
                      <p className="font-semibold text-gray-900 text-sm">
                        {meal.calories} kcal
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {meal.items} items
                      </p>
                    </>
                  ) : (
                    <Badge variant="default">Not logged</Badge>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
