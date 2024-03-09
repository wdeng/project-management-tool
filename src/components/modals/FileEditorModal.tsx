import React, { useEffect, useMemo, useRef, useState } from 'react';
import Modal from './Modal';
import Editor from "@monaco-editor/react";
import { useSelected } from '@/hooks/useSelectedContext';
import { FileDesign, fetchSourceCode, updateFile } from '@/utils/apis';
import { getFileExtension, languageMap } from '@/utils';
import { MdOutlineChat, MdSave } from 'react-icons/md';
import ComplexChat from '../general/ChatFields/ComplexChat';

interface EditorModalProps {
  onClose: () => void;
  fileId?: number | null | string;
  onChange?: (value: string | undefined) => void;
  allowChat?: boolean;
}

function handleEditorWillMount(monaco: any) {
  monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true,
    noSyntaxValidation: true
  });
  monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true,
    noSyntaxValidation: true
  });
}

const FileEditor: React.FC<EditorModalProps> = ({
  onClose, fileId, onChange, allowChat = true
}) => {
  const { selectedProjectId } = useSelected();
  // const [showChat, setShowChat] = useState(false);
  const [file, setFile] = useState<FileDesign | undefined>(undefined);
  const [languageType, setLanguageType] = useState<string>("");
  const orgFile = useRef<FileDesign | null>(null);

  useEffect(() => {
    if (fileId != null && selectedProjectId) {
      fetchSourceCode(selectedProjectId, fileId).then(file => {
        setFile(file);
        orgFile.current = { ...file };
        const ext = getFileExtension(file.path) || "yaml";
        setLanguageType(languageMap[ext] || ext);
      }).catch(err => {
        console.error(err);
      });
    }
  }, [selectedProjectId, fileId]);

  const onCloseModal = () => {
    setTimeout(() => {
      setFile(undefined);
    }, 300);
    onClose();
  };

  const handleEditorChange = (value: string | undefined) => {
    setFile(v => v ? { ...v, content: value } : undefined);
    onChange && onChange(value);
  };

  const Buttons = useMemo(() => {
    const buttons: JSX.Element[] = [];
    // if (allowChat) {
    //   buttons.push(<button key='chat' onClick={() => setShowChat(prev => !prev)}>
    //     <MdOutlineChat />
    //   </button>);
    // }
    const curr = orgFile.current;
    if (!selectedProjectId || !file?.id || (curr?.content === file?.content)) return buttons;

    const save = () => {
      updateFile(selectedProjectId, { fileId: file.id, content: file?.content });
    };
    buttons.push(<button key="save" onClick={save}>
      <MdSave />
    </button>);
    return buttons;
  }, [file, selectedProjectId]);

  const Chat = useMemo(() => allowChat && <ComplexChat onSend={async () => { }} />, [allowChat]);

  return (
    <Modal isOpen={fileId != null} onClose={onCloseModal} title={file?.path || "File Edit"} MoreButtons={Buttons} FieldBelow={Chat}>
      <Editor
        beforeMount={handleEditorWillMount}
        height="90vh"
        language={languageType}
        value={file?.content}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          fontSize: 13,
          minimap: { enabled: false },
        }}
      />
    </Modal>
  );
};

export default FileEditor;

const areDiff = (file1: FileDesign, file2?: FileDesign | null): boolean => {
  if (!file2)
    return true
  const allKeys: (keyof FileDesign)[] = ["id", "path", "goal", "content"];

  for (const key of allKeys) {
    if (file1[key] !== file2[key as keyof FileDesign]) {
      return true;
    }
  }

  return false;
};