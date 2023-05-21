import React, { useState, useEffect } from 'react';
import { Project, fetchProjects, createProject } from '../utils/api';
import ProjectCreationModal from './ProjectCreationModal';

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
      <ul className="divide-y divide-gray-200">
        {projects.map((project) => (
          <li
            key={project.id}
            className={`p-4 hover:bg-gray-100 cursor-pointer ${selectedProjectId === project.id ? 'bg-gray-100' : ''}`}
            onClick={() => handleProjectClick(project)}
          >
            {project.name}
          </li>

        ))}
      </ul>
    </div>
  );
}

export default ProjectList;
