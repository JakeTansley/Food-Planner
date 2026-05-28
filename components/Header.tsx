interface Props {
  weekRange: string
  onMenuClick: () => void
  onClearAll: () => void
}

export default function Header({ weekRange, onMenuClick, onClearAll }: Props) {
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
      <button
        onClick={onClearAll}
        className="text-gray-500 hover:text-red-400 active:text-red-600 p-1 transition-colors"
        aria-label="Clear all meals"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          <path d="M10 11v6M14 11v6" />
          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
        </svg>
      </button>
    </div>
  )
}
