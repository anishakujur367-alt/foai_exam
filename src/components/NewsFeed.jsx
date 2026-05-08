import React from 'react';

const MOCK_NEWS = [
  {
    id: 1,
    title: 'BUENOS AIRES',
    date:  '10/04/2026, 05:30:00',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=120&q=80',
    badge: 1,
  },
  {
    id: 2,
    title: 'HOUSTON CONTROL',
    date:  '10/04/2026, 04:15:00',
    image: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=120&q=80',
    badge: 0,
  },
  {
    id: 3,
    title: 'CAPE CANAVERAL',
    date:  '10/04/2026, 03:00:00',
    image: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=120&q=80',
    badge: 0,
  },
];

const NewsFeed = () => {
  return (
    <div className="dashboard-card flex flex-col h-full">

      {/* ── Header row ───────────────────────────────────── */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold dark:text-white">Breaking News</h2>
        <button className="btn-pill">Refresh</button>
      </div>

      {/* ── Search + Sort ────────────────────────────────── */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search title, source, author..."
          className="
            flex-1 px-4 py-2 rounded-full text-sm
            border border-border-light
            bg-white text-text-main placeholder-text-muted
            focus:outline-none focus:ring-2 focus:ring-blue-300
            dark:bg-dark-stat dark:border-dark-border
            dark:text-white dark:placeholder-dark-muted
          "
        />
        <select
          className="
            px-4 py-2 pr-8 rounded-full text-sm
            border border-border-light
            bg-white text-text-main
            focus:outline-none
            dark:bg-dark-stat dark:border-dark-border dark:text-white
            appearance-none cursor-pointer
          "
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2.5' stroke-linecap='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
        >
          <option>Sort by Date</option>
          <option>Sort by Relevance</option>
          <option>Sort by Source</option>
        </select>
      </div>

      {/* ── News list ────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto space-y-1 -mx-1 px-1">
        {MOCK_NEWS.map((item, idx) => (
          <div
            key={item.id}
            className={`
              flex items-center gap-3 px-3 py-2 rounded-xl
              transition-colors cursor-pointer
              ${idx === 0
                ? 'bg-orange-50 dark:bg-[#1a2033]'
                : 'hover:bg-orange-50 dark:hover:bg-[#1a2033]'
              }
            `}
          >
            {/* Thumbnail + badge */}
            <div className="relative shrink-0">
              <img
                src={item.image}
                alt={item.title}
                className="w-16 h-10 object-cover rounded-lg shadow-sm"
              />
              {item.badge > 0 && (
                <span className="
                  absolute -top-1.5 -left-1.5
                  bg-accent-red text-white
                  text-[9px] font-bold
                  w-4 h-4 rounded-full
                  flex items-center justify-center
                  border-2 border-white dark:border-dark-card
                ">
                  {item.badge}
                </span>
              )}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-accent-blue uppercase tracking-wide truncate">
                {item.title}
              </p>
              <p className="text-[11px] text-text-muted dark:text-dark-muted mt-0.5">
                {item.date}
              </p>
            </div>

            {/* Expand chevron */}
            <button className="
              ml-auto shrink-0 w-6 h-6 rounded
              flex items-center justify-center
              bg-orange-100 dark:bg-dark-border
              text-accent-red dark:text-dark-accent
              hover:bg-orange-200 dark:hover:bg-dark-muted/30
              transition-colors
            ">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="3"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsFeed;
