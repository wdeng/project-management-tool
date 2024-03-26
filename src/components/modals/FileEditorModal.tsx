import React, { useEffect, useMemo, useRef, useState } from 'react';
import Modal from './Modal';
import { useSelected } from '@/hooks/useSelectedContext';
import { ChatInputType, ElementDesign, RefineResource, getSourceCode, smartUpdateFile, updateGuidelines, updateSource } from '@/apis';
import { MdRestore, MdSave } from 'react-icons/md';
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
  const [initialContent, setInitialContent] = useState<string | undefined>();

  useEffect(() => {
    if (fileIdOrName != null && selectedProjectId) {
      getSourceCode(selectedProjectId, fileIdOrName).then(file => {
        setFile(file);
        setInitialContent(file.content);
      }).catch(err => {
        console.error(err);
      });
    }
  }, [selectedProjectId, fileIdOrName]);

  const onCloseModal = () => {
    setTimeout(() => {
      setFile(undefined);
      setInitialContent(undefined);
    }, 300);
    onClose();
  };

  const handleContentChange = (content?: string) => {
    content = content || "";
    setFile(prev => prev ? { ...prev, content } : undefined);
  };

  const Buttons = useMemo(() => {
    const buttons: JSX.Element[] = [];
    if (!selectedProjectId || !file?.id) return buttons;
    if (initialContent !== file?.content)
      buttons.push(<button key="save" onClick={() => {
        if (selectedProjectId && file?.id) {
          const payload = { id: file.id, name: file.name, content: file?.content };
          if (file?.contentType === 'guidelines')
            updateGuidelines(selectedProjectId, payload);
          else
            updateSource(selectedProjectId, payload);
          setInitialContent(file.content);
          setFile(prev => prev ? { ...prev, original: undefined } : undefined);
        }
      }}>
        <MdSave />
      </button>);
    if (file?.original)
      buttons.push(<button key="reset" onClick={() => {
        if (window.confirm('Are you sure to reset to original?')) {
          setInitialContent(file.original);
          setFile(prev => prev ? { ...prev, content: file.original, original: undefined } : undefined);
        }
      }}>
        <MdRestore />
      </button>);
    return buttons;
  }, [selectedProjectId, file, initialContent]);

  const Chat = useMemo(() => allowChat && <ComplexChat onSend={async (chat: ChatInputType, resourcesEnabled: RefineResource[], fileIds: number[]) => {
    if (!selectedProjectId || !file?.id) return;

    try {
      console.log('Chat:', chat, resourcesEnabled, fileIds);
      const data = await smartUpdateFile(selectedProjectId, file, chat, fileIds, resourcesEnabled);
      console.log('Data:', data);

      setInitialContent(file.content);
      setFile(prev => prev ? { ...prev, content: data.content, original: file.content } : undefined);
    } catch (error) {
      console.error('Error sending chat input:', error);
    }
  }} />, [allowChat, selectedProjectId, file]);

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