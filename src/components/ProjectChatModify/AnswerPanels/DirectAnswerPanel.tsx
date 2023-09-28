import React from 'react';
import { ProposedDirectAnswer } from '@/utils/apis/chatRefine';

interface ChangesReviewPanelProps {
  answer: ProposedDirectAnswer;
}

const DirectAnswerPanel: React.FC<ChangesReviewPanelProps> = ({
  answer
}) => {
  return (
    <div className="mt-4">
      <div className="mb-3">
        <div className="bg-white p-3 rounded-lg drop-shadow-sm">
          <h3 className='font-semibold text-lg py-2'>Direct Answer: </h3>
          <span>{answer.content}</span>
        </div>
      </div>
    </div>
  );
};

export default DirectAnswerPanel;
