import React, { useState, ReactElement } from 'react';
import { outlineButtonStyles } from '@/utils/tailwindStyles';
import { ProposedItem } from '@/utils/apis/chatRefine';
import { useSelected } from '@/hooks/useSelectedContext';
import { FileModifyType } from '@/components/general/ModifySpan';
import { synchronizeProject } from '@/utils/apis';
import { AcceptIgnoreType } from '@/components/general/AcceptIgnoreTab';
import ReviewItem from '@/components/general/ReviewItem';
import FileEditorModal from '@/components/general/FileEditorModal';
import ModuleReviewPanel from './ReviewModuleChanges';

interface FileChangeType {
  name: string;
  revisionType: FileModifyType;
  goal: string;
}

interface ChangesReviewPanelProps {
  changes: FileChangeType[];
  setElement: React.Dispatch<React.SetStateAction<ReactElement | null>>;
}

const GitDiffReview: React.FC<ChangesReviewPanelProps> = ({
  changes, setElement
}) => {
  const [editingItem, setEditingItem] = useState<ProposedItem | null>(null);
  const closeEditor = () => setEditingItem(null);

  const [accepts, setAccepts] = useState<Record<string, AcceptIgnoreType>>({});
  const { selectedProjectId } = useSelected();

  const confirmChange = async () => {
    if (selectedProjectId) {
      const acceptedChanges = changes.filter(file => accepts[file.name] !== 'Ignore');
      const res = await synchronizeProject(selectedProjectId, acceptedChanges);
      console.log(res);
      setElement(<ModuleReviewPanel changes={res.outline} additions={res.files} setElement={setElement} />)
    }
  };

  return (
    <div className="mt-4">
      <span className="mr-6">Document Changed Sources to the Project: </span>
      <div className="mb-3">
        {changes.map(
          c => <ReviewItem
            key={c.name} change={c} accept={accepts[c.name] ?? 'Accept'} setAccepts={setAccepts} setEditingItem={setEditingItem}
          />
        )}
      </div>
      <div className="flex">
        {Array.isArray(changes) && <button className={`${outlineButtonStyles} mr-2`} onClick={confirmChange}>
          Next
        </button>}
      </div>
      {editingItem && <FileEditorModal onClose={closeEditor} fileId={editingItem.name} />}
    </div>
  );
};

export default GitDiffReview;
