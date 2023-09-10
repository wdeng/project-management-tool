import React from 'react';
import { ImSpinner2 } from 'react-icons/im';

interface SpinnerProps {
  className?: string;
  spinnerSize?: number;
}

const Spinner: React.FC<SpinnerProps> = ({ className = '', spinnerSize=36 }) => {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <ImSpinner2 className="animate-spin text-gray-400" size={spinnerSize} />
    </div>
  );
};

export default Spinner;
