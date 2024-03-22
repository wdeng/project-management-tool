import { camelToTitle } from '@/utils';
import { buttonStyles, textAreaStyles } from '@/utils/tailwindStyles';
import React from 'react';

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
  const title = camelToTitle(key);
  let element: React.JSX.Element | null = null;
  switch (type) {
    case 'textarea':
      element = (
        <textarea
          id={key}
          value={value}
          onChange={(e) => onUpdateValue(key, e.target.value)}
          rows={8}
          placeholder={title}
          className={textAreaStyles}
        />
      );
      break;
    case 'textfield':
      element = (
        <input
          id={key}
          type="text"
          value={value}
          onChange={(e) => onUpdateValue(key, e.target.value)}
          placeholder={title}
          className="w-full border-none outline-none resize-none rounded-md focus:ring-1"
        />
      );
      break;
    case 'label':
      element = (
        <p>{value}</p>
      );
      break;
    default:
      return null;
  }

  return (
    <div key={key}>
      <h3 className='text-lg font-semibold py-1'
      >{title}:</h3>
      <div className='ml-2 mb-2'
      >{element}</div>
    </div>
  )
};

export const InfoEditor: React.FC<DynamicFormProps> = ({ values, valueTypes, onUpdateField }) => {

  // const save = () => {
  //   const fields: any = { fileId: obj.id }
  //   if (obj?.content && curr?.content !== obj?.content)
  //     fields["content"] = obj?.content
  //   if (obj?.goal && curr?.goal !== obj?.goal)
  //     fields["goal"] = obj?.goal
  //   fields["target"] = "guidelines"
  //   updateFile(selectedProjectId, fields)
  // }

  return (
    <div className="p-4">
      {values && Object.keys(values).map((key) => renderElement(key, values[key], valueTypes[key], onUpdateField))}
      <div className="flex space-x-3">
        <button
          className={`${buttonStyles} my-3 px-3`}
        >
          Implement
        </button>
        <button
          onClick={
            () => window.confirm('Are you sure to delete this module?')
          }
          className={`${buttonStyles} my-3 px-3 bg-red-500`}
        >
          Delete
        </button>
      </div>
    </div>
  );
}