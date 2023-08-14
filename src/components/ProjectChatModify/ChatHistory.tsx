// components/ChatHistory.tsx

import React from 'react';

interface Step {
  title: string;
  description: string;
}

interface ChatHistoryProps {
  steps: Step[];
}

const ChatHistory = ({ steps }: ChatHistoryProps) => {
  return steps.length > 0 ? (
    <div className="overflow-y-auto h-full py-2">
      <h3 className="text-lg font-semibold mb-4">Chat History</h3>
      <ul>
        {steps.map((step, index) => (
          <li key={index} className="mb-4">
            <div className="text-lg font-medium">{step.title}</div>
            <div className="text-gray-700">{step.description}</div>
          </li>
        ))}
      </ul>
    </div>
  ) : null;
};

export default ChatHistory;
