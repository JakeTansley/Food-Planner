'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { formatWeekRange, getCurrentWeekStart } from '@/lib/dates'
import type { Meal } from '@/types/meal'

interface Props {
  isOpen: boolean
  onClose: () => void
  meals: Meal[]
  onSelectHistoryWeek: (weekStart: string, meals: Meal[]) => void
}

export default function MenuDrawer({ isOpen, onClose, meals, onSelectHistoryWeek }: Props) {
  const [view, setView] = useState<'menu' | 'shopping' | 'history'>('menu')
  const [historyWeeks, setHistoryWeeks] = useState<string[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)

  const allIngredients = meals
    .flatMap(m => (m.ingredients ? m.ingredients.split('\n') : []))
    .map(i => i.trim())
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b))

  async function loadHistory() {
    setLoadingHistory(true)
    const currentWeek = getCurrentWeekStart()
    const { data } = await supabase
      .from('meals')
      .select('week_start')
      .lt('week_start', currentWeek)
      .order('week_start', { ascending: false })
    if (data) {
      const unique = [...new Set(data.map(r => r.week_start as string))]
      setHistoryWeeks(unique)
    }
    setLoadingHistory(false)
  }

  async function handleSelectWeek(weekStart: string) {
    const { data } = await supabase
      .from('meals')
      .select('*')
      .eq('week_start', weekStart)
    handleClose()
    onSelectHistoryWeek(weekStart, (data ?? []) as Meal[])
  }

  function handleShowHistory() {
    setView('history')
    loadHistory()
  }

  function handleClose() {
    setView('menu')
    onClose()
  }

  if (!isOpen) return null

  const viewTitles = { menu: 'Menu', shopping: 'Shopping List', history: 'Previous Weeks' }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/60" onClick={handleClose} />

      <div className="relative bg-gray-800 w-64 max-w-[80vw] h-full flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 shrink-0">
          {view !== 'menu' ? (
            <button
              onClick={() => setView('menu')}
              className="text-blue-400 text-sm hover:text-blue-300"
            >
              ← Back
            </button>
          ) : (
            <h2 className="text-white font-semibold text-sm">{viewTitles[view]}</h2>
          )}
          {view !== 'menu' && (
            <h2 className="text-white font-semibold text-sm">{viewTitles[view]}</h2>
          )}
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white w-8 h-8 flex items-center justify-center text-xl"
          >
            ✕
          </button>
        </div>

        {view === 'menu' && (
          <div className="flex-1 p-4 flex flex-col gap-2">
            <button
              onClick={() => setView('shopping')}
              className="text-left px-4 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white text-sm transition-colors"
            >
              Shopping List
              <span className="block text-xs text-gray-400 mt-0.5">
                {allIngredients.length} ingredient{allIngredients.length !== 1 ? 's' : ''} this week
              </span>
            </button>
            <button
              onClick={handleShowHistory}
              className="text-left px-4 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white text-sm transition-colors"
            >
              Previous Weeks
              <span className="block text-xs text-gray-400 mt-0.5">View, browse &amp; reinstate</span>
            </button>
          </div>
        )}

        {view === 'shopping' && (
          <div className="flex-1 overflow-y-auto p-4">
            {allIngredients.length === 0 ? (
              <p className="text-gray-500 text-sm">No ingredients yet — fill in some meals first.</p>
            ) : (
              <ul className="space-y-2">
                {allIngredients.map((ingredient, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-white">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                    {ingredient}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {view === 'history' && (
          <div className="flex-1 overflow-y-auto p-4">
            {loadingHistory && (
              <p className="text-gray-500 text-sm">Loading...</p>
            )}
            {!loadingHistory && historyWeeks.length === 0 && (
              <p className="text-gray-500 text-sm">No previous weeks saved yet.</p>
            )}
            {!loadingHistory && historyWeeks.map(week => (
              <button
                key={week}
                onClick={() => handleSelectWeek(week)}
                className="w-full text-left px-4 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white text-sm transition-colors mb-2"
              >
                {formatWeekRange(week)}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
