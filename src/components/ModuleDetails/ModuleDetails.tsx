import React, { useState, useEffect, useMemo } from 'react';
import { MdOutlineSubject } from 'react-icons/md'; // Import icons from react-icons
import { buttonStyles } from '@/utils/tailwindStyles';
import FilesCard from './FilesCard';
import { ModuleHierarchy, deleteModule, updateModuleSpecs } from '@/utils/apis';
import * as yaml from 'js-yaml';
import TextEditor from '../general/TextEditor';
import { useSelected } from '@/hooks/useSelectedContext';

interface IModuleDetailsProps {
  moduleBuild: (moduleName: string, moduleId: number, target?: string) => Promise<void>;
  canBuild?: "warning" | true | false | null;
  moduleDetails: ModuleHierarchy;
}

export const ModuleDetails: React.FC<IModuleDetailsProps> = ({ moduleBuild, canBuild, moduleDetails }) => {
  const { selectedProjectId, refreshCurrentProject } = useSelected();
  const [name, setName] = useState('');
  const [error, _] = useState<string | null>(null);

  useEffect(() => {
    if (moduleDetails) {
      setName(moduleDetails.name);
    }
  }, [moduleDetails]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    if (name === 'name') setName(value);
  };

  const build = async (ev: React.MouseEvent) => {
    ev.preventDefault();
    if (moduleDetails) {
      if (canBuild === "warning" ? window.confirm('This module is not next in the implementation sequence. Are you sure?') : true) {
        moduleBuild(moduleDetails.name, moduleDetails.id, 'module');
      }
    }
  };

  const implement = async () => {
    if (moduleDetails && canBuild) {
      moduleBuild(moduleDetails.name, moduleDetails.id, 'code');
    }
  }

  const [moduleEditorOpen, setModuleEditorOpen] = useState(false);
  const saveModuleSpecs = async (content: string) => {
    await updateModuleSpecs(selectedProjectId!, moduleDetails.id, content);
    refreshCurrentProject();
  }

  const requires = moduleDetails?.functionalRequirements
  const moduleSpecs = useMemo(() => {
    if (!moduleDetails) return null;
    const { name, description, functionalRequirements } = moduleDetails;
    return yaml.dump({ name, description, functionalRequirements })
  }, [moduleDetails]);

  return (
    <div className="flex flex-col justify-between h-full p-6 text-gray-700">
      {error && <p className="absolute text-red-500">{error}</p>}
      <TextEditor isOpen={moduleEditorOpen} initialContent={moduleSpecs} handleSave={saveModuleSpecs} onClose={() => setModuleEditorOpen(false)} />
      {/* <form onSubmit={handleSubmit} className="mb-4"> */}
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={handleInputChange}
            className="-ml-3 block w-full text-3xl font-medium border-none outline-none bg-transparent focus:ring-0"
            placeholder="Module Name"
          />
          <button type="button" className="hover:text-indigo-700 text-xl" onClick={() => setModuleEditorOpen(true)}>
            <MdOutlineSubject />
          </button>
        </div>
        <p className='mb-2'>{moduleDetails.description}</p>
        {requires && requires.length > 0 && <>
          <h2 className='text-xl font-medium py-2'>Requirements:</h2>
          <ul className='pl-2'>
            {requires.map((req: string) => (
              <li className='pb-1' key={req}> - {req}</li>
            ))}
          </ul>
        </>}
        <div className="flex space-x-3">
          <button
            onClick={build}
            disabled={!canBuild}
            className={`${buttonStyles} my-3`}
          >
            Build
          </button>
          {moduleDetails.files.length > 0 && <button
            onClick={implement}
            disabled={!canBuild}
            className={`${buttonStyles} my-3`}
          >
            Code
          </button>}
          <button
            onClick={
              () => window.confirm('Are you sure to delete this module?') && deleteModule(selectedProjectId!, moduleDetails.id)
            }
            disabled={!canBuild}
            className={`${buttonStyles} my-3 bg-red-500`}
          >
            Delete
          </button>
        </div>
      </div>
      {moduleDetails.files.length > 0 && <FilesCard files={moduleDetails?.files} />}
    </div>
  );
};

export default ModuleDetails;
