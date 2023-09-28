import { outlineButtonStyles } from '@/utils/tailwindStyles';
import React from 'react';

interface NextStepsProps {
  deny: () => void
  proceed: () => void
}

const NextSteps = ({ deny, proceed }: NextStepsProps) => {
  return (
    <div className="overflow-y-auto h-full py-2">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Proceed to next step</h3>
      </div>
      <div className="flex">
        <button className={`${outlineButtonStyles} mr-2`} onClick={proceed}>
          Next
        </button>
        <button className={`${outlineButtonStyles}`} onClick={deny}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default NextSteps;
