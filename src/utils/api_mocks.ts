export interface Project {
  id: number;
  name: string;
  description: string;
  requirements: string;
  schema?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Module {
  id: number;
  projectId: number;
  tabLevel?: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  files: FileDesign[];
  modules?: Module[];
}

export interface FileDesign {
  id?: number;
  filePath: string;
  goal: string;
}

export async function fetchProjects(): Promise<Project[]> {
  // Mock response
  return [
    {
      id: 1,
      name: 'Test Project 1',
      description: 'Description of Test Project 1',
      requirements: 'Project 1 requirements',
      schema: '',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-02T00:00:00Z',
    },
    {
      id: 2,
      name: 'Test Project 2',
      description: 'Description of Test Project 2',
      requirements: 'Project 2 requirements',
      schema: '',
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
      id: 11,
      projectId: projectId,
      tabLevel: 0,
      name: 'Test Module 1',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-02T00:00:00Z',
      description: 'Module 1 Description',      // Add module description
      files: [                      // Add functional designs
        {
          filePath: '/path/to1/ModuleFiles1.tsx',
          goal: 'Provide utility functions for interacting with the backend API to fetch, create, update, and delete projects and modules.',
        },
        {
          filePath: '/path/to2/ModuleFiles2.tsx',
          goal: 'Provide utility functions for interacting with the backend API to fetch, create, update, and delete projects and modules.',
        },
        {
          filePath: '/path/to3/ModuleFiles21.tsx',
          goal: 'Provide utility functions for interacting with the backend API to fetch, create, update, and delete projects and modules.',
        },
      ],
      modules: [                    // Add submodules
        {
          id: 42,
          projectId: projectId,
          tabLevel: 1,
          name: 'Test Module 4',
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-02T00:00:00Z',
          description: 'Module 1 Description',      // Add module description
          files: [
            {
              filePath: '/path4/to/ModuleFiles1.tsx',
              goal: 'Provide utility functions for interacting with the backend API to fetch, create, update, and delete projects and modules.',
            },
            {
              filePath: '/path5/to/ModuleFiles2.tsx',
              goal: 'Provide utility functions for interacting with the backend API to fetch, create, update, and delete projects and modules.',
            }, {
              filePath: '/path6/to/ModuleFiles21.tsx',
              goal: 'Provide utility functions for interacting with the backend API to fetch, create, update, and delete projects and modules.',
            }
          ],
          modules: [
            {
              id: 53,
              projectId: projectId,
              tabLevel: 2,
              name: 'Test Module 5',
              createdAt: '2023-01-01T00:00:00Z',
              updatedAt: '2023-01-02T00:00:00Z',
              description: 'Module 1 Description',      // Add module description
              files: [
                {
                  filePath: '/path/to7/ModuleFiles1.tsx',
                  goal: 'Provide utility functions for interacting with the backend API to fetch, create, update, and delete projects and modules.',
                },
                {
                  filePath: '/path/to8/ModuleFiles2.tsx',
                  goal: 'Provide utility functions for interacting with the backend API to fetch, create, update, and delete projects and modules.',
                }
              ],
            },
          ],
        },
      ],
    },
    {
      id: 24,
      projectId: projectId,
      tabLevel: 0,
      name: 'Test Module 2',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-02T00:00:00Z',
      description: 'Module 1 Description',      // Add module description
      files: [                      // Add functional designs
        {
          filePath: '/path/to/1ModuleFiles1.tsx',
          goal: 'Provide utility functions for interacting with the backend API to fetch, create, update, and delete projects and modules.',
        },
        {
          filePath: '/path/to/2ModuleFiles2.tsx',
          goal: 'Provide utility functions for interacting with the backend API to fetch, create, update, and delete projects and modules.',
        },
        {
          filePath: '/path/to/3ModuleFiles3.tsx',
          goal: 'Provide utility functions for interacting with the backend API to fetch, create, update, and delete projects and modules.',
        },
        {
          filePath: '/path/to/4ModuleFiles4.tsx',
          goal: 'Provide utility functions for interacting with the backend API to fetch, create, update, and delete projects and modules.',
        }
      ],
    },
    {
      id: 35,
      projectId: projectId,
      tabLevel: 0,
      name: 'Test Module 3',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-02T00:00:00Z',
      description: 'Module 1 Description',      // Add module description
      files: [                      // Add functional designs
        {
          filePath: '/path/to/ModuleFiles1.tsx',
          goal: 'Provide utility functions for interacting with the backend API to fetch, create, update, and delete projects and modules.',
        },
        {
          filePath: '/path/to/ModuleFiles2.tsx',
          goal: 'Provide utility functions for interacting with the backend API to fetch, create, update, and delete projects and modules.',
        },
        {
          filePath: '/path/to/ModuleFiles123.tsx',
          goal: 'Provide utility functions for interacting with the backend API to fetch, create, update, and delete projects and modules.',
        },
        {
          filePath: '/path/to/ModuleFiles3.tsx',
          goal: 'Provide utility functions for interacting with the backend API to fetch, create, update, and delete projects and modules.',
        },
        {
          filePath: '/path/to/ModuleFiles5.tsx',
          goal: 'Provide utility functions for interacting with the backend API to fetch, create, update, and delete projects and modules.',
        },
        {
          filePath: '/path/to/ModuleFiles7.tsx',
          goal: 'Provide utility functions for interacting with the backend API to fetch, create, update, and delete projects and modules.',
        },
        {
          filePath: '/path/to/ModuleFiles11.tsx',
          goal: 'Provide utility functions for interacting with the backend API to fetch, create, update, and delete projects and modules.',
        }, {
          filePath: '/path/to/ModuleFiles12.tsx',
          goal: 'Provide utility functions for interacting with the backend API to fetch, create, update, and delete projects and modules.',
        }, {
          filePath: '/path/to/ModuleFiles23.tsx',
          goal: 'Provide utility functions for interacting with the backend API to fetch, create, update, and delete projects and modules.',
        }, {
          filePath: '/path/to/ModuleFiles45.tsx',
          goal: 'Provide utility functions for interacting with the backend API to fetch, create, update, and delete projects and modules.',
        },
      ]
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

export async function createModule(projectId: number, name: string, description: string): Promise<Module> {
  // Mock response
  return {
    id: Math.floor(Math.random() * 1000), // Generate a random id for demo
    projectId: projectId,
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
