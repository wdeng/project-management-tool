import React from 'react';

interface ProjectSpecsProps {
  projectSpecs: ProjectSpecs;
  onSubmitIssue: (issue: string) => Promise<void>;
}

interface ProjectSpecs {
  name: string;
  folder: string;
  projectDescription: string;
  components: Record<string, any>[];
}

const RecursiveComponent: React.FC<{ data: Record<string, any>[] }> = ({ data }) => (
  <ul>
    {data.map((item, index) => (
      <li key={index}>
        {Object.entries(item).map(([key, value]) => (
          <div key={key}>
            <strong>{key}: </strong>
            {typeof value === 'object' && value !== null ? (
              <RecursiveComponent data={Array.isArray(value) ? value : [value]} />
            ) : (
              <span>{value}</span>
            )}
          </div>
        ))}
      </li>
    ))}
  </ul>
);

export const ReviewProjectSpecs: React.FC<ProjectSpecsProps> = ({ projectSpecs, onSubmitIssue }) => {
  const [issue, setIssue] = React.useState('');

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if(issue !== '') {
      await onSubmitIssue(issue);
    }
  }

  return (
    <div>
      <h3>Review Project Specs</h3>
      <p>Name: {projectSpecs.name}</p>
      <p>Folder: {projectSpecs.folder}</p>
      <p>Project Description: {projectSpecs.projectDescription}</p>
      <h4>Components</h4>
      <RecursiveComponent data={projectSpecs.components} />
      <textarea onChange={(e) => setIssue(e.target.value)} placeholder="Submit an issue..."/>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};
