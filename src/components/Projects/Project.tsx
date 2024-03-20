// ProjectDetails.tsx
import React, { useState, ReactElement, useCallback, useMemo } from 'react';
import TopBar from './TopBar';
import { checkGitSync, updateProjectSpecs } from '@/apis';
import GitDiffReview from './GitSync/ReviewGitDiff';
import useScrollToBottom from '@/hooks/useScrollToBottom';
import { useSelected } from '@/hooks/useSelectedContext';
import { MdOutlineSubject } from 'react-icons/md';
import TextEditor from '../modals/TextEditor';
import * as yaml from 'js-yaml';
// MdOutlineLogoDev
// MdDescription
// MdHomeFilled

interface ApiSchemaProps {
  schemaData: any; // Replace 'any' with your schema data type
}

const ApiSchema: React.FC<ApiSchemaProps> = ({ schemaData }) => {
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
  const { refreshCurrentProject } = useSelected();
  const [gitReview, setReview] = useState<ReactElement | null>(null)
  const [editorOpen, setEditorOpen] = useState(false);
  const refreshFiles = useCallback(async () => {
    const res = await checkGitSync(projectId);
    if (!res.synced && res.files)
      setReview(
        <GitDiffReview changes={res.files} setElement={setReview} />
      );
  }, [projectId])
  const bottomRef = useScrollToBottom(gitReview);

  const saveProjectSpecs = async (content: string) => {
    await updateProjectSpecs(projectId, content);
    refreshCurrentProject();
  }

  const projectSpecs = useMemo(() => {
    return yaml.dump({ projectName, description, requirements })
  }, [projectName, description, requirements])

  // useEffect(() => {
  //   refreshFiles();
  // }, [refreshFiles])

  return (
    <>
      <TextEditor isOpen={editorOpen} initialContent={projectSpecs} handleSave={saveProjectSpecs} onClose={() => setEditorOpen(false)} />
      <TopBar syncProject={refreshFiles} />
      <div className="flex flex-col px-6 pb-8 text-gray-700">
        <div className="flex justify-between items-center">
          <h1 className='text-3xl font-medium pb-2'>
            {projectName}
          </h1>
          <button type="button" className="hover:text-indigo-700 text-xl" onClick={() => setEditorOpen(true)}>
            <MdOutlineSubject />
          </button>
        </div>

        <p>{description}</p>
        {/* refresh button */}
        <h2 className='text-xl font-medium pt-4 pb-2'>Requirements:</h2>
        <ul className='pl-2'>
          {requirements.map((req: string) => (
            <li className='pb-1' key={req}> - {req}</li>
          ))}
        </ul>
        {gitReview}
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
