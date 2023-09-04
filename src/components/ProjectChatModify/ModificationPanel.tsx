import React, { useState } from 'react';
import { outlineButtonStyles } from '@/utils/tailwindStyles';
import { ProposedFile, ProposedItem, confirmProjectChanges } from '@/utils/apis/chatRefine';
import DiffEditorModal from '../general/DiffEditorModal';
import { useSelected } from '@/hooks/useSelectedContext';
import AcceptRejectTabs from '../general/AcceptReject';


const getTagStyle = (type: 'add' | 'delete' | 'modify') => {
  let text = '';
  switch (type) {
    case 'add':
      text = 'bg-green-200 text-green-800';
      break;
    case 'delete':
      text = 'bg-red-200 text-red-800';
      break;
    default: // 'modify'
      text = 'bg-yellow-200 text-yellow-800';
  }

  return `px-1.5 py-0.5 rounded-md ${text}`;
};

interface ChangesReviewPanelProps {
  changes: ProposedItem[];
}
const ChangesReviewPanel: React.FC<ChangesReviewPanelProps> = ({ changes }) => {
  const [editingItem, setEditingItem] = useState<ProposedItem | null>(null);
  const [fileStatus, setFileStatus] = useState(
    Object.fromEntries(changes.map(file => [file.name, 'Accept']))
  );
  const { refreshCurrentProject, selectedProjectId } = useSelected();

  const closeEditor = () => setEditingItem(null);

  const confirmChange = async () => {
    // your API logic
    await confirmProjectChanges(selectedProjectId!, changes);
    refreshCurrentProject();
  };

  const handleRadioChange = (name: string, value: string) => {
    setFileStatus({
      ...fileStatus,
      [name]: value
    });
  };

  return (
    <div className="mt-6">
      <span className="mr-6">Proposed modifications: </span>
      <div className="mb-3">
        {changes.map((change) => (
          <div key={change.name} className="flex justify-between items-center mb-4 bg-white p-3 rounded-lg drop-shadow-sm">
            <div className='flex-grow'>
              <span className={getTagStyle(change.revisionType)}>
                {change.revisionType}
              </span>
              <button onClick={() => setEditingItem(change)} className="text-blue-500 underline ml-2">
                {change.name}
              </button>
              {change.type == 'file' && <div className="text-gray-400 text-sm">{change.goal}</div>}
            </div>
            <AcceptRejectTabs
              name={change.name}
              defaultValue="Accept"
              onChange={(value) => handleRadioChange(change.name, value)}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <button
          className={`${outlineButtonStyles}`}
          onClick={confirmChange}
        >
          Confirm
        </button>
      </div>
      {editingItem && <DiffEditorModal onClose={closeEditor} file={editingItem} />}
    </div>
  );
};

export default ChangesReviewPanel;
