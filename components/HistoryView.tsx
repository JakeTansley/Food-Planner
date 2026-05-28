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
    <div className="fixed inset-0 z-50 bg-gray-900 flex flex-col">
      <div className="flex items-center px-3 py-2 border-b border-gray-800 shrink-0">
        <button onClick={onBack} className="text-blue-400 text-sm hover:text-blue-300 mr-3">
          ← Back
        </button>
        <div className="flex-1 text-center">
          <p className="text-gray-500 text-[10px] uppercase tracking-wider">Previous Week</p>
          <h2 className="text-white font-bold text-sm">{formatWeekRange(weekStart)}</h2>
        </div>
        <div className="w-16" />
      </div>

      <div className="flex border-b border-gray-800 shrink-0">
        <button
          onClick={() => setTab('grid')}
          className={`flex-1 py-2 text-xs font-semibold transition-colors ${
            tab === 'grid' ? 'text-white border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Meal Plan
        </button>
        <button
          onClick={() => setTab('shopping')}
          className={`flex-1 py-2 text-xs font-semibold transition-colors ${
            tab === 'shopping' ? 'text-white border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-300'
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
              <p className="text-gray-500 text-sm">No ingredients recorded for this week.</p>
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
      </div>

      <div className="p-4 border-t border-gray-800 shrink-0">
        {confirming ? (
          <>
            <p className="text-amber-400 text-xs text-center mb-3">
              This will replace your current week&apos;s plan. Continue?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirming(false)}
                className="flex-1 py-3 rounded-xl border border-gray-600 text-gray-400 text-sm font-semibold hover:border-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => { setConfirming(false); onReinstate() }}
                className="flex-1 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold transition-colors"
              >
                Yes, Reinstate
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={() => setConfirming(true)}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold transition-colors"
          >
            Reinstate this Week
          </button>
        )}
      </div>
    </div>
  )
}
