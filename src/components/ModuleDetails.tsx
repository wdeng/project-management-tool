import React, { useState, useEffect } from 'react';
import { Module, updateModule } from '../utils/api';

interface IModuleDetailsProps {
  selectedModule: Module | null;
  onModuleUpdate: (module: Module) => void;
}

export const ModuleDetails: React.FC<IModuleDetailsProps> = ({ selectedModule, onModuleUpdate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch module description from the selected module
    if (selectedModule) {
      setName(selectedModule.name);
      setDescription(selectedModule.description);
    }
  }, [selectedModule]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit}>
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
        <input
          type="text"
          name="description"
          id="description"
          value={description}
          onChange={handleInputChange}
          className="mt-1 block w-full border border-gray-300 rounded-md"
        />
        <button
          type="submit"
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default ModuleDetails;
