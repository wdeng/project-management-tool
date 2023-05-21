import React, { useState } from 'react';
import { MdAdd } from 'react-icons/md'; // Import icons from react-icons
import Modal from './Modal';

interface ProjectCreationModalProps {
  onNewProject: (projectName: string, requirements: string, schema: string) => Promise<void>;
}

export const ProjectCreationModal: React.FC<ProjectCreationModalProps> = ({ onNewProject }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [requirements, setRequirements] = useState('');
  const [schema, setSchema] = useState('');

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  const validateForm = () => {
    return projectName.length > 0 && requirements.length > 0 && schema.length > 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onNewProject(projectName, requirements, schema);
      setProjectName(''); // reset form
      setRequirements(''); // reset form
      setSchema(''); // reset form
      close();
    } catch (error) {
      // Display error messages
    }
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
      <Modal
        isOpen={isOpen}
        onClose={close}
        title="Create New Project"
      >
        <form onSubmit={handleSubmit} className="p-4">
          <label htmlFor="projectName">Project Name</label>
          <input
            id="projectName"
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
          />
          <label htmlFor="requirements">Requirements</label>
          <textarea
            id="requirements"
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            className="w-full p-2 mb-4 h-20 border rounded"
          />
          <label htmlFor="schema">Project Schema</label>
          <textarea
            id="schema"
            value={schema}
            onChange={(e) => setSchema(e.target.value)}
            className="w-full p-2 mb-4 h-20 border rounded"
          />
          <button type="submit" disabled={!validateForm()} className="w-full p-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors duration-200 ease-in-out">
            Create
          </button>
        </form>
      </Modal>
    </>
  );
};

export default ProjectCreationModal;
