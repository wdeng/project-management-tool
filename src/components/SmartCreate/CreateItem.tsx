import React, { useMemo, useState } from 'react';
import { MdAddBox, MdAddCircleOutline } from 'react-icons/md';
import ItemCreationModal from '@/components/modals/ItemCreationModal';
import { useSelected } from '@/hooks/useSelectedContext';
import { RefineResource, smartCreateFile, smartCreateModule, ElementDesign } from '@/apis';
import SetCreationGoal from './SetCreationGoal';
import ReviewSpecs from './ReviewSpecs';

interface Props {
  buttonStyle?: string;
  itemType?: 'file' | 'module';
}

// "py-10 mr-4 mb-4 inline-block bg-white drop-shadow-md rounded-lg cursor-pointer w-64 h-32 transition ease-in-out delay-100 hover:scale-110 duration-300 flex items-center justify-center"

const CreateItem: React.FC<Props> = ({
  buttonStyle = "py-10 mr-4 mb-4 inline-block bg-white drop-shadow-md rounded-lg cursor-pointer w-64 h-32 transition ease-in-out delay-100 hover:scale-110 duration-300 flex items-center justify-center",
  itemType = "file"
}) => {
  const { selectedProjectId, refreshCurrentProject } = useSelected();
  const [isOpen, setIsOpen] = useState(false);

  const [currentStep, setCurrentStep] = useState('SetGoal');
  const [isLoading, setIsLoading] = useState(false);
  const [createdItem, setCreatedItem] = useState<ElementDesign | null>(null);

  const open = () => setIsOpen(true);
  const close = () => {
    setIsOpen(false);
    setCurrentStep('SetGoal');
    setCreatedItem(null);
    refreshCurrentProject();
  };

  const currentComponent = useMemo(() => {
    const handleGoalSubmit = async (
      goal: string,
      resources: RefineResource[],
      selectedItemIds: number[],
    ) => {
      if (!selectedProjectId) return;
      setIsLoading(true);

      try {
        console.log("goal", goal);
        console.log("resources", resources);
        console.log("selectedCheckboxOptions", selectedItemIds);
        console.log("selectedProjectId", selectedProjectId);

        const smartCreate = itemType === 'file' ? smartCreateFile : smartCreateModule;
        const element = await smartCreate(
          selectedProjectId,
          { text: goal },
          selectedItemIds,
          resources
        );
        console.log("element", element);
        setCreatedItem(element);
        setCurrentStep('ReviewSpecs');
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    switch (currentStep) {
      case 'SetGoal':
        return <SetCreationGoal onSubmit={handleGoalSubmit} createTarget={itemType} />;
      case 'ReviewSpecs':
        return (
          createdItem && selectedProjectId && (
            <ReviewSpecs
              close={() => {
                setIsOpen(false);
                setCurrentStep('SetGoal');
                setCreatedItem(null);
                refreshCurrentProject();
              }}
              orgItem={createdItem}
              projectId={selectedProjectId}
              itemType={itemType}
            />
          )
        );
      default:
        return <SetCreationGoal onSubmit={handleGoalSubmit} />;
    }
  }, [currentStep, selectedProjectId, createdItem, itemType, refreshCurrentProject]);

  return (
    <>
      <button
        className={buttonStyle}
        onClick={open}
        role="button"
        tabIndex={0}
      >
        {itemType === 'file' ? (
          <>
            <MdAddCircleOutline size={20} className="mr-3" />
            Create New File
          </>

        ) : (
          <>
            <MdAddBox size={20} className="mr-3" />
            Create New Module
          </>
        )}

      </button>
      <ItemCreationModal
        title={`Create ${itemType === 'file' ? 'File' : 'Module'}`}
        isLoading={isLoading}
        directInputComponent={null}
        isOpen={isOpen}
        close={close}
      >
        {currentComponent}
      </ItemCreationModal>
    </>
  );
};

export default CreateItem;