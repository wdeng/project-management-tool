// components/ChatHistory.tsx

import React from 'react';

interface ChatHistoryProps {
  steps: string[];
  clearHistory: () => void
}

const ChatHistory = ({ steps, clearHistory }: ChatHistoryProps) => {
  const handleClearHistory = () => {
    if (confirm('Are you sure you want to reset the chat history?'))
      clearHistory();
  };

  return steps.length > 0 ? (
    <div className="h-full py-2">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Chat History</h3>
        <button className="text-red-500" onClick={handleClearHistory}>Reset</button>
      </div>
      <ul>
        {steps.map((s, index) => (
          <li key={index} className="mb-2">
            <div className="text-gray-700">{s}</div>
          </li>
        ))}
      </ul>
    </div>
  ) : null;
};

export default ChatHistory;
