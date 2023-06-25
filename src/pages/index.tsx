import React, { useEffect, useMemo, useState } from 'react';
import ProjectList from '../components/ProjectList';
import ModuleList from '../components/ModuleList';
import ModuleDetails from '../components/ModuleDetails/ModuleDetails';
import { Project, ModuleHierarchy, fetchProjectDetails, ProjectDetailResponse, ModuleImplement } from '@/utils/apiREAL';
import ChatButton from '@/components/ChatButton';


export default function Home() {
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [selectedModule, setSelectedModule] = useState<ModuleImplement | null | undefined>(null);
  const [projectDetails, setProjectDetails] = useState<ProjectDetailResponse | null>(null);

  const moduleIdPath = useMemo(() => {
    if (selectedModule && projectDetails?.outline.modules) {
      return findModuleAncestors(selectedModule.id, projectDetails.outline.modules);
    }
    return [];
  }, [selectedModule, projectDetails]);

  const [executingName, setExecuting] = useState("");
  const nextPendingModule = useMemo(() => {
    return projectDetails?.moduleSequence.find((module) => module.status === 'pending')?.name || '';
  }, [projectDetails]);

  const canBuild = useMemo(() => {
    return executingName ? false : nextPendingModule === selectedModule?.name ? true : 'warning';
  }, [nextPendingModule, selectedModule, executingName]);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedProjectId !== null) {
        const details = await fetchProjectDetails(selectedProjectId);
        setProjectDetails(details);
      }
    };
    fetchData();
  }, [selectedProjectId]);

  const handleProjectSelect = (project: Project) => {
    setSelectedProjectId(project.id);
  };

  const handleModuleSelect = (moduleName: string) => {
    const moduleImp = projectDetails?.moduleSequence.find((m) => m.name === moduleName);
    setSelectedModule(moduleImp);
  };

  const handleModuleBuild = async (e: React.MouseEvent, moduleName: string, moduleId: number) => {
    e.stopPropagation();
    if (executingName) return;
    setExecuting(moduleName);
    // executeModule && executeModule(projModule);
    await new Promise(res => setTimeout(res, 5000));
    setExecuting("");
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
        {selectedProjectId && projectDetails && <ModuleList
          onModuleSelect={handleModuleSelect}
          executingName={executingName}
          onPlayClick={handleModuleBuild}
          modules={projectDetails.outline.modules}
          selectedModule={selectedModule}
          nextModuleName={nextPendingModule}
        />}
      </div>
      {selectedModule && <div style={{ flex: '1' }} className="bg-gray-100 h-screen overflow-auto">
        <ModuleDetails
          projectId={selectedProjectId!}
          selectedModule={selectedModule}
          onModuleUpdate={() => { }}
          canBuild={canBuild} />
      </div>}
      {selectedModule && <ChatButton moduleIdPath={moduleIdPath} modules={projectDetails!.outline.modules} />}
    </div>
  );
}

function findModuleAncestors(moduleId: number, modules: ModuleHierarchy[]): number[] {
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

