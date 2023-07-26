// components/ChatHistory.tsx

import React from 'react';

interface Step {
  timestamp: string;
  title: string;
  description: string;
}

interface ChatHistoryProps {
  steps: Step[];
}

const ChatHistory = ({ steps }: ChatHistoryProps) => {
  return (
    <div className="overflow-y-auto h-full px-2 py-4">
      <h3 className="text-lg font-semibold mb-4">Chat History</h3>
      {steps.map((step, index) => (
        <div key={index} className="mb-4">
          <div className="text-sm text-gray-500">{step.timestamp}</div>
          <div className="text-lg font-medium">{step.title}</div>
          <div className="text-gray-700">{step.description}</div>
        </div>
      ))}
    </div>
  );
};

export default ChatHistory;
