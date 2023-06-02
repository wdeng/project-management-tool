import React, { useState } from 'react';

interface ProjectFormProps {
  onNewProject: (projectName: string, requirements: string, schema: string) => Promise<void>;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({ onNewProject }) => {
  const [projectName, setProjectName] = useState('');
  const [requirements, setRequirements] = useState('');
  const [schema, setSchema] = useState('');

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
        className="w-full mb-4 border-none outline-none resize-none rounded-md focus:ring-2 text-lg"
        placeholder='Project Name'
      />
      <textarea
        id="requirements"
        value={requirements}
        onChange={(e) => setRequirements(e.target.value)}
        className="w-full mb-4 border-none outline-none resize-none rounded-md focus:ring-2"
        placeholder='Requirements'
        rows={5}
      />
      <textarea
        id="schema"
        value={schema}
        onChange={(e) => setSchema(e.target.value)}
        className="w-full mb-4 border-none outline-none resize-none rounded-md focus:ring-2"
        placeholder='Optional API or database schema'
        rows={5}
      />
      <button type="submit" disabled={!validateForm()} className="w-full p-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors duration-200 ease-in-out">
        Create
      </button>
    </form>
  );
};
