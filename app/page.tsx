'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { getCurrentWeekStart, formatWeekRange, getNextDay } from '@/lib/dates'
import type { Meal, Day, MealType } from '@/types/meal'
import MealGrid from '@/components/MealGrid'
import MealForm from '@/components/MealForm'
import MenuDrawer from '@/components/MenuDrawer'
import Header from '@/components/Header'

export default function Home() {
  const [meals, setMeals] = useState<Meal[]>([])
  const [selectedCell, setSelectedCell] = useState<{ day: Day; mealType: MealType } | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const weekStart = getCurrentWeekStart()

  useEffect(() => {
    fetchMeals()
  }, [])

  async function fetchMeals() {
    const { data } = await supabase
      .from('meals')
      .select('*')
      .eq('week_start', weekStart)
    if (data) setMeals(data as Meal[])
  }

  function getMeal(day: Day, mealType: MealType): Meal | undefined {
    return meals.find(m => m.day === day && m.meal_type === mealType)
  }

  async function saveMeal(
    day: Day,
    mealType: MealType,
    dish: string,
    ingredients: string,
    isLeftovers: boolean
  ) {
    await supabase.from('meals').upsert(
      { week_start: weekStart, day, meal_type: mealType, dish, ingredients, is_leftovers: isLeftovers, auto_filled: false },
      { onConflict: 'week_start,day,meal_type' }
    )

    if (mealType === 'dinner') {
      const nextDay = getNextDay(day)
      if (nextDay) {
        if (isLeftovers) {
          await supabase.from('meals').upsert(
            { week_start: weekStart, day: nextDay, meal_type: 'lunch', dish: 'Leftovers', ingredients: '', is_leftovers: false, auto_filled: true },
            { onConflict: 'week_start,day,meal_type' }
          )
        } else {
          await supabase
            .from('meals')
            .delete()
            .eq('week_start', weekStart)
            .eq('day', nextDay)
            .eq('meal_type', 'lunch')
            .eq('auto_filled', true)
        }
      }
    }

    await fetchMeals()
    setSelectedCell(null)
  }

  return (
    <main className="h-screen overflow-hidden bg-gray-900 flex flex-col">
      <Header
        weekRange={formatWeekRange(weekStart)}
        onMenuClick={() => setMenuOpen(true)}
      />
      <div className="flex-1 min-h-0 p-2">
        <MealGrid meals={meals} onCellClick={(day, mealType) => setSelectedCell({ day, mealType })} />
      </div>

      {selectedCell && (
        <MealForm
          day={selectedCell.day}
          mealType={selectedCell.mealType}
          existingMeal={getMeal(selectedCell.day, selectedCell.mealType)}
          onSave={saveMeal}
          onClose={() => setSelectedCell(null)}
        />
      )}

      <MenuDrawer
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        meals={meals}
      />
    </main>
  )
}
