import React, { useEffect, useMemo, useRef, useState } from 'react';
import Modal from './Modal';
import { useSelected } from '@/hooks/useSelectedContext';
import { ElementDesign, getSourceCode, updateGuidelines, updateSource } from '@/apis';
import { MdSave } from 'react-icons/md';
import ComplexChat from '../general/ChatFields/ComplexChat';
import ContentEditor from './ContentEditor';
import { getExt, languageMap } from '@/utils';

interface EditorModalProps {
  onClose: () => void;
  fileIdOrName?: number | null | string;
  allowChat?: boolean;
}

const FileEditorModal: React.FC<EditorModalProps> = ({
  onClose, fileIdOrName, allowChat = true
}) => {
  const { selectedProjectId } = useSelected();
  const [file, setFile] = useState<ElementDesign | undefined>(undefined);
  const orgFile = useRef<ElementDesign | null>(null);
  const [saved, setSaved] = useState(true);

  useEffect(() => {
    if (fileIdOrName != null && selectedProjectId) {
      getSourceCode(selectedProjectId, fileIdOrName).then(file => {
        setFile(file);
        orgFile.current = { ...file };
        setSaved(true);
      }).catch(err => {
        console.error(err);
      });
    }
  }, [selectedProjectId, fileIdOrName]);

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
        const payload = { id: file.id, content: file?.content };
        if (file?.contentType === 'guidelines')
          updateGuidelines(selectedProjectId, payload);
        else
          updateSource(selectedProjectId, payload);
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
    <Modal isOpen={fileIdOrName != null} onClose={onCloseModal} title={file?.name || "File Edit"} MoreButtons={Buttons} FieldBelow={Chat} height='h-[81vh]'>
      <ContentEditor
        {...file}
        langType={languageMap[getExt(file?.name)] || getExt(file?.name)}
        handleContentChange={handleContentChange}
      />
    </Modal>
  );
};

export default FileEditorModal;