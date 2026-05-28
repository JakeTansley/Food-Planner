interface Props {
  weekRange: string
  onMenuClick: () => void
}

export default function Header({ weekRange, onMenuClick }: Props) {
  return (
    <div className="flex items-center px-3 py-2 bg-gray-900 border-b border-gray-800 shrink-0">
      <button
        onClick={onMenuClick}
        className="text-white p-1 mr-3 hover:text-gray-300 active:text-gray-500"
        aria-label="Open menu"
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="currentColor">
          <rect y="4" width="22" height="2" rx="1" />
          <rect y="10" width="22" height="2" rx="1" />
          <rect y="16" width="22" height="2" rx="1" />
        </svg>
      </button>
      <div className="flex-1 text-center">
        <h1 className="text-white font-bold text-sm leading-tight">Meal Plan</h1>
        <p className="text-gray-400 text-xs leading-tight">{weekRange}</p>
      </div>
      <div className="w-8" />
    </div>
  )
}
