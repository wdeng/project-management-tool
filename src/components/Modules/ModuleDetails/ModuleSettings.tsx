import React, { useMemo, useState } from 'react';
import { Menu } from '@headlessui/react';
import { MdOutlineSubject } from 'react-icons/md'; // MdDriveFileMove
import Dropdown from '../../general/Dropdown';
import { contextMenuItemStyles, contextMenuStyles } from '@/utils/tailwindStyles';
import TextEditor from '@/components/modals/[deprecated]TextEditor';
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
    await updateModuleSpecs(selectedProjectId!, moduleDetails.id, content);
    refreshCurrentProject();
  }

  const moduleSpecs = useMemo(() => {
    if (!moduleDetails) return null;
    const { name, description, functionalRequirements } = moduleDetails;
    return yaml.dump({ name, description, functionalRequirements })
  }, [moduleDetails]);

  const makeGuidelines = async (ev: React.MouseEvent) => {
    ev.preventDefault();
    if (moduleDetails)
      moduleBuild(moduleDetails.name, moduleDetails.id, 'module');
  }

  const implementFiles = async (ev: React.MouseEvent) => {
    ev.preventDefault();
    if (moduleDetails)
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
                onClick={() => window.confirm('Are you sure to delete this module?') && deleteModule(selectedProjectId!, moduleDetails.id)}
              >
                Delete
              </button>
            </Menu.Item>
          </Menu.Items>
        </Dropdown>
      </Menu>
      {/* <TextEditor isOpen={moduleEditorOpen} initialContent={moduleSpecs} handleSave={saveModuleSpecs} onClose={() => setModuleEditorOpen(false)} /> */}
      <ContentEditorModal
        name={moduleDetails.name}
        content={moduleSpecs}
        saveContent={saveModuleSpecs}
        onClose={() => setModuleEditorOpen(false)}
        isOpen={moduleEditorOpen}
        showSaveButtons={true}
      />
    </>
  );
};

export default ModuleSettingsModal;
