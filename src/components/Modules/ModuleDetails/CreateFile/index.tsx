import React, { useMemo, useState } from 'react';
import { MdAddCircleOutline } from 'react-icons/md'; // MdDriveFileMove
import ItemCreationModal from '@/components/modals/ItemCreationModal';
import { SetFileGoal } from './SetFileGoal';
import { useSelected } from '@/hooks/useSelectedContext';
import { RefineResource, promptCreateFile } from '@/apis';
import { ReviewSpecs } from '../../ReviewSpecs';

interface Props {
}

const FileCreation: React.FC<Props> = ({ }) => {
  const { selectedProjectId } = useSelected();
  const [isOpen, setIsOpen] = useState(false);

  const [currentStep, setCurrentStep] = useState('SetGoal');
  const [isLoading, setIsLoading] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const currentComponent = useMemo(() => {
    const handleGoalSubmit = async (
      goal: string,
      resources: RefineResource[],
      selectedFileIds: number[],
    ) => {
      // Start the loading state
      if (!selectedProjectId) return;
      setIsLoading(true);

      try {
        console.log("goal", goal);
        console.log("resources", resources);
        console.log("selectedCheckboxOptions", selectedFileIds);
        console.log("selectedProjectId", selectedProjectId);


        const res = await promptCreateFile(
          selectedProjectId,
          { text: goal },
          selectedFileIds,
          resources,
        );
        setCurrentStep('ReviewSpecs');
      } catch (error) {
        console.error(error);
      } finally {
        // End the loading state
        setIsLoading(false);
      }
    };

    switch (currentStep) {
      case 'SetGoal':
        return <SetFileGoal onSubmit={handleGoalSubmit} />;
      case 'ReviewSpecs':
        return <ReviewSpecs specs='123' />;
      default:
        return <SetFileGoal onSubmit={handleGoalSubmit} />;
    }
  }, [currentStep, selectedProjectId]);

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
