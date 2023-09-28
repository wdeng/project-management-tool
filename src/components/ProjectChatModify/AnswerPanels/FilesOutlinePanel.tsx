import React, { useCallback, useEffect, useState } from 'react';
import { outlineButtonStyles } from '@/utils/tailwindStyles';
import { ProposedItem, confirmProjectChanges } from '@/utils/apis/chatRefine';
import DiffEditorModal from '../../general/DiffEditorModal';
import { useSelected } from '@/hooks/useSelectedContext';
import AcceptIgnoreTab from '../../general/AcceptIgnoreTab';
import ModTag from '../../general/ModifySpan';

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

  const [filesStatus, setFilesStatus] = useState<Record<string, string>>({});

  useEffect(() => {
    if (Array.isArray(changes)) {
      setFilesStatus(Object.fromEntries(changes.map(file => [file.name, 'Accept'])));
    }
  }, [changes]);

  const { refreshCurrentProject, selectedProjectId } = useSelected();

  const confirmChange = async () => {
    if (selectedProjectId) {
      const acceptedChanges = changes.filter(file => filesStatus[file.name] === 'Accept');
      const newHistory = await confirmProjectChanges(acceptedChanges, selectedProjectId, issueId);
      reset(newHistory);
      refreshCurrentProject();
    } else
      reset();
  };

  const denyChange = () => {
    reset();
  };

  const handleRadioChange = (filepath: string, value: string) => {
    setFilesStatus(
      s => ({
        ...s,
        [filepath]: value
      })
    );
  };

  const renderItem = useCallback((change: ProposedItem) => (
    <div key={change.name} className="flex justify-between items-center mb-4 bg-white p-3 rounded-lg drop-shadow-sm">
      <div className='flex-grow'>
        <ModTag type={change.revisionType} />
        <button onClick={() => setEditingItem(change)} className="text-blue-500 underline ml-2">
          {change.name}
        </button>
        {change.type === 'file' && change.goal && <div className="text-gray-400 text-sm">{change.goal}</div>}
      </div>
      <AcceptIgnoreTab
        name={change.name}
        value={filesStatus[change.name] === 'Accept' ? 'Accept' : 'Ignore'}
        onChange={(value) => handleRadioChange(change.name, value)}
      />
    </div>
  ), [filesStatus]);

  return (
    <div className="mt-4">
      <span className="mr-6">Proposed modifications: </span>
      <div className="mb-3">
        {changes.map(renderItem)}
      </div>
      <div className="flex">
        <button className={`${outlineButtonStyles} mr-2`} onClick={confirmChange}>
          Next
        </button>
        <button className={`${outlineButtonStyles}`} onClick={denyChange}>
          Cancel
        </button>
      </div>
      {editingItem && <DiffEditorModal onClose={closeEditor} file={editingItem} />}
    </div>
  );
};

export default FilesOutlinePanel;
