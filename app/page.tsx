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
  const [saveError, setSaveError] = useState<string | null>(null)
  const [isPortrait, setIsPortrait] = useState(false)

  const weekStart = getCurrentWeekStart()

  useEffect(() => {
    fetchMeals()
  }, [])

  useEffect(() => {
    function checkOrientation() {
      // Only show rotate hint on small screens (phones), not tablets/desktop
      const isMobile = Math.max(window.innerWidth, window.innerHeight) < 1024
      setIsPortrait(isMobile && window.innerHeight > window.innerWidth)
    }
    checkOrientation()
    window.addEventListener('resize', checkOrientation)
    return () => window.removeEventListener('resize', checkOrientation)
  }, [])

  async function fetchMeals() {
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .eq('week_start', weekStart)
    if (error) {
      console.error('Fetch error:', error)
      setSaveError(`Could not load meals: ${error.message}`)
    }
    if (data) setMeals(data as Meal[])
  }

  function getMeal(day: Day, mealType: MealType): Meal | undefined {
    return meals.find(m => m.day === day && m.meal_type === mealType)
  }

  async function saveMeal(day: Day, mealType: MealType, dish: string, ingredients: string, isLeftovers: boolean) {
    setSaveError(null)

    // Delete any existing entry first so updates always work cleanly
    await supabase.from('meals').delete()
      .eq('week_start', weekStart).eq('day', day).eq('meal_type', mealType)

    const { error } = await supabase.from('meals').insert(
      { week_start: weekStart, day, meal_type: mealType, dish, ingredients, is_leftovers: isLeftovers, auto_filled: false }
    )

    if (error) {
      console.error('Save error:', error)
      setSaveError(`Could not save: ${error.message}`)
      return
    }

    if (mealType === 'dinner') {
      const nextDay = getNextDay(day)
      if (nextDay) {
        if (isLeftovers) {
          await supabase.from('meals').delete()
            .eq('week_start', weekStart).eq('day', nextDay).eq('meal_type', 'lunch')
          await supabase.from('meals').insert(
            { week_start: weekStart, day: nextDay, meal_type: 'lunch', dish: 'Leftovers', ingredients: '', is_leftovers: false, auto_filled: true }
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
    <main className="h-full overflow-hidden bg-white flex flex-col">
      {/* Rotate hint — shown only when phone is in portrait */}
      {isPortrait && (
        <div className="fixed inset-0 z-[200] bg-emerald-600 flex flex-col items-center justify-center gap-5 px-8">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="2" width="16" height="20" rx="2" />
            <path d="M9 21h6" />
            {/* Rotation arrows */}
            <path d="M17 8 A6 6 0 0 1 7 8" />
            <polyline points="17 5 17 8 20 8" />
          </svg>
          <p className="text-white font-extrabold text-xl text-center">Rotate your phone</p>
          <p className="text-emerald-100 text-sm text-center">This app works in landscape mode</p>
        </div>
      )}

      <Header
        weekRange={formatWeekRange(weekStart)}
        onMenuClick={() => setMenuOpen(true)}
        onClearAll={() => setConfirmClear(true)}
      />

      {saveError && (
        <div className="mx-3 mt-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs shrink-0">
          {saveError}
          <button className="ml-2 underline" onClick={() => setSaveError(null)}>Dismiss</button>
        </div>
      )}

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
          <div className="absolute inset-0 bg-black/40" onClick={() => setConfirmClear(false)} />
          <div className="relative bg-white rounded-2xl p-6 mx-6 flex flex-col gap-4 w-full max-w-sm shadow-xl">
            <h3 className="text-black font-bold text-center">Clear this week?</h3>
            <p className="text-gray-500 text-sm text-center">All meals for this week will be permanently deleted.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmClear(false)}
                className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-600 text-sm font-semibold hover:border-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={clearAllMeals}
                className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-colors"
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
