import React, { useEffect, useMemo, useState } from 'react';
import { useSelected } from '@/hooks/useSelectedContext';
import { fetchProjectDetails, updateProjectSpecs } from '@/apis';
import DynamicForm, { ElementTypeMapping } from '@/components/general/DynamicForm';
import { MdSave } from 'react-icons/md';
import { GeneralData } from '@/utils/types';
import Modal from '@/components/modals/Modal';
import * as yaml from 'js-yaml';
import { compareObjects } from '@/utils';

interface ProjectInfoModalProps {
  onClose: () => void;
  moduleId?: number;
  // onContentChange?: (value: GeneralData) => void;
  isOpen: boolean;
}

const elementTypes: ElementTypeMapping = {
  projectName: 'textfield',
  description: 'textfield',
  requirements: 'textarea',
};

interface ProjectDetails {
  projectName: string;
  description: string;
  requirements: string;
}

const ProjectInfoModal: React.FC<ProjectInfoModalProps> = ({ onClose, isOpen }) => {

  const { selectedProjectId, refreshCurrentProject } = useSelected();
  const [projectDetails, setProjectDetails] = useState<ProjectDetails | undefined>(undefined);
  const [initialProjectDetails, setInitialProjectDetails] = useState<ProjectDetails | undefined>(undefined);

  useEffect(() => {
    const fetchProject = async (selectedProjectId: number) => {
      const detail = await fetchProjectDetails(selectedProjectId, false);
      detail.requirements = yaml.dump(detail.requirements) as any;
      setProjectDetails(detail as any);
      setInitialProjectDetails(detail as any);
      return detail;
    }
    selectedProjectId && fetchProject(selectedProjectId);
  }, [selectedProjectId]);

  const handleContentChange = (value: GeneralData) => {
    setProjectDetails((prevDetails) => (prevDetails ? { ...prevDetails, ...value } : undefined));
  };

  const Buttons = useMemo(() => {
    const buttons: JSX.Element[] = [];
    if (!projectDetails) return buttons;

    const isModified = !compareObjects(projectDetails, initialProjectDetails || {});

    if (isModified) {
      buttons.push(
        <button
          key="save"
          onClick={async () => {
            if (!selectedProjectId)
              return;
            const { projectName, description } = projectDetails;
            let { requirements }: any = projectDetails;
            try {
              requirements = yaml.load(requirements);
              if (!(requirements instanceof Array))
                throw new Error;
            } catch {
              window.alert('Requirements must be valid YAML list');
              return;
            }
            await updateProjectSpecs(selectedProjectId, yaml.dump({ projectName, description, requirements }), 'specs');
            refreshCurrentProject();
            setInitialProjectDetails(projectDetails);
          }}
        >
          <MdSave />
        </button>
      );
    }

    return buttons;
  }, [selectedProjectId, projectDetails, initialProjectDetails, refreshCurrentProject]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={projectDetails?.projectName || 'Project Info Edit'} MoreButtons={Buttons}>
      <DynamicForm
        formData={projectDetails as GeneralData}
        elementTypes={elementTypes}
        onContentChange={handleContentChange}
      />
    </Modal>
  );
};

export default ProjectInfoModal;