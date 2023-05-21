import React from 'react';
import ProjectList from '../components/ProjectList';
import ModuleList from '../components/ModuleList';
import ModuleDetails from '../components/ModuleDetails';
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
      <div style={{ flex: '0 0 200px' }} className="bg-gray-700 h-screen overflow-auto">
        <ProjectList selectedProjectId={selectedProjectId} onProjectSelect={handleProjectSelect} />
      </div>
      <div style={{ flex: '0 0 250px' }} className="bg-gray-600 h-screen overflow-auto">
        {selectedProjectId && <ModuleList projectId={selectedProjectId} onModuleSelect={handleModuleSelect} />}
      </div>
      <div style={{ flex: '1' }} className="bg-gray-200 h-screen overflow-auto">
        {selectedModule && <ModuleDetails selectedModule={selectedModule} onModuleUpdate={() => {}} />}
      </div>
    </div>
  );
  
}
