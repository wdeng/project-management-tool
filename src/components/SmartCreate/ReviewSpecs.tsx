import React, { useEffect, useMemo, useState } from 'react';
import { ElementDesign, updateSource, finalizeModule } from '@/apis';
import DynamicForm, { ElementTypeMapping } from '@/components/modals/DynamicForm';
import { GeneralData } from '@/utils/types';

interface ReviewSpecsProps {
  close: () => void;
  orgItem: ElementDesign;
  projectId: number;
  itemType: 'file' | 'module';
}

const elementTypes: ElementTypeMapping = {
  name: { type: 'textfield' },
  goal: { type: 'textarea' },
  content: { type: 'editor' },
};

const ReviewSpecs: React.FC<ReviewSpecsProps> = ({ close, orgItem, projectId, itemType }) => {
  const [item, setItem] = useState<ElementDesign>(orgItem);

  useEffect(() => {
    setItem(orgItem);
  }, [orgItem]);

  const handleContentChange = (key: string, value: string | GeneralData) => {
    setItem((prevItem) => ({ ...prevItem, [key]: value }));
  };

  const handleSave = () => {
    if (itemType === 'file') {
      updateSource(projectId, {
        name: item.name,
        content: item as ElementDesign,
      }).then(() => {
        close();
      });
    } else {
      finalizeModule(projectId, item).then(() => {
        close();
      });
    }
  };

  const formData = useMemo(() => {
    return {
      name: item.name,
      goal: item.goal || '',
      content: {
        name: item.name,
        content: item.content,
        original: orgItem.content,
      },
    };
  }, [item, orgItem]);

  return (
    <div>
      <DynamicForm
        formData={formData}
        elementTypes={elementTypes}
        onContentChange={handleContentChange}
      />
      <div className="mt-4">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save
        </button>
        <button
          onClick={close}
          className="ml-2 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ReviewSpecs;