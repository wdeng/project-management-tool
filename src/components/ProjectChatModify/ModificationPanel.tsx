// NOT USED YET, will be used to show changes to files in a module

import React, { useState } from 'react';
import { outlineButtonStyles } from '@/utils/tailwindStyles';
import { ProposedFile, confirmProjectChanges } from '@/utils/apis/chatRefine';
import DiffEditorModal from '../general/DiffEditorModal';
import { useSelected } from '@/hooks/useSelectedContext';
interface FileChangesPanelProps {
  changedFiles: ProposedFile[];
}

const FileChangesPanel: React.FC<FileChangesPanelProps> = ({ changedFiles }) => {
  const [editingFile, setEditingFile] = useState<ProposedFile | null>(null);
  const { refreshCurrentProject, selectedProjectId } = useSelected();
  const closeEditor = () => {
    setEditingFile(null);
  };

  const confirmChange = async () => {
    await confirmProjectChanges(selectedProjectId!, changedFiles)
    refreshCurrentProject()
  }

  return (
    <div className="mt-6">
      <span className="mr-6">Proposed modifications: </span>
      <div className="mb-3">
        {changedFiles.map((file) => (
          <button onClick={() => setEditingFile(file)} key={file.path} className="text-blue-500 underline mr-2">
            {file.path}
          </button>
        ))}
      </div>
      <div className="flex justify-end">
        <button
          className={`${outlineButtonStyles} mr-2`}
          onClick={confirmChange}
        >
          Accept
        </button>
        <button
          className={`${outlineButtonStyles}`}
        >
          Reject
        </button>
      </div>
      {editingFile && <DiffEditorModal onClose={closeEditor} {...editingFile} />}
    </div>
  );
};

export default FileChangesPanel;
