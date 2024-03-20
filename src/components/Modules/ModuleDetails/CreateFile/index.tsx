import React, { useState } from 'react';
import { MdAddCircleOutline } from 'react-icons/md'; // MdDriveFileMove
import ItemCreationModal from '@/components/modals/ItemCreationModal';
import { SetFileGoal } from './SetFileGoal';

interface Props {
}

const FileCreation: React.FC<Props> = ({ }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [currentStep, setCurrentStep] = useState('SetGoal');
  const [isLoading, setIsLoading] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const handleGoalSubmit = async (goal: string) => {
    // Start the loading state
    setIsLoading(true);

    try {
      // Simulate an async operation e.g. making API request.
      // const res = await 
      setCurrentStep('SetGoal');
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
      currentComponent = <SetFileGoal onSubmit={handleGoalSubmit} />;
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
        <MdAddCircleOutline size={20} className="mr-3" />
        New File
      </button>
      <ItemCreationModal title="Create File" isLoading={isLoading} directInputComponent={null} isOpen={isOpen} close={close}>
        {currentComponent}
      </ItemCreationModal>
    </>
  );
};

export default FileCreation;
