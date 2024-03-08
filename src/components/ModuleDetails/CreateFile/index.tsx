import React, { useState } from 'react';
import { MdAdd } from 'react-icons/md'; // MdDriveFileMove
import ItemCreationModal from '@/components/modals/ItemCreationModal';
import { SetProjectGoal } from '@/components/CreateProject/SetProjectGoal';

interface Props {
}

export const CreationModal: React.FC<Props> = ({ }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [currentStep, setCurrentStep] = useState('SetGoal');
  const [isLoading, setIsLoading] = useState(false);
  const [projectId, setProjectId] = useState<number>(19);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const handleGoalSubmit = async (goal: string) => {
    // Start the loading state
    setIsLoading(true);

    try {
      // Simulate an async operation e.g. making API request.
      // const res = await 
      setCurrentStep('MultipleChoiceQuestions');
    } catch (error) {
      console.error(error);
    } finally {
      // End the loading state
      setIsLoading(false);
    }
  };

  let currentComponent;
  switch (currentStep) {
    case 'SetGoal':
      currentComponent = <SetProjectGoal onProjectGoalSubmit={handleGoalSubmit} />;
      break;
    default:
      currentComponent = null;
  }

  return (
    <>
      <button
        className="py-10 mr-4 mb-4 inline-block bg-white drop-shadow-md rounded-lg cursor-pointer w-64 h-32 transition ease-in-out delay-100 hover:scale-110 duration-300 flex items-center justify-center"
        onClick={open}
        role="button"
        tabIndex={0}
      >
        <MdAdd size={24} className="mr-2" />
        Add New File
      </button>
      <ItemCreationModal title="Create File" isLoading={isLoading} directInputComponent={null} isOpen={isOpen} close={close}>
        {currentComponent}
      </ItemCreationModal>
    </>
  );
};

export default CreationModal;
