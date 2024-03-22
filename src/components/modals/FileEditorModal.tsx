import React, { useEffect, useMemo, useRef, useState } from 'react';
import Modal from './Modal';
import { useSelected } from '@/hooks/useSelectedContext';
import { FileDesign, fetchSourceCode, updateFile } from '@/apis';
import { MdSave } from 'react-icons/md';
import ComplexChat from '../general/ChatFields/ComplexChat';
import FileEditor from './FileEditor';

interface EditorModalProps {
  onClose: () => void;
  fileId?: number | null | string;
  onChange?: (value: string | undefined) => void;
  allowChat?: boolean;
}

const FileEditorModal: React.FC<EditorModalProps> = ({
  onClose, fileId, allowChat = true
}) => {
  const { selectedProjectId } = useSelected();
  const [file, setFile] = useState<FileDesign | undefined>(undefined);
  const orgFile = useRef<FileDesign | null>(null);
  const [saved, setSaved] = useState(true);

  useEffect(() => {
    if (fileId != null && selectedProjectId) {
      fetchSourceCode(selectedProjectId, fileId).then(file => {
        setFile(file);
        orgFile.current = { ...file };
        setSaved(true);
      }).catch(err => {
        console.error(err);
      });
    }
  }, [selectedProjectId, fileId]);

  useEffect(() => {
    if (file?.content !== orgFile.current?.content) {
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

  const handleContentChange = (content?: string) => {
    content = content || "";
    setFile(prev => prev ? { ...prev, content } : undefined);
  };

  const Buttons = useMemo(() => {
    const buttons: JSX.Element[] = [];
    if (!selectedProjectId || !file?.id || saved) return buttons;
    const saveFile = () => {
      if (selectedProjectId && file?.id) {
        updateFile(selectedProjectId, { fileId: file.id, content: file?.content });
        orgFile.current = { ...file };
        setSaved(true);
      }
    };

    buttons.push(<button key="save" onClick={saveFile}>
      <MdSave />
    </button>);
    return buttons;
  }, [selectedProjectId, file, saved]);

  const Chat = useMemo(() => allowChat && <ComplexChat onSend={async () => { }} />, [allowChat]);

  return (
    <Modal isOpen={fileId != null} onClose={onCloseModal} title={file?.path || "File Edit"} MoreButtons={Buttons} FieldBelow={Chat} height='h-[77vh]'>
      <FileEditor
        {...file}
        handleContentChange={handleContentChange}
      />
    </Modal>
  );
};

export default FileEditorModal;