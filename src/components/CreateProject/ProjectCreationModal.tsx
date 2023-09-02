import React, { useEffect, useState } from 'react';
import { Tab } from '@headlessui/react';
import { MdAdd } from 'react-icons/md';
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
  getProjectSpecs,
} from '@/utils/apis';
import { ReviewProjectSpecs } from './ReviewProjectSpecs';

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

  // useEffect(() => {
  //   const fetchProjectSpecs = async () => {
  //     const projectId = 19;
  //     const res = await getProjectSpecs(projectId);
  //     setProjectSpecs(res);
  //     setProjectId(projectId);
  //     setCurrentStep('ReviewProjectSpecs');
  //   }
  
  //   fetchProjectSpecs();
  // }, []);

  const handleProjectGoalSubmit = async (goal: string) => {
    // Start the loading state
    setIsLoading(true);

    try {
      // Simulate an async operation e.g. making API request.
      const res = await setProjectGoal(goal);
      setProjectId(res.projectId);
      setQuestions(res.QAs);

      // After submitting the project goal, we want to show the Multiple Choice Questions
      console.log(goal)
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
      // console.log(answers);
    } catch (error) {
      console.error(error);
    } finally {
      // End the loading state
      setIsLoading(false);
    }
  };

  const handleIssueSubmit = async (issues: string) => {
    // Handle the issue here
    // Maybe sending it to your backend
    console.log('issues:', issues);
    if (issues) {
      const resps = await fixProjectIssue(issues, projectId)
      setProjectSpecs(resps.projectSpecs);
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
      currentComponent = projectSpecs && <ReviewProjectSpecs setProjectSpecs={setProjectSpecs} projectSpecs={projectSpecs} onSubmitIssue={handleIssueSubmit} />;
      break;
    default:
      currentComponent = null;
  }


  return (
    <>
      <button
        className="w-full flex items-center py-5 px-2 mb-2 bg-gray-900 text-white shadow-md hover:bg-gray-800 transition-colors duration-300 ease-in-out cursor-pointer"
        onClick={open}
      >
        <MdAdd className="mr-2" />
        Create Project
      </button>
      <Modal
        height='80vh'
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
              <ProjectForm onNewProject={onNewProject} />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </Modal>
    </>
  );
};

export default ProjectCreationModal;

