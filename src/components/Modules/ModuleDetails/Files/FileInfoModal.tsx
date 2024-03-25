import React, { useEffect, useMemo, useRef, useState } from 'react';
import Modal from '../../../modals/Modal';
import { useSelected } from '@/hooks/useSelectedContext';
import { ElementDesign, deleteFile, getSourceCode, updateSource } from '@/apis';
import DynamicForm, { ElementTypeMapping } from '@/components/modals/DynamicForm';
import { MdSave, MdDelete } from 'react-icons/md';
import { GeneralData } from '@/utils/types';

interface FileInfoModalProps {
  onClose: () => void;
  fileIdOrName?: number | null | string;
  onContentChange?: (value: GeneralData) => void;
}

const elementTypes: ElementTypeMapping = {
  name: { type: 'textfield' },
  goal: { type: 'textarea' },
};

const FileInfoModal: React.FC<FileInfoModalProps> = ({ onClose, fileIdOrName, onContentChange }) => {
  const { selectedProjectId, refreshCurrentProject } = useSelected();
  const [file, setFile] = useState<ElementDesign | undefined>(undefined);
  const orgFile = useRef<ElementDesign | null>(null);
  const [saved, setSaved] = useState(true);

  useEffect(() => {
    if (fileIdOrName != null && selectedProjectId) {
      getSourceCode(selectedProjectId, fileIdOrName)
        .then((file) => {
          setFile(file);
          orgFile.current = { ...file };
          setSaved(true);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [selectedProjectId, fileIdOrName]);

  useEffect(() => {
    if (file?.name !== orgFile.current?.name || file?.goal !== orgFile.current?.goal) {
      setSaved(false);
    } else {
      setSaved(true);
    }
  }, [file]);

  const onCloseModal = () => {
    setTimeout(() => {
      setFile(undefined);
      orgFile.current = null;
    }, 300);
    onClose();
  };

  const handleContentChange = (value: GeneralData) => {
    setFile((prevFile) => (prevFile ? { ...prevFile, ...value } : undefined));
    onContentChange && onContentChange(value);
  };

  const Buttons = useMemo(() => {
    if (!selectedProjectId || !file?.id) return [];
    const buttons: JSX.Element[] = [(
      <button key="delete" onClick={() => {
        if (window.confirm('Are you sure you want to delete this file?')) {
          deleteFile(selectedProjectId, file.id);
          refreshCurrentProject();
          onClose();
        }
      }}>
        <MdDelete />
      </button>
    )];
    if (saved) return buttons;
    const saveFile = () => {
      if (selectedProjectId && file?.id) {
        updateSource(selectedProjectId, { id: file.id, name: file.name, goal: file.goal });
        orgFile.current = { ...file };
        setSaved(true);
      }
    };

    buttons.push(
      <button key="save" onClick={saveFile}>
        <MdSave />
      </button>
    );
    return buttons;
  }, [selectedProjectId, file, saved, onClose, refreshCurrentProject]);

  return (
    <Modal isOpen={fileIdOrName != null} onClose={onCloseModal} title={file?.name || 'Info Edit'} MoreButtons={Buttons}>
      <DynamicForm
        formData={{ name: file?.name, goal: file?.goal }}
        elementTypes={elementTypes}
        onContentChange={handleContentChange}
      />
    </Modal>
  );
};

export default FileInfoModal;