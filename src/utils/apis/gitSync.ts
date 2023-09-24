import axios from 'axios';
import { API_BASE_URL } from '.';


export async function checkGitSync(projectId: number): Promise<any> {
  const response = await axios.get<any>(`${API_BASE_URL}/project/${projectId}/check_sync`);
  return response.data;
}