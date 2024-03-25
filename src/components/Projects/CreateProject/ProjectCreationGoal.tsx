import { buttonStyles, textAreaStyles } from '@/utils/tailwindStyles';
import React, { useState } from 'react';

interface Props {
  onGoalSubmit: (goal: string) => void;
}

export const ProjectCreationGoal: React.FC<Props> = ({
  onGoalSubmit,
}) => {
  const [overview, setOverview] = useState('');
  const validateForm = () => overview.length > 0;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onGoalSubmit(overview);
    setOverview(""); // reset form
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <h2 className='font-medium pt-3'>Please provide an overview or description.</h2>
      <textarea
        id="overview"
        value={overview}
        placeholder='Overview or description...'
        onChange={(e) => setOverview(e.target.value)}
        className={`mt-4 ${textAreaStyles}`}
        rows={5}
      />
      <button type="submit" disabled={!validateForm()} className={`w-full ${buttonStyles}`}>
        Submit
      </button>
    </form>
  );
};
