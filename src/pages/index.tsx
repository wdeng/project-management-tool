import React from 'react';
import ProjectList from '../components/ProjectList';
import ModuleList from '../components/ModuleList';
import ModuleDetails from '../components/ModuleDetails/ModuleDetails';
import { Project, Module } from '../utils/api';

export default function Home() {
  const [selectedProjectId, setSelectedProjectId] = React.useState<number | null>(null);
  const [selectedModule, setSelectedModule] = React.useState<Module | null>(null);

  const handleProjectSelect = (project: Project) => {
    setSelectedProjectId(project.id);
  };

  const handleModuleSelect = (module: Module) => {
    setSelectedModule(module);
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
        {selectedProjectId && <ModuleList projectId={selectedProjectId} onModuleSelect={handleModuleSelect} />}
      </div>
      {selectedModule && <div style={{ flex: '1' }} className="bg-gray-100 h-screen overflow-auto">
        <ModuleDetails selectedModule={selectedModule} onModuleUpdate={() => { }} />
      </div>}
    </div>
  );

}
