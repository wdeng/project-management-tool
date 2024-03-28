import React, { useEffect, useMemo, useState } from 'react';
import { useSelected } from '@/hooks/useSelectedContext';
import { ElementDesign, ModuleHierarchy, getModuleDetails, updateModuleSpecs } from '@/apis';
import DynamicForm, { ElementTypeMapping } from '@/components/general/DynamicForm';
import { MdSave } from 'react-icons/md';
import { GeneralData } from '@/utils/types';
import Modal from '@/components/modals/Modal';
import * as yaml from 'js-yaml';
import { compareObjects } from '@/utils';

interface ModuleInfoModalProps {
  onClose: () => void;
  moduleId?: number;
  // onContentChange?: (value: GeneralData) => void;
  isOpen: boolean;
}

const elementTypes: ElementTypeMapping = {
  name: 'textfield',
  description: 'textfield',
  functionalRequirements: 'textarea',
};

const ModuleInfoModal: React.FC<ModuleInfoModalProps> = ({ onClose, moduleId, isOpen }) => {

  const { selectedProjectId, refreshCurrentProject } = useSelected();
  const [moduleDetails, setModuleDetails] = useState<ModuleHierarchy | undefined>(undefined);
  const [initialModuleDetails, setInitialModuleDetails] = useState<ModuleHierarchy | undefined>(undefined);

  useEffect(() => {
    if (moduleId && selectedProjectId) {
      getModuleDetails(selectedProjectId, moduleId)
        .then((m) => {
          m.functionalRequirements = yaml.dump(m.functionalRequirements) as any;
          setModuleDetails(m);
          setInitialModuleDetails(m);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [selectedProjectId, moduleId]);

  const handleContentChange = (value: GeneralData) => {
    setModuleDetails((prevDetails) => (prevDetails ? { ...prevDetails, ...value } : undefined));
  };

  const Buttons = useMemo(() => {
    const buttons: JSX.Element[] = [];
    if (!selectedProjectId || !moduleDetails?.id) return buttons;

    const isModified = !compareObjects(moduleDetails, initialModuleDetails || {});

    if (isModified) {
      buttons.push(
        <button
          key="save"
          onClick={async () => {
            if (selectedProjectId && moduleDetails?.id) {
              const { name, description } = moduleDetails;
              let { functionalRequirements }: any = moduleDetails;
              try {
                functionalRequirements = yaml.load(functionalRequirements);
                if (!(functionalRequirements instanceof Array))
                  throw new Error;
              } catch {
                window.alert('Functional requirements must be valid YAML list');
                return;
              }
              await updateModuleSpecs(selectedProjectId!, moduleDetails!.id, yaml.dump({ name, description, functionalRequirements }));
              refreshCurrentProject();
              setInitialModuleDetails(moduleDetails);
            }
          }}
        >
          <MdSave />
        </button>
      );
    }

    return buttons;
  }, [selectedProjectId, moduleDetails, initialModuleDetails, refreshCurrentProject]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={moduleDetails?.name || 'Module Info Edit'} MoreButtons={Buttons}>
      <DynamicForm
        formData={moduleDetails as GeneralData}
        elementTypes={elementTypes}
        onContentChange={handleContentChange}
      />
    </Modal>
  );
};

export default ModuleInfoModal;