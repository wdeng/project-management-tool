import React, { useMemo, useEffect, useState } from 'react';
import Modal from '../Modal';
import { DiffEditor } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { ProposedFile } from '@/utils/apis/chatRefine';


interface EditorModalProps {
  onClose: () => void;
  file?: ProposedFile | null;
  setContent?: (value: string | undefined) => void;
}

const EditorModal: React.FC<EditorModalProps> = ({ onClose, setContent, file }) => {
  const languageType = useMemo(() => {
    const extension = getFileExtension(file?.path || "");
    return languageMap[extension] || extension;
  }, [file]);

  function handleEditorMount(currEditor: editor.IStandaloneDiffEditor) {

    const modifiedEditor = currEditor.getModifiedEditor();

    // Add event listener to update state whenever the content in the editor changes
    modifiedEditor.onDidChangeModelContent((e: any) => {
      console.log(e)
      const v = modifiedEditor.getValue();
      if (file) file.content = v;
      setContent && setContent(v);
    });
  }

  // useEffect(() => {
  //   if (file != null)
  //     setModalOpen(true);
  // }, [file]);

  const onCloseModal = () => {
    // setTimeout(() => {
    //   setModalOpen(false);
    // }, 300);
    onClose();
  }

  return (
    <Modal isOpen={file != null} onClose={onCloseModal} title="Edit Module">
      <DiffEditor
        height="78vh"
        theme="vs-dark"
        language={languageType}
        original={file?.original}
        modified={file?.content}
        onMount={handleEditorMount}
      />
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
