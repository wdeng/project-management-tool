import React from 'react';

export type FileModifyType = 'create' | 'delete' | 'modify';

const colorMap = {
  'create': 'bg-green-200 text-green-800',
  'delete': 'bg-red-200 text-red-800',
  'modify': 'bg-yellow-200 text-yellow-800'
};

const ModTag = ({ task }: { task: FileModifyType }) => {
  return (
    <span className={`px-1.5 py-0.5 rounded-md ${colorMap[task]}`}>{task}</span>
  )
};

export default ModTag;
