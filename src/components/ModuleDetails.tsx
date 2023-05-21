import React, { useState, useEffect } from 'react';
import { Module, updateModule } from '../utils/api';
import EditorModal from './EditorModal';

interface IModuleDetailsProps {
  selectedModule: Module | null;
  onModuleUpdate: (module: Module) => void;
}

export const ModuleDetails: React.FC<IModuleDetailsProps> = ({ selectedModule, onModuleUpdate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorValue, setEditorValue] = useState("// some comment");

  const openEditor = () => {
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
  };

  const handleEditorChange = (val: string | undefined) => {
    if (val != null)
      setEditorValue(val);
  }

  useEffect(() => {
    // Fetch module description from the selected module
    if (selectedModule) {
      setName(selectedModule.name);
      setDescription(selectedModule.description);
    }
  }, [selectedModule]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    if (name === 'name') setName(value);
    if (name === 'description') setDescription(value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedModule) {
      try {
        const updatedModule = await updateModule(
          selectedModule.projectId,
          selectedModule.id,
          name,
          description,
          selectedModule.files,
        );
        onModuleUpdate(updatedModule);
      } catch (error) {
        setError('Failed to update module description');
      }
    }
  };

  return (
    <div className="w-full h-full p-4">
      <EditorModal
        isOpen={isEditorOpen}
        onClose={closeEditor}
        value={editorValue}
        onChange={handleEditorChange}
      />

      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          value={name}
          onChange={handleInputChange}
          className="mt-1 block w-full border border-gray-300 rounded-md"
        />
        <label htmlFor="description" className="block mt-4 text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          id="description"
          value={description}
          onChange={handleInputChange}
          className="mt-1 block w-full border border-gray-300 rounded-md"
          rows={4}
        />
        <button
          type="submit"
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Save
        </button>
      </form>
      {selectedModule?.files.map(file => (
        <button
          key={file.filePath}
          onClick={openEditor}
          className="bg-white shadow-md rounded-lg p-4 mb-4 cursor-pointer w-64 mr-2"
        >
          <h2 className="font-semibold text-xl truncate">{file.filePath.split('/').pop()}</h2>
          <p className="text-gray-600 mt-2">{file.goal}</p>
        </button>
      ))}
    </div>
  );
};

export default ModuleDetails;
