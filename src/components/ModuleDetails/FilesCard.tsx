import React, { useState } from 'react';
import { MdInfoOutline } from 'react-icons/md';
import { FileDesign } from '@/utils/apis';
import FileEditorModal from '../general/FileEditorModal';

interface IFileCardProps {
  files: FileDesign[];
}

const FilesCard: React.FC<IFileCardProps> = ({ files }) => {
  const [editingFileId, setEditingFileId] = useState<number | null>(null);
  const openEditor = (fileId: number) => {
    setEditingFileId(fileId);
  };

  const closeEditor = () => {
    setEditingFileId(null);
  };

  return (
    <div>
      <FileEditorModal
        fileId={editingFileId}
        onClose={closeEditor}
      />
      {files.map((file) => (
        <div
          className="p-2 relative mb-4 inline-block bg-white drop-shadow-md rounded-lg p-3 mb-4 cursor-pointer w-52 text-left transition ease-in-out delay-100 hover:scale-110 duration-300"
          onClick={() => openEditor(file.id)}
          role="button"
          tabIndex={0}
        >
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-l truncate text-gray-700">
              {file.path.split('/').pop()}
            </h3>
            <button className="text-gray-400 hover:text-gray-600">
              <MdInfoOutline />
            </button>
          </div>
          <p className="text-gray-400 mt-4 text-sm">{file.goal}</p>
        </div>
      ))}
    </div>
  )
};

export default FilesCard;
