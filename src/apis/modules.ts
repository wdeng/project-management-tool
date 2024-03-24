import { createQueryString, getReq, postReq } from "@/utils";
import { FileDesign } from "./files";
import { RefineResource } from "./refine";

export interface ModuleHierarchy {
  id: number;
  tabLevel?: number;
  name: string;
  description: string;
  functionalRequirements: string[];
  files: FileDesign[];
  status?: string;
  modules?: ModuleHierarchy[];
}

export interface ModuleImplement {
  id: number;
  name: string;
  description: string;
  files: FileDesign[];
  status: 'pending' | 'done' | 'failure';
  [key: string]: any
}

export async function buildModule(projectId: number, moduleId: number, targets?: "code" | "module" | "both"): Promise<any> {
  const data = {
    projectId,
    moduleId,
    targets,
  };

  return await postReq(`module/build`, data);
}

export async function getModuleDetails(projectId: number, moduleId: number): Promise<ModuleHierarchy> {
  const query = createQueryString({ 'project-id': projectId, 'id': moduleId });
  return await getReq(`module/details?${query}`);
}

export async function deleteModule(projectId: number, moduleId: number): Promise<any> {
  return await postReq(`module/delete`, { projectId, moduleId });
}

export async function updateModuleSpecs(projectId: number, moduleId: number, specs: string): Promise<any> {
  const data = {
    projectId,
    moduleId,
    specs,
  };
  return await postReq(`module/update-specs`, data);
}

export async function finalizeModule(
  projectId: number,
  moduleId: number,
  data: object,
  task: "create" | "modify"
): Promise<any> {
  return await postReq(`module/finalize-update`, {
    projectId,
    moduleId,
    data,
    task,
  });
}

export async function smartCreateModule(
  projectId: number,
  userInput: string,
  fileIds: number[] = [],
  resourcesAllowed: RefineResource[] = [],
): Promise<any> {
  const fields = {
    projectId,
    userInput,
    fileIds,
    resourcesAllowed,
  };
  return await postReq(`module/smart-create`, fields);
}

export async function smartUpdateModule(
  projectId: number,
  mainElement: string,
  userInput: string,
  fileIds: number[] = [],
  resourcesAllowed: RefineResource[] = [],
): Promise<any> {
  const fields = {
    projectId,
    mainElement,
    userInput,
    fileIds,
    resourcesAllowed,
  };
  return await postReq(`module/smart-update`, fields);
}