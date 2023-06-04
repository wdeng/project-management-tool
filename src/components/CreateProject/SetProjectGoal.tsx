import { buttonStyles, textAreaStyles } from '@/styles/tailwindStyles';
import React, { useState } from 'react';

interface Props {
  onProjectGoalSubmit: (goal: string) => void;
}

export const SetProjectGoal: React.FC<Props> = ({
  onProjectGoalSubmit,
}) => {
  const [overview, setOverview] = useState('');
  const validateForm = () => overview.length > 0;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('hi')
    onProjectGoalSubmit(overview);
    setOverview(""); // reset form
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <h2 className='font-medium pt-3'>What this project is about? Please provide an overview or description.</h2>
      <textarea
        id="overview"
        value={overview}
        placeholder='Overview of project'
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
