import { FileDesign } from '.';
import { postReq } from '..';

export async function updateFile(projectId: number, file: FileDesign): Promise<any> {
  const data = {
    projectId,
    fileId: file.id,
    file
  };
  return await postReq(`project/${projectId}/update-file`, data);
}

export async function createFile(projectId: number, file: FileDesign): Promise<any> {
  const data = {
    projectId,
    file
  };
  return await postReq(`project/${projectId}/create-file`, data);
}