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

export const ProjectCreationModal: React.FC<ProjectCreationModalProps> = ({ onNewProject, questions }) => {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  const handleAnswersSubmit = (answers: { [key: string]: string }) => {
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
      <Modal isOpen={isOpen} onClose={close} title="Create New Project">
        <Tab.Group>
          <Tab.List className="flex p-1 space-x-1 bg-blue-900 rounded-xl">
            <Tab className={({ selected }) => (
              `w-full py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg 
              ${selected ? 'bg-white' : 'text-blue-100 bg-blue-700 hover:bg-blue-800'}
              `)}>
              GUI Form
            </Tab>
            <Tab className={({ selected }) => (
              `w-full py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg 
              ${selected ? 'bg-white' : 'text-blue-100 bg-blue-700 hover:bg-blue-800'}
              `)}>
              Multiple Choice Questions
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-2">
            <Tab.Panel>
              <ProjectForm onNewProject={onNewProject} />
            </Tab.Panel>
            <Tab.Panel>
              <MultipleChoiceQuestions
                questions={questions}
                onAnswersSubmit={handleAnswersSubmit}
              />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </Modal>
    </>
  );
};

export default ProjectCreationModal;
