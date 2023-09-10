import { outlineButtonStyles } from '@/utils/tailwindStyles';
import React from 'react';

interface NextStepsProps {
  steps: string[];
  deny: () => void
  proceed: () => void
}

const NextSteps = ({ steps, deny, proceed }: NextStepsProps) => {
  return !!steps.length ? (
    <div className="overflow-y-auto h-full py-2">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Possible Next Steps</h3>
      </div>
      <ul>
        {steps.map((s, i) => (
          <li key={i} className="mb-2">
            <div className="text-gray-700">{s}</div>
          </li>
        ))}
      </ul>
      <div className="flex">
        <button className={`${outlineButtonStyles} mr-2`} onClick={proceed}>
          Next
        </button>
        <button className={`${outlineButtonStyles}`} onClick={deny}>
          Dismiss
        </button>
      </div>
    </div>
  ) : null;
};

export default NextSteps;
