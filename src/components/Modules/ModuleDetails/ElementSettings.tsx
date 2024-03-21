import React, { useMemo, useState } from 'react';
import { Menu } from '@headlessui/react';
import { MdOutlineSubject } from 'react-icons/md'; // MdDriveFileMove
import Dropdown from '../../general/Dropdown';
import { contextMenuItemStyles, contextMenuStyles } from '@/utils/tailwindStyles';
import TextEditor from '@/components/modals/TextEditor';
import { useSelected } from '@/hooks/useSelectedContext';
import { ModuleHierarchy, deleteModule, updateModuleSpecs } from '@/apis';
import * as yaml from 'js-yaml';

interface ElementSettingsModalProps {
  moduleDetails: ModuleHierarchy;
  canBuild?: "warning" | true | false | null;
}

export const ElementSettingsModal: React.FC<ElementSettingsModalProps> = ({ moduleDetails, canBuild }) => {
  const { selectedProjectId, refreshCurrentProject } = useSelected();

  const [moduleEditorOpen, setModuleEditorOpen] = useState(false);

  const saveModuleSpecs = async (content: string) => {
    await updateModuleSpecs(selectedProjectId!, moduleDetails.id, content);
    refreshCurrentProject();
  }

  const moduleSpecs = useMemo(() => {
    if (!moduleDetails) return null;
    const { name, description, functionalRequirements } = moduleDetails;
    return yaml.dump({ name, description, functionalRequirements })
  }, [moduleDetails]);

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
                onClick={() => setModuleEditorOpen(true)}
              >
                Create Guidelines
              </button>
            </Menu.Item>
            <Menu.Item>
              <button
                className={contextMenuItemStyles}
                onClick={() => setModuleEditorOpen(true)}
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
      <TextEditor isOpen={moduleEditorOpen} initialContent={moduleSpecs} handleSave={saveModuleSpecs} onClose={() => setModuleEditorOpen(false)} />
    </>
  );
};

export default ElementSettingsModal;
