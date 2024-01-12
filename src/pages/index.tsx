import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ProjectList from '../components/ProjectList';
import ModuleList from '../components/ModuleList';
import ModuleDetails from '../components/ModuleDetails/ModuleDetails';
import { Project, ModuleHierarchy, fetchProjectModules, ProjectDetailResponse, buildModule, fetchModuleDetails } from '@/utils/apis';
import ChatButton from '@/components/ProjectChatModify/ChatModify';
import { SelectedContext } from '@/hooks/useSelectedContext';
import ProjectDetails from '@/components/ProjectDetails/Project';



export default function Home() {
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [selectedModule, setSelectedModule] = useState<ModuleHierarchy | null | undefined>(null);
  const [projectDetails, setProjectDetails] = useState<ProjectDetailResponse | null>(null);

  const handleModuleSelect = useCallback(async (moduleId: number) => {
    if (!selectedProjectId) return;
    if (moduleId > 0) {
      const m = await fetchModuleDetails(selectedProjectId, moduleId);
      setSelectedModule(m);
    } else
      setSelectedModule(null);
  }, [selectedProjectId]);

  const refreshCurrentProject = useCallback(async () => {
    if (selectedProjectId == null) return;

    const details = await fetchProjectModules(selectedProjectId);
    if (!(selectedModule?.id && details.moduleIds.includes(selectedModule.id)))
      setSelectedModule(null);
    else
      await handleModuleSelect(selectedModule.id);
    setProjectDetails(details);
  }, [selectedProjectId, selectedModule, handleModuleSelect])

  const moduleIdPath = useMemo(() => {
    if (selectedModule && projectDetails?.modules) {
      return findModuleAncestors(selectedModule.id, projectDetails.modules);
    }
    return [];
  }, [selectedModule, projectDetails]);

  const [executingName, setExecuting] = useState<string>("");

  const canBuild = useMemo(() => {
    if (!selectedModule || executingName) return false;
    return projectDetails?.next === selectedModule.id ? true : 'warning';
  }, [projectDetails?.next, selectedModule, executingName]);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedProjectId !== null) {
        const details = await fetchProjectModules(selectedProjectId);
        setProjectDetails(details);
      }
    };
    fetchData();
  }, [selectedProjectId]);

  const handleProjectSelect = (project: Project) => {
    setSelectedProjectId(project.id);
    selectedModule && setSelectedModule(null);
  };

  const handleModuleBuild = async (moduleName: string, moduleId: number, targets?: string) => {
    if (executingName || !selectedProjectId) return;
    setExecuting(moduleName);
    const next = await buildModule(selectedProjectId, moduleId, targets);
    setProjectDetails((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        next,
      };
    });
    setExecuting("");
    const m = await fetchModuleDetails(selectedProjectId, moduleId);
    setSelectedModule(m);
  };

  return (
    <SelectedContext.Provider value={{ selectedModule, setSelectedModule, selectedProjectId, setSelectedProjectId, refreshCurrentProject }}>
      <div className="flex">
        <div style={{ flex: '0 0 250px' }} className="z-10 bg-gray-700 h-screen overflow-auto">
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
            modules={projectDetails.modules}
            nextModuleId={projectDetails.next}
          />}
        </div>
        <div style={{ flex: '1' }} className="bg-gray-100 h-screen overflow-auto">
          {selectedModule ? <>
            <ModuleDetails
              moduleBuild={handleModuleBuild}
              canBuild={canBuild}
              moduleDetails={selectedModule}
            />
            <ChatButton moduleIdPath={moduleIdPath} modules={projectDetails!.modules} />
          </> : projectDetails && <ProjectDetails {...projectDetails} projectId={selectedProjectId!} />}
        </div>
      </div>
    </SelectedContext.Provider>
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

