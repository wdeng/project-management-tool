import axios from 'axios';
import { API_BASE_URL } from '.';

interface Proposed {
  projectId: number;
  files: any[];
  outline: any[];
  synced?: boolean;
};

export async function checkGitSync(projectId: number): Promise<any> {
  const response = await axios.get<any>(`${API_BASE_URL}/project/${projectId}/check_sync`);
  return response.data;
}

export async function synchronizeProject(projectId: number, files: any[]): Promise<Proposed> {
  const data = {
    projectId,
    files,
  }
  const response = await axios.post<any>(`${API_BASE_URL}/project/sync`, data);
  return response.data;
}

export async function finalizeSyncGit(projectId: number, outline: any[], files: any[]): Promise<any> {
  const data = {
    projectId,
    outline,
    files
  }
  console.log(data);
  const response = await axios.post<any>(`${API_BASE_URL}/project/sync_finalize`, data);
  return response.data;
}
