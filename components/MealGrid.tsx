import type { Meal, Day, MealType } from '@/types/meal'
import { DAYS, DAY_LABELS } from '@/lib/dates'
import MealCell from './MealCell'

const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner']
const MEAL_LABELS: Record<MealType, string> = {
  breakfast: 'Brkfst',
  lunch: 'Lunch',
  dinner: 'Dinner',
}

interface Props {
  meals: Meal[]
  onCellClick: (day: Day, mealType: MealType) => void
  readOnly?: boolean
}

export default function MealGrid({ meals, onCellClick, readOnly = false }: Props) {
  function getMeal(day: Day, mealType: MealType): Meal | undefined {
    return meals.find(m => m.day === day && m.meal_type === mealType)
  }

  return (
    <div className="h-full flex flex-col gap-0.5">
      {/* Day headers */}
      <div className="flex gap-0.5 shrink-0">
        <div className="w-12 shrink-0" />
        {DAYS.map(day => (
          <div key={day} className="flex-1 text-center text-[10px] font-bold text-emerald-700 uppercase py-1 tracking-wide">
            {DAY_LABELS[day]}
          </div>
        ))}
      </div>

      {/* Meal rows */}
      {MEAL_TYPES.map(mealType => (
        <div key={mealType} className="flex-1 flex gap-0.5 min-h-0">
          <div className="w-12 shrink-0 flex items-center justify-center">
            <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wide">
              {MEAL_LABELS[mealType]}
            </span>
          </div>

          {DAYS.map(day => {
            const meal = getMeal(day, mealType)
            return (
              <div key={day} className="flex-1 min-w-0">
                <MealCell
                  meal={meal}
                  showLeftoverArrow={mealType === 'dinner' && (meal?.is_leftovers ?? false)}
                  isAutoFilled={meal?.auto_filled ?? false}
                  onClick={() => onCellClick(day, mealType)}
                  readOnly={readOnly}
                />
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
