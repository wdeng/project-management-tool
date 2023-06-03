import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import { MdAdd } from 'react-icons/md';
import Modal from '../Modal';
import { MultipleChoiceQuestions, Question } from './MultipleChoices';
import { ProjectForm } from './ProjectForm';

interface ProjectCreationModalProps {
  onQuestionSubmit: (answers: { [key: string]: string }) => Promise<void>;
  onNewProject: (projectName: string, requirements: string, schema: string) => Promise<void>;
  questions: Question[];
}

const tabStyle = 'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-indigo-800 rounded-lg ring-white ring-opacity-60 ring-offset-2 ring-offset-indigo-400 focus:outline-none focus:ring-2';

export const ProjectCreationModal: React.FC<ProjectCreationModalProps> = ({ onNewProject, questions }) => {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  const handleAnswersSubmit = (answers: { [key: string]: { option: string; userInput: string }[] }) => {
    // Handle submission of answers from MultipleChoiceModal
  };

  return (
    <>
      <button
        className="w-full flex items-center py-5 px-2 mb-2 bg-gray-900 text-white shadow-md hover:bg-gray-800 transition-colors duration-300 ease-in-out cursor-pointer"
        onClick={open}
      >
        <MdAdd className="mr-2" />
        Create Project
      </button>
      <Modal height='80vh' isOpen={isOpen} onClose={close} title="Create New Project">
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-indigo-300 p-1 mx-4">
            <Tab className={({ selected }) => (
              `${tabStyle} ${selected ? 'bg-white shadow' : 'text-indigo-100 hover:bg-white/[0.12] hover:text-white'}
              `)}>
              Multiple Choice Questions
            </Tab>
            <Tab className={({ selected }) => (
              `${tabStyle} ${selected ? 'bg-white shadow' : 'text-indigo-100 hover:bg-white/[0.12] hover:text-white'}
              `)}>
              Direct Setup
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-2">
            <Tab.Panel>
              <MultipleChoiceQuestions
                questions={questions}
                onAnswersSubmit={handleAnswersSubmit}
              />
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
