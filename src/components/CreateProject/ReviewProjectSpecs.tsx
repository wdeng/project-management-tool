import { ComponentSpecs, ProjectSpecs } from '@/utils/apis';
import React from 'react';
import ChatInput from '../general/ChatTextArea';

interface ProjectSpecsProps {
  projectSpecs: ProjectSpecs;
  setProjectSpecs: React.Dispatch<React.SetStateAction<ProjectSpecs | undefined>>;
  onSubmitIssue: (issue: string) => Promise<ProjectSpecs | void>;
}

const RecursiveComponent: React.FC<{ data: ComponentSpecs[], level?: number }> = ({ data, level=0 }) => (
  <ul className='ml-4'>
    {data.map((item, index) => (
      <li key={index}>
        {Object.entries(item).map(([key, value]) => (
          <div key={key} className='my-2'>
            <strong>{key}: </strong>
            {typeof value === 'object' && value !== null ? (
              <RecursiveComponent data={Array.isArray(value) ? value : [value]} level={level + 1} />
            ) : (
              <span>{value}</span>
            )}
          </div>
        ))}
      </li>
    ))}
  </ul>
);

export const ReviewProjectSpecs: React.FC<ProjectSpecsProps> = ({ projectSpecs, onSubmitIssue, setProjectSpecs }) => {
  // const [issue, setIssue] = React.useState('');

  const handleSubmit = async (issue: string) => {
    const newProjSpecs = await onSubmitIssue(issue);
    if (newProjSpecs)
      setProjectSpecs(newProjSpecs)
  }

  return (
    <div className='px-6 py-4'>
      <h3 className='font-semibold text-2xl py-2'>Review Project Specs</h3>
      <p className='my-2'><strong>name:</strong> {projectSpecs.name}</p>
      <p className='my-2'><strong>folder:</strong> {projectSpecs.folder}</p>
      <p className='my-2'><strong>project description:</strong> {projectSpecs.projectDescription}</p>
      <h4 className='font-bold text-lg pt-2'>Components</h4>
      <RecursiveComponent data={projectSpecs.components} />
      <div className='p-3' />
      <ChatInput onSend={handleSubmit} sendOnEmpty={true} placeholder="Your issues, leave empty if none"/>
    </div>
  );
};
