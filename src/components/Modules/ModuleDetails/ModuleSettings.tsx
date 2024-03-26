import React, { useMemo, useState } from 'react';
import { Menu } from '@headlessui/react';
import { MdOutlineSubject } from 'react-icons/md'; // MdDriveFileMove
import Dropdown from '../../general/Dropdown';
import { contextMenuItemStyles, contextMenuStyles } from '@/utils/tailwindStyles';
import { useSelected } from '@/hooks/useSelectedContext';
import { ModuleHierarchy, deleteModule, updateModuleSpecs } from '@/apis';
import * as yaml from 'js-yaml';
import ContentEditorModal from '@/components/modals/ContentEditorModal';

interface ModuleSettingsModalProps {
  moduleDetails: ModuleHierarchy;
  canBuild?: "warning" | true | false | null;
  moduleBuild: (name: string, id: number, type: 'module' | 'code') => void;
}

export const ModuleSettingsModal: React.FC<ModuleSettingsModalProps> = ({ moduleDetails, canBuild, moduleBuild }) => {
  const { selectedProjectId, refreshCurrentProject } = useSelected();

  const [moduleEditorOpen, setModuleEditorOpen] = useState(false);

  const saveModuleSpecs = async ({ content }: any) => {
    console.log(content);
    await updateModuleSpecs(selectedProjectId!, moduleDetails.id, content);
    refreshCurrentProject();
  }

  const moduleSpecs = useMemo(() => {
    if (!moduleDetails) return null;
    const { name, description, functionalRequirements } = moduleDetails;
    return yaml.dump({ name, description, functionalRequirements })
  }, [moduleDetails]);

  const makeGuidelines = async () => {
    if (moduleDetails && window.confirm('Are you sure to create guidelines for this module?'))
      moduleBuild(moduleDetails.name, moduleDetails.id, 'module');
  }

  const implementFiles = async () => {
    if (moduleDetails && window.confirm('Are you sure to implement files for this module?'))
      moduleBuild(moduleDetails.name, moduleDetails.id, 'code');
  }

  return (
    <>
      <Menu as="div" className="relative mb-2">
        <Menu.Button as="button" className="hover:text-indigo-700 text-xl" disabled={!canBuild}>
          <MdOutlineSubject size={20} />
        </Menu.Button>
        <Dropdown>
          <Menu.Items className={`${contextMenuStyles} min-w-[160px]`}>
            <Menu.Item>
              <button
                className={contextMenuItemStyles}
                onClick={() => setModuleEditorOpen(true)}
              >
                Edit Requirements
              </button>
            </Menu.Item>
            <Menu.Item>
              <button
                className={contextMenuItemStyles}
                onClick={makeGuidelines}
              >
                Create Guidelines
              </button>
            </Menu.Item>
            <Menu.Item>
              <button
                className={contextMenuItemStyles}
                onClick={implementFiles}
              >
                Implement Files
              </button>
            </Menu.Item>
            <Menu.Item>
              <button
                className={`${contextMenuItemStyles} text-red-500`}
                onClick={() => {
                  if (window.confirm('Are you sure to delete this module?')) {
                    deleteModule(selectedProjectId!, moduleDetails.id)
                    refreshCurrentProject();
                  }
                }}
              >
                Delete
              </button>
            </Menu.Item>
          </Menu.Items>
        </Dropdown>
      </Menu>
      <ContentEditorModal
        name={moduleDetails.name}
        initialContent={moduleSpecs}
        saveContent={saveModuleSpecs}
        onClose={() => setModuleEditorOpen(false)}
        isOpen={moduleEditorOpen}
      />
    </>
  );
};

export default ModuleSettingsModal;
