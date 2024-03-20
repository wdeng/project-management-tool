import React, { useMemo, useState } from 'react';
import { Menu } from '@headlessui/react';
import { MdAdd, MdDashboard } from 'react-icons/md'; // MdDriveFileMove
import { FaFileImport } from "react-icons/fa";
import { ImMakeGroup } from "react-icons/im";
import { MultipleChoiceQuestions } from './MultipleChoices';
import { ProjectForm } from './ProjectForm';
import { SetCreationGoal } from '../modals/SetCreationGoal';
import {
  QuestionChoices,
  setProjectGoal,
  anwerProjectQAs,
  ProjectSpecs,
  fixProjectIssue,
} from '@/apis';
import { ReviewProjectSpecs } from './ReviewProjectSpecs';
import { ChatInputType } from '@/apis/chatRefine';
import Dropdown from '../general/Dropdown';
import { contextMenuItemStyles, contextMenuStyles } from '@/utils/tailwindStyles';
import ItemCreationModal from '../modals/ItemCreationModal';

interface ProjectCreationModalProps {
  onNewProject: (projectName: string, requirements: string, schema: string) => Promise<void>;
  onProjectBuild: (projectId: number) => Promise<void>;
}

export const ProjectCreationModal: React.FC<ProjectCreationModalProps> = ({ onNewProject, onProjectBuild }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [currentStep, setCurrentStep] = useState('SetProjectGoal');
  const [projectSpecs, setProjectSpecs] = useState<ProjectSpecs | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionChoices[]>([]);
  const [projectId, setProjectId] = useState<number>(19);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const currentComponent = useMemo(() => {
    const handleProjectGoalSubmit = async (goal: string) => {
      // Start the loading state
      setIsLoading(true);

      try {
        // Simulate an async operation e.g. making API request.
        const res = await setProjectGoal(goal);
        setProjectId(res.projectId);
        setQuestions(res.QAs);

        setCurrentStep('MultipleChoiceQuestions');
      } catch (error) {
        console.error(error);
      } finally {
        // End the loading state
        setIsLoading(false);
      }
    };

    const handleAnswersSubmit = async (answers: { question: string; answers: string[] }[]) => {
      setIsLoading(true);

      try {
        // await new Promise(res => setTimeout(res, 2000));
        const resps = await anwerProjectQAs(answers, projectId)
        if (resps.finished) {
          setIsLoading(false);
          setProjectSpecs(resps.projectSpecs);
          setCurrentStep('ReviewProjectSpecs');
          return;
        }
        setQuestions(resps.QAs);
      } catch (error) {
        console.error(error);
      } finally {
        // End the loading state
        setIsLoading(false);
      }
    };

    const handleIssueSubmit = async (issues: ChatInputType, abortController: AbortController) => {
      if (issues?.text) {
        const resps = await fixProjectIssue(issues, projectId, abortController)
        resps && setProjectSpecs(resps.projectSpecs);
      } else {
        setCurrentStep('SetProjectGoal');
        close();
        onProjectBuild(projectId);
      }
    };

    switch (currentStep) {
      case 'SetProjectGoal':
        return <SetCreationGoal onGoalSubmit={handleProjectGoalSubmit} />;
      case 'MultipleChoiceQuestions':
        return <MultipleChoiceQuestions questions={questions} onAnswersSubmit={handleAnswersSubmit} />;
      case 'ReviewProjectSpecs':
        return projectSpecs && <ReviewProjectSpecs
          setProjectSpecs={setProjectSpecs}
          projectSpecs={projectSpecs}
          onSubmitIssue={handleIssueSubmit}
        />;
      default:
        return null;
    }
  }, [currentStep, questions, projectSpecs, onProjectBuild, projectId]);

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
          </Menu.Items>
        </Dropdown>
      </Menu>
      <ItemCreationModal title="Create Project" isLoading={isLoading} directInputComponent={<ProjectForm onNewProject={directNewProject} />} isOpen={isOpen} close={close}>
        {currentComponent}
      </ItemCreationModal>
    </>
  );
};

export default ProjectCreationModal;
