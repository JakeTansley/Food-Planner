'use client'

import { useState } from 'react'
import type { Meal, Day, MealType } from '@/types/meal'

const DAY_DISPLAY: Record<Day, string> = {
  monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
  thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday',
}

const MEAL_DISPLAY: Record<MealType, string> = {
  breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner',
}

interface Props {
  day: Day
  mealType: MealType
  existingMeal?: Meal
  onSave: (day: Day, mealType: MealType, dish: string, ingredients: string, isLeftovers: boolean) => void
  onClose: () => void
}

export default function MealForm({ day, mealType, existingMeal, onSave, onClose }: Props) {
  const isAutoFilled = existingMeal?.auto_filled ?? false
  const [dish, setDish] = useState(existingMeal?.dish ?? '')
  const [ingredients, setIngredients] = useState(existingMeal?.ingredients ?? '')
  const [isLeftovers, setIsLeftovers] = useState(existingMeal?.is_leftovers ?? false)

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative bg-gray-800 rounded-t-2xl px-4 pt-4 pb-6 flex flex-col gap-3 max-h-[72vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-semibold text-sm">
            {DAY_DISPLAY[day]} · {MEAL_DISPLAY[mealType]}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl leading-none w-8 h-8 flex items-center justify-center">
            ✕
          </button>
        </div>

        {isAutoFilled && (
          <p className="text-amber-400 text-xs bg-amber-400/10 rounded-lg px-3 py-2">
            Auto-filled from previous night&apos;s leftovers
          </p>
        )}

        <div>
          <label className="text-gray-400 text-xs uppercase tracking-wider mb-1.5 block">Dish</label>
          <input
            type="text"
            value={dish}
            onChange={e => setDish(e.target.value)}
            placeholder="e.g. Pasta Bolognese"
            disabled={isAutoFilled}
            className="w-full bg-gray-700 text-white rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-40 placeholder:text-gray-500"
          />
        </div>

        {mealType === 'dinner' && (
          <div>
            <label className="text-gray-400 text-xs uppercase tracking-wider mb-1.5 block">Type</label>
            <div className="flex rounded-lg overflow-hidden border border-gray-600">
              <button
                onClick={() => setIsLeftovers(false)}
                className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                  !isLeftovers
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-400 hover:text-white'
                }`}
              >
                One-off
              </button>
              <button
                onClick={() => setIsLeftovers(true)}
                className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                  isLeftovers
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-700 text-gray-400 hover:text-white'
                }`}
              >
                Leftovers
              </button>
            </div>
            {isLeftovers && (
              <p className="text-amber-400 text-xs mt-1.5">
                Tomorrow&apos;s lunch will be marked as Leftovers
              </p>
            )}
          </div>
        )}

        <div>
          <label className="text-gray-400 text-xs uppercase tracking-wider mb-1.5 block">
            Ingredients <span className="normal-case text-gray-600">(one per line)</span>
          </label>
          <textarea
            value={ingredients}
            onChange={e => setIngredients(e.target.value)}
            placeholder={'Chicken breast\nGarlic\nOlive oil'}
            disabled={isAutoFilled}
            rows={4}
            className="w-full bg-gray-700 text-white rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:opacity-40 placeholder:text-gray-500"
          />
        </div>

        <button
          onClick={() => onSave(day, mealType, dish, ingredients, isLeftovers)}
          disabled={isAutoFilled || !dish.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl text-sm transition-colors"
        >
          Save
        </button>
      </div>
    </div>
  )
}
