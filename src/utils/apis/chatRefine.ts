import axios from 'axios';
import { API_BASE_URL } from '.'

export interface ProposedFile {
  type: 'file' | 'outline';
  path: string;
  content: string;
  goal?: string;
  original?: string;
  module?: string;
}

export async function resolveIssues(
  projectId: number, issues: string, allowAdditionalFiles: boolean, files?: any
): Promise<any> {
  const data = {
    projectId,
    issues,
    files,
    noAdditionalFiles: !allowAdditionalFiles,
  };
  console.log(data);
  const response = await axios.post<any>(`${API_BASE_URL}/project/resolve_issues`, data);
  return response.data;
}

export async function confirmProjectChanges(projectId: number, changedFiles: ProposedFile[]): Promise<any> {
  const data = {
    projectId,
    changedFiles,
  };
  const response = await axios.post<any>(`${API_BASE_URL}/project/confirm_project`, data);
  return response.data;
}