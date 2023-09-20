import { camelToTitle } from '@/utils';
import { textAreaStyles } from '@/utils/tailwindStyles';
import React, { useState } from 'react';

interface DynamicFormProps {
  initialData: { [key: string]: any };
  dataTypes: { [key: string]: 'textarea' | 'textfield' | 'label' };
  onUpdateField: (key: string, newValue: string) => void;
}

const renderElement = (
  key: string,
  value: any,
  type: 'textarea' | 'textfield' | 'label',
  onUpdateValue: (k: string, v: any) => void
) => {
  switch (type) {
    case 'textarea':
      return (
        <textarea
          key={key}
          id={key}
          value={value}
          onChange={(e) => onUpdateValue(key, e.target.value)}
          rows={8}
          placeholder={camelToTitle(key)}
          className={textAreaStyles}
        />
      );
    case 'textfield':
      return (
        <input
          key={key}
          id={key}
          type="text"
          value={value}
          onChange={(e) => onUpdateValue(key, e.target.value)}
          placeholder={camelToTitle(key)}
          className="w-full mb-4 border-none outline-none resize-none rounded-md focus:ring-1"
        />
      );
    case 'label':
      return (
        <div key={key}>
          {camelToTitle(key)}: {value}
        </div>
      );
    default:
      return null;
  }
};

export const DynamicForm: React.FC<DynamicFormProps> = ({ initialData, dataTypes, onUpdateField }) => {
  const [data, setData] = useState<{ [key: string]: any }>(initialData);

  const handleFieldChange = (key: string, newValue: any) => {
    // Update the local state
    setData(v => ({
      ...v,
      [key]: newValue,
    }));

    // Notify the parent component
    onUpdateField(key, newValue);
  };

  return (
    <div className="p-4">
      {Object.keys(data).map((key) => renderElement(key, data[key], dataTypes[key], handleFieldChange))}
    </div>
  );
}