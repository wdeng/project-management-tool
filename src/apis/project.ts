import { getReq, postReq } from '../utils';
import { ModuleHierarchy } from './modules';
import { ChatInputType } from './refine';

export async function initProject(name: string, folder: string, requirements: string): Promise<any> {
  return await postReq('project-init/init', { name, folder, requirements });
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


export async function fetchProjectModules(projectId: number, projectDetails = true): Promise<ProjectDetailResponse> {
  let url = `project/${projectId}/modules`;
  if (projectDetails)
    url = `project/${projectId}/details`;
  const resp = await getReq(url);

  const [modules, moduleIds] = parseProjectModules(resp.modules);
  return { ...resp, modules, moduleIds };
}

export async function updateProjectSpecs(projectId: number, specs: string): Promise<any> {
  return await postReq(`project/${projectId}/update-specs`, { specs });
}

export async function deleteProject(projectId: number): Promise<any> {
  return await postReq(`project/${projectId}/delete`);
}


// QA Initialisation

export interface QuestionOption {
  text: string;
  userTextField: boolean;
}

export interface QuestionChoices {
  text: string;
  options: QuestionOption[];
}
export interface ComponentSpecs {
  [key: string]: string | ComponentSpecs | ComponentSpecs[];
}

export interface QAResponse {
  projectId: number;
  QAs: QuestionChoices[];
  finished?: boolean;
  projectSpecs?: ProjectSpecs;
}

export async function setProjectGoal(goal: string): Promise<QAResponse> {
  const data = {
    goal,
  };
  return await postReq('project-init/collect-requirements', data);
}

export interface QAAnswer {
  question: string;
  answers: string[];
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

export interface ProjectSpecs {
  name: string;
  folder: string;
  projectDescription: string;
  components: ComponentSpecs[];
}

export async function getProjectSpecs(projectId: number): Promise<ProjectSpecs> {
  return await getReq(`project-init/requirement-specs/${projectId}`);
}

export async function fixProjectIssue(
  issues: ChatInputType,
  projectId: number,
  abortController?: AbortController
): Promise<QAResponse> {
  const data = {
    issues,
    projectId,
  };
  return await postReq('project-init/requirement-specs/fix-specs', data, abortController);
}

export interface ProjectDetailResponse {
  modules: ModuleHierarchy[];
  moduleIds: number[];
  next: number;
  description: string;
  projectName: string;
  requirements: string[];
}
export async function buildProject(projectId: number): Promise<ProjectDetailResponse> {
  const data = {
    projectId,
  };

  return await postReq(`build/project`, data);
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