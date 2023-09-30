import React, { useCallback, useEffect, useState } from 'react';
import { outlineButtonStyles } from '@/utils/tailwindStyles';
import { ProposedItem, confirmProjectChanges } from '@/utils/apis/chatRefine';
import DiffEditorModal from '../../general/DiffEditorModal';
import { useSelected } from '@/hooks/useSelectedContext';
import ReviewItem from '@/components/general/ReviewItem';
import { AcceptIgnoreType } from '@/components/general/AcceptIgnoreTab';

interface FilesOutlinePanelProps {
  changes: ProposedItem[];
  issueId?: string | null;
  reset: (history?: string[] | null) => void;
}

const FilesOutlinePanel: React.FC<FilesOutlinePanelProps> = ({
  changes, issueId = null, reset
}) => {
  const [editingItem, setEditingItem] = useState<ProposedItem | null>(null);
  const closeEditor = () => setEditingItem(null);

  const [accepts, setAccepts] = useState<Record<string, AcceptIgnoreType>>({});

  const { refreshCurrentProject, selectedProjectId } = useSelected();

  const confirmChange = async (next: boolean) => {
    if (selectedProjectId) {
      const acceptedChanges = changes.filter(file => accepts[file.name] !== 'Ignore');
      const newHistory = await confirmProjectChanges(acceptedChanges, selectedProjectId, issueId);
      reset(newHistory);
      refreshCurrentProject();
    }
  };

  const denyChange = () => {
    reset();
  };

  return (
    <div className="mt-4">
      <span className="mr-6">Proposed modifications: </span>
      <div className="mb-3">
        {changes.map(
          c => <ReviewItem
          key={c.name} change={c} accept={accepts[c.name] ?? 'Accept'} setAccepts={setAccepts} setEditingItem={setEditingItem}
        />
        )}
      </div>
      <div className="flex">
        <button className={`${outlineButtonStyles} mr-2`} onClick={() => confirmChange(true)}>
          Next
        </button>
        <button className={`${outlineButtonStyles} mr-2`} onClick={() => confirmChange(false)}>
          Finish
        </button>
        <button className={`${outlineButtonStyles}`} onClick={denyChange}>
          Cancel (maybe upper right corner)
        </button>
      </div>
      {editingItem && <DiffEditorModal onClose={closeEditor} file={editingItem} />}
    </div>
  );
};

export default FilesOutlinePanel;
