import React, { useState, useEffect } from 'react';
import { Project, fetchProjects, createProject } from '../utils/api';
import ProjectCreationModal from './CreateProject/ProjectCreationModal';
import { MdDashboard } from "react-icons/md";

interface ProjectListProps {
  selectedProjectId: number | null;
  onProjectSelect: (project: Project) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({
  selectedProjectId,
  onProjectSelect,
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
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

  async function handleNewProject(projectName: string, requirements: string, schema: string) {
    try {
      // you would call the API to create the project here
      await createProject(projectName, requirements, schema);

      // and then re-fetch the projects
      fetchData();
    } catch (err) {
      setError('Failed to create project');
    }
  }

  function handleProjectClick(project: Project) {
    onProjectSelect(project);
  }


  return (
    <div className="overflow-y-auto h-full">
      <ProjectCreationModal onNewProject={handleNewProject} />
      {error && <p className="text-red-500">{error}</p>}
      <ul>
        {projects.map((project) => (
          <li
            key={project.id}
            className={`px-2 py-4 flex items-center rounded-l-md text-white cursor-pointer transition ease-in-out delay-100 hover:translate-x-2 hover:scale-105 hover:bg-indigo-400 duration-300 ${selectedProjectId === project.id ? 'bg-indigo-600' : ''}`}
            onClick={() => handleProjectClick(project)}
          >
            <div className="mr-2">
              <MdDashboard size={16} />
            </div>
            <span>{project.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProjectList;
