import React, { useState, useEffect, useMemo } from 'react';
import { buttonStyles } from '@/utils/tailwindStyles';
import FilesCard from './FilesCard';
import { ModuleHierarchy } from '@/apis';
import ElementSettingsModal from './ElementSettings';

interface IModuleDetailsProps {
  moduleBuild: (moduleName: string, moduleId: number, target?: string) => Promise<void>;
  canBuild?: "warning" | true | false | null;
  moduleDetails: ModuleHierarchy;
}

export const ModuleDetails: React.FC<IModuleDetailsProps> = ({ moduleBuild, canBuild, moduleDetails }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (moduleDetails) {
      setName(moduleDetails.name);
    }
  }, [moduleDetails]);

  const ImplementButton = useMemo(() => {
    if (moduleDetails?.status === 'done')
      return null;
    let build: any = async () => { };
    let title = '';
    if (moduleDetails.files.length > 0) {
      build = async () => {
        if (moduleDetails && canBuild)
          moduleBuild(moduleDetails.name, moduleDetails.id, 'code');
      }
      title = 'IMPLEMENT FILES';
    } else if (moduleDetails.files.length === 0) {
      build = async (ev: React.MouseEvent) => {
        ev.preventDefault();
        if (moduleDetails)
          if (canBuild === "warning" ? window.confirm('This module is not next in the implementation sequence. Are you sure?') : true) {
            moduleBuild(moduleDetails.name, moduleDetails.id, 'module');
          }
      };
      title = 'CREATE GUIDELINES';
    }
    return (
      <button
        onClick={build}
        disabled={!canBuild}
        className={`${buttonStyles} px-5 py-2 mt-2`}
      >
        {title}
      </button>
    );
  }, [moduleDetails, canBuild, moduleBuild]);

  const requires = moduleDetails?.functionalRequirements

  return (
    <div className="flex flex-col justify-between h-full p-6 text-gray-700">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className='text-3xl font-medium pb-2'>
            {name}
          </h1>
          <ElementSettingsModal moduleDetails={moduleDetails} canBuild={canBuild} />
        </div>
        <p className='mb-2'>{moduleDetails.description}</p>
        {requires?.length && <>
          <h2 className='text-xl font-medium py-2'>Requirements:</h2>
          <ul className='pl-2'>
            {requires.map((r: string) => <li className='pb-1' key={r}> - {r}</li>)}
          </ul>
        </>}
        {ImplementButton}
      </div>

      {moduleDetails.files.length > 0 && <FilesCard files={moduleDetails?.files} />}
    </div>
  );
};

export default ModuleDetails;
