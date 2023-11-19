import { getReq, postReq } from "..";

interface Proposed {
  projectId: number;
  files: any[];
  outline: any[];
  synced?: boolean;
};

export async function checkGitSync(projectId: number): Promise<any> {
  return await getReq(`project/${projectId}/check_sync`);
}

export async function synchronizeProject(projectId: number, files: any[]): Promise<Proposed> {
  const data = {
    projectId,
    files,
  }
  return await postReq('project/sync', data);
}

export async function finalizeSyncGit(projectId: number, outline: any[], files: any[]): Promise<any> {
  const data = {
    projectId,
    outline,
    files
  }
  console.log(data);
  return await postReq('project/sync_finalize', data);
}
