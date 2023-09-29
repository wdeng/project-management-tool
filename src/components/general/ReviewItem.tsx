import React from 'react';
import AcceptIgnoreTab, { AcceptIgnoreType } from './AcceptIgnoreTab';
import ModTag, { FileModifyType } from './ModifySpan';


export interface Item {
  goal?: string;
  revisionType: FileModifyType;
  name: string;
}

interface ReviewItemProps {
  change: Item;
  accept: AcceptIgnoreType;
  setAccepts: React.Dispatch<React.SetStateAction<Record<string, AcceptIgnoreType>>>;
  setEditingItem: (item: any) => void;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ change, accept, setEditingItem, setAccepts }) => {
  const handleRadioChange = (filepath: string, value: AcceptIgnoreType) => {
    setAccepts(
      s => ({
        ...s,
        [filepath]: value
      })
    );
  };

  return (
    <div key={change.name} className="flex justify-between items-center mb-4 bg-white p-3 rounded-lg drop-shadow-sm">
      <div className='flex-grow'>
        <ModTag type={change.revisionType} />
        <button onClick={() => setEditingItem(change)} className="text-blue-500 underline ml-2">
          {change.name}
        </button>
        {change.goal && <div className="text-gray-400 text-sm">{change.goal}</div>}
      </div>
      <AcceptIgnoreTab
        name={change.name}
        value={accept}
        onChange={v => handleRadioChange(change.name, v)}
      />
    </div>
  );
}

export default ReviewItem;
