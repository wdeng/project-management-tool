import { camelToTitle } from '@/utils';
import { textAreaStyles } from '@/utils/tailwindStyles';
import React, { useState } from 'react';

interface DynamicFormProps {
  values: { [key: string]: any } | undefined;
  valueTypes: { [key: string]: string };
  onUpdateField: (key: string, newValue: string) => void;
}

function renderElement(
  key: string,
  value: any,
  type: string,
  onUpdateValue: (k: string, v: any) => void
) {
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

export const InfoEditor: React.FC<DynamicFormProps> = ({ values, valueTypes, onUpdateField }) => {
  // TODO: check if the data should set 
  // const [data, setData] = useState<{ [key: string]: any }>(data);
  // const handleFieldChange = (key: string, newValue: any) => {
  //   // Update the local state
  //   setData(v => ({
  //     ...v,
  //     [key]: newValue,
  //   }));

  //   // Notify the parent component
  //   onUpdateField(key, newValue);
  // };

  return (
    <div className="p-4">
      {values && Object.keys(values).map((key) => renderElement(key, values[key], valueTypes[key], onUpdateField))}
    </div>
  );
}