import React, { useState } from 'react';

interface AcceptIgnoreTabsProps {
  name: string;
  defaultValue?: 'Accept' | 'Ignore';
  onChange: (value: string) => void;
  className?: string;
}

const AcceptIgnoreTabs: React.FC<AcceptIgnoreTabsProps> = ({ name, defaultValue = 'Accept', onChange, className=''}) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue);

  const handleTabChange = (value: 'Accept' | 'Ignore') => {
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
        className={`flex-1 text-center py-1 m-1 ml-0.5 cursor-pointer rounded-lg transition-all duration-300 ease-in-out drop-shadow-sm ${selectedValue === 'Ignore' ? 'bg-red-500 text-white font-semibold' : 'hover:bg-gray-300 hover:text-gray-100 text-gray-600'}`}
        onClick={() => handleTabChange('Ignore')}
      >
        <input
          type="radio"
          name={name}
          value="Ignore"
          className="hidden"
          readOnly
          checked={selectedValue === 'Ignore'}
        />
        Ignore
      </label>
    </div>
  );
};

export default AcceptIgnoreTabs;
