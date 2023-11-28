import { FileDesign } from '.';
import { postReq } from '..';

export async function updateFile(projectId: number, fields: Object): Promise<any> {
  return await postReq(`project/${projectId}/sourcecode`, fields);
}

export async function createFile(projectId: number, file: FileDesign): Promise<any> {
  const data = {
    projectId,
    file
  };
  return await postReq(`project/${projectId}/create-file`, data);
}
