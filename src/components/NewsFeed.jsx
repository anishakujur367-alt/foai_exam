import React, { useState, useEffect, useCallback } from 'react';

const API_KEY  = import.meta.env.VITE_NEWS_API_KEY;
const NEWS_URL = `https://newsapi.org/v2/top-headlines?language=en&pageSize=30&apiKey=${API_KEY}`;

/* ── Helpers ──────────────────────────────────────────────── */
function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleString('en-GB', {
    day:    '2-digit',
    month:  '2-digit',
    year:   'numeric',
    hour:   '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).replace(',', '');
}

function sourceLabel(article) {
  // Prefer city-like source names shown in the reference
  return article.source?.name?.toUpperCase() || 'UNKNOWN';
}

/* ── Sort options ─────────────────────────────────────────── */
const SORT_OPTIONS = ['Sort by Date', 'Sort by Source', 'Sort by Title'];

function sortArticles(articles, option) {
  const arr = [...articles];
  if (option === 'Sort by Source') {
    arr.sort((a, b) => sourceLabel(a).localeCompare(sourceLabel(b)));
  } else if (option === 'Sort by Title') {
    arr.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
  } else {
    // Default: by date (newest first)
    arr.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  }
  return arr;
}

/* ── Chevron icon ─────────────────────────────────────────── */
function Chevron({ up }) {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="3.5" strokeLinecap="round">
      <path d={up ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'} />
    </svg>
  );
}

/* ── Single news row ──────────────────────────────────────── */
function NewsRow({ article, index, expanded, onToggle }) {
  const label = sourceLabel(article);
  const date  = formatDate(article.publishedAt);
  const hasTitle = article.title && article.title !== '[Removed]';

  return (
    <div
      className={`
        flex items-start gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
        ${expanded
          ? 'border border-accent-red/60 dark:border-dark-accent/60 bg-orange-50/60 dark:bg-orange-900/10'
          : 'border border-transparent hover:bg-orange-50/60 dark:hover:bg-white/5'
        }
      `}
    >
      {/* Thumbnail + numbered badge */}
      <div className="relative shrink-0">
        <img
          src={article.urlToImage || `https://picsum.photos/seed/${index}/64/42`}
          alt={label}
          onError={e => { e.target.src = `https://picsum.photos/seed/${index + 99}/64/42`; }}
          className="w-16 h-10 object-cover rounded-lg shadow-sm"
        />
        <span className="
          absolute -top-1.5 -left-1.5
          bg-accent-red text-white
          text-[9px] font-bold
          min-w-[18px] h-[18px] rounded-full px-1
          flex items-center justify-center
          border-2 border-white dark:border-dark-card
          leading-none
        ">
          {index + 1}
        </span>
      </div>

      {/* Text content */}
      <div className="flex-1 min-w-0">
        {/* Source + date */}
        <div className="flex flex-wrap items-baseline gap-2 mb-0.5">
          {label && label !== 'UNKNOWN' && (
            <span className="text-[11px] font-bold text-accent-blue dark:text-blue-400 uppercase tracking-wide">
              {label}
            </span>
          )}
          <span className="text-[10px] text-text-muted dark:text-dark-muted">{date}</span>
        </div>

        {/* Title (shown when expanded) */}
        {expanded && hasTitle && (
          <p className="text-sm font-semibold dark:text-white leading-snug mt-1 mb-1">
            {article.title}
          </p>
        )}

        {/* Description (shown when expanded) */}
        {expanded && article.description && (
          <p className="text-xs text-text-muted dark:text-dark-muted leading-relaxed line-clamp-3">
            {article.description}
          </p>
        )}
      </div>

      {/* Expand/collapse chevron button */}
      <button
        onClick={() => onToggle(index)}
        className={`
          shrink-0 w-6 h-6 rounded flex items-center justify-center mt-0.5
          transition-colors duration-150
          ${expanded
            ? 'bg-accent-red text-white'
            : 'bg-orange-100 dark:bg-dark-border text-accent-red dark:text-dark-accent hover:bg-orange-200 dark:hover:bg-dark-muted/30'
          }
        `}
      >
        <Chevron up={expanded} />
      </button>
    </div>
  );
}

/* ── Main component ───────────────────────────────────────── */
const NewsFeed = () => {
  const [articles,    setArticles]    = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState('');
  const [search,      setSearch]      = useState('');
  const [sortOption,  setSortOption]  = useState(SORT_OPTIONS[0]);
  const [expandedIdx, setExpandedIdx] = useState(null);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res  = await fetch(NEWS_URL);
      const data = await res.json();
      if (data.status === 'ok') {
        setArticles(data.articles.filter(a => a.title && a.title !== '[Removed]'));
      } else {
        setError(data.message || 'Failed to fetch news.');
      }
    } catch (e) {
      setError('Network error. Could not fetch news.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNews(); }, [fetchNews]);

  const handleToggle = (idx) =>
    setExpandedIdx(prev => (prev === idx ? null : idx));

  /* Apply search filter then sort */
  const filtered = sortArticles(
    articles.filter(a => {
      const q = search.toLowerCase();
      return (
        a.title?.toLowerCase().includes(q)       ||
        a.source?.name?.toLowerCase().includes(q) ||
        a.author?.toLowerCase().includes(q)
      );
    }),
    sortOption
  );

  return (
    <div className="dashboard-card flex flex-col h-full">

      {/* ── Header ────────────────────────────────────────── */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold dark:text-white">Breaking News</h2>
        <button
          id="news-refresh-btn"
          onClick={fetchNews}
          disabled={loading}
          className="btn-pill flex items-center gap-1.5 disabled:opacity-50"
        >
          {loading ? (
            <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83
                       M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
          ) : null}
          Refresh
        </button>
      </div>

      {/* ── Search + Sort ────────────────────────────────── */}
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search title, source, author..."
          className="
            flex-1 px-4 py-2 rounded-full text-sm
            border border-border-light
            bg-white text-text-main placeholder-text-muted
            focus:outline-none focus:ring-2 focus:ring-blue-200
            dark:bg-dark-stat dark:border-dark-border
            dark:text-white dark:placeholder-dark-muted
          "
        />
        <div className="relative">
          <select
            value={sortOption}
            onChange={e => setSortOption(e.target.value)}
            className="
              appearance-none pl-4 pr-8 py-2 rounded-full text-sm
              border border-border-light
              bg-white text-text-main
              focus:outline-none cursor-pointer
              dark:bg-dark-stat dark:border-dark-border dark:text-white
            "
          >
            {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </span>
        </div>
      </div>

      {/* ── Error state ──────────────────────────────────── */}
      {error && (
        <p className="text-xs text-accent-red dark:text-dark-accent mb-2 px-2">{error}</p>
      )}

      {/* ── Loading skeleton ─────────────────────────────── */}
      {loading && articles.length === 0 && (
        <div className="space-y-2 flex-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl animate-pulse">
              <div className="w-16 h-10 bg-gray-200 dark:bg-dark-border rounded-lg shrink-0"/>
              <div className="flex-1 space-y-1.5">
                <div className="h-2.5 bg-gray-200 dark:bg-dark-border rounded w-1/3"/>
                <div className="h-2 bg-gray-100 dark:bg-dark-stat rounded w-1/2"/>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── News list ────────────────────────────────────── */}
      {!loading || articles.length > 0 ? (
        <div className="flex-1 overflow-y-auto space-y-1 -mx-1 px-1 pr-0">
          {filtered.length === 0 && !loading ? (
            <p className="text-sm text-text-muted dark:text-dark-muted text-center py-8">
              No articles match your search.
            </p>
          ) : (
            filtered.map((article, idx) => (
              <NewsRow
                key={article.url || idx}
                article={article}
                index={idx}
                expanded={expandedIdx === idx}
                onToggle={handleToggle}
              />
            ))
          )}
        </div>
      ) : null}
    </div>
  );
};

export default NewsFeed;
