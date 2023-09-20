import React, { useState, useEffect } from 'react';
import EditorModal from '../general/EditorModal';
import { MdOutlineSubject } from 'react-icons/md'; // Import icons from react-icons
import { buttonStyles } from '@/utils/tailwindStyles';
import { useSelected } from '@/hooks/useSelectedContext';
import FileCard from './FileCard';

interface IModuleDetailsProps {
  moduleBuild: (moduleName: string, moduleId: number) => Promise<void>;
  canBuild?: "warning" | true | false | null;
}

export const ModuleDetails: React.FC<IModuleDetailsProps> = ({ moduleBuild, canBuild }) => {
  const { selectedModule } = useSelected();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, _] = useState<string | null>(null);

  const [editingFileId, setEditingFileId] = useState<number | null>(null);

  const openEditor = (fileId: number) => {
    setEditingFileId(fileId);
  };

  const closeEditor = () => {
    setEditingFileId(null);
  };

  useEffect(() => {
    // Fetch module description from the selected module
    if (selectedModule) {
      setName(selectedModule.name);
      setDescription(selectedModule.description || '');
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
      if (canBuild === "warning" ? window.confirm('This moudule is not next in the implementation sequence. Are you sure?') : true) {
        moduleBuild(selectedModule.name, selectedModule.id);
      }
    }
  };

  return (
    <div className="flex flex-col justify-between h-full p-6">
      <EditorModal
        fileId={editingFileId}
        onClose={closeEditor}
      />
      {error && <p className="absolute text-red-500">{error}</p>}
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
          <button type="button" className="hover:text-indigo-700 text-gray-700 text-xl"><MdOutlineSubject /></button>
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
            disabled={!canBuild}
            className={`${buttonStyles} mt-4 px-4`}
          >
            Build
          </button>
        </div>
      </form>
      <div>
        {selectedModule?.files?.map((file) => (
          <FileCard key={file.path} file={file} openEditor={openEditor}/>
        ))}
      </div>
    </div>
  );

};

export default ModuleDetails;
