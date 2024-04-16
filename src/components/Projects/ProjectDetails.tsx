// ProjectDetails.tsx
import React, { useState, ReactElement, useCallback, use, useEffect } from 'react';
import TopBar from './TopBar';
import { checkGitSync } from '@/apis';
import GitDiffReview from './GitSync/ReviewGitDiff';
import useScrollToBottom from '@/hooks/useScrollToBottom';
import ProjectSettingsModal from './ProjectSettings';
// MdOutlineLogoDev
// MdDescription
// MdHomeFilled

interface IProjectDetailsProps {
  projectId: number;
  projectName: string;
  description: string;
  requirements: string[];
  modules: any[]; // Replace 'any' with your module data type
  projectSchema?: any; // Replace 'any' with your schema data type
}

export const ProjectDetails: React.FC<IProjectDetailsProps> = ({ projectId, projectName, description, requirements, projectSchema }) => {
  const [gitReview, setReview] = useState<ReactElement | null>(null)
  const refreshFiles = useCallback(async () => {
    const res = await checkGitSync(projectId);
    if (!res.synced && res.files)
      setReview(
        <GitDiffReview changes={res.files} setElement={setReview} />
      );
    else
      setReview(null);
  }, [projectId])
  useEffect(() => {
    refreshFiles();
  }, [refreshFiles]);
  const bottomRef = useScrollToBottom(gitReview);

  return (
    <>
      <TopBar syncProject={refreshFiles} />
      <div className="flex flex-col px-6 pb-8 text-gray-700">
        <div className="flex justify-between items-center">
          <h1 className='text-3xl font-medium pb-2'>
            {projectName}
          </h1>
          <ProjectSettingsModal projectSpecs={{ projectName, description, requirements }} projectSchema={projectSchema} canBuild={true} />
        </div>

        <p>{description}</p>
        <h2 className='text-xl font-medium pt-4 pb-2'>Requirements:</h2>
        <ul className='pl-2'>
          {requirements.map((req: string) => (
            <li className='pb-1' key={req}> - {req}</li>
          ))}
        </ul>
        {gitReview}
      </div>
      <div ref={bottomRef} />
    </>
  );
};

export default ProjectDetails;
