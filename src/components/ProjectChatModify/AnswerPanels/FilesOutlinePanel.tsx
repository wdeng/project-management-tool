import React, { useState } from 'react';
import { outlineButtonStyles } from '@/utils/tailwindStyles';
import { ProposedItem, confirmProjectChanges } from '@/apis';
import { useSelected } from '@/hooks/useSelectedContext';
import ReviewItem from '@/components/general/ReviewItem';
import { AcceptIgnoreType } from '@/components/general/AcceptIgnoreTab';
import ContentEditorModal from '@/components/modals/ContentEditorModal';

interface FilesOutlinePanelProps {
  changes: ProposedItem[];
  syncHistory: (history?: string[] | null) => void;
  nextStep: () => void;
}

const FilesOutlinePanel: React.FC<FilesOutlinePanelProps> = ({
  changes, syncHistory, nextStep
}) => {
  const [editingItem, setEditingItem] = useState<ProposedItem | null>(null);
  const closeEditor = () => setOpen(false);
  const [open, setOpen] = useState(false);
  const [changesAccepted, acceptChanges] = useState<Record<string, AcceptIgnoreType>>({});

  const { refreshCurrentProject, selectedProjectId } = useSelected();

  const confirmChange = async (next: boolean) => {
    if (selectedProjectId) {
      const acceptedChanges = changes.filter(file => changesAccepted[file.name] !== 'Ignore');
      if (acceptedChanges.length > 0) {
        const newHistory = await confirmProjectChanges(acceptedChanges, selectedProjectId);
        console.log('newHistory', newHistory)
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
            key={c.name} change={c} accept={changesAccepted[c.name] ?? 'Accept'} acceptChanges={acceptChanges} setEditingItem={(item) => {
              setEditingItem(item);
              setOpen(true);
            }}
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
      <ContentEditorModal
        onClose={closeEditor}
        name={editingItem?.name}
        original={editingItem?.original}
        initialContent={editingItem?.content || ""}
        saveContent={
          ({ content }) => {
            if (editingItem) {
              editingItem.content = content;
              if (!content)
                editingItem.task = 'delete';
              else if (editingItem.task === 'delete')
                editingItem.task = 'modify';
              setEditingItem({ ...editingItem });
            }
          }}
        isOpen={open}
      />
    </div>
  );
};

export default FilesOutlinePanel;
