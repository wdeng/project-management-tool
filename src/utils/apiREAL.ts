import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : 'https://api.wenxiangdeng.com';

export interface Project {
  id: number;
  name: string;
  folder: string;
  url: string;
  details?: ProjectDetailResponse;
}

export interface ProjectDetailResponse {
  outline: {
    modules: Module[];
    [key: string]: any;
  }
  moduleSequence: Array<{ [key: string]: any }>;
}

export interface Module {
  id: number;
  projectId: number;
  tabLevel?: number;
  name: string;
  description: string;
  files: FileDesign[];
  modules?: Module[];
}

export interface FileDesign {
  id?: number;
  filePath: string;
  goal: string;
}

export interface QuestionOption {
  text: string;
  userTextField: boolean;
}

export interface QuestionChoices {
  text: string;
  options: QuestionOption[];
}

export interface QAResponse {
  projectId: number;
  QAs: QuestionChoices[];
  finished?: boolean;
}

export interface QAAnswer {
  question: string;
  answers: string[];
}

export interface ProjectMeta {
  folder: string;
  // Add other properties as needed
}

export interface ModuleDetailResponse {
  id: number;
  // Add other properties as needed
}

export async function setProjectGoal(goal: string): Promise<QAResponse> {
  const data = {
    goal,
  };
  const response = await axios.post<QAResponse>(
    `${API_BASE_URL}/project/collect_requirements`, data
  );
  return response.data;
}

export async function anwerProjectQAs(
  questionAnswers: QAAnswer[], projectId: number
): Promise<QAResponse> {
  const data = {
    questionAnswers,
    projectId,
  };
  const response = await axios.post<QAResponse>(
    `${API_BASE_URL}/project/collect_requirements`, data
  );
  return response.data;
}

export async function buildProject(projectId: number): Promise<ProjectDetailResponse> {
  const response = await axios.post<ProjectDetailResponse>(`${API_BASE_URL}/project/build/${projectId}`);
  return response.data;
}

export async function buildModule(projectId: number, moduleId: number): Promise<any> {
  const data = {
    projectId,
    moduleId,
  };
  const response = await axios.post<any>(`${API_BASE_URL}/module/build/${projectId}`, data);
  return response.data;
}

export async function fetchProjectDetails(projectId: number): Promise<ProjectDetailResponse> {
  const response = await axios.get<ProjectDetailResponse>(`${API_BASE_URL}/project/${projectId}/details`);

  const resp = response.data;
  if (resp.outline && resp.outline.modules) {
    const assignTabLevels = (modules: Module[], tabLevel = 0) => {
      for (const mod of modules) {
        mod.tabLevel = tabLevel;
        if (mod.modules) {
          assignTabLevels(mod.modules, tabLevel + 1);
        }
      }
    };
    assignTabLevels(resp.outline.modules);
  }
  return response.data;
}

export async function fetchProjects(): Promise<Project[]> {
  const response = await axios.get<Project[]>(`${API_BASE_URL}/projects/list`);
  return response.data;
}

export async function fetchModules(projectId: number): Promise<Module[]> {
  const response = await axios.get<Module[]>(`${API_BASE_URL}/project/${projectId}/modules`);
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

export async function createProjectLegacy(name: string, requirements: string, schema: string): Promise<Project> {
  const response = await axios.post<Project>(`${API_BASE_URL}/projects`, { name, requirements, schema });
  return response.data;
}
