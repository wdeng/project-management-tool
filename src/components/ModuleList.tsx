import React, { useEffect, useState } from 'react';
import { Module as IModule, fetchModules } from '../utils/api';

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
            className={`p-4 hover:bg-gray-200 hover:text-black text-white cursor-pointer ${
              selectedModule?.id === module.id ? 'bg-gray-200 text-black' : ''
            }`}
            onClick={() => handleModuleSelect(module)}
            style={{ paddingLeft: `${(module.tabLevel || 0) * 16 + 10}px` }}
          >
            {module.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ModuleList;