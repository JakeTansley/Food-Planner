'use client'

import { useState } from 'react'
import type { Meal } from '@/types/meal'
import { formatWeekRange } from '@/lib/dates'
import MealGrid from './MealGrid'

interface Props {
  weekStart: string
  meals: Meal[]
  onBack: () => void
  onReinstate: () => void
}

export default function HistoryView({ weekStart, meals, onBack, onReinstate }: Props) {
  const [tab, setTab] = useState<'grid' | 'shopping'>('grid')
  const [confirming, setConfirming] = useState(false)

  const allIngredients = meals
    .flatMap(m => (m.ingredients ? m.ingredients.split('\n') : []))
    .map(i => i.trim())
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b))

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      <div className="flex items-center px-3 py-2 bg-emerald-600 shrink-0">
        <button onClick={onBack} className="text-emerald-100 hover:text-white text-sm font-semibold mr-3 transition-colors">
          ← Back
        </button>
        <div className="flex-1 text-center">
          <p className="text-emerald-200 text-[10px] uppercase tracking-wider font-bold">Previous Week</p>
          <h2 className="text-white font-extrabold text-sm">{formatWeekRange(weekStart)}</h2>
        </div>
        <div className="w-16" />
      </div>

      <div className="flex border-b border-gray-200 shrink-0">
        <button
          onClick={() => setTab('grid')}
          className={`flex-1 py-2.5 text-xs font-bold transition-colors ${
            tab === 'grid' ? 'text-emerald-700 border-b-2 border-emerald-600' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          Meal Plan
        </button>
        <button
          onClick={() => setTab('shopping')}
          className={`flex-1 py-2.5 text-xs font-bold transition-colors ${
            tab === 'shopping' ? 'text-emerald-700 border-b-2 border-emerald-600' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          Shopping List ({allIngredients.length})
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        {tab === 'grid' && (
          <div className="h-full p-2">
            <MealGrid meals={meals} readOnly onCellClick={() => {}} />
          </div>
        )}
        {tab === 'shopping' && (
          <div className="h-full overflow-y-auto p-4">
            {allIngredients.length === 0 ? (
              <p className="text-gray-400 text-sm">No ingredients recorded for this week.</p>
            ) : (
              <ul className="space-y-2">
                {allIngredients.map((ingredient, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-black">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    {ingredient}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 shrink-0">
        {confirming ? (
          <>
            <p className="text-amber-600 text-xs text-center mb-3 font-semibold">
              This will replace your current week&apos;s plan. Continue?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirming(false)}
                className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-600 text-sm font-semibold hover:border-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => { setConfirming(false); onReinstate() }}
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-colors"
              >
                Yes, Reinstate
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={() => setConfirming(true)}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-bold transition-colors"
          >
            Reinstate this Week
          </button>
        )}
      </div>
    </div>
  )
}
