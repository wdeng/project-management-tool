import axios from 'axios';
import { API_BASE_URL } from '.'

interface BaseProposed {
  type: string;
  name: string;
  revisionType: 'add' | 'delete' | 'modify';
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
  const response = await axios.post<any>(`${API_BASE_URL}/project/resolve_issues`, data);
  console.log(response.data);
  return response.data;
}

export async function confirmProjectChanges(projectId: number, issueId: string, changedFiles: ProposedItem[]): Promise<any> {
  const data = {
    projectId,
    issueId,
    changes: changedFiles,
  };
  console.log(data);
  const response = await axios.post<any>(`${API_BASE_URL}/project/resolve_issues/confirm`, data);
  console.log(response.data);
  return response.data;
}

export async function getIssueHistory(projectId: number, issueId: string): Promise<any> {
  const response = await axios.get<any>(`${API_BASE_URL}/project=${projectId}/issue=${issueId}/history`);
  return response.data;
}