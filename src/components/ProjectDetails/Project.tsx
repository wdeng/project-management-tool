// ProjectDetails.tsx
import React from 'react';
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
  projectData: any; // Replace 'any' with your project data type
}

export const ProjectDetails: React.FC<IProjectDetailsProps> = ({ projectData }) => {
  return (
    <div className="flex flex-col">
      <h1>{projectData.projectName}</h1>
      <p>{projectData.description}</p>
      <h2>Languages:</h2>
      <ul>
        {projectData.languages.map((lang: string) => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>
      <h2>Requirements:</h2>
      <ul>
        {projectData.requirements.map((req: string) => (
          <li key={req}>{req}</li>
        ))}
      </ul>
      <h2>Modules:</h2>
      {projectData.modules.map((mod: any, index: number) => ( // Replace 'any' with your module data type
        <Module key={index} moduleData={mod} />
      ))}
      <h2>Project Schema:</h2>
      {projectData.projectSchema.map((schema: any, index: number) => ( // Replace 'any' with your schema data type
        <ApiSchema key={index} schemaData={schema} />
      ))}
    </div>
  );
};

export default ProjectDetails;
