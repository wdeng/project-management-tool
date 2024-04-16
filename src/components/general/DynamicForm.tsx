import { camelToTitle } from '@/utils';
import { textAreaStyles } from '@/utils/tailwindStyles';
import React, { useMemo, useState } from 'react';
import ContentEditorModal from '../modals/ContentEditorModal';
import { GeneralData } from '@/utils/types';
import Selection from './Selection';

type FormElementType = 'textarea' | 'textfield' | 'label' | 'editor' | 'select';

export interface ElementTypeMapping {
  [key: string]: FormElementType;
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
  const content = (value instanceof Object && value.content) ? value.content : value;
  const [open, setOpen] = useState<boolean>(false);

  // const Chat = useMemo(() => {
  //   return (
  //     <ComplexChat
  //       onSend={async (chat: ChatInputType, resourcesEnabled: any, selectedCheckboxOptions: number[]) => {
  //       }}
  //       resourcesAvailable={[]}
  //     />
  //   );
  // }, []);

  if (!content) return null;
  switch (elementType) {
    case 'textarea':
      return (
        <textarea
          value={content}
          onChange={({ target }) => onContentChange({ [elementKey]: target.value })}
          rows={8}
          placeholder={title}
          className={textAreaStyles}
        />
      );
    case 'textfield':
      return (
        <input
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
      return (
        <>
          <button
            onClick={() => setOpen(true)}
            className="cursor-pointer hover:text-indigo-700 hover:underline"
          >
            {value.name}
          </button>
          <ContentEditorModal
            name={value.name}
            original={value.original}
            initialContent={value.content}
            saveContent={({ content }) => onContentChange({ content })}
            onClose={() => setOpen(false)}
            isOpen={open}
            // additionalField={Chat}
          />
        </>
      );
    case 'select':
      if (typeof value === 'string' || !value?.options) return null;
      return (
        <Selection
          value={content as string}
          onValueChange={v => onContentChange({ [elementKey]: v })}
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
    <div className="p-4 mb-8">
      {Object.entries(elementTypes).map(([key, type]) => {
        if (!formData[key]) return null;
        return <div key={key} className="mb-4">
          <h3 className="text-lg font-semibold py-1">{camelToTitle(key)}:</h3>
          <div className="ml-2">
            <FormElement
              elementKey={key}
              elementType={type}
              value={formData[key]}
              onContentChange={onContentChange}
            />
          </div>
        </div>
      })}
    </div>
  );
};

export default DynamicForm;