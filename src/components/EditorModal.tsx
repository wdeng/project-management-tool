import React from 'react';
import Modal from './Modal';
import Editor from "@monaco-editor/react";

interface EditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  onChange: (value: string | undefined) => void;
}

const EditorModal: React.FC<EditorModalProps> = ({ isOpen, onClose, value, onChange }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Module">
      <div>
        <Editor
          height="88vh"
          defaultLanguage="typescript"
          value={value}
          onChange={onChange}
          theme="vs-dark"
        />
      </div>
    </Modal>
  );
};

export default EditorModal;
