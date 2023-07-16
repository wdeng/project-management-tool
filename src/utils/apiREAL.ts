import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://api.wenxiangdeng.com';

export interface ComponentSpecs {
  [key: string]: string | ComponentSpecs | ComponentSpecs[];
}

export interface ProjectSpecs {
  name: string;
  folder: string;
  projectDescription: string;
  components: ComponentSpecs[];
}

export interface Project {
  id: number;
  name: string;
  folder: string;
  url: string;
  details?: ProjectDetailResponse;
}

export interface ProjectDetailResponse {
  outline: {
    modules: ModuleHierarchy[];
    [key: string]: any;
  }
  moduleSequence: ModuleImplement[];
}

export interface ModuleImplement {
  id: number;
  name: string;
  description: string;
  files: FileDesign[];
  status: 'pending' | 'done' | 'failure';
  [key: string]: any 
}

export interface ModuleHierarchy {
  id: number;
  tabLevel?: number;
  name: string;
  description: string;
  files: FileDesign[];
  modules?: ModuleHierarchy[];
}

export interface FileDesign {
  id: number;
  path: string;
  goal: string;
  content?: string;
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
  projectSpecs?: ProjectSpecs;
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

export async function getProjectSpecs(projectId: number): Promise<ProjectSpecs> {
  const response = await axios.get<ProjectSpecs>(`${API_BASE_URL}/project/requirement_specs/${projectId}`);
  return response.data;
}

export async function fixProjectIssue(issues: string, projectId: number): Promise<QAResponse> {
  const data = {
    issues,
    projectId,
  };
  const response = await axios.post<QAResponse>(
    `${API_BASE_URL}/project/requirement_specs/fix_specs`, data
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

export async function fetchSouceCode(projectId: number, moduleId: number, fileId: number): Promise<FileDesign> {
  const response = await axios.get<FileDesign>(`${API_BASE_URL}/sourcecode/${projectId}/${moduleId}/${fileId}`);
  return response.data;
}

export async function fetchProjectDetails(projectId: number): Promise<ProjectDetailResponse> {
  const response = await axios.get<ProjectDetailResponse>(`${API_BASE_URL}/project/${projectId}/details`);

  const resp = response.data;
  console.log(resp);
  if (resp.outline && resp.outline.modules) {
    const assignTabLevels = (modules: ModuleHierarchy[], tabLevel = 0) => {
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

export async function fetchModules(projectId: number): Promise<ModuleHierarchy[]> {
  const response = await axios.get<ModuleHierarchy[]>(`${API_BASE_URL}/project/${projectId}/modules`);
  const modules = response.data;

  // Create tabLevels for modules and include files
  const assignTabLevels = (modules: ModuleHierarchy[], tabLevel = 0) => {
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

export async function resolveIssues(projectId: number, issues: string, files?: any): Promise<any> {
  const data = {
    projectId,
    issues,
    files,
  };
  const response = await axios.post<any>(`${API_BASE_URL}/project/resolve_issues`, data);
  return response.data;
}

export async function createProjectLegacy(name: string, requirements: string, schema: string): Promise<Project> {
  const response = await axios.post<Project>(`${API_BASE_URL}/projects`, { name, requirements, schema });
  return response.data;
}
