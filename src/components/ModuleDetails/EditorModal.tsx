import React, { useEffect, useState } from 'react';
import Modal from '../Modal';
import Editor from "@monaco-editor/react";
import { useSelected } from '@/hooks/useSelectedContext';
import { fetchSouceCode } from '@/utils/apiREAL';  // assuming apiREAL is the file where fetchSouceCode is exported from

interface EditorModalProps {
  onClose: () => void;
  fileId?: number | null;
  onChange?: (value: string | undefined) => void;
}

const EditorModal: React.FC<EditorModalProps> = ({ onClose, fileId, onChange }) => {
  const { selectedModule, selectedProjectId } = useSelected();
  const [content, setContent] = useState<string | undefined>(undefined);
  const [languageType, setLanguageType] = useState<string>("");

  useEffect(() => {
    if(fileId != null && selectedProjectId && selectedModule?.id) {
      fetchSouceCode(selectedProjectId, selectedModule.id, fileId)
        .then(data => {
          setContent(data.content);
          const extension = getFileExtension(data.path);
          setLanguageType(languageMap[extension] || extension);
        })
        .catch(err => {
          console.error(err);
        });
    }
  }, [selectedProjectId, selectedModule?.id, fileId]);
  
  const onCloseModal = () => {
    setContent(undefined);
    onClose();
  }


  const handleEditorChange = (value: string | undefined) => {
    setContent(value);
    onChange && onChange(value);
  };

  return (
    <Modal isOpen={fileId != null} onClose={onCloseModal} title="Edit Module">
      {content != null && <Editor
        height="78vh"
        defaultLanguage={languageType}
        value={content}
        onChange={handleEditorChange}
        theme="vs-dark"
      />}
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
  "ts": "typescript",
  "tsx": "typescript",
}