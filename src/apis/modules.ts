import { deleteReq, getReq, postReq } from "@/utils";
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

export async function buildModule(projectId: number, moduleId: number, targets?: string): Promise<any> {
  const data = {
    projectId,
    moduleId,
    targets,
  };

  return await postReq(`build/module`, data);
}

export async function promptCreateModule(
  projectId: number,
  userInput: string,
): Promise<any> {
  const fields = {
    target: 'module',
    projectId,
    userInput,
  };
  return await postReq(`resolve-issues/create-element`, fields);
}

export async function promptUpdateModule(
  projectId: number,
  mainModuleName: string,
  userInput: string,
): Promise<any> {
  const fields = {
    target: 'module',
    projectId,
    mainModuleName,
    userInput,
  };
  return await postReq(`resolve-issues/update-element`, fields);
}

export async function fetchModuleDetails(projectId: number, moduleId: number): Promise<ModuleHierarchy> {
  return await getReq(`project/${projectId}/module/${moduleId}/details`);
}

export async function updateModuleSpecs(projectId: number, moduleId: number, specs: string): Promise<any> {
  const data = {
    moduleId,
    specs,
  };
  return await postReq(`project/${projectId}/update-module-specs`, data);
}

export async function deleteModule(projectId: number, moduleId: number): Promise<any> {
  return await deleteReq(`project/${projectId}/module/${moduleId}`);
}