import React, { useState } from 'react';
import { Module as IModule } from '../utils/api';
import { MdViewStream, MdPlayArrow } from 'react-icons/md';
import Spinner from './general/Spinner';

interface IModuleListProps {
  onModuleSelect: (projModule: IModule) => void;
  modules: IModule[];
  selectedModule: IModule | null;
  nextModuleName?: string;
  executeModule?: (projModule: IModule) => Promise<void>;
}

export const ModuleList: React.FC<IModuleListProps> = ({ onModuleSelect, modules, selectedModule, nextModuleName, executeModule }) => {
  const [executingName, setExecuting] = useState("");

  const handleModuleSelect = async (projModule: IModule) => {
    if (projModule.name !== executingName) {
      onModuleSelect(projModule);
    }
  };

  const handlePlayClick = async (e: React.MouseEvent, projModule: IModule) => {
    e.stopPropagation();
    if (executingName) return;
    setExecuting(projModule.name);
    executeModule && executeModule(projModule);
    await new Promise(res => setTimeout(res, 1000));
    setExecuting("");
  };

  const renderModule = (projModule: IModule) => (
    <li key={projModule.id}>
      <div
        className={`px-2 py-4 flex items-center rounded-l-md mb-1 ${selectedModule?.id === projModule.id ? 'bg-gray-100 text-gray-800' : 'text-white'} cursor-pointer transition ease-in-out hover:translate-x-2 hover:scale-105 hover:bg-gray-100 hover:text-gray-800 duration-300`}
        onClick={() => handleModuleSelect(projModule)}
        style={{
          paddingLeft: `${(projModule.tabLevel || 0) * 16 + 14}px`,
        }}
      >
        <div className="mr-2">
          {executingName === projModule.name ? (
            <Spinner spinnerSize={16} />
          ) : projModule.name === nextModuleName ? (
            <button onClick={(e) => handlePlayClick(e, projModule)}>
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
