import React, { useEffect, useMemo, useRef, useState } from 'react';
import Modal from '../../../modals/Modal';
import { useSelected } from '@/hooks/useSelectedContext';
import { ElementDesign, deleteFile, getSourceCode, updateGuidelines, updateSource } from '@/apis';
import DynamicForm, { ElementTypeMapping } from '@/components/general/DynamicForm';
import { MdSave, MdDelete } from 'react-icons/md';
import { GeneralData } from '@/utils/types';
import yaml from 'js-yaml';
import { compareObjects } from '@/utils';

interface FileInfoModalProps {
  onClose: () => void;
  fileIdOrName?: number | null | string;
  onContentChange?: (value: GeneralData) => void;
}

const elementTypes: ElementTypeMapping = {
  name: 'textfield',
  goal: 'textfield',
  guidelines: 'textarea',
};

const FileInfoModal: React.FC<FileInfoModalProps> = ({ onClose, fileIdOrName, onContentChange }) => {
  const { selectedProjectId, refreshCurrentProject } = useSelected();
  const [file, setFile] = useState<ElementDesign | undefined>(undefined);
  const [initialFile, setInitialFile] = useState<ElementDesign | undefined>();
  const orgFile = useRef<ElementDesign | null>(null);

  useEffect(() => {
    if (fileIdOrName != null && selectedProjectId) {
      getSourceCode(selectedProjectId, fileIdOrName)
        .then((fetchedFile) => {
          orgFile.current = fetchedFile;
          let parsedFile: any = fetchedFile;
          if (fetchedFile.status === 'pending' && fetchedFile.content) {
            parsedFile = yaml.load(fetchedFile.content) as ElementDesign;
            parsedFile.guidelines = yaml.dump(parsedFile.guidelines);
          }
          setFile(parsedFile);
          setInitialFile(parsedFile);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [selectedProjectId, fileIdOrName]);

  const onCloseModal = () => {
    // setTimeout(() => {
    //   setFile(undefined);
    //   setInitialFile(undefined);
    //   orgFile.current = null;
    // }, 300);
    onClose();
  };

  const handleContentChange = (value: GeneralData) => {
    setFile((prevFile) => (prevFile ? { ...prevFile, ...value } : undefined));
    onContentChange && onContentChange(value);
  };

  const Buttons = useMemo(() => {
    if (!selectedProjectId || !file) return [];
    const buttons: JSX.Element[] = [
      <button
        key="delete"
        onClick={() => {
          if (window.confirm('Are you sure you want to delete this file?')) {
            deleteFile(selectedProjectId, file.id);
            refreshCurrentProject();
            onClose();
          }
        }}
      >
        <MdDelete />
      </button>,
    ];

    if (!compareObjects(file, initialFile as any)) {
      buttons.push(
        <button
          key="save"
          onClick={async () => {
            if (selectedProjectId && orgFile.current?.id) {
              if (orgFile.current?.status === 'pending' && file.guidelines)
                try {
                  const guidelines = yaml.load(file.guidelines);
                  const payload: any = { id: orgFile.current.id, content: yaml.dump({ ...file, guidelines }) };
                  updateGuidelines(selectedProjectId, payload);
                } catch {
                  window.alert('Content must be valid YAML list.');
                  return;
                }
              else {
                const payload = { id: orgFile.current.id, name: file.name, goal: file.goal, content: file.content };
                await updateSource(selectedProjectId, payload);
              }
              setInitialFile(file);
            }
          }}
        >
          <MdSave />
        </button>
      );
    }

    return buttons;
  }, [selectedProjectId, file, initialFile, onClose, refreshCurrentProject]);

  return (
    <Modal isOpen={fileIdOrName != null} onClose={onCloseModal} title={file?.name || 'Info Edit'} MoreButtons={Buttons}>
      <DynamicForm formData={file || {}} elementTypes={elementTypes} onContentChange={handleContentChange} />
    </Modal>
  );
};

export default FileInfoModal;