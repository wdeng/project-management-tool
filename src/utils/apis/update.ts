import axios from 'axios';
import { API_BASE_URL, FileDesign } from '.';

export async function updateFile(projectId: number, file: FileDesign): Promise<any> {
  const data = {
    projectId,
    fileId: file.id,
    file
  };
  const response = await axios.post<any>(`${API_BASE_URL}/project/${projectId}/update-file`, data);
  return response.data;
}

export async function createFile(projectId: number, file: FileDesign): Promise<any> {
  const data = {
    projectId,
    file
  };
  const response = await axios.post<any>(`${API_BASE_URL}/project/${projectId}/create-file`, data);
  return response.data;
}