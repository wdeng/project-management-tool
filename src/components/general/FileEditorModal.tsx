import React, { useEffect, useRef, useState } from 'react';
import Modal from '../Modal';
import Editor from "@monaco-editor/react";
import { useSelected } from '@/hooks/useSelectedContext';
import { FileDesign, fetchSourceCode, updateFile } from '@/utils/apis';
import { InfoEditor } from './DescView';
import { getFileExtension, languageMap } from '@/utils';

interface EditorModalProps {
  onClose: () => void;
  fileId?: number | null | string;
  onChange?: (value: string | undefined) => void;
  kind?: "editor" | "info";
}

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

const dispayTypes = {
  path: "label",
  goal: "textfield",
}

function handleEditorWillMount(monaco: any) {
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

const FileEditorModal: React.FC<EditorModalProps> = ({ onClose, fileId, onChange, kind = "editor" }) => {
  const { selectedProjectId } = useSelected();
  const [file, setFile] = useState<FileDesign | undefined>(undefined);
  const [languageType, setLanguageType] = useState<string>("");
  const orgFile = useRef<FileDesign | null>(null)

  useEffect(() => {
    if (fileId != null && selectedProjectId) {
      fetchSourceCode(selectedProjectId, fileId).then(data => {
        setFile(data);
        orgFile.current = data
        const ext = getFileExtension(data.path);
        setLanguageType(languageMap[ext] || ext);
      }).catch(err => {
        console.error(err);
      });
    }
  }, [selectedProjectId, fileId]);

  const onCloseModal = () => {
    // const curr = orgFile.current
    // if (selectedProjectId && file?.id && areDiff(file, curr))
    //   updateFile(selectedProjectId, file)
    setTimeout(() => {
      setFile(undefined);
    }, 300);
    onClose();
  }

  const handleEditorChange = (value: string | undefined) => {
    setFile(v => v ? { ...v, content: value } : undefined);
    onChange && onChange(value);
  };

  const handleInfoChange = (key: string, value: any) => {
    setFile(v => v ? { ...v, [key]: value } : undefined);
    onChange && onChange(value);
  }

  return (
    <Modal isOpen={fileId != null} onClose={onCloseModal} title={file?.path || "File Edit"}>
      {kind === "editor" ? <Editor
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
      /> : <InfoEditor values={file} valueTypes={dispayTypes} onUpdateField={handleInfoChange} />}
    </Modal>
  );
};

export default FileEditorModal;
