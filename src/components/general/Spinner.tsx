import React from 'react';
import { ImSpinner2 } from 'react-icons/im';

interface SpinnerProps {
  additionalStyles?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ additionalStyles }) => {
  return (
    <div className={`flex justify-center items-center ${additionalStyles}`}>
      <ImSpinner2 className="animate-spin text-gray-400" size={36} />
    </div>
  );
};

export default Spinner;
