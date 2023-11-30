import React, { useEffect, useState } from 'react';
import { Module as IModule, fetchModules } from '../utils/api_mocks';

interface IModuleListProps {
  projectId: number;
  onModuleSelect: (module: IModule) => void;
}

// Extend the IModule interface to include children
interface IModuleWithChildren extends IModule {
  children: IModuleWithChildren[];
}

const ModuleList: React.FC<IModuleListProps> = ({ projectId, onModuleSelect }) => {
  const [modules, setModules] = useState<IModuleWithChildren[]>([]);
  const [selectedModule, setSelectedModule] = useState<IModuleWithChildren | null>(null);
  const [expandedModuleIds, setExpandedModuleIds] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const fetchData = async () => {
      const modules = await fetchModules(projectId);
      setModules(transformModules(modules));
    };

    fetchData();
  }, [projectId]);

  const handleModuleSelect = (module: IModuleWithChildren) => {
    setSelectedModule(module);
    onModuleSelect(module);
  };

  const handleToggle = (moduleId: number) => {
    setExpandedModuleIds(prevState => ({ ...prevState, [moduleId]: !prevState[moduleId] }));
  };

  const transformModules = (modules: IModule[]): IModuleWithChildren[] => {
    let stack: IModuleWithChildren[] = [];
    modules.forEach((module) => {
      let node = { ...module, children: [] };
      while (stack.length && (stack[stack.length - 1].tabLevel || 0) >= (module.tabLevel || 0)) {
        stack.pop();
      }
      if (stack.length) {
        stack[stack.length - 1].children.push(node);
      }
      stack.push(node);
    });
    return stack[0]?.children || []; // Returns the transformed module hierarchy
};


  const renderModules = (modules: IModuleWithChildren[]) => (
    <ul>
      {modules.map((m) => (
        <li
          key={m.id}
          className={`p-4 hover:bg-gray-100 cursor-pointer ${selectedModule?.id === m.id ? 'bg-gray-200' : ''}`}
          onClick={() => handleModuleSelect(m)}
          style={{ paddingLeft: `${(m.tabLevel || 0) * 16 + 10}px` }}
        >
          {m.name}
          {m.children.length > 0 && (
            <button onClick={() => handleToggle(m.id)}>
              {expandedModuleIds[m.id] ? 'Collapse' : 'Expand'}
            </button>
          )}
          {m.children.length > 0 && expandedModuleIds[m.id] && renderModules(m.children)}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="w-full h-full overflow-auto">
      {renderModules(modules)}
    </div>
  );
};

export default ModuleList;
