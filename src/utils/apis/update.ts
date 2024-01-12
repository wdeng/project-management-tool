import { FileDesign } from '.';
import { postReq } from '..';

export async function updateFile(projectId: number, fields: Object): Promise<any> {
  return await postReq(`project/${projectId}/update-file`, fields);
}

export async function createFile(projectId: number, file: FileDesign): Promise<any> {
  const data = {
    projectId,
    file
  };
  return await postReq(`project/${projectId}/create-file`, data);
}

export async function updateModuleSpecs(projectId: number, moduleId: number, specs: string): Promise<any> {
  const data = {
    moduleId,
    specs,
  };
  return await postReq(`project/${projectId}/update-module-specs`, data);
}

export async function updateProjectSpecs(projectId: number, specs: string): Promise<any> {
  return await postReq(`project/${projectId}/update-specs`, { specs });
}

export async function deleteProject(projectId: number): Promise<any> {
  return await postReq(`project/${projectId}/delete`);
}

export async function deleteAllFiles(projectId: number): Promise<any> {
  return await postReq(
    `project/${projectId}/delete`, { targets: 'all-files' }
  );
}