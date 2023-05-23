2023-05-20 21:02:21
Step 1: **Environment Setup**

Here's a bash shell script to set up the environment on an Ubuntu system:

```bash
#!/bin/bash

# Update system
sudo apt update
sudo apt upgrade -y

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Yarn
npm install --global yarn

# Install Next.js, Tailwind CSS, and Headless UI
yarn create next-app project-name
cd project-name
yarn add tailwindcss@latest postcss@latest autoprefixer@latest
yarn add @headlessui/react

# Initialize Tailwind CSS
npx tailwindcss init -p

# Create necessary directories and files
mkdir -p src/components src/pages src/utils
touch src/components/ProjectList.tsx src/components/ModuleList.tsx src/components/ModuleDetails.tsx src/pages/index.tsx src/utils/api.ts
```

Step 2: **Project Outline**

```yaml
projectName: Project Management Tool
description: A responsive, single-page web application for managing software projects and their configuration files using TypeScript, Next, Tailwind, and Headless UI.
devLanguage: typescript
testFramework: jest
modules:
  - name: ProjectList
    description: Displays a list of projects in the left column.
    functionalBlocks:
      - "Fetch projects from the backend API"
      - "Display projects in a scrollable list"
      - "Allow users to select a project"
      - "Trigger the display of modules for the selected project"
    sourceFilePaths: [src/components/ProjectList.tsx]
  - name: ModuleList
    description: Displays a list of modules for the selected project in the middle column.
    functionalBlocks:
      - "Fetch modules from the backend API based on the selected project"
      - "Display modules in a scrollable list with a nested hierarchy"
      - "Allow users to select a module"
      - "Trigger the display of module details for the selected module"
    sourceFilePaths: [src/components/ModuleList.tsx]
  - name: ModuleDetails
    description: Displays and allows editing of the selected module's details in the right column.
    functionalBlocks:
      - "Fetch module details from the backend API based on the selected module"
      - "Display module details in a form"
      - "Allow users to edit module details"
      - "Save updated module details to the backend API"
    sourceFilePaths: [src/components/ModuleDetails.tsx]
  - name: APIUtils
    description: Utility functions for interacting with the backend API.
    functionalBlocks:
      - "Fetch projects and modules from the backend API"
      - "Create, update, and delete projects and modules"
    sourceFilePaths: [src/utils/api.ts]
```

Step 3: **Project Schema**

```yaml
projectSchema:
  - name: projects
    description: Table containing information about each project.
    fields: [id, name, createdAt, updatedAt]
  - name: modules
    description: Table containing information about each module within a project.
    fields: [id, projectId, parentId, name, details, createdAt, updatedAt]
  - name: "/projects"
    description: API endpoint for fetching and creating projects.
    methods:
      - GET:
          output: [id, name, createdAt, updatedAt]
      - POST:
          input: [name]
          output: [id, name, createdAt, updatedAt]
  - name: "/projects/{projectId}"
    description: API endpoint for fetching a specific project.
    methods:
      - GET:
          output: [id, name, createdAt, updatedAt]
  - name: "/projects/{projectId}/modules"
    description: API endpoint for fetching and creating modules within a project.
    methods:
      - GET:
          output: [id, projectId, parentId, name, details, createdAt, updatedAt]
      - POST:
          input: [parentId, name, details]
          output: [id, projectId, parentId, name, details, createdAt, updatedAt]
  - name: "/projects/{projectId}/modules/{moduleId}"
    description: API endpoint for fetching, updating, and deleting a specific module within a project.
    methods:
      - GET:
          output: [id, projectId, parentId, name, details, createdAt, updatedAt]
      - PUT:
          input: [name, details]
          output: [id, projectId, parentId, name, details, createdAt, updatedAt]
      - DELETE:
          output: [id, projectId, parentId, name, details, createdAt, updatedAt]
  - name: "/logs/{logId}"
    description: API endpoint for fetching a specific log.
    methods:
      - GET:
          output: [id, logData, createdAt, updatedAt]
```

Step 4: **Project Directory Tree**

```yaml
directoryTree:
  - dirname: src
    subdir:
      - dirname: components
        files: [ProjectList.tsx, ModuleList.tsx, ModuleDetails.tsx]
      - dirname: pages
        files: [index.tsx]
      - dirname: utils
        files: [api.ts]
```

Step 5: **Module Development Sequence**

```yaml
moduleDevSequence:
  step1: APIUtils
  step2: ProjectList
  step3: ModuleList
  step4: ModuleDetails
```
* * *
