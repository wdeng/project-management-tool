import React, { useState, useEffect } from 'react';
import { Project, fetchProjects, initProject, buildProject, ProjectDetailResponse } from '../utils/apis';
import ProjectCreationModal from './CreateProject/ProjectCreationModal';
import { MdDashboard, MdDriveFileMove } from "react-icons/md";
import Spinner from './general/Spinner';
import RetractMenu from './general/RetractMenu';

interface ProjectListProps {
  selectedProjectId: number | null;
  onProjectSelect: (project: Project) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({
  selectedProjectId,
  onProjectSelect,
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [buildingProjects, setBuildingProjects] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function fetchData() {
    try {
      const data = await fetchProjects();
      setProjects(data);
    } catch (err) {
      setError('Failed to fetch projects');
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function handleNewProject(projectName: string, folderName: string, requirements: string) {
    try {
      // you would call the API to create the project here
      const { projectId } = await initProject(projectName, folderName, requirements);
      await handleProjectBuild(projectId)

      // and then re-fetch the projects
      fetchData();
    } catch (err) {
      setError('Failed to create project');
    }
  }

  async function handleProjectBuild(projectId: number) {
    try {
      fetchData();
      setBuildingProjects(prevState => [...prevState, projectId]);

      const projectDetailResponse: ProjectDetailResponse = await buildProject(projectId);

      // Handle the project build response here
      console.log(projectDetailResponse);

      // After project build is successful, remove the project from buildingProjects list
      setBuildingProjects(prevState => prevState.filter(id => id !== projectId));
    } catch (err) {
      setError('Failed to build project');
      setBuildingProjects(prevState => prevState.filter(id => id !== projectId));
    }
  }

  function selectProject(project: Project) {
    // Avoid selection if the project is building
    if (!buildingProjects.includes(project.id)) {
      onProjectSelect(project);
    }
  }

  return (
    <div className="overflow-y-auto h-full">
      <ProjectCreationModal onNewProject={handleNewProject} onProjectBuild={handleProjectBuild} />
      {error && <p className="text-red-500">{error}</p>}
      <RetractMenu>
        <li
          className={`pl-4 pr-2 py-1 flex items-center rounded-l-md text-white cursor-pointer transition-all ease-in-out hover:translate-x-2 hover:scale-105 hover:bg-indigo-400 duration-300 ${selectedProjectId === null ? 'bg-indigo-500' : ''}`}
        >
          <div className="mr-2">
            <MdDashboard size={16} />
          </div>
          <span>Dashboard</span>
        </li>
      </RetractMenu>
      <ul>
        {projects.map((project) => (
          <li
            key={project.id}
            className={`px-2 py-3 flex items-center rounded-l-md text-white cursor-pointer transition-all ease-in-out hover:translate-x-2 hover:scale-105 hover:bg-indigo-400 duration-300 ${selectedProjectId === project.id ? 'bg-indigo-500' : ''}`}
            onClick={() => selectProject(project)}
          >
            <div className="mr-2">
              {buildingProjects.includes(project.id) ? (
                <Spinner spinnerSize={16} />
              ) : (
                <MdDashboard size={16} />
              )}
            </div>
            <span>{project.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProjectList;
