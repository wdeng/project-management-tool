import React from 'react';
import { Module as IModule } from '../utils/api';
import { MdViewStream } from 'react-icons/md';

interface IModuleListProps {
  onModuleSelect: (module: IModule) => void;
  modules: IModule[];
  selectedModule: IModule | null;
}

export const ModuleList: React.FC<IModuleListProps> = ({ onModuleSelect, modules, selectedModule }) => {

  const renderModule = (module: IModule) => (
    <li key={module.id}>
      <div
        className={`px-2 py-4 flex items-center rounded-l-md mb-1 ${selectedModule?.id === module.id ? 'bg-gray-100 text-gray-800' : 'text-white'} cursor-pointer transition ease-in-out hover:translate-x-2 hover:scale-105 hover:bg-gray-100 hover:text-gray-800 duration-300`}
        onClick={() => onModuleSelect(module)}
        style={{
          paddingLeft: `${(module.tabLevel || 0) * 16 + 14}px`,
        }}
      >
        <div className="mr-2">
          <MdViewStream size={16} />
        </div>
        <span>{module.name}</span>
      </div>
      {module.modules?.length && <ul>{module.modules.map(renderModule)}</ul>}
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
