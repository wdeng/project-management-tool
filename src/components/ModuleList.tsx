import React, { useEffect, useState } from 'react';
import { Module as IModule, fetchModules } from '../utils/api';
import { MdViewStream } from 'react-icons/md';

interface IModuleListProps {
  projectId: number;
  onModuleSelect: (module: IModule) => void;
}

export const ModuleList: React.FC<IModuleListProps> = ({ projectId, onModuleSelect }) => {
  const [modules, setModules] = useState<IModule[]>([]);
  const [selectedModule, setSelectedModule] = useState<IModule | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const modules = await fetchModules(projectId);
      setModules(modules);
    };

    fetchData();
  }, [projectId]);

  const handleModuleSelect = (module: IModule) => {
    setSelectedModule(module);
    onModuleSelect(module);
  };

  return (
    <div className="w-full h-full overflow-auto">
      <ul>
        {modules.map((module) => (
          <li
            key={module.id}
            className={`px-2 py-4 flex items-center a hover:bg-gray-200 hover:text-black text-white cursor-pointer ${selectedModule?.id === module.id ? 'bg-gray-200 text-black' : ''}`}
            onClick={() => handleModuleSelect(module)}
            style={{
              paddingLeft: `${(module.tabLevel || 0) * 16 + 12}px`,
            }}
          >
            <div className="mr-2">
              <MdViewStream size={16} />
            </div>
            <span>{module.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );  
};

export default ModuleList;