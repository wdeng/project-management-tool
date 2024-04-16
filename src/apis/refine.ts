import { FileModifyType } from '@/components/general/ModifySpan';
import { createQueryString, getReq, postReq } from '../utils';

interface BaseProposed {
  contentType: string;
  name: string;
  task: FileModifyType;
  content: string;
  original: string;
}

export interface ProposedFile extends BaseProposed {
  contentType: 'file';
  goal: string;
  module: string;
}

export interface ProposedModule extends BaseProposed {
  contentType: 'module';
}

export interface ProposedDirectAnswer {
  contentType: 'answer';
  content: string;
}

export type ProposedItem = ProposedFile | ProposedModule;

export type RefineResource = 'outline' | 'schema' | 'read_more_files' | 'direct_answer';

export type ChatInputType = { images?: string[]; text: string } | null;

export const REFINE_RESOURCES: Record<RefineResource, string> = {
  outline: "Project Outline",
  schema: "Data and API Schema",
  read_more_files: "Read More Files",
  direct_answer: "Directly Answer Question",
};

export async function resolveIssues(
  projectId: number,
  issues: ChatInputType,
  fileIds?: number[],
  resourcesAllowed: RefineResource[] = [],
  abortController: AbortController | undefined = undefined,
): Promise<any> {
  if (!issues?.text) issues = null;
  const data = {
    projectId,
    issues,
    fileIds,
    resourcesAllowed,
  };
  return await postReq('resolve-issues/propose', data, abortController);
}

export async function confirmProjectChanges(changedFiles: ProposedItem[], projectId: number): Promise<any> {
  const data = {
    projectId,
    changes: changedFiles,
  };
  const resp = await postReq('resolve-issues/confirm', data);
  return resp;
}

export async function clearIssueHistory(projectId: number): Promise<any> {
  const data = {
    projectId,
  };
  return await postReq('resolve-issues/reset', data);
}

export async function getIssueHistory(projectId: number): Promise<any> {
  const queries = createQueryString({ 'project-id': projectId });
  return await getReq(`resolve-issues/history?${queries}`);
}