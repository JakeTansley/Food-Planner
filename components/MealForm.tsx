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
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative bg-white rounded-t-2xl px-4 pt-4 pb-6 flex flex-col gap-3 max-h-[80vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-black font-extrabold text-base">
            {DAY_DISPLAY[day]} · {MEAL_DISPLAY[mealType]}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black text-xl leading-none w-8 h-8 flex items-center justify-center transition-colors">
            ✕
          </button>
        </div>

        {isAutoFilled && (
          <p className="text-amber-700 text-xs bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            Auto-filled from previous night&apos;s leftovers
          </p>
        )}

        <div>
          <label className="text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1.5 block">Recipe Name</label>
          <input
            type="text"
            value={dish}
            onChange={e => setDish(e.target.value)}
            placeholder="e.g. Pasta Bolognese"
            disabled={isAutoFilled}
            className="w-full bg-gray-50 border border-gray-200 text-black rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 disabled:opacity-40 placeholder:text-gray-400 transition-colors"
          />
        </div>

        {mealType === 'dinner' && (
          <div>
            <label className="text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1.5 block">Type</label>
            <div className="flex rounded-lg overflow-hidden border border-gray-200">
              <button
                onClick={() => setIsLeftovers(false)}
                className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
                  !isLeftovers
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-gray-500 hover:text-black'
                }`}
              >
                One-off
              </button>
              <button
                onClick={() => setIsLeftovers(true)}
                className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
                  isLeftovers
                    ? 'bg-amber-500 text-white'
                    : 'bg-white text-gray-500 hover:text-black'
                }`}
              >
                Leftovers
              </button>
            </div>
            {isLeftovers && (
              <p className="text-amber-600 text-xs mt-1.5">
                Tomorrow&apos;s lunch will be marked as Leftovers
              </p>
            )}
          </div>
        )}

        <div>
          <label className="text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1.5 block">
            Ingredients <span className="normal-case text-gray-400 font-normal">(one per line)</span>
          </label>
          <textarea
            value={ingredients}
            onChange={e => setIngredients(e.target.value)}
            placeholder={'Chicken breast\nGarlic\nOlive oil'}
            disabled={isAutoFilled}
            rows={4}
            className="w-full bg-gray-50 border border-gray-200 text-black rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 resize-none disabled:opacity-40 placeholder:text-gray-400 transition-colors"
          />
        </div>

        <button
          onClick={() => onSave(day, mealType, dish, ingredients, isLeftovers)}
          disabled={isAutoFilled || !dish.trim()}
          className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl text-sm transition-colors"
        >
          Save
        </button>
      </div>
    </div>
  )
}
