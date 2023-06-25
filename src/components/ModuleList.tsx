import React from 'react';
import { ModuleHierarchy, ModuleImplement } from '../utils/apiREAL';
import { MdViewStream, MdPlayArrow } from 'react-icons/md';
import Spinner from './general/Spinner';

interface IModuleListProps {
  onModuleSelect: (moduleName: string) => void;
  modules: ModuleHierarchy[];
  selectedModule?: ModuleImplement | null;
  nextModuleName: string;
  executingName: string;
  onPlayClick: (e: React.MouseEvent, moduleName: string, moduleId: number) => Promise<void>;
}

export const ModuleList: React.FC<IModuleListProps> = ({ onModuleSelect, modules, selectedModule, nextModuleName, onPlayClick, executingName }) => {
  const handleModuleSelect = async (name: string) => {
    if (name !== executingName) {
      onModuleSelect(name);
    }
  };

  const renderModule = (projModule: ModuleHierarchy) => (
    <li key={projModule.id}>
      <div
        className={`px-2 py-4 flex items-center rounded-l-md mb-1 ${selectedModule?.id === projModule.id ? 'bg-gray-100 text-gray-800' : 'text-white'} cursor-pointer transition ease-in-out hover:translate-x-2 hover:scale-105 hover:bg-gray-100 hover:text-gray-800 duration-300`}
        onClick={() => handleModuleSelect(projModule.name)}
        style={{
          paddingLeft: `${(projModule.tabLevel || 0) * 16 + 14}px`,
        }}
      >
        <div className="flex items-center mr-2">
          {executingName === projModule.name ? (
            <Spinner spinnerSize={16} />
          ) : projModule.name === nextModuleName ? (
            <button className='hover:text-indigo-400' onClick={(e) => onPlayClick(e, projModule.name, projModule.id)}>
              <MdPlayArrow size={16} />
            </button>
          ) : (
            <MdViewStream size={16} />
          )}
        </div>
        <span>{projModule.name}</span>
      </div>
      {projModule.modules?.length && <ul>{projModule.modules.map(renderModule)}</ul>}
    </li>
  );

  return (
    <div className="w-full h-full overflow-auto">
      <ul>
        {modules.map(renderModule)}
      </ul>
    </div>
  );
};

export default ModuleList;
