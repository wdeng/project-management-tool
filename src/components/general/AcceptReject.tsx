import React, { useState } from 'react';

interface AcceptRejectTabsProps {
  name: string;
  defaultValue?: 'Accept' | 'Reject';
  onChange: (value: string) => void;
  className?: string;
}

const AcceptRejectTabs: React.FC<AcceptRejectTabsProps> = ({ name, defaultValue = 'Accept', onChange, className=''}) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue);

  const handleTabChange = (value: 'Accept' | 'Reject') => {
    setSelectedValue(value);
    onChange(value);
  };

  return (
    <div className={`relative inline-flex w-[12rem] min-w-[12rem] bg-gray-100 rounded-lg transition-all duration-300 ease-in-out ${className}`}>
      <label
        className={`flex-1 text-center py-1 m-1 mr-0.5 cursor-pointer rounded-lg transition-all duration-300 ease-in-out drop-shadow-sm ${selectedValue === 'Accept' ? 'bg-blue-500 text-white font-semibold' : 'hover:bg-gray-300 hover:text-gray-100 text-gray-600'}`}
        onClick={() => handleTabChange('Accept')}
      >
        <input
          type="radio"
          name={name}
          value="Accept"
          className="hidden"
          readOnly
          checked={selectedValue === 'Accept'}
        />
        Accept
      </label>
      <label
        className={`flex-1 text-center py-1 m-1 ml-0.5 cursor-pointer rounded-lg transition-all duration-300 ease-in-out drop-shadow-sm ${selectedValue === 'Reject' ? 'bg-red-500 text-white font-semibold' : 'hover:bg-gray-300 hover:text-gray-100 text-gray-600'}`}
        onClick={() => handleTabChange('Reject')}
      >
        <input
          type="radio"
          name={name}
          value="Reject"
          className="hidden"
          readOnly
          checked={selectedValue === 'Reject'}
        />
        Reject
      </label>
    </div>
  );
};

export default AcceptRejectTabs;
