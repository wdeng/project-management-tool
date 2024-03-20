import { buttonStyles, textAreaStyles } from '../../utils/tailwindStyles';
import React, { useState } from 'react';

interface ReviewSpecsProps {
  specs: string;
}

export const ReviewSpecs: React.FC<ReviewSpecsProps> = ({ specs }) => {
  const [requirements, setRequirements] = useState(specs);

  const validateForm = () => requirements.length > 0;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      // await onNewProject(projectName, projectFolder, requirements);
      setRequirements(''); // reset form
    } catch (error) {
      // Display error messages
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 h-[calc(80vh-60px)]">
      <textarea
        id="requirements"
        value={requirements}
        onChange={({ target }) => setRequirements(target.value)}
        className={`${textAreaStyles} h-[calc(100%-60px)]`}
        placeholder='Requirements'
      />
      <button type="submit" disabled={!validateForm()} className={`w-full ${buttonStyles}`}>
        Create
      </button>
    </form>
  );
};
