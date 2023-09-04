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

export type ProposedItem = ProposedFile | ProposedModule;

export async function resolveIssues(
  projectId: number, issues: string, allowAdditionalFiles: boolean, fileIds?: number[]
): Promise<any> {
  const data = {
    projectId,
    issues,
    fileIds,
    noAdditionalFiles: !allowAdditionalFiles,
  };
  console.log(data);
  const response = await axios.post<any>(`${API_BASE_URL}/project/resolve_issues`, data);
  return response.data;
}

export async function confirmProjectChanges(projectId: number, changedFiles: ProposedItem[]): Promise<any> {
  const data = {
    projectId,
    changedFiles,
  };
  const response = await axios.post<any>(`${API_BASE_URL}/project/confirm_project`, data);
  return response.data;
}