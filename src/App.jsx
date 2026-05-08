import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ISSTracker from './components/ISSTracker';
import SpeedChart from './components/SpeedChart';
import NewsFeed from './components/NewsFeed';
import ChatButton from './components/ChatButton';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [toast, setToast]       = useState('');
  const [showToast, setShowToast] = useState(false);

  // Apply / remove the dark class on <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Show toast whenever mode changes (skip initial render)
  const firstRender = React.useRef(true);
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    setToast(darkMode ? 'Switched to dark mode.' : 'Switched to light mode.');
    setShowToast(true);
    const t = setTimeout(() => setShowToast(false), 2200);
    return () => clearTimeout(t);
  }, [darkMode]);

  return (
    <div className="min-h-screen px-4 py-6 md:px-10 md:py-8 transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-6">

        {/* ── Toast ─────────────────────────────────────────── */}
        <div
          className={`
            fixed top-4 right-4 z-50 px-4 py-2 rounded-full text-sm font-semibold text-white
            bg-blue-600 shadow-lg pointer-events-none
            transition-all duration-500
            ${showToast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
          `}
        >
          {toast}
        </div>

        {/* ── Header ────────────────────────────────────────── */}
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />

        {/* ── Main grid ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left column – ISS Tracker + Breaking News */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div style={{ minHeight: '500px' }}>
              <ISSTracker />
            </div>
            <div style={{ minHeight: '250px' }}>
              <NewsFeed />
            </div>
          </div>

          {/* Right column – Speed Chart */}
          <div className="lg:col-span-4" style={{ minHeight: '600px' }}>
            <SpeedChart darkMode={darkMode} />
          </div>
        </div>

        {/* ── Chat FAB ──────────────────────────────────────── */}
        <ChatButton />
      </div>
    </div>
  );
}

export default App;
