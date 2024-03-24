import React, { useEffect, useMemo, useState } from 'react';
import { FileDesign, updateSource } from '@/apis';
import DynamicForm, { ElementTypeMapping } from '@/components/modals/DynamicForm';
import { GeneralData } from '@/utils/types';

interface ReviewSpecsProps {
  onClose: () => void;
  orgFile: FileDesign;
  projectId: number;
}

const elementTypes: ElementTypeMapping = {
  name: { type: 'textfield' },
  goal: { type: 'textarea' },
  content: { type: 'editor' },
};

const ReviewSpecs: React.FC<ReviewSpecsProps> = ({ onClose, orgFile, projectId }) => {
  const [file, setFile] = useState<FileDesign>(orgFile);

  useEffect(() => {
    setFile(orgFile);
  }, [orgFile]);

  const handleContentChange = (key: string, value: string | GeneralData) => {
    setFile((prevFile) => ({ ...prevFile, [key]: value }));
  };

  const handleSave = () => {
    updateSource(projectId, {
      name: file.name,
      content: file,
    }).then(() => {
      onClose();
    });
  };

  const formData = useMemo(() => {
    return {
      name: file.name,
      goal: file.goal || '',
      content: {
        name: file.name,
        content: file.content,
        original: orgFile.content,
      },
    };
  }, [file, orgFile]);

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
          onClick={onClose}
          className="ml-2 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ReviewSpecs;