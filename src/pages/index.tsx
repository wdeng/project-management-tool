import React, { useEffect, useMemo, useState } from 'react';
import ProjectList from '../components/ProjectList';
import ModuleList from '../components/ModuleList';
import ModuleDetails from '../components/ModuleDetails/ModuleDetails';
import { Project, Module, fetchModules } from '../utils/api';
import ChatButton from '@/components/ChatButton';


export default function Home() {
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [modules, setModules] = useState<Module[]>([]);

  const moduleIdPath = useMemo(() => {
    if (selectedModule) {
      return findModuleAncestors(selectedModule.id, modules);
    }
    return [];
  }, [selectedModule, modules]);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedProjectId !== null) {
        const modules = await fetchModules(selectedProjectId);
        setModules(modules);
      }
    };
    fetchData();
  }, [selectedProjectId]);

  const handleProjectSelect = (project: Project) => {
    setSelectedProjectId(project.id);
  };

  const handleModuleSelect = (mod: Module) => {
    setSelectedModule(mod);
  };

  return (
    <div className="flex">
      <div style={{ flex: '0 0 200px' }} className="z-10 bg-gray-700 h-screen overflow-auto">
        <ProjectList selectedProjectId={selectedProjectId} onProjectSelect={handleProjectSelect} />
      </div>
      <div
        style={{ flex: '0 0 250px' }}
        className={`bg-gray-600 h-screen overflow-auto transform transition-transform ease-in-out duration-300 ${selectedProjectId ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {selectedProjectId && <ModuleList onModuleSelect={handleModuleSelect} modules={modules} selectedModule={selectedModule} />}
      </div>
      {selectedModule && <div style={{ flex: '1' }} className="bg-gray-100 h-screen overflow-auto">
        <ModuleDetails selectedModule={selectedModule} onModuleUpdate={() => { }} />
      </div>}
      {selectedModule && <ChatButton moduleIdPath={moduleIdPath} modules={modules} />}
    </div>
  );
}

function findModuleAncestors(moduleId: number, modules: Module[]): number[] {
  for (let mod of modules) {
    if (mod.id === moduleId) {
      return [mod.id];
    }

    if (mod.modules) {
      const result = findModuleAncestors(moduleId, mod.modules);
      if (result.length > 0) {
        return [mod.id, ...result];
      }
    }
  }

  return [];
}

