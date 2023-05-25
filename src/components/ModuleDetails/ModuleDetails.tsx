import React, { useState, useEffect } from 'react';
import { Module, updateModule } from '../../utils/api';
import EditorModal from '../EditorModal';
import { MdOutlineSubject } from 'react-icons/md'; // Import icons from react-icons
import ChatButton from './ChatButton';

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
    <div className="flex flex-col justify-between h-full p-6">
      <EditorModal
        isOpen={isEditorOpen}
        onClose={closeEditor}
        value={editorValue}
        onChange={handleEditorChange}
      />

      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex justify-between items-center mb-3">
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={handleInputChange}
            className="-ml-2 block w-full text-3xl font-medium text-gray-700 border-none outline-none bg-transparent focus:ring-0"
            placeholder="Module Name"
          />
          <button onClick={openEditor} className="hover:text-indigo-700 text-gray-700 text-xl"><MdOutlineSubject /></button>
        </div>
        <textarea
          name="description"
          id="description"
          value={description}
          onChange={handleInputChange}
          className="mt-1 block w-full border-none outline-none resize-none rounded-md p-2 focus:ring-0"
          rows={4}
          placeholder='Describe the module...'
        />
        <div className="flex justify-end">
          <button
            type="submit"
            className="mt-4 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Save
          </button>
        </div>
      </form>
      <div>
        {selectedModule?.files.map((file) => (
          <button
            key={file.filePath}
            onClick={openEditor}
            className="bg-white shadow-md rounded-lg p-3 mb-4 cursor-pointer w-52 mr-4 text-left cursor-pointer transition ease-in-out delay-100 hover:scale-110 duration-300"
          >
            <h3 className="font-semibold text-l truncate">{file.filePath.split('/').pop()}</h3>
            <p className="text-gray-500 mt-4 text-sm">{file.goal}</p>
          </button>
        ))}
      </div>
      <ChatButton />
    </div>
  );

};

export default ModuleDetails;