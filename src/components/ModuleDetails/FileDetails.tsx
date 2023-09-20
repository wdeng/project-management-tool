import React, { useEffect, useState } from 'react';
import { MdAdd } from 'react-icons/md';
import Modal from '../Modal';
import Spinner from '../general/Spinner';
import {
  QuestionChoices,
  ProjectSpecs,
} from '@/utils/apis';

interface ProjectCreationModalProps {
  onNewProject: (projectName: string, requirements: string, schema: string) => Promise<void>;
  onProjectBuild: (projectId: number) => Promise<void>;
}

export const DetailsModal: React.FC<ProjectCreationModalProps> = ({ onNewProject, onProjectBuild }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [currentStep, setCurrentStep] = useState('SetProjectGoal');
  const [projectSpecs, setProjectSpecs] = useState<ProjectSpecs | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionChoices[]>([]);
  const [projectId, setProjectId] = useState<number>(19);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const directNewProject = async (projectName: string, requirements: string, schema: string) => {
    close();
    await onNewProject(projectName, requirements, schema);
  }


  return <Modal
    height='80vh'
    isOpen={isOpen}
    onClose={close}
    title="Create New Project"
  >

  </Modal>
};

export default DetailsModal;
