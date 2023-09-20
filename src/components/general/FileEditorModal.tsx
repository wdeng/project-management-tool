import React, { useEffect, useRef, useState } from 'react';
import Modal from '../Modal';
import Editor from "@monaco-editor/react";
import { useSelected } from '@/hooks/useSelectedContext';
import { FileDesign, fetchSouceCode, updateFile } from '@/utils/apis';
import { DynamicForm } from './DescView';
import { getFileExtension, languageMap } from '@/utils';

interface EditorModalProps {
  onClose: () => void;
  fileId?: number | null;
  onChange?: (value: string | undefined) => void;
  kind?: "editor" | "info";
}

const different = (file1: FileDesign, file2?: FileDesign | null): boolean => {
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

const dispayTypes = {
  path: "label",
  goal: "textfield",
}

const FileEditorModal: React.FC<EditorModalProps> = ({ onClose, fileId, onChange, kind="editor" }) => {
  const { selectedProjectId } = useSelected();
  const [file, setFile] = useState<FileDesign | undefined>(undefined);
  const [languageType, setLanguageType] = useState<string>("");
  const orgFile = useRef<FileDesign | null>(null)


  useEffect(() => {
    if (fileId != null && selectedProjectId) {
      fetchSouceCode(selectedProjectId, fileId)
        .then(data => {
          setFile(data);
          orgFile.current = data
          const extension = getFileExtension(data.path);
          setLanguageType(languageMap[extension] || extension);
        })
        .catch(err => {
          console.error(err);
        });
    }
  }, [selectedProjectId, fileId]);

  const onCloseModal = () => {
    const curr = orgFile.current
    if (selectedProjectId && file?.id && different(file, curr))
      updateFile(selectedProjectId, file)
    setTimeout(() => {
      setFile(undefined);
    }, 300);
    onClose();
  }

  const handleEditorChange = (value: string | undefined) => {
    setFile(v => v ? {...v, content: value} : undefined);
    onChange && onChange(value);
  };

  return (
    <Modal isOpen={fileId != null} onClose={onCloseModal} title="Edit Module">
      {kind === "editor" ? <Editor
        height="78vh"
        language={languageType}
        value={file?.content}
        onChange={handleEditorChange}
        theme="vs-dark"
      /> : <DynamicForm values={file} valueTypes={dispayTypes} onUpdateField={(k: string, v: any) => setFile(
        f => f && ({...f, k: v}))} /> }
    </Modal>
  );
};

export default FileEditorModal;
