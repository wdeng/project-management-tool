import React, { useEffect, useState } from 'react';
import { outlineButtonStyles } from '@/utils/tailwindStyles';
import { ProposedItem } from '@/utils/apis/chatRefine';
import DiffEditorModal from '../../general/DiffEditorModal';
import { useSelected } from '@/hooks/useSelectedContext';
import ProposeFileChange from './FileDiffInspector';
import { FileModifyType } from '@/components/general/ModifySpan';
import { synchronizeProject } from '@/utils/apis';

interface FileChangeType {
  name: string;
  revisionType: FileModifyType;
  goal: string;
}

interface ChangesReviewPanelProps {
  changes: FileChangeType[];
}

const ChangesReviewPanel: React.FC<ChangesReviewPanelProps> = ({
  changes
}) => {
  const [editingItem, setEditingItem] = useState<ProposedItem | null>(null);
  const closeEditor = () => setEditingItem(null);

  const [fileStatus, setFileStatus] = useState<Record<string, string>>({});

  useEffect(() => {
    if (Array.isArray(changes)) {
      setFileStatus(Object.fromEntries(changes.map(file => [file.name, 'Accept'])));
    }
  }, [changes]);

  const { refreshCurrentProject, selectedProjectId } = useSelected();

  const confirmChange = async () => {
    if (Array.isArray(changes) && selectedProjectId) {
      const acceptedChanges = changes.filter(file => fileStatus[file.name] === 'Accept');
      const res = await synchronizeProject(selectedProjectId, acceptedChanges);
      console.log(res);
      refreshCurrentProject();
      console.log(acceptedChanges);
    }
  };

  const handleRadioChange = (filepath: string, value: string) => {
    setFileStatus(
      s => ({
        ...s,
        [filepath]: value
      })
    );
  };

  return (
    <div className="mt-4">
      <span className="mr-6">Document Changed Sources to the Project: </span>
      <div className="mb-3">
        {changes.map(change => <ProposeFileChange key={change.name} {...change} handleRadioChange={handleRadioChange} accept={fileStatus[change.name] === 'Accept'} />)}
      </div>
      <div className="flex">
        {Array.isArray(changes) && <button className={`${outlineButtonStyles} mr-2`} onClick={confirmChange}>
          Next
        </button>}
      </div>
      {editingItem && <DiffEditorModal onClose={closeEditor} file={editingItem} />}
    </div>
  );
};

export default ChangesReviewPanel;
