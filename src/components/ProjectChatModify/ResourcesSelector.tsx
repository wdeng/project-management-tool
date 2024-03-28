import React from 'react';
import { RefineResource, REFINE_RESOURCES } from '@/apis';
import ToggleSwitch from '../general/ToggleSwitch';
import DisclosurePanel from './ResourcesDisclosure';
import { useSelected } from '@/hooks/useSelectedContext';

interface ResourcesSelectorProps {
  resourcesEnabled: RefineResource[];
  setResourcesEnabled: React.Dispatch<React.SetStateAction<RefineResource[]>>;
  selectedCheckboxOptions: number[];
  setSelectedCheckboxOptions: React.Dispatch<React.SetStateAction<number[]>>;
  resourcesAvailable?: RefineResource[];
}

const ResourcesSelector: React.FC<ResourcesSelectorProps> = ({
  resourcesAvailable = Object.keys(REFINE_RESOURCES),
  resourcesEnabled,
  setResourcesEnabled,
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
    <div className='my-2 px-2 max-h-[50vh] overflow-y-auto'>
      <h2 className="font-semibold text-2xl mb-5">Select the resources exposed to AI:</h2>
      <div className="mb-4 bg-white px-6 py-3 rounded-lg drop-shadow-sm">
        {resourcesAvailable.map((resource, index) => (
          <div key={resource}>
            {index ? <hr className='border-gray-300 my-3 mr-[-1.5rem]' /> : null}
            <ToggleSwitch
              enabled={resourcesEnabled.includes(resource as RefineResource)}
              setEnabled={(newState) => {
                setResourcesEnabled(prevState =>
                  newState ? [...prevState, resource as RefineResource] : prevState.filter(res => res !== resource)
                );
              }}
              label={REFINE_RESOURCES[resource as RefineResource]}
            />
          </div>
        ))}
      </div>

      <h6 className="font-medium text-lg">Project Files:</h6>
      <div className="mt-4">
        {projectModules && projectModules.map((m, i) => (
          <DisclosurePanel
            key={m.id}
            isInitOpen={i === 0}
            aModule={m}
            handleCheckboxChange={handleCheckboxChange}
            selectedCheckboxOptions={selectedCheckboxOptions}
          />
        ))}
      </div>
    </div>
  );
};

export default ResourcesSelector;
