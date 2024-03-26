import { createQueryString, getReq, postReq } from "@/utils";
import { ElementDesign } from "./files";
import { ChatInputType, RefineResource } from "./refine";

export interface ModuleHierarchy {
  id: number;
  tabLevel?: number;
  name: string;
  description: string;
  functionalRequirements: string[];
  files: ElementDesign[];
  status?: string;
  modules?: ModuleHierarchy[];
}

export interface ModuleImplement {
  id: number;
  name: string;
  description: string;
  files: ElementDesign[];
  status: 'pending' | 'done' | 'failure';
  [key: string]: any
}

export async function buildModule(projectId: number, moduleId: number, target?: "code" | "module" | "both"): Promise<any> {
  const data = {
    projectId,
    id: moduleId,
    target,
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
  data: object,
  task: "create" | "modify" = "create",
): Promise<any> {
  return await postReq(`module/finalize-update`, {
    projectId,
    data,
    task,
  });
}

export async function smartCreateModule(
  projectId: number,
  userInput: ChatInputType,
  fileIds: number[] = [],
  resourcesAllowed: RefineResource[] = [],
): Promise<ElementDesign> {
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
  mainElement: ElementDesign,
  userInput: ChatInputType,
  fileIds: number[] = [],
  resourcesAllowed: RefineResource[] = [],
): Promise<ElementDesign> {
  const fields = {
    projectId,
    mainElement,
    userInput,
    fileIds,
    resourcesAllowed,
  };
  return await postReq(`module/smart-update`, fields);
}