import { buttonStyles, textAreaStyles } from '../../../utils/tailwindStyles';
import React, { useState } from 'react';

interface ProjectFormProps {
  onNewProject: (projectName: string, requirements: string, schema: string) => Promise<void>;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({ onNewProject }) => {
  const [projectName, setProjectName] = useState('');
  const [projectFolder, setProjectFolder] = useState('');
  const [requirements, setRequirements] = useState('');

  const validateForm = () => projectName.length > 0 && requirements.length > 0;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await onNewProject(projectName, projectFolder, requirements);
      setProjectName(''); // reset form
      setProjectFolder(''); // reset form
      setRequirements(''); // reset form
    } catch (error) {
      // Display error messages
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <input
        id="projectName"
        type="text"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        className="w-full mb-4 border-none outline-none resize-none rounded-md focus:ring-1 text-lg"
        placeholder='Project Name'
      />
      <input
        id="projectFolder"
        type="text"
        value={projectFolder}
        onChange={(e) => setProjectFolder(e.target.value)}
        className="w-full mb-4 border-none outline-none resize-none rounded-md focus:ring-1"
        placeholder='Project Folder'
      />
      <textarea
        id="requirements"
        value={requirements}
        onChange={(e) => setRequirements(e.target.value)}
        className={textAreaStyles}
        placeholder='Requirements'
        rows={10}
      />
      <button type="submit" disabled={!validateForm()} className={`w-full ${buttonStyles}`}>
        Create
      </button>
    </form>
  );
};
