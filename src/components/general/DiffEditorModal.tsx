import React, { useMemo, useEffect, useState } from 'react';
import Modal from '../Modal';
import { DiffEditor } from "@monaco-editor/react";
import { editor } from "monaco-editor";


interface EditorModalProps {
  onClose: () => void;
  file?: {
    name: string;
    original: string;
    content: string;
  } | null;
  contentUpdated?: (value: string | undefined) => void;  // addtional callback to the parent component
}

const EditorModal: React.FC<EditorModalProps> = ({ onClose, contentUpdated, file }) => {
  const languageType = useMemo(() => {
    const extension = getFileExtension(file?.name || "yaml");
    return languageMap[extension] || extension;
  }, [file]);

  function handleEditorMount(currEditor: editor.IStandaloneDiffEditor) {

    const modifiedEditor = currEditor.getModifiedEditor();

    // Add event listener to update state whenever the content in the editor changes
    modifiedEditor.onDidChangeModelContent((e: any) => {
      const v = modifiedEditor.getValue();
      if (file) file.content = v;  // inline update the content in the file object
      contentUpdated && contentUpdated(v);
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
