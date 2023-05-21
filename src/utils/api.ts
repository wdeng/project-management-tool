export interface Project {
  id: number;
  name: string;
  description: string;
  requirements: string;
  schema: string;
  createdAt: string;
  updatedAt: string;
}

export interface Module {
  id: number;
  projectId: number;
  parentId: number | null;
  name: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  files: FileDesign[];
}

export interface FileDesign {
  filePath: string;
  goal: string;
  packages: string[];
  dependencies: string[];
}

export async function fetchProjects(): Promise<Project[]> {
  // Mock response
  return [
    {
      id: 1,
      name: 'Test Project 1',
      description: 'Description of Test Project 1',
      requirements: 'Project 1 requirements',
      schema: 'Project 1 schema',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-02T00:00:00Z',
    },
    {
      id: 2,
      name: 'Test Project 2',
      description: 'Description of Test Project 2',
      requirements: 'Project 2 requirements',
      schema: 'Project 2 schema',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-02T00:00:00Z',
    },
    // Add more mock projects as needed...
  ];
}

export async function fetchModules(projectId: number): Promise<Module[]> {
  // Mock response
  return [
    {
      id: 1,
      projectId: projectId,
      parentId: null,
      name: 'Test Module 1',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-02T00:00:00Z',
      description: 'Module 1 Description',      // Add module description
      files: [                      // Add functional designs
        {
          filePath: '/path/to/ModuleDepndency1.tsx',
          goal: 'Provide utility functions for interacting with the backend API to fetch, create, update, and delete projects and modules.',
          packages: ['Package 1', 'Package 2'],
          dependencies: ['/path/to/dependency'],
        },
        {
          filePath: '/path/to/ModuleDepndency2.tsx',
          goal: 'Provide utility functions for interacting with the backend API to fetch, create, update, and delete projects and modules.',
          packages: ['Package 1', 'Package 2'],
          dependencies: ['/path/to/dependency'],
        },
      ],
    },
    // Add more mock modules as needed...
  ];
}

export async function createProject(name: string, requirements: string, schema: string): Promise<Project> {
  // Mock response
  return {
    id: Math.floor(Math.random() * 1000), // Generate a random id for demo
    name: name,
    description: "Description of " + name,
    requirements: requirements,
    schema: schema,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export async function createModule(projectId: number, parentId: number | null, name: string, description: string): Promise<Module> {
  // Mock response
  return {
    id: Math.floor(Math.random() * 1000), // Generate a random id for demo
    projectId: projectId,
    parentId: parentId,
    name: name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    description: description,
    files: [],
  };
}

export async function updateModule(projectId: number, moduleId: number, name: string, description: string, files: FileDesign[]): Promise<Module> {
  // Mock response
  return {
    id: moduleId,
    projectId: projectId, // use a fixed projectId for the mock
    parentId: null, // Modify as per requirement
    name: name,
    description: description,
    files: files,
    createdAt: '2023-01-01T00:00:00Z', // Modify as per requirement
    updatedAt: new Date().toISOString(),
  };
}

export async function deleteModule(projectId: number, moduleId: number): Promise<void> {
  // No mock response needed for delete operations
  return;
}
