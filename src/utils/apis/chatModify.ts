import axios from 'axios';
import { API_BASE_URL } from '.'

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

