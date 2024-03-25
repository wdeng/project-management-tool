import React, { useEffect, useMemo, useState } from 'react';
import Modal from './Modal';
import ContentEditor from './ContentEditor';
import { MdSave, MdRestore } from 'react-icons/md';
import { getExt, languageMap } from '@/utils';
import ComplexChat from '../general/ChatFields/ComplexChat';
import { ChatInputType } from '@/apis';

interface ContentEditorModalProps {
  onClose: () => void;
  isOpen: boolean;
  name?: string;
  content: string | null;
  original?: string;
  saveContent: (data: { content: string, original?: string }) => void;
  showSaveButtons?: boolean;
  contentType?: string;
  allowChat?: boolean;
}

const ContentEditorModal: React.FC<ContentEditorModalProps> = ({ onClose, isOpen, content, saveContent, original, showSaveButtons = true, name, allowChat = true }) => {
  const [_content, setContent] = useState<string>(content || "");

  useEffect(() => {
    isOpen && setContent(prev => prev !== content ? content || "" : prev);
  }, [content, isOpen]);

  const onCloseModal = () => {
    setTimeout(() => {
      setContent("");
    }, 300);
    onClose();
  }

  const handleContentChange = (value: string | undefined) => {
    setContent(value || "");
    if (!showSaveButtons) {
      saveContent({ content: value || "", original });
    }
  };

  const save = useMemo(() => {
    if (showSaveButtons && content !== _content && saveContent)
      return (
        <button key="save" onClick={() => saveContent({ content: _content, original })}>
          <MdSave />
        </button>
      )
  }, [_content, content, saveContent, original, showSaveButtons])

  const reset = useMemo(() => {
    if (original && saveContent)
      return (
        <button key="reset" onClick={() => saveContent({ content: original })}>
          <MdRestore />
        </button>
      )
  }, [original, saveContent])

  const Chat = useMemo(() => {
    if (allowChat)
      return (
        <ComplexChat onSend={async (chat: ChatInputType) => { }}
        />
      )
  }, [allowChat])

  return (
    <Modal isOpen={isOpen} onClose={onCloseModal} title={name || "Edit Text"} MoreButtons={[reset, save]} FieldBelow={Chat}>
      <ContentEditor
        editorHeight='81vh'
        langType={languageMap[getExt(name)] || getExt(name) || "yaml"}
        content={_content}
        original={original}
        handleContentChange={handleContentChange}
      />
    </Modal>
  );
};

export default ContentEditorModal;