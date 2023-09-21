// ProjectDetails.tsx
import React, { useState } from 'react';
import ChangesReviewPanel from '../ProjectChatModify/ModificationPanel';
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
  projectName: string;
  description: string;
  requirements: string[];
  modules: any[]; // Replace 'any' with your module data type
  projectSchema?: any; // Replace 'any' with your schema data type
}

export const ProjectDetails: React.FC<IProjectDetailsProps> = ({ projectName, description, requirements, modules, projectSchema }) => {

  const [changes, setChanges] = useState([])

  return (
    <div className="flex flex-col">
      <h1>{projectName}</h1>
      <p>{description}</p>
      {/* refresh button */}
      <h2>Requirements:</h2>
      <ul>
        {requirements.map((req: string) => (
          <li key={req}>{req}</li>
        ))}
      </ul>

      {/* {changes && <ChangesReviewPanel changes={changes} reset={()=> {}} />} */}
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
  );
};

export default ProjectDetails;
