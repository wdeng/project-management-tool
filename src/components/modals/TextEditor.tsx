import React, { useEffect, useMemo, useState } from 'react';
import Modal from './Modal';
import Editor, { Monaco } from "@monaco-editor/react";
import { MdOutlineChat, MdSave } from 'react-icons/md';

interface TextEditorModalProps {
  onClose: () => void;
  isOpen: boolean;
  initialContent: string | null;
  languageType?: string;
  title?: string;
  handleSave?: (value: string) => void;
  barButtons?: React.ReactNode[];
}

function handleEditorWillMount(monaco: Monaco) {
  monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true,
    noSyntaxValidation: true
  });

  // For JavaScript:
  monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true,
    noSyntaxValidation: true
  });
}

const TextEditor: React.FC<TextEditorModalProps> = ({ onClose, isOpen, title, handleSave, initialContent, languageType = "yaml", barButtons = [] }) => {
  const [content, setContent] = useState<string>(initialContent || "");
  useEffect(() => {
    setContent(initialContent || "");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const onCloseModal = () => {
    // setTimeout(() => {
    //   setFile(undefined);
    // }, 300);
    onClose();
  }

  const handleEditorChange = (value: string | undefined) => {
    setContent(value || "");
    // onChange && onChange(value);
  };

  const save = useMemo(() => {
    if (initialContent !== content && handleSave)
      return (
        <button key="save" onClick={() => handleSave(content)}>
          <MdSave />
        </button>
      )
  }, [content, initialContent, handleSave])

  return (
    <Modal isOpen={isOpen} onClose={onCloseModal} title={title || "Edit Text"} MoreButtons={[...barButtons, save]}>
      <Editor
        beforeMount={handleEditorWillMount}
        height="90vh"
        language={languageType}
        value={content}
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

export default TextEditor;
