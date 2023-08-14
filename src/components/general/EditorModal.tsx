import React, { useEffect, useState } from 'react';
import Modal from '../Modal';
import Editor from "@monaco-editor/react";
import { useSelected } from '@/hooks/useSelectedContext';
import { fetchSouceCode } from '@/utils/apis';  // assuming apiREAL is the file where fetchSouceCode is exported from

interface EditorModalProps {
  onClose: () => void;
  fileId?: number | null;
  moduleId?: number | null;
  onChange?: (value: string | undefined) => void;
}

const EditorModal: React.FC<EditorModalProps> = ({ onClose, fileId, onChange, moduleId }) => {
  const { selectedModule, selectedProjectId } = useSelected();
  const [content, setContent] = useState<string | undefined>(undefined);
  const [languageType, setLanguageType] = useState<string>("");

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

  return (
    <Modal isOpen={fileId != null} onClose={onCloseModal} title="Edit Module">
      <Editor
        height="78vh"
        defaultLanguage={languageType}
        value={content}
        onChange={handleEditorChange}
        theme="vs-dark"
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