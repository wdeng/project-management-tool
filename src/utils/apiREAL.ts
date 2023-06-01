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
  tabLevel?: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  files: FileDesign[];
  modules?: Module[];
}

export interface FileDesign {
  id?: number;
  filePath: string;
  goal: string;
}


export async function fetchProjects(): Promise<Project[]> {
  const response = await axios.get<Project[]>(`${API_BASE_URL}/projects`);
  return response.data;
}

export async function fetchModules(projectId: number): Promise<Module[]> {
  const response = await axios.get<Module[]>(`${API_BASE_URL}/projects/${projectId}/modules`);
  const modules = response.data;

  // Create tabLevels for modules and include files
  const assignTabLevels = (modules: Module[], tabLevel = 0) => {
    for (const mod of modules) {
      mod.tabLevel = tabLevel;
      if (mod.modules) {
        assignTabLevels(mod.modules, tabLevel + 1);
      }
    }
  };

  assignTabLevels(modules);
  return modules;
}

export async function createProject(name: string, requirements: string, schema: string): Promise<Project> {
  const response = await axios.post<Project>(`${API_BASE_URL}/projects`, { name, requirements, schema });
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
