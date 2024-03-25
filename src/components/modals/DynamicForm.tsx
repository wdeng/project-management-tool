import { camelToTitle } from '@/utils';
import { textAreaStyles } from '@/utils/tailwindStyles';
import React, { useState } from 'react';
import ContentEditorModal from './ContentEditorModal';
import { GeneralData } from '@/utils/types';
import Selection from '../general/Selection';

type FormElementType = 'textarea' | 'textfield' | 'label' | 'editor' | 'select';

export interface ElementTypeMapping {
  [key: string]: {
    type: FormElementType;
  };
}


interface DynamicFormProps {
  formData: GeneralData;
  elementTypes: ElementTypeMapping;
  onContentChange: (value: GeneralData) => void;
}

const FormElement: React.FC<{
  elementKey: string;
  elementType: FormElementType;
  value?: GeneralData | string;
  onContentChange: (value: GeneralData) => void;
}> = ({ elementKey, elementType, value, onContentChange }) => {
  const title = camelToTitle(elementKey);
  const content = value instanceof Object ? value.content : value;
  const [open, setOpen] = useState<boolean>(false);

  if (!content) return null;
  switch (elementType) {
    case 'textarea':
      return (
        <textarea
          id={elementKey}
          value={value as any}
          onChange={({ target }) => onContentChange({ [elementKey]: target.value })}
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
          onChange={({ target }) => onContentChange({ [elementKey]: target.value })}
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
          <ContentEditorModal
            name={val.name}
            original={val.original}
            content={val.content}
            saveContent={(v) => onContentChange(v)}
            onClose={() => setOpen(false)}
            isOpen={open}
            showSaveButtons={false}
          />
        </>
      );
    case 'select':
      if (typeof value === 'string' || !value?.options) return null;
      return (
        <Selection
          value={content as string}
          onValueChange={(v) => onContentChange({ [elementKey]: v })}
          options={value.options}
        />
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