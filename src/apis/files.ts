import { getReq, postReq } from "@/utils";

export interface FileDesign {
  id: number;
  path: string;
  goal?: string;
  content?: string;
  status?: 'pending' | 'done';
}

export async function fetchSourceCode(projectId: number, fileId: number | string, target?: "code" | "metadata" | "guidelines"): Promise<FileDesign> {
  let apiUrl: string;

  if (typeof fileId === 'string') {
    const encodedPath = encodeURIComponent(fileId);
    apiUrl = `project/${projectId}/source-file?path=${encodedPath}`;
  } else if (typeof fileId === 'number')
    apiUrl = `project/${projectId}/source-file?id=${fileId}`;
  else
    throw new Error("Either path or id must be provided");

  if (target != null)
    apiUrl += `&target=${target}`;

  return await getReq(apiUrl);
}

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

export async function deleteAllFiles(projectId: number): Promise<any> {
  return await postReq(
    `project/${projectId}/delete`, { targets: 'all-files' }
  );
}