import React, { useEffect, useMemo, useState } from 'react';
import { ElementDesign, createFile, finalizeModule } from '@/apis';
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
  content: { type: 'editor' },
  goal: { type: 'textarea' },
};

const ReviewSpecs: React.FC<ReviewSpecsProps> = ({ close, orgItem, projectId, itemType }) => {
  const [item, setItem] = useState<ElementDesign>(orgItem);

  useEffect(() => {
    setItem(orgItem);
  }, [orgItem]);

  const handleContentChange = (value: GeneralData) => {
    setItem((prevItem) => ({ ...prevItem, ...value }));
  };

  const handleSave = async () => {
    if (itemType === 'file')
      await createFile(projectId, item)
    else
      await finalizeModule(projectId, item, "create")
    close();
  };

  const formData = useMemo(() => {
    const v = {
      name: item.name,
      content: {
        name: item.name,
        content: item.content,
      },
    } as GeneralData;
    if (item.goal) v['goal'] = item.goal;
    return v;
  }, [item]);

  return (
    <div>
      <DynamicForm
        formData={formData}
        elementTypes={elementTypes}
        onContentChange={handleContentChange}
      />
      <div className="m-6 relative flex items-center justify-end">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
        >
          Save
        </button>
        <button
          onClick={close}
          className="ml-4 px-4 py-2 bg-gray-300 text-gray-700 rounded-xl hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ReviewSpecs;