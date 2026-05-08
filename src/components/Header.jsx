import React from 'react';

const Header = ({ darkMode, setDarkMode }) => {
  return (
    <header className="flex justify-between items-center mb-6 pt-2">
      <div>
        <p className="text-accent-blue dark:text-blue-400 text-xs font-bold tracking-widest uppercase mb-1">
          Mission Control Dashboard
        </p>
        <h1 className="text-3xl font-bold text-text-main dark:text-white leading-tight">
          Real-Time ISS and News Intelligence
        </h1>
      </div>

      <button
        id="theme-toggle"
        onClick={() => setDarkMode(!darkMode)}
        className="btn-pill shrink-0 ml-4"
      >
        {darkMode ? 'Switch to Light' : 'Switch to Dark'}
      </button>
    </header>
  );
};

export default Header;
