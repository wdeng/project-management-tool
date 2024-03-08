import React from 'react';
import { RefineResource, REFINE_RESOURCES } from '@/utils/apis/chatRefine';
import ToggleSwitch from '../general/ToggleSwitch';
import DisclosurePanel from '../general/Disclosure';
import { ModuleHierarchy } from '@/utils/apis';
import { useSelected } from '@/hooks/useSelectedContext';

interface ResourcesSelectorProps {
  moduleIdPath: number[];
  resourcesEnabled: RefineResource[];
  setResourcesEnabled: React.Dispatch<React.SetStateAction<RefineResource[]>>;
  selectedCheckboxOptions: number[];
  setSelectedCheckboxOptions: React.Dispatch<React.SetStateAction<number[]>>;
}

const ResourcesSelector: React.FC<ResourcesSelectorProps> = ({
  resourcesEnabled,
  setResourcesEnabled,
  moduleIdPath,
  selectedCheckboxOptions,
  setSelectedCheckboxOptions,
}) => {
  const { projectModules } = useSelected();
  const handleCheckboxChange = (option: number) => {
    setSelectedCheckboxOptions((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  };

  return (
    <>
      <h2 className="font-semibold text-2xl mb-5">Select the resources to expose:</h2>
      <div className="mb-4 bg-white px-6 py-3 rounded-lg drop-shadow-sm">
        {Object.entries(REFINE_RESOURCES).map(([resource, label], index) => (
          <div key={resource}>
            {index ? <hr className='border-gray-300 my-3 mr-[-1.5rem]' /> : null}
            <ToggleSwitch
              enabled={resourcesEnabled.includes(resource as RefineResource)}
              setEnabled={(newState) => {
                setResourcesEnabled(prevState =>
                  newState ? [...prevState, resource as RefineResource] : prevState.filter(res => res !== resource)
                );
              }}
              label={label}
            />
          </div>
        ))}
      </div>

      <p>Project Modules:</p>
      <div className="mt-6">
        {projectModules && projectModules.map((m) => (
          <DisclosurePanel
            key={m.id}
            isInitOpen={moduleIdPath[0] === m.id}
            aModule={m}
            handleCheckboxChange={handleCheckboxChange}
            selectedCheckboxOptions={selectedCheckboxOptions}
            moduleIdPath={moduleIdPath.slice(1)}
          />
        ))}
      </div>
    </>
  );
};

export default ResourcesSelector;
