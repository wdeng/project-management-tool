import { getReq, postReq } from "@/utils";
import { ChatInputType, RefineResource } from "./refine";

export interface ElementDesign {
  id: number;
  name: string;
  goal?: string;
  original?: string;
  content?: string;
  parent?: string;
  status?: 'pending' | 'done';
  contentType?: 'code' | 'file' | 'guidelines' | 'module';
}


export async function getSourceCode(projectId: number, fileId: number | string): Promise<ElementDesign> {
  let apiUrl = `file/source?project-id=${projectId}`;

  if (typeof fileId === 'string') {
    const encodedPath = encodeURIComponent(fileId);
    apiUrl += `&name=${encodedPath}`;
  } else if (typeof fileId === 'number')
    apiUrl += `&id=${fileId}`;
  else
    throw new Error("Either path or id must be provided");

  return await getReq(apiUrl);
}

export async function deleteFile(projectId: number, fileId: number): Promise<any> {
  return await postReq('file/delete', { projectId, fileId });
}

export interface ElementContent {
  id?: number;
  name: string;
  parent?: string;
  content: string;
  original?: string;
  goal?: string;
}

export async function updateSource(projectId: number, data: ElementDesign): Promise<any> {
  return await postReq('file/finalize-source', { projectId, data, task: "modify" });
}

export async function updateGuidelines(projectId: number, data: ElementDesign): Promise<any> {
  return await postReq('file/update-guidelines', { projectId, ...data });
}

export async function smartCreateFile(
  projectId: number,
  userInput: ChatInputType,
  fileIds: number[] = [],
  resourcesAllowed: RefineResource[] = [],
): Promise<ElementDesign> {
  const fields = {
    projectId,
    fileIds,
    resourcesAllowed,
    userInput,
  };
  return await postReq(`file/smart-create`, fields);
}

export async function smartUpdateFile(
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
  return await postReq(`file/smart-update`, fields);
}

export async function createFile(projectId: number, file: ElementDesign): Promise<any> {
  return await postReq('file/finalize-source', { projectId, data: file, task: "create" });
}
