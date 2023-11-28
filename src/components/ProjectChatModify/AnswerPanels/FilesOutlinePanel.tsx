import React, { useState } from 'react';
import { outlineButtonStyles } from '@/utils/tailwindStyles';
import { ProposedItem, confirmProjectChanges } from '@/utils/apis/chatRefine';
import DiffEditorModal from '../../general/DiffEditorModal';
import { useSelected } from '@/hooks/useSelectedContext';
import ReviewItem from '@/components/general/ReviewItem';
import { AcceptIgnoreType } from '@/components/general/AcceptIgnoreTab';

interface FilesOutlinePanelProps {
  changes: ProposedItem[];
  syncHistory: (history?: string[] | null) => void;
  nextStep: () => void;
}

const FilesOutlinePanel: React.FC<FilesOutlinePanelProps> = ({
  changes, syncHistory, nextStep
}) => {
  const [editingItem, setEditingItem] = useState<ProposedItem | null>(null);
  const closeEditor = () => setEditingItem(null);

  const [changesAccepted, acceptChanges] = useState<Record<string, AcceptIgnoreType>>({});

  const { refreshCurrentProject, selectedProjectId } = useSelected();

  const confirmChange = async (next: boolean) => {
    if (selectedProjectId) {
      const acceptedChanges = changes.filter(file => changesAccepted[file.name] !== 'Ignore');
      if (acceptedChanges.length > 0) {
        const newHistory = await confirmProjectChanges(acceptedChanges, selectedProjectId);
        syncHistory(newHistory);
      }
      next && await nextStep();
      refreshCurrentProject();
    }
  };

  return (
    <div className="mt-4">
      <span className="mr-6">Proposed modifications: </span>
      <div className="mb-3">
        {changes.map(
          c => <ReviewItem
            key={c.name} change={c} accept={changesAccepted[c.name] ?? 'Accept'} acceptChanges={acceptChanges} setEditingItem={setEditingItem}
          />
        )}
      </div>
      <div className="flex">
        <button className={`${outlineButtonStyles} mr-2`} onClick={() => confirmChange(true)}>
          Next Step
        </button>
        <button className={`${outlineButtonStyles} mr-2`} onClick={() => confirmChange(false)}>
          Finish
        </button>
      </div>
      {editingItem && <DiffEditorModal onClose={closeEditor} file={editingItem} />}
    </div>
  );
};

export default FilesOutlinePanel;
