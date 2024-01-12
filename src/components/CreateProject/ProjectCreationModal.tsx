import React, { useState } from 'react';
import { Menu, Tab } from '@headlessui/react';
import { MdAdd, MdDashboard } from 'react-icons/md'; // MdDriveFileMove
import { FaFileImport } from "react-icons/fa";
import { ImMakeGroup } from "react-icons/im";
import Modal from '../Modal';
import { MultipleChoiceQuestions } from './MultipleChoices';
import { ProjectForm } from './ProjectForm';
import { SetProjectGoal } from './SetProjectGoal';
import Spinner from '../general/Spinner';
import {
  QuestionChoices,
  setProjectGoal,
  anwerProjectQAs,
  ProjectSpecs,
  fixProjectIssue,
} from '@/utils/apis';
import { ReviewProjectSpecs } from './ReviewProjectSpecs';
import { ChatInputType } from '@/utils/apis/chatRefine';
import Dropdown from '../general/Dropdown';
import { contextMenuItemStyles, contextMenuStyles } from '@/utils/tailwindStyles';

interface ProjectCreationModalProps {
  onNewProject: (projectName: string, requirements: string, schema: string) => Promise<void>;
  onProjectBuild: (projectId: number) => Promise<void>;
}

const tabStyle = ({ selected }: any) => (
  `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-indigo-800 rounded-lg ring-white ring-opacity-60 ring-offset-2 ring-offset-indigo-400 focus:outline-none focus:ring-2 ${selected ? 'bg-white shadow' : 'text-indigo-100 hover:bg-white/[0.12] hover:text-white'}`
)

export const ProjectCreationModal: React.FC<ProjectCreationModalProps> = ({ onNewProject, onProjectBuild }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [currentStep, setCurrentStep] = useState('SetProjectGoal');
  const [projectSpecs, setProjectSpecs] = useState<ProjectSpecs | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionChoices[]>([]);
  const [projectId, setProjectId] = useState<number>(19);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

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
    // Handle the issue here
    // Maybe sending it to your backend
    if (issues?.text) {
      const resps = await fixProjectIssue(issues, projectId, abortController)
      resps && setProjectSpecs(resps.projectSpecs);
    } else {
      setCurrentStep('SetProjectGoal');
      close();
      onProjectBuild(projectId);
    }
  };

  let currentComponent;
  switch (currentStep) {
    case 'SetProjectGoal':
      currentComponent = <SetProjectGoal onProjectGoalSubmit={handleProjectGoalSubmit} />;
      break;
    case 'MultipleChoiceQuestions':
      currentComponent = <MultipleChoiceQuestions questions={questions} onAnswersSubmit={handleAnswersSubmit} />;
      break;
    case 'ReviewProjectSpecs':
      currentComponent = projectSpecs && <ReviewProjectSpecs
        setProjectSpecs={setProjectSpecs}
        projectSpecs={projectSpecs}
        onSubmitIssue={handleIssueSubmit}
      />;
      break;
    default:
      currentComponent = null;
  }

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
          <Menu.Items className={contextMenuStyles}>
            <Menu.Item>
              <button
                className={contextMenuItemStyles}
                onClick={open}
              >
                <MdDashboard className="mr-3" /> New Project
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
      <Modal
        height='h-[80vh]'
        isOpen={isOpen}
        onClose={close}
        title="Create New Project"
        className={isLoading ? 'pointer-events-none' : ''}
      >
        {isLoading && (
          <div className={`absolute inset-0 flex items-center justify-center bg-white bg-opacity-40 z-50 pointer-events-auto`}>
            <Spinner />
          </div>
        )}
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-indigo-500 p-1 mx-4">
            <Tab className={tabStyle}>
              Multiple Choice Questions
            </Tab>
            <Tab className={tabStyle}>
              Direct Input
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-2">
            <Tab.Panel>
              {currentComponent}
            </Tab.Panel>
            <Tab.Panel>
              <ProjectForm onNewProject={directNewProject} />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </Modal>
    </>
  );
};

export default ProjectCreationModal;
