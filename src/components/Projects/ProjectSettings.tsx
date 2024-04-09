import React, { useMemo, useState } from 'react';
import { Menu } from '@headlessui/react';
import { MdOutlineSubject } from 'react-icons/md';
import { contextMenuItemStyles, contextMenuStyles } from '@/utils/tailwindStyles';
import { useSelected } from '@/hooks/useSelectedContext';
import { ChatInputType, deleteProject, smartUpdateSchema, updateProjectSpecs } from '@/apis';
import * as yaml from 'js-yaml';
import Dropdown from '../general/Dropdown';
import ContentEditorModal from '../modals/ContentEditorModal';
import ComplexChat from '../general/ChatFields/ComplexChat';
import ProjectInfoModal from './ProjectInfoModal';

interface SettingsModalProps {
  canBuild?: true | false | null;
  projectSpecs: any; // Replace 'any' with your schema data type
  projectSchema: any; // Replace 'any' with your schema data type
}

export const ProjectSettingsModal: React.FC<SettingsModalProps> = ({ canBuild, projectSpecs, projectSchema }) => {
  const { selectedProjectId, refreshCurrentProject } = useSelected();

  const [editorOpen, setEditorOpen] = useState<string>('');
  const [editorContent, setEditorContent] = useState('');
  const [editorOriginal, setEditorOriginal] = useState<string | undefined>();

  const saveContent = async ({ content }: any) => {
    await updateProjectSpecs(selectedProjectId!, content, 'schema');
    setEditorContent(content);
    setEditorOriginal(undefined)
    refreshCurrentProject();
  }

  const projectSchemaString = useMemo(() => {
    if (!projectSchema) return null;
    return yaml.dump(projectSchema);
  }, [projectSchema]);

  const openEditor = (kind: 'specs' | 'schema') => {
    if (kind === 'schema')
      setEditorContent(projectSchemaString || '');
    setEditorOpen(kind);
  }

  const closeEditor = () => {
    setEditorOpen('');
    setEditorContent('');
    setEditorOriginal(undefined);
  }

  const Chat = useMemo(() => {
    return (
      <ComplexChat
        onSend={async (chat: ChatInputType, resourcesEnabled: any, selectedCheckboxOptions: number[]) => {
          const element = await smartUpdateSchema(
            selectedProjectId!,
            { id: -1, name: "Data Schema", content: editorContent },
            chat,
            selectedCheckboxOptions);
          setEditorOriginal(editorContent);
          setEditorContent(element.content || '');
        }}
        resourcesAvailable={[]}
      />
    );
  }, [editorContent, selectedProjectId]);

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
                onClick={() => openEditor('specs')}
              >
                Edit Requirements
              </button>
            </Menu.Item>
            <Menu.Item>
              <button
                className={contextMenuItemStyles}
                onClick={() => openEditor('schema')}
              >
                Edit Data Schema
              </button>
            </Menu.Item>
            <Menu.Item>
              <button
                className={`${contextMenuItemStyles} text-red-500`}
                onClick={() => window.confirm('Are you sure to delete this project?') && deleteProject(selectedProjectId!)}
              >
                Delete
              </button>
            </Menu.Item>
          </Menu.Items>
        </Dropdown>
      </Menu>
      <ContentEditorModal
        name={projectSpecs.projectName}
        initialContent={editorContent}
        original={editorOriginal}
        saveContent={saveContent}
        additionalField={Chat}
        onClose={closeEditor}
        isOpen={editorOpen === 'schema'}
      />
      <ProjectInfoModal
        isOpen={editorOpen === 'specs'}
        onClose={closeEditor}
      />
    </>
  );
};

export default ProjectSettingsModal;