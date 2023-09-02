import React from 'react';
import { ModuleHierarchy } from '../utils/apis';
import { MdViewStream, MdPlayArrow } from 'react-icons/md';
import Spinner from './general/Spinner';
import { useSelected } from '@/hooks/useSelectedContext';

interface IModuleListProps {
  onModuleSelect: (moduleId: number) => void;
  modules: ModuleHierarchy[];
  nextModuleId: number;
  executingName: string;
  onPlayClick: (moduleName: string, moduleId: number) => Promise<void>;
}

export const ModuleList: React.FC<IModuleListProps> = ({ onModuleSelect, modules, nextModuleId, onPlayClick, executingName }) => {
  const { selectedModule } = useSelected();
  const handleModuleSelect = async (idn: number) => {
    onModuleSelect(idn);
  };

  const renderModule = (projModule: ModuleHierarchy) => (
    <li key={projModule.id}>
      <div
        className={`px-2 py-4 flex items-center rounded-l-md mb-1 ${selectedModule?.id === projModule.id ? 'bg-gray-100 text-gray-800' : 'text-white'} cursor-pointer transition ease-in-out hover:translate-x-2 hover:scale-105 hover:bg-gray-100 hover:text-gray-800 duration-300`}
        onClick={() => handleModuleSelect(projModule.id)}
        style={{
          paddingLeft: `${(projModule.tabLevel || 0) * 16 + 14}px`,
        }}
      >
        <div className="flex items-center mr-2">
          {executingName === projModule.name ? (
            <Spinner spinnerSize={16} />
          ) : projModule.id === nextModuleId ? (
            <button className='hover:text-indigo-400' onClick={() => onPlayClick(projModule.name, projModule.id)}>
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
