import React, { useEffect, useMemo, useRef, useState } from 'react';
import Modal from '../../../modals/Modal';
import { useSelected } from '@/hooks/useSelectedContext';
import { ElementDesign, getSourceCode, updateSource } from '@/apis';
import DynamicForm, { ElementTypeMapping } from '@/components/modals/DynamicForm';
import { MdSave } from 'react-icons/md';

interface FileInfoModalProps {
  onClose: () => void;
  fileIdOrName?: number | null | string;
  onContentChange?: (key: string, value: string) => void;
}

const elementTypes: ElementTypeMapping = {
  name: { type: 'textfield' },
  goal: { type: 'textarea' },
  // content: { type: 'editor', langType: 'html' },
};

const FileInfoModal: React.FC<FileInfoModalProps> = ({ onClose, fileIdOrName, onContentChange }) => {
  const { selectedProjectId } = useSelected();
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
    }
  }, [file]);

  const onCloseModal = () => {
    setTimeout(() => {
      setFile(undefined);
      orgFile.current = null;
    }, 300);
    onClose();
  };

  const handleContentChange = (key: string, value: string) => {
    setFile((prevFile) => (prevFile ? { ...prevFile, [key]: value } : undefined));
    onContentChange && onContentChange(key, value);
  };

  const Buttons = useMemo(() => {
    const buttons: JSX.Element[] = [];
    if (!selectedProjectId || !file?.id || saved) return buttons;
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
  }, [selectedProjectId, file, saved]);

  return (
    <Modal isOpen={fileIdOrName != null} onClose={onCloseModal} title={file?.name || 'Info Edit'} MoreButtons={Buttons}>
      <DynamicForm
        formData={{ name: file?.name, goal: file?.goal }}
        elementTypes={elementTypes}
        onContentChange={handleContentChange as any}
      />
    </Modal>
  );
};

export default FileInfoModal;