// ProjectDetails.tsx
import React, { useState, ReactElement } from 'react';
import TopBar from './TopBar';
import { checkGitSync } from '@/utils/apis';
import GitDiffReview from './ProjectSync/ReviewGitDiff';
// MdOutlineLogoDev
// MdDescription
// MdHomeFilled
interface IModuleProps {
  moduleData: any; // Replace 'any' with your module data type
}

const Module: React.FC<IModuleProps> = ({ moduleData }) => {
  return (
    <div>
      <h3>{moduleData.name}</h3>
      <p>{moduleData.description}</p>
      {/* Add more attributes as needed */}
    </div>
  );
};

interface IApiSchemaProps {
  schemaData: any; // Replace 'any' with your schema data type
}

const ApiSchema: React.FC<IApiSchemaProps> = ({ schemaData }) => {
  return (
    <div>
      <h3>{schemaData.name}</h3>
      <p>{schemaData.description}</p>
      {/* Add more attributes as needed */}
    </div>
  );
};


interface IProjectDetailsProps {
  projectId: number;
  projectName: string;
  description: string;
  requirements: string[];
  modules: any[]; // Replace 'any' with your module data type
  projectSchema?: any; // Replace 'any' with your schema data type
}

export const ProjectDetails: React.FC<IProjectDetailsProps> = ({ projectId, projectName, description, requirements, modules, projectSchema }) => {
  const [reviewer, setReviewer] = useState<ReactElement | null>(null)
  const refreshFiles = async () => {
    const res = await checkGitSync(projectId);
    if (!res.synced && res.files)
      setReviewer(
        <GitDiffReview changes={res.files} setElement={setReviewer} />
      );
  }

  return (
    <>
      <TopBar refresh={refreshFiles} />
      <div className="flex flex-col px-6">

        <h1>{projectName}</h1>
        <p>{description}</p>
        {/* refresh button */}
        <h2>Requirements:</h2>
        <ul>
          {requirements.map((req: string) => (
            <li key={req}>{req}</li>
          ))}
        </ul>
        {reviewer}
        <h2>Modules:</h2>
        {modules.map((mod: any, index: number) => ( // Replace 'any' with your module data type
          <Module key={index} moduleData={mod} />
        ))}
        {projectSchema && (
          <>
            <h2>Project Schema:</h2>
            {
              projectSchema.map((schema: any, index: number) => ( // Replace 'any' with your schema data type
                <ApiSchema key={index} schemaData={schema} />
              ))
            }
          </>
        )}
      </div>
    </>

  );
};

export default ProjectDetails;
