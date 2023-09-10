// components/ChatHistory.tsx

import React from 'react';

export interface HistoryItem {
  title?: string;
  description: string;
}

interface ChatHistoryProps {
  steps: string[];
  clearHistory: () => void
}

const ChatHistory = ({ steps, clearHistory }: ChatHistoryProps) => {
  return steps.length > 0 ? (
    <div className="overflow-y-auto h-full py-2">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Chat History</h3>
        <button className="text-red-500" onClick={clearHistory}>Clear</button>
      </div>
      <ul>
        {steps.map((description, index) => (
          <li key={index} className="mb-2">
            {/* {title && <div className="text-lg font-medium">{title}</div>} */}
            <div className="text-gray-700">{description}</div>
          </li>
        ))}
      </ul>
    </div>
  ) : null;
};

export default ChatHistory;
