// NOT USED YET, will be used to show changes to files in a module

import React, { useState } from 'react';
import EditorModal from '../general/EditorModal';
import { outlineButtonStyles } from '@/utils/tailwindStyles';

interface FileChangesPanelProps {
  changedFiles: { moduleId: number, fileId: number }[];
}

const FileChangesPanel: React.FC<FileChangesPanelProps> = ({ changedFiles }) => {
  const [editingFile, setEditingFile] = useState<{ moduleId: number, fileId: number } | null>(null);

  const openEditor = (moduleId: number, fileId: number) => {
    setEditingFile({ moduleId, fileId });
  };

  const closeEditor = () => {
    setEditingFile(null);
  };

  return (
    <div className="mt-6">
      <span className="mr-6">Proposed modifications: </span>
      <div className="mb-3">
        {changedFiles.map(({ moduleId, fileId }) => (
          <button onClick={() => openEditor(moduleId, fileId)} key={fileId} className="text-blue-500 underline mr-2">
            {fileId}
          </button>
        ))}
      </div>
      <div className="flex justify-end">
        <button
          className={`${outlineButtonStyles} mr-2`}
          onClick={() => { console.log('Integrate'); }}
        >
          Accept
        </button>
        <button
          className={`${outlineButtonStyles}`}
        >
          Reject
        </button>
      </div>
      {editingFile && <EditorModal moduleId={editingFile.moduleId} fileId={editingFile.fileId} onClose={closeEditor} />}
    </div>
  );
};

export default FileChangesPanel;
