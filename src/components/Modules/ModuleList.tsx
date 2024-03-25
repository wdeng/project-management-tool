import React from 'react';
import { ModuleHierarchy } from '@/apis';
import { MdDescription, MdViewStream, MdPlayArrow } from 'react-icons/md';
import Spinner from '../general/Spinner';
import { useSelected } from '@/hooks/useSelectedContext';
import CreateItem from '../SmartCreate/CreateItem';

interface IModuleListProps {
  onModuleSelect: (moduleId: number) => void;
  modules: ModuleHierarchy[];
  nextModuleId: number;
  executingName: string;
  onPlayClick: (moduleName: string, moduleId: number) => Promise<void>;
}

const buttonStyle = (selected: boolean) => `px-2 py-4 flex items-center rounded-l-md mb-1 cursor-pointer ${selected ? 'bg-gray-100 text-gray-800' : 'text-white'} transition ease-in-out hover:bg-gray-100 hover:text-gray-800 duration-300 hover:translate-x-2 hover:scale-105`

export const ModuleList: React.FC<IModuleListProps> = ({ onModuleSelect, modules, nextModuleId, onPlayClick, executingName }) => {
  const { selectedModule } = useSelected();

  const handleModuleSelect = async (idn: number) => {
    onModuleSelect(idn);
  };

  const renderModule = (projModule: ModuleHierarchy) => (
    <li key={projModule.id}>
      <div
        className={buttonStyle(selectedModule?.id === projModule.id)}
        onClick={() => handleModuleSelect(projModule.id)}
        style={{
          paddingLeft: `${(projModule.tabLevel || 0) * 16 + 16}px`,
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
        <li>
          <div
            className={buttonStyle(!selectedModule)}
            onClick={() => handleModuleSelect(-1)}
          >
            <div className="flex items-center mr-2">
              <MdDescription size={16} />
            </div>
            <span className='text-lg'>Project Details</span>
          </div>
        </li>
        {modules.map(renderModule)}
        <li>
          <CreateItem
            buttonStyle={`${buttonStyle(false)} pl-4 w-full`}
            itemType='module'
          />
        </li>
      </ul>
    </div>
  );
};

export default ModuleList;


{/* <li>
  <div
    className={`${buttonStyle(false)} pl-4`}
    onClick={() => setIsOpen(true)}
  >
    <div className="flex items-center mr-2">
      <MdAddBox size={16} />
    </div>
    <span>Create New Module</span>
  </div>
</li> */}