import axios from 'axios';

const API_BASE_URL = 'https://api.example.com';

export interface Project {
  id: number;
  name: string;
  description: string;
  requirements: string;
  schema: string;
  createdAt: string;
  updatedAt: string;
}

export interface Module {
  id: number;
  projectId: number;
  parentId: number | null;
  name: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  files: FileDesign[];
}

export interface FileDesign {
  filePath: string;
  goal: string;
  packages: string[];
  dependencies: string[];
}


export async function fetchProjects(): Promise<Project[]> {
  const response = await axios.get<Project[]>(`${API_BASE_URL}/projects`);
  return response.data;
}

export async function fetchModules(projectId: number): Promise<Module[]> {
  const response = await axios.get<Module[]>(`${API_BASE_URL}/projects/${projectId}/modules`);
  return response.data;
}

export async function createProject(name: string, requirements: string, schema: string): Promise<Project> {
  const response = await axios.post<Project>(`${API_BASE_URL}/projects`, { name , requirements, schema });
  return response.data;
}

export async function createModule(
  projectId: number,
  parentId: number | null,
  name: string,
  description: string,
): Promise<Module> {
  const response = await axios.post<Module>(`${API_BASE_URL}/projects/${projectId}/modules`, {
    parentId,
    name,
    description,
  });
  return response.data;
}

export async function updateModule(
  projectId: number,
  moduleId: number,
  name: string,
  description: string,
  files: FileDesign[],
): Promise<Module> {
  const response = await axios.put<Module>(
    `${API_BASE_URL}/projects/${projectId}/modules/${moduleId}`,
    { name, description, files },
  );
  return response.data;
}

export async function deleteModule(projectId: number, moduleId: number): Promise<void> {
  await axios.delete(`${API_BASE_URL}/projects/${projectId}/modules/${moduleId}`);
}
