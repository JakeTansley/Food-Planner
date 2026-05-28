'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { getCurrentWeekStart, formatWeekRange, getNextDay } from '@/lib/dates'
import type { Meal, Day, MealType } from '@/types/meal'
import MealGrid from '@/components/MealGrid'
import MealForm from '@/components/MealForm'
import MenuDrawer from '@/components/MenuDrawer'
import Header from '@/components/Header'
import HistoryView from '@/components/HistoryView'

export default function Home() {
  const [meals, setMeals] = useState<Meal[]>([])
  const [selectedCell, setSelectedCell] = useState<{ day: Day; mealType: MealType } | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)
  const [historyView, setHistoryView] = useState<{ weekStart: string; meals: Meal[] } | null>(null)

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

  async function saveMeal(day: Day, mealType: MealType, dish: string, ingredients: string, isLeftovers: boolean) {
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
          await supabase.from('meals').delete()
            .eq('week_start', weekStart).eq('day', nextDay).eq('meal_type', 'lunch').eq('auto_filled', true)
        }
      }
    }

    await fetchMeals()
    setSelectedCell(null)
  }

  async function clearAllMeals() {
    await supabase.from('meals').delete().eq('week_start', weekStart)
    await fetchMeals()
    setConfirmClear(false)
  }

  async function reinstateWeek(historicalWeekStart: string) {
    const { data: historicalMeals } = await supabase
      .from('meals').select('*').eq('week_start', historicalWeekStart)
    if (!historicalMeals) return

    await supabase.from('meals').delete().eq('week_start', weekStart)

    const reinstated = historicalMeals.map(({ id: _id, created_at: _c, updated_at: _u, week_start: _w, ...rest }) => ({
      ...rest,
      week_start: weekStart,
    }))

    if (reinstated.length > 0) {
      await supabase.from('meals').insert(reinstated)
    }

    await fetchMeals()
    setHistoryView(null)
  }

  return (
    <main className="h-screen overflow-hidden bg-gray-900 flex flex-col">
      <Header
        weekRange={formatWeekRange(weekStart)}
        onMenuClick={() => setMenuOpen(true)}
        onClearAll={() => setConfirmClear(true)}
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
        onSelectHistoryWeek={(ws, ms) => setHistoryView({ weekStart: ws, meals: ms })}
      />

      {historyView && (
        <HistoryView
          weekStart={historyView.weekStart}
          meals={historyView.meals}
          onBack={() => setHistoryView(null)}
          onReinstate={() => reinstateWeek(historyView.weekStart)}
        />
      )}

      {confirmClear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setConfirmClear(false)} />
          <div className="relative bg-gray-800 rounded-2xl p-6 mx-6 flex flex-col gap-4 w-full max-w-sm">
            <h3 className="text-white font-semibold text-center">Clear this week?</h3>
            <p className="text-gray-400 text-sm text-center">All meals for this week will be permanently deleted.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmClear(false)}
                className="flex-1 py-3 rounded-xl border border-gray-600 text-gray-400 text-sm font-semibold hover:border-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={clearAllMeals}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
