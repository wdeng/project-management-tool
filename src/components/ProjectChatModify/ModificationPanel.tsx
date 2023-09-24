import React, { useEffect, useState } from 'react';
import { outlineButtonStyles } from '@/utils/tailwindStyles';
import { ProposedItem, ProposedDirectAnswer, confirmProjectChanges } from '@/utils/apis/chatRefine';
import DiffEditorModal from '../general/DiffEditorModal';
import { useSelected } from '@/hooks/useSelectedContext';
import AcceptIgnoreTabs from '../general/AcceptIgnoreTab';
import ModTag from '../general/ModifySpan';

interface ChangesReviewPanelProps {
  changes: ProposedItem[] | ProposedDirectAnswer;
  issueId?: string | null;
  reset: (history?: string[] | null) => void;
}

const ChangesReviewPanel: React.FC<ChangesReviewPanelProps> = ({
  changes, issueId = null, reset
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
    if (Array.isArray(changes) && selectedProjectId && issueId) {
      const acceptedChanges = changes.filter(file => fileStatus[file.name] === 'Accept');
      const newHistory = await confirmProjectChanges(selectedProjectId, issueId, acceptedChanges);
      reset(newHistory);
      refreshCurrentProject();
    } else
      reset();
  };

  const denyChange = () => {
    reset();
  };

  const handleRadioChange = (filepath: string, value: string) => {
    setFileStatus(
      s => ({
        ...s,
        [filepath]: value
      })
    );
  };

  const renderChangeItem = (change: ProposedItem) => (
    <div key={change.name} className="flex justify-between items-center mb-4 bg-white p-3 rounded-lg drop-shadow-sm">
      <div className='flex-grow'>
        <ModTag type={change.revisionType} />
        <button onClick={() => setEditingItem(change)} className="text-blue-500 underline ml-2">
          {change.name}
        </button>
        {change.type === 'file' && change.goal && <div className="text-gray-400 text-sm">{change.goal}</div>}
      </div>
      <AcceptIgnoreTabs
        name={change.name}
        value={fileStatus[change.name] === 'Accept' ? 'Accept' : 'Ignore'}
        onChange={(value) => handleRadioChange(change.name, value)}
      />
    </div>
  );

  return (
    <div className="mt-4">
      <span className="mr-6">Proposed modifications: </span>
      <div className="mb-3">
        {Array.isArray(changes) ? (
          changes.map(renderChangeItem)
        ) : (
          <div className="bg-white p-3 rounded-lg drop-shadow-sm">
            <h3 className='font-semibold text-lg py-2'>Direct Answer: </h3>
            <span>{changes.content}</span>
          </div>
        )}
      </div>
      <div className="flex">
        {Array.isArray(changes) && <button className={`${outlineButtonStyles} mr-2`} onClick={confirmChange}>
          Next
        </button>}
        <button className={`${outlineButtonStyles}`} onClick={denyChange}>
          Dismiss
        </button>
      </div>
      {editingItem && <DiffEditorModal onClose={closeEditor} file={editingItem} />}
    </div>
  );
};

export default ChangesReviewPanel;
