// ProjectDetails.tsx
import React, { useState, ReactElement, useEffect, useCallback } from 'react';
import TopBar from './TopBar';
import { checkGitSync } from '@/utils/apis';
import GitDiffReview from './ProjectSync/ReviewGitDiff';
import useScrollToBottom from '@/hooks/useScrollToBottom';
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

export const ProjectDetails: React.FC<IProjectDetailsProps> = ({ projectId, projectName, description, requirements, projectSchema }) => {
  const [reviewer, setReviewer] = useState<ReactElement | null>(null)
  const refreshFiles = useCallback(async () => {
    console.log('refreshing', projectId)
    const res = await checkGitSync(projectId);
    if (!res.synced && res.files)
      setReviewer(
        <GitDiffReview changes={res.files} setElement={setReviewer} />
      );
  }, [projectId])
  const bottomRef = useScrollToBottom(reviewer);

  // useEffect(() => {
  //   refreshFiles();
  // }, [refreshFiles])

  return (
    <>
      <TopBar refresh={refreshFiles} />
      <div className="flex flex-col px-6 pb-8 text-gray-700 ">

        <h1 className='text-3xl font-medium pb-2'
        >{projectName}</h1>
        <p>{description}</p>
        {/* refresh button */}
        <h2 className='text-xl font-medium pt-4 pb-2'
        >Requirements:</h2>
        <ul className='pl-2'>
          {
            requirements.map((req: string) => (
              <li className='pb-1' key={req}>- {req}</li>
            ))
          }
        </ul>
        {reviewer}
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
      <div ref={bottomRef} />
    </>
  );
};

export default ProjectDetails;
