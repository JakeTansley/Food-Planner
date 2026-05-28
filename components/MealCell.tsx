import type { Meal } from '@/types/meal'

interface Props {
  meal?: Meal
  showLeftoverArrow: boolean
  isAutoFilled: boolean
  onClick: () => void
}

export default function MealCell({ meal, showLeftoverArrow, isAutoFilled, onClick }: Props) {
  const hasContent = Boolean(meal?.dish)

  return (
    <button
      onClick={onClick}
      className={[
        'relative w-full h-full rounded text-left text-xs p-1.5 transition-colors overflow-hidden',
        hasContent
          ? 'bg-gray-700 hover:bg-gray-600 active:bg-gray-500'
          : 'bg-gray-800 hover:bg-gray-750 active:bg-gray-700 border border-gray-700',
        isAutoFilled ? 'border border-amber-700' : '',
      ].join(' ')}
    >
      {hasContent ? (
        <span className="block font-medium text-white truncate leading-tight text-[11px]">
          {meal!.dish}
        </span>
      ) : (
        <span className="text-gray-600 text-base leading-none">+</span>
      )}

      {showLeftoverArrow && (
        <span className="absolute bottom-0.5 right-0.5 text-amber-400 text-[10px] leading-none">
          ↘
        </span>
      )}
      {isAutoFilled && (
        <span className="absolute top-0.5 right-0.5 text-amber-400 text-[10px] leading-none">
          ↩
        </span>
      )}
    </button>
  )
}
