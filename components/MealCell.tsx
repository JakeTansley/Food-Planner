import type { Meal } from '@/types/meal'

interface Props {
  meal?: Meal
  showLeftoverArrow: boolean
  isAutoFilled: boolean
  onClick: () => void
  readOnly?: boolean
}

function dishFontClass(dish: string): string {
  const len = dish.length
  if (len <= 6)  return 'text-sm font-extrabold'
  if (len <= 12) return 'text-xs font-bold'
  if (len <= 20) return 'text-[10px] font-bold'
  return 'text-[9px] font-bold'
}

export default function MealCell({ meal, showLeftoverArrow, isAutoFilled, onClick, readOnly = false }: Props) {
  const hasContent = Boolean(meal?.dish)

  const baseClass = 'relative w-full h-full rounded-lg overflow-hidden'

  const colorClass = hasContent
    ? isAutoFilled
      ? readOnly ? 'bg-amber-50 border border-amber-300' : 'bg-amber-50 border border-amber-300 hover:bg-amber-100 active:bg-amber-200'
      : readOnly ? 'bg-emerald-50 border border-emerald-300' : 'bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 active:bg-emerald-200'
    : readOnly ? 'bg-white border border-gray-200' : 'bg-white border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 active:bg-emerald-100'

  const content = (
    <>
      {/* Recipe title — fills cell, scales with name length */}
      <div className="h-full w-full flex items-center justify-center p-1">
        {hasContent ? (
          <span className={`text-center text-black leading-tight break-words hyphens-auto w-full ${dishFontClass(meal!.dish)}`}>
            {meal!.dish}
          </span>
        ) : (
          !readOnly && <span className="text-gray-300 text-base leading-none font-light">+</span>
        )}
      </div>

      {/* Leftover arrow on dinner cell — points ↗ toward tomorrow's lunch */}
      {showLeftoverArrow && (
        <span className="absolute top-0.5 right-0.5 bg-amber-400 text-white text-[8px] font-bold leading-none rounded-full w-3.5 h-3.5 flex items-center justify-center">
          ↗
        </span>
      )}

      {/* Auto-filled badge on lunch cell — points ↙ back toward yesterday's dinner */}
      {isAutoFilled && (
        <span className="absolute bottom-0.5 left-0.5 bg-amber-400 text-white text-[8px] font-bold leading-none rounded-full w-3.5 h-3.5 flex items-center justify-center">
          ↙
        </span>
      )}
    </>
  )

  if (readOnly) {
    return <div className={[baseClass, colorClass].join(' ')}>{content}</div>
  }

  return (
    <button onClick={onClick} className={[baseClass, colorClass, 'transition-colors'].join(' ')}>
      {content}
    </button>
  )
}
