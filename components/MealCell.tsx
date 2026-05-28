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

  const baseClass = 'relative w-full h-full rounded-lg text-left overflow-hidden p-1.5'

  const colorClass = hasContent
    ? isAutoFilled
      ? readOnly ? 'bg-amber-50 border border-amber-300' : 'bg-amber-50 border border-amber-300 hover:bg-amber-100 active:bg-amber-200'
      : readOnly ? 'bg-emerald-50 border border-emerald-300' : 'bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 active:bg-emerald-200'
    : readOnly ? 'bg-white border border-gray-200' : 'bg-white border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 active:bg-emerald-100'

  const content = (
    <>
      {hasContent ? (
        <span className="block font-bold text-black leading-tight text-[12px] line-clamp-3">
          {meal!.dish}
        </span>
      ) : (
        !readOnly && <span className="text-gray-300 text-lg leading-none font-light">+</span>
      )}
      {showLeftoverArrow && (
        <span className="absolute bottom-0.5 right-0.5 text-amber-500 text-[10px] leading-none">↘</span>
      )}
      {isAutoFilled && (
        <span className="absolute top-0.5 right-0.5 text-amber-500 text-[10px] leading-none">↩</span>
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
