import React, { useEffect, useMemo, useState } from 'react';
import Modal from './Modal';
import ContentEditor from './ContentEditor';
import { MdSave, MdRestore } from 'react-icons/md';
import { getExt, languageMap } from '@/utils';

interface ContentEditorModalProps {
  onClose: () => void;
  isOpen: boolean;
  name?: string;
  initialContent: string | null;
  original?: string;
  saveContent: (data: { content: string }) => void;
  showSaveButtons?: boolean;
  contentType?: string;
  additionalField?: React.ReactNode;
  allowChat?: boolean;
}

const ContentEditorModal: React.FC<ContentEditorModalProps> = ({
  onClose,
  isOpen,
  initialContent,
  saveContent,
  original,
  showSaveButtons = true,
  name,
  additionalField,
}) => {
  const [_content, setContent] = useState<string>(initialContent || "");

  useEffect(() => {
    isOpen && setContent(prev => prev !== initialContent ? (initialContent || "") : prev);
  }, [initialContent, isOpen]);

  const onCloseModal = () => {
    setTimeout(() => {
      setContent("");
    }, 300);
    onClose();
  }

  const handleContentChange = (value: string | undefined) => {
    setContent(value || "");
    if (!showSaveButtons)
      saveContent({ content: value || "" });
  };

  const save = useMemo(() => {
    if (!saveContent || !showSaveButtons) return;
    if (initialContent !== _content || original)
      return (
        <button key="save" onClick={() => saveContent({ content: _content })}>
          <MdSave />
        </button>
      )
  }, [_content, initialContent, saveContent, original, showSaveButtons])

  const reset = useMemo(() => {
    if (original && saveContent)
      return (
        <button key="reset" onClick={() => saveContent({ content: original })}>
          <MdRestore />
        </button>
      )
  }, [original, saveContent])

  return (
    <Modal isOpen={isOpen} onClose={onCloseModal} title={name || "Edit Text"} MoreButtons={[reset, save]} FieldBelow={additionalField}>
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