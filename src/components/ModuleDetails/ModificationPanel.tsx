// components/FileChangesPanel.tsx

import React, { useState } from 'react';
import EditorModal from './EditorModal';
import { outlineButtonStyles } from '@/utils/tailwindStyles';

interface FileChangesPanelProps {
  changedFiles: { moduleId: number, fileId: number }[];
}

const FileChangesPanel: React.FC<FileChangesPanelProps> = ({ changedFiles }) => {
  const [editingFileIds, setEditingFileIds] = useState<{ moduleId: number, fileId: number } | null>(null);

  const openEditor = (moduleId: number, fileId: number) => {
    setEditingFileIds({ moduleId, fileId });
  };

  const closeEditor = () => {
    setEditingFileIds(null);
  };

  return (
    <div className="mt-6">
      <div className="mb-3">
        {changedFiles.map(({ moduleId, fileId }) => (
          <button onClick={() => openEditor(moduleId, fileId)} key={fileId} className="text-blue-500 underline mr-2">
            {fileId}
          </button>
        ))}
      </div>
      <div className="flex justify-end">
        <span className="mr-6">Proposed modifications</span>
        <button
          className={`${outlineButtonStyles} mr-2`}
          onClick={() => { console.log('Will Integrate'); }}
        >
          Accept
        </button>
        <button
          className={`${outlineButtonStyles}`}
        >
          Reject
        </button>
      </div>
      {editingFileIds && <EditorModal moduleId={editingFileIds.moduleId} fileId={editingFileIds.fileId} onClose={closeEditor} />}
    </div>
  );
};

export default FileChangesPanel;
