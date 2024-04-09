import ResourcesSelector from '@/components/ProjectChatModify/ResourcesSelector';
import { RefineResource } from '@/apis';
import { buttonStyles, textAreaStyles } from '@/utils/tailwindStyles';
import React, { useState } from 'react';

interface Props {
  onSubmit: (goal: string, resourcesEnabled: RefineResource[], selectedCheckboxOptions: number[]) => void;
  createTarget?: string;
}

const SetCreationGoal: React.FC<Props> = ({
  onSubmit,
  createTarget = 'file',
}) => {
  const [selectedCheckboxOptions, setSelectedCheckboxOptions] = useState<number[]>([]);
  const [resourcesEnabled, setResourcesEnabled] = useState<RefineResource[]>(['outline']);

  const [overview, setOverview] = useState('');
  const validateForm = () => overview.length > 0;

  const handleSubmit = (event: React.FormEvent) => {
    console.log('submitting goal');
    event.preventDefault();
    onSubmit(overview, resourcesEnabled, selectedCheckboxOptions);
    setOverview(""); // reset form
  };

  return (
    <div className="p-4">
      <h2 className='font-medium pt-3'>What this {createTarget} is about? Please provide an overview or description.</h2>
      <textarea
        id="overview"
        value={overview}
        placeholder={`Goal or overview of ${createTarget}`}
        onChange={({ target }) => setOverview(target.value)}
        className={`mt-4 ${textAreaStyles}`}
        rows={5}
      />
      <ResourcesSelector
        resourcesAvailable={['outline', 'schema']}
        resourcesEnabled={resourcesEnabled}
        setResourcesEnabled={setResourcesEnabled}
        selectedCheckboxOptions={selectedCheckboxOptions}
        setSelectedCheckboxOptions={setSelectedCheckboxOptions}
      />
      <button type="submit" disabled={!validateForm()} className={`w-full ${buttonStyles}`} onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};

export default SetCreationGoal;