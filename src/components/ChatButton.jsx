import React from 'react';

const ChatButton = () => (
  <button
    id="chat-fab"
    title="Open AI chat"
    className="
      fixed bottom-7 right-7 z-50
      w-13 h-13 rounded-full
      bg-[#F26442] hover:bg-[#d95333] active:scale-95
      flex items-center justify-center
      shadow-lg shadow-orange-400/30
      transition-all duration-200
      focus:outline-none focus:ring-4 focus:ring-orange-300/50
    "
    style={{ width: 52, height: 52 }}
  >
    {/* Chat bubble SVG matching reference exactly */}
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  </button>
);

export default ChatButton;
