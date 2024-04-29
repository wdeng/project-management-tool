import React, { useMemo, useState } from 'react';
import { Menu } from '@headlessui/react';
import { MdAdd, MdDashboard, MdOutlineTextSnippet } from 'react-icons/md'; // MdDriveFileMove
import { FaFileImport } from "react-icons/fa";
import { ImMakeGroup } from "react-icons/im";
import { MultipleChoiceQuestions } from './MultipleChoices';
import { ProjectForm } from './ProjectForm';
import { ProjectCreationGoal } from './ProjectCreationGoal';
import {
  QuestionChoices,
  setProjectGoal,
  anwerProjectQAs,
} from '@/apis';
import { ReviewProjectSpecs } from './ProjectReview';
import Dropdown from '../../general/Dropdown';
import { contextMenuItemStyles, contextMenuStyles } from '@/utils/tailwindStyles';
import ItemCreationModal from '../../modals/ItemCreationModal';
interface ProjectCreationModalProps {
  onNewProject: (projectName: string, requirements: string, schema: string) => Promise<void>;
  onProjectBuild: (projectId: number) => Promise<void>;
}

export const ProjectCreationModal: React.FC<ProjectCreationModalProps> = ({ onNewProject, onProjectBuild }) => {
  const [additionalButtons, setAdditionalButtons] = useState<React.ReactNode>(null);
  const [isOpen, setIsOpen] = useState(false);

  const [currentStep, setCurrentStep] = useState('SetProjectGoal');
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionChoices[]>([]);
  const [projectId, setProjectId] = useState<number>(0);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const currentComponent = useMemo(() => {
    switch (currentStep) {
      case 'SetProjectGoal':
        const handleProjectGoalSubmit = async (goal: string) => {
          setIsLoading(true);
          const res = await setProjectGoal(goal);
          setProjectId(res.projectId);
          setQuestions(res.QAs);

          setCurrentStep('MultipleChoiceQuestions');
          setIsLoading(false);
        };
        return <ProjectCreationGoal onGoalSubmit={handleProjectGoalSubmit} />;
      case 'MultipleChoiceQuestions':
        const handleAnswersSubmit = async (answers: { question: string; answers: string[] }[]) => {
          setIsLoading(true);
          const resps = await anwerProjectQAs(answers, projectId)
          setIsLoading(false);
          if (resps.finished) {
            setCurrentStep('ReviewProjectSpecs');
          } else {
            setQuestions(resps.QAs);
          }
        };
        return <MultipleChoiceQuestions questions={questions} onAnswersSubmit={handleAnswersSubmit} />;
      case 'ReviewProjectSpecs':
        const onFinish = async () => {
          setCurrentStep('SetProjectGoal');
          close();
          onProjectBuild(projectId);
        };
        return <ReviewProjectSpecs
          projectId={projectId}
          onFinish={onFinish}
          setAdditionalButtons={setAdditionalButtons}
        />;
      default:
        return null;
    }
  }, [currentStep, questions, onProjectBuild, projectId]);

  const directNewProject = async (projectName: string, requirements: string, schema: string) => {
    close();
    await onNewProject(projectName, requirements, schema);
  }

  return (
    <>
      <Menu as="div" className="relative mb-2">
        <Menu.Button as="button" className="w-full flex justify-between items-center p-5 bg-gray-900 text-white shadow-md hover:bg-gray-800 transition-colors duration-300 ease-in-out cursor-pointer font-semibold">
          New
          <MdAdd size={20} />
        </Menu.Button>
        <Dropdown>
          <Menu.Items className={`${contextMenuStyles} min-w-[160px]`}>
            <Menu.Item>
              <button
                className={contextMenuItemStyles}
                onClick={open}
              >
                <MdDashboard className="mr-3" /> Create Project
              </button>
            </Menu.Item>
            <Menu.Item>
              <button
                className={contextMenuItemStyles}
                onClick={() => { console.log('Import Project') }}
              >
                <FaFileImport className="mr-3" /> Import Project
              </button>
            </Menu.Item>
            <Menu.Item>
              <button
                className={contextMenuItemStyles}
                onClick={() => { console.log('New Group') }}
              >
                <ImMakeGroup className="mr-3" /> New Group
              </button>
            </Menu.Item>
            <Menu.Item>
              <button
                className={contextMenuItemStyles}
                onClick={() => { console.log('New Prompt') }}
              >
                <MdOutlineTextSnippet className="mr-3" /> Create Prompt
              </button>
            </Menu.Item>
          </Menu.Items>
        </Dropdown>
      </Menu>
      <ItemCreationModal title="Create Project" isLoading={isLoading} directInputComponent={<ProjectForm onNewProject={directNewProject} />} isOpen={isOpen} close={close} MoreButtons={additionalButtons}>
        {currentComponent}
      </ItemCreationModal>
    </>
  );
};

export default ProjectCreationModal;
