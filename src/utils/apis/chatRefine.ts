import { FileModifyType } from '@/components/general/ModifySpan';
import { getReq, postReq } from '..';

interface BaseProposed {
  type: string;
  name: string;
  revisionType: FileModifyType;
  content: string;
  original: string;
}

export interface ProposedFile extends BaseProposed {
  type: 'file';
  goal: string;
  module: string;
}

export interface ProposedModule extends BaseProposed {
  type: 'module';
}

export interface ProposedDirectAnswer {
  type: 'answer';
  content: string;
}

export type ProposedItem = ProposedFile | ProposedModule;

export type RefineResource = 'outline' | 'schema' | 'read_more_files' | 'direct_answer';

export const REFINE_RESOURCES: Record<RefineResource, string> = {
  outline: "Project Outline",
  schema: "Data and API Schema",
  read_more_files: "Read More Files",
  direct_answer: "Directly Answer Question",
};

export async function resolveIssues(
  projectId: number, issues: string | null, issueId: string | null, fileIds?: number[], resourcesAllowed: RefineResource[] = []
): Promise<any> {
  const data = {
    projectId,
    issueId,
    issues,
    fileIds,
    resourcesAllowed,
  };
  console.log(data);
  return await postReq('project/resolve_issues', data);
}

export async function confirmProjectChanges(changedFiles: ProposedItem[], projectId: number, issueId: string | null): Promise<any> {
  const data = {
    projectId,
    issueId,
    changes: changedFiles,
  };
  console.log(data);
  return await postReq('project/resolve_issues/confirm', data);
}

export async function getIssueHistory(projectId: number, issueId: string): Promise<any> {
  return await getReq(`project=${projectId}/issue=${issueId}/history`);
}