import { getReq, postReq } from '../utils';
import { ElementDesign } from './files';
import { ModuleHierarchy } from './modules';
import { ChatInputType } from './refine';

export async function initProject(name: string, folder: string, requirements: string): Promise<any> {
  return await postReq('project-init/init', { name, folder, requirements });
}

export async function fetchModules(projectId: number): Promise<ModuleHierarchy[]> {
  const modules = await getReq(`project/modules?project-id=${projectId}`);

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

export async function fetchProjectDetails(projectId: number, getModules = true): Promise<ProjectDetailResponse> {
  let url = `project/specs`;
  if (getModules)
    url = `project/details`;
  url += `?project-id=${projectId}`;
  const resp = await getReq(url);
  if (!getModules)
    return resp;

  const [modules, moduleIds, moduleNames] = parseProjectModules(resp.modules);
  return { ...resp, modules, moduleIds, moduleNames };
}

export async function smartUpdateSchema(
  projectId: number,
  mainElement: ElementDesign,
  userInput: ChatInputType,
  fileIds: number[] = [],
): Promise<ElementDesign> {
  const fields = {
    projectId,
    mainElement,
    userInput,
    fileIds,
    resourcesAllowed: [],
  };
  return await postReq(`project/smart-update-schema`, fields);
}

export async function updateProjectSpecs(
  projectId: number,
  content: string,
  target: "schema" | "specs" = "specs"
): Promise<any> {
  return await postReq(`project/update-specs`, { content, projectId, target });
}

export async function deleteProject(projectId: number): Promise<any> {
  return await postReq(`project/delete`, { projectId });
}

export async function deleteAllFiles(projectId: number): Promise<any> {
  return await postReq(
    `project/delete`, { targets: 'files', projectId }
  );
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
  projectSpecs?: string;
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

export async function getProjectSpecs(projectId: number): Promise<string> {
  const res = await getReq(`project-init/requirement-specs/${projectId}`);
  return res.specs;
}

export async function fixProjectIssue(
  projectId: number,
  issues: ChatInputType,
  updatedSpecs?: string,
): Promise<QAResponse> {
  const data = {
    issues,
    updatedSpecs,
    projectId,
  };
  return await postReq('project-init/requirement-specs/fix-specs', data);
}

export interface ProjectDetailResponse {
  modules: ModuleHierarchy[];
  moduleIds: number[];
  moduleNames: string[];
  next: number;
  description: string;
  projectName: string;
  requirements: string[];
}
export async function buildProject(projectId: number): Promise<ProjectDetailResponse> {
  const data = {
    projectId,
  };

  return await postReq(`project/build`, data);
}

function parseProjectModules(modules: ModuleHierarchy[]): [ModuleHierarchy[], number[], string[]] {
  const moduleIds = new Set<number>();
  const moduleNames = new Set<string>();

  const assignTabLevels = (modules: ModuleHierarchy[], tabLevel = 0) => {
    for (const mod of modules) {
      mod.tabLevel = tabLevel;
      if (mod.modules) {
        assignTabLevels(mod.modules, tabLevel + 1);
      }
      moduleNames.add(mod.name);
      moduleIds.add(mod.id);
    }
  };

  assignTabLevels(modules);
  return [modules, Array.from(moduleIds), Array.from(moduleNames)];
}