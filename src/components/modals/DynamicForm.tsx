import { camelToTitle } from '@/utils';
import { textAreaStyles } from '@/utils/tailwindStyles';
import React, { useState } from 'react';
import TextEditorModal from './TextEditorModal';
import { GeneralData } from '@/utils/types';

export interface ElementTypeMapping {
  [key: string]: {
    type: 'textarea' | 'textfield' | 'label' | 'editor' | 'select';
  };
}

interface DynamicFormProps {
  formData: GeneralData;
  elementTypes: ElementTypeMapping;
  onContentChange: (key: string, value: GeneralData | string) => void;
}

const FormElement: React.FC<{
  elementKey: string;
  elementType: 'textarea' | 'textfield' | 'label' | 'editor';
  value?: GeneralData | string;
  onContentChange: (key: string, value: GeneralData | string) => void;
}> = ({ elementKey, elementType, value, onContentChange }) => {
  const title = camelToTitle(elementKey);
  const content = (value instanceof Object ? value.content : value) as string;

  const [open, setOpen] = useState<boolean>(false);

  switch (elementType) {
    case 'textarea':
      return (
        <textarea
          id={elementKey}
          value={content}
          onChange={({ target }) => onContentChange(elementKey, target.value)}
          rows={6}
          placeholder={title}
          className={textAreaStyles}
        />
      );
    case 'textfield':
      return (
        <input
          id={elementKey}
          type="text"
          value={content}
          onChange={({ target }) => onContentChange(elementKey, target.value)}
          placeholder={title}
          className="w-full border-none outline-none resize-none rounded-md focus:ring-1"
        />
      );
    case 'label':
      return <p>{content}</p>;
    case 'editor':
      if (!value || typeof value === 'string')
        return null;
      const val = value as any;
      return (
        <>
          <button
            onClick={() => setOpen(true)}
            className="cursor-pointer hover:text-indigo-700 hover:underline"
          >
            {val.name}
          </button>
          <TextEditorModal
            name={val.name}
            original={val.original}
            content={val.content}
            saveContent={(v) => onContentChange(elementKey, v)}
            onClose={() => setOpen(false)}
            isOpen={open}
            showSaveButtons={false}
          />
        </>
      );
    default:
      return null;
  }
};

const DynamicForm: React.FC<DynamicFormProps> = ({
  formData,
  elementTypes,
  onContentChange,
}) => {
  return (
    <div className="p-4">
      {Object.entries(formData).map(([key, value]) => (
        <div key={key} className="mb-4">
          <h3 className="text-lg font-semibold py-1">{camelToTitle(key)}:</h3>
          <div className="ml-2">
            <FormElement
              elementKey={key}
              elementType={elementTypes[key].type}
              value={value}
              onContentChange={onContentChange}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default DynamicForm;