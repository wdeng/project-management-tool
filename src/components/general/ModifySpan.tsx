import React from 'react';

export type FileModifyType = 'add' | 'delete' | 'modify';

const colorMap = {
  'add': 'bg-green-200 text-green-800',
  'delete': 'bg-red-200 text-red-800',
  'modify': 'bg-yellow-200 text-yellow-800'
};

const ModTag = ({ type }: { type: FileModifyType }) => {
  return (
    <span className={`px-1.5 py-0.5 rounded-md ${colorMap[type]}`}>{type}</span>
  )
};

export default ModTag;
