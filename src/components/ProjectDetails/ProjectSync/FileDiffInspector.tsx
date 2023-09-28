import React from "react";
import AcceptIgnoreTab from "../../general/AcceptIgnoreTab";
import ModTag, { FileModifyType } from "../../general/ModifySpan";

interface ChangesReviewPanelProps {
  name: string;
  revisionType: FileModifyType;
  goal: string;
  handleRadioChange: (name: string, value: string) => void;
  accept: boolean;
  rest?: any;
}

const ProposeFileChange = ({
  name, revisionType, goal, handleRadioChange, accept
}: ChangesReviewPanelProps) => {
  return (
    <div key={name} className="flex justify-between items-center mb-4 bg-white p-3 rounded-lg drop-shadow-sm">
      <div className='flex-grow'>
        <ModTag type={revisionType} />
        <span className="ml-2">
          {name}
        </span>
        {goal && <div className="text-gray-400 text-sm">{goal}</div>}
      </div>
      <AcceptIgnoreTab
        name={name}
        value={accept ? 'Accept' : 'Ignore'}
        onChange={(value) => handleRadioChange(name, value)}
      />
    </div>
  );
}

export default ProposeFileChange;