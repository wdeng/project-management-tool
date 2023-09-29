import React, { useState,ReactElement } from 'react';
import { outlineButtonStyles } from '@/utils/tailwindStyles';
import { ProposedItem, confirmProjectChanges } from '@/utils/apis/chatRefine';
import DiffEditorModal from '../../general/DiffEditorModal';
import { useSelected } from '@/hooks/useSelectedContext';
import ReviewItem from '../../general/ReviewItem';
import { AcceptIgnoreType } from '@/components/general/AcceptIgnoreTab';

interface ModuleReviewPanelProps {
  changes: ProposedItem[];
  setElement: React.Dispatch<React.SetStateAction<ReactElement | null>>;
}

const ModuleReviewPanel: React.FC<ModuleReviewPanelProps> = ({
  changes, setElement
}) => {
  const [editingItem, setEditingItem] = useState<ProposedItem | null>(null);
  const closeEditor = () => setEditingItem(null);

  const [accepts, setAccepts] = useState<Record<string, AcceptIgnoreType>>({});
  const { refreshCurrentProject, selectedProjectId } = useSelected();
  // Move to outside module
  const confirmChange = async () => {
    if (selectedProjectId) {
      const acceptedChanges = changes.filter(file => accepts[file.name] !== 'Ignore');
      if (acceptedChanges.length == 0)
        return
      await confirmProjectChanges(acceptedChanges, selectedProjectId, null);
      refreshCurrentProject();
      setElement(null);
    }
  };

  return (
    <div className="mt-4">
      <span className="mr-6">Proposed Module modifications: </span>
      <div className="mb-3">
        {changes.map(
          c => <ReviewItem
            key={c.name} change={c} accept={accepts[c.name] ?? 'Accept'} setAccepts={setAccepts} setEditingItem={setEditingItem}
          />
        )}
      </div>
      <div className="flex">
        <button className={`${outlineButtonStyles} mr-2`} onClick={confirmChange}>
          Done
        </button>
      </div>
      {editingItem && <DiffEditorModal onClose={closeEditor} file={editingItem} />}
    </div>
  );
};

export default ModuleReviewPanel;
