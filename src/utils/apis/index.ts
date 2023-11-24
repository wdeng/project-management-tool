import { getReq, postReq } from '..';
export * from './update';
export * from './gitSync';

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
  // folder: string;
  // url: string;
}

export interface ProjectDetailResponse {
  modules: ModuleHierarchy[];
  moduleIds: number[];
  next: number;
  description: string;
  projectName: string;
  requirements: string[];
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
  functionalRequirements: string[];
  files: FileDesign[];
  modules?: ModuleHierarchy[];
}

export interface FileDesign {
  id: number;
  path: string;
  goal?: string;
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

export async function setProjectGoal(goal: string): Promise<QAResponse> {
  const data = {
    goal,
  };
  return await postReq('project-init/collect_requirements', data);
}

export async function anwerProjectQAs(
  questionAnswers: QAAnswer[], projectId: number
): Promise<QAResponse> {
  const data = {
    questionAnswers,
    projectId,
  };

  return await postReq('project-init/collect-requirements', data);
}

export async function getProjectSpecs(projectId: number): Promise<ProjectSpecs> {
  return await getReq(`project-init/requirement-specs/${projectId}`);
}

export async function fixProjectIssue(issues: string, projectId: number): Promise<QAResponse> {
  const data = {
    issues,
    projectId,
  };
  return await postReq('project-init/requirement-specs/fix_specs', data);
}

export async function buildProject(projectId: number): Promise<ProjectDetailResponse> {
  const data = {
    projectId,
  };

  return await postReq(`build/project`, data);
}

export async function initProject(name: string, folder: string, requirements: string): Promise<any> {
  return await postReq('project-init/init', { name, folder, requirements });
}

export async function buildModule(projectId: number, moduleId: number): Promise<any> {
  const data = {
    projectId,
    moduleId,
  };

  return await postReq(`build/module`, data);
}

export async function fetchSourceCode(projectId: number, fileId: number | string): Promise<FileDesign> {
  let apiUrl: string;

  if (typeof fileId === 'string') {
    const encodedPath = encodeURIComponent(fileId);
    apiUrl = `sourcecode/${projectId}?path=${encodedPath}`;
  } else if (typeof fileId === 'number')
    apiUrl = `sourcecode/${projectId}?id=${fileId}`;
  else
    throw new Error("Either path or id must be provided");

  return await getReq(apiUrl);
}

export async function fetchProjectModules(projectId: number, projectDetails = true): Promise<ProjectDetailResponse> {
  let url = `project/${projectId}/modules`;
  if (projectDetails)
    url = `project/${projectId}/details`;
  const resp = await getReq(url);

  const [modules, moduleIds] = parseProjectModules(resp.modules);
  return { ...resp, modules, moduleIds };
}

function parseProjectModules(modules: ModuleHierarchy[]): [ModuleHierarchy[], number[]] {
  const moduleIds = new Set<number>();
  const assignTabLevels = (modules: ModuleHierarchy[], tabLevel = 0) => {
    for (const mod of modules) {
      mod.tabLevel = tabLevel;
      if (mod.modules) {
        assignTabLevels(mod.modules, tabLevel + 1);
      }
      moduleIds.add(mod.id);
    }
  };

  assignTabLevels(modules);
  return [modules, Array.from(moduleIds)];
}

export async function fetchModuleDetails(projectId: number, moduleId: number): Promise<ModuleHierarchy> {
  return await getReq(`module/${projectId}/${moduleId}/details`);
}

export async function fetchProjects(): Promise<Project[]> {
  return await getReq('projects');
}

export async function fetchModules(projectId: number): Promise<ModuleHierarchy[]> {
  const modules = await getReq(`project/${projectId}/modules`);

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
