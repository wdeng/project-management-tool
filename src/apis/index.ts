import { getReq } from '../utils';
export * from './project';
export * from './gitSync';
export * from './refine';
export * from './modules';
export * from './files';

export interface Project {
  id: number;
  name: string;
}

export async function fetchProjects(): Promise<Project[]> {
  return await getReq('project/list');
}