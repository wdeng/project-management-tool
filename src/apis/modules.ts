import { deleteReq, postReq } from "@/utils";

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