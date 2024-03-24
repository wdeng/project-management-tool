import React, { useMemo, useState } from 'react';
import { Menu } from '@headlessui/react';
import { MdOutlineSubject } from 'react-icons/md'; // MdDriveFileMove
import { contextMenuItemStyles, contextMenuStyles } from '@/utils/tailwindStyles';
import TextEditor from '@/components/modals/TextEditor';
import { useSelected } from '@/hooks/useSelectedContext';
import { deleteProject, updateProjectSpecs } from '@/apis';
import * as yaml from 'js-yaml';
import Dropdown from '../general/Dropdown';

interface SettingsModalProps {
  canBuild?: true | false | null;
  projectSpecs: any; // Replace 'any' with your schema data type
}

export const ProjectSettingsModal: React.FC<SettingsModalProps> = ({ canBuild, projectSpecs }) => {
  const { selectedProjectId, refreshCurrentProject } = useSelected();

  const [moduleEditorOpen, setModuleEditorOpen] = useState(false);

  const saveModuleSpecs = async (content: string) => {
    await updateProjectSpecs(selectedProjectId!, content);
    refreshCurrentProject();
  }

  const projectString = useMemo(() => {
    if (!projectSpecs) return null;
    const { projectName, description, requirements } = projectSpecs;
    return yaml.dump({ projectName, description, requirements })
  }, [projectSpecs]);

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
                onClick={() => { setModuleEditorOpen(true) }}
              >
                Edit Data Schema
              </button>
            </Menu.Item>
            <Menu.Item>
              <button
                className={`${contextMenuItemStyles} text-red-500`}
                onClick={() => window.confirm('Are you sure to delete this module?') && deleteProject(selectedProjectId!)}
              >
                Delete
              </button>
            </Menu.Item>
          </Menu.Items>
        </Dropdown>
      </Menu>
      <TextEditor isOpen={moduleEditorOpen} initialContent={projectString} handleSave={saveModuleSpecs} onClose={() => setModuleEditorOpen(false)} />
    </>
  );
};

export default ProjectSettingsModal;
