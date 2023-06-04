import React, { useState, useEffect } from 'react';
import { Project, fetchProjects, createProject } from '../utils/api';
import ProjectCreationModal from './CreateProject/ProjectCreationModal';
import { MdDashboard } from "react-icons/md";

interface ProjectListProps {
  selectedProjectId: number | null;
  onProjectSelect: (project: Project) => void;
}

const questions = [
  {
    text: "What this project is about? Please provide an overview or description.",
    options: [
      { text: "Overview of project", userTextField: true },
    ],
  },
  {
    text: "Which programming language(s) would you like to use for your project?",
    options: [
      { text: "TypeScript", userTextField: false },
      { text: "JavaScript", userTextField: false },
      { text: "Python", userTextField: false },
      { text: "Java", userTextField: false },
      { text: "Other", userTextField: true },
    ],
  },
  {
    text: "What features would you like to include in your software project? (select all that apply)",
    options: [
      { text: "User authentication", userTextField: false },
      { text: "Database integration", userTextField: false },
      { text: "API integration", userTextField: false },
      { text: "File uploading", userTextField: false },
      { text: "Real-time updates", userTextField: false },
      { text: "Other", userTextField: true },
    ],
  },
  {
    text: "What features would you like to include?",
    options: [
      {
        text: "User authentication",
        userTextField: false,
      },
      {
        text: "Database integration",
        userTextField: false,
      },
      {
        text: "Third-party API integration",
        userTextField: false,
      },
      {
        text: "Custom feature",
        userTextField: true,
      },
    ],
  },
];

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
      <ProjectCreationModal onNewProject={handleNewProject} questions={questions} />
      {error && <p className="text-red-500">{error}</p>}
      <ul>
        {projects.map((project) => (
          <li
            key={project.id}
            className={`px-2 py-4 flex items-center rounded-l-md text-white cursor-pointer transition-all ease-in-out hover:translate-x-2 hover:scale-105 hover:bg-indigo-400 duration-300 ${selectedProjectId === project.id ? 'bg-indigo-500' : ''}`}
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
