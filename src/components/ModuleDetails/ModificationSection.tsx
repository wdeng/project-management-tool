// components/ModificationButtons.tsx

import React from 'react';
import { outlineButtonStyles } from '@/utils/tailwindStyles';

const ModificationButtons = () => {
  return (
    <div className="mt-6 flex justify-end">
      <span className="mr-6">Proposed modifications</span>
      <button
        className={`${outlineButtonStyles} mr-2`}
        onClick={() => { console.log('Will Integrate'); }}
      >
        Accept
      </button>
      <button
        className={`${outlineButtonStyles}`}
      >
        Reject
      </button>
    </div>
  );
};

export default ModificationButtons;
