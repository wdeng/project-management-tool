import { postReq } from '../utils';


export async function updateProjectSpecs(projectId: number, specs: string): Promise<any> {
  return await postReq(`project/${projectId}/update-specs`, { specs });
}

export async function deleteProject(projectId: number): Promise<any> {
  return await postReq(`project/${projectId}/delete`);
}
