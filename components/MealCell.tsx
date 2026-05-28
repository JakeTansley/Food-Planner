import type { Meal } from '@/types/meal'

interface Props {
  meal?: Meal
  showLeftoverArrow: boolean
  isAutoFilled: boolean
  onClick: () => void
  readOnly?: boolean
}

export default function MealCell({ meal, showLeftoverArrow, isAutoFilled, onClick, readOnly = false }: Props) {
  const hasContent = Boolean(meal?.dish)
  const baseClass = 'relative w-full h-full rounded text-left text-xs p-1.5 overflow-hidden'

  const colorClass = hasContent
    ? readOnly ? 'bg-gray-700' : 'bg-gray-700 hover:bg-gray-600 active:bg-gray-500'
    : readOnly ? 'bg-gray-800 border border-gray-700' : 'bg-gray-800 hover:bg-gray-750 active:bg-gray-700 border border-gray-700'

  const autoClass = isAutoFilled ? 'border border-amber-700' : ''

  const content = (
    <>
      {hasContent ? (
        <span className="block font-medium text-white truncate leading-tight text-[11px]">
          {meal!.dish}
        </span>
      ) : (
        !readOnly && <span className="text-gray-600 text-base leading-none">+</span>
      )}
      {showLeftoverArrow && (
        <span className="absolute bottom-0.5 right-0.5 text-amber-400 text-[10px] leading-none">↘</span>
      )}
      {isAutoFilled && (
        <span className="absolute top-0.5 right-0.5 text-amber-400 text-[10px] leading-none">↩</span>
      )}
    </>
  )

  if (readOnly) {
    return <div className={[baseClass, colorClass, autoClass].join(' ')}>{content}</div>
  }

  return (
    <button onClick={onClick} className={[baseClass, colorClass, autoClass, 'transition-colors'].join(' ')}>
      {content}
    </button>
  )
}
