import React, { useMemo, useState } from 'react';
import { MdInfoOutline } from 'react-icons/md';
import { FileDesign } from '@/apis';
import FileEditorModal from '../../../modals/FileEditorModal';
import FileCreation from '../../../SmartCreate/CreateItem';
import InfoEditorModal from './FileInfoModal';

interface IFileCardProps {
  files: FileDesign[];
}

const FilesCard: React.FC<IFileCardProps> = ({ files }) => {
  const [editingFileID, setEditingFileID] = useState<number | null>(null);
  const [editorKind, setEditorKind] = useState<"editor" | "info">("editor");

  const openEditor = (fileId: number, kind: "editor" | "info" = "editor") => {
    setEditingFileID(fileId);
    setEditorKind(kind);
  };

  const Modal = useMemo(() => {
    const closeEditor = () => setEditingFileID(null);
    const Modal = editorKind === "editor" ? FileEditorModal : InfoEditorModal;
    return <Modal fileIdOrName={editingFileID} onClose={closeEditor} />
  }, [editingFileID, editorKind]);

  return (
    <div className="flex flex-wrap items-start">
      {Modal}
      {files.map((file) => (
        <div
          key={file.id}
          className="p-2.5 relative mr-4 mb-4 inline-block bg-white drop-shadow-md rounded-lg cursor-pointer w-64 text-left transition ease-in-out delay-100 hover:scale-110 duration-300"
          onClick={() => openEditor(file.id)}
          role="button"
          tabIndex={0}
        >
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-base truncate text-gray-700">
              {file.name.substring(0, file.name.lastIndexOf('.'))}
            </h3>
            <button className="text-gray-400 hover:text-gray-600 p-1 mr-[-0.25rem]" onClick={(ev) => {
              ev.stopPropagation();
              openEditor(file.id, "info");
            }}>
              <MdInfoOutline size={16} />
            </button>
          </div>
          <p className="text-gray-400 mt-1 text-sm">{file.goal}</p>
        </div>
      ))}
      <FileCreation />
    </div>
  );
};

export default FilesCard;
