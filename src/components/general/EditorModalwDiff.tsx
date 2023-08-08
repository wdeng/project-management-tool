import React, { useEffect, useState, useRef } from 'react';
import Modal from '../Modal';
import Editor, { DiffEditor } from "@monaco-editor/react";
import { useSelected } from '@/hooks/useSelectedContext';
import { fetchSouceCode } from '@/utils/apis';
import { editor } from "monaco-editor";


interface EditorModalProps {
  onClose: () => void;
  fileId?: number | null;
  moduleId?: number | null;
  onChange?: (value: string | undefined) => void;
  originalContent?: string;
  isDiffEditor?: boolean;
}

const EditorModal: React.FC<EditorModalProps> = ({ onClose, fileId, onChange, moduleId, originalContent, isDiffEditor }) => {
  const { selectedModule, selectedProjectId } = useSelected();
  const [content, setContent] = useState<string | undefined>(undefined);
  const [languageType, setLanguageType] = useState<string>("");

  const [modifiedText, setModifiedText] = useState("// the modified code");

  function handleEditorMount(currEditor: editor.IStandaloneDiffEditor) {

    const modifiedEditor = currEditor.getModifiedEditor();

    // Add event listener to update state whenever the content in the editor changes
    modifiedEditor.onDidChangeModelContent((e: any) => {
      console.log(e)
      setModifiedText(modifiedEditor.getValue());
    });
  }

  useEffect(() => {
    const _moduleId = moduleId || selectedModule?.id;
    if (fileId != null && selectedProjectId && _moduleId) {
      fetchSouceCode(selectedProjectId, _moduleId, fileId)
        .then(data => {
          setContent(data.content);
          const extension = getFileExtension(data.path);
          setLanguageType(languageMap[extension] || extension);
        })
        .catch(err => {
          console.error(err);
        });
    }
  }, [selectedProjectId, selectedModule?.id, fileId, moduleId]);

  const onCloseModal = () => {
    setTimeout(() => {
      setContent(undefined);
    }, 300);
    onClose();
  }

  const handleEditorChange = (value: string | undefined) => {
    setContent(value);
    onChange && onChange(value);
  };

  const originalModel = "const a = 1";

  return (
    <Modal isOpen={fileId != null} onClose={onCloseModal} title="Edit Module">
      {content != null && isDiffEditor ? (
        <DiffEditor
          height="78vh"
          theme="vs-dark"
          language={languageType}
          original={originalModel}
          modified={modifiedText}
          onMount={handleEditorMount}
        />
      ) : (
        <Editor
          height="78vh"
          defaultLanguage={languageType}
          value={content}
          onChange={handleEditorChange}
          theme="vs-dark"
        />
      )}
    </Modal>
  );
};

export default EditorModal;

function getFileExtension(filename: string) {
  return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
}

const languageMap: Record<string, string> = {
  "py": "python",
  "js": "javascript",
  "jsx": "javascript",
  "ts": "typescript",
  "tsx": "typescript",
}
