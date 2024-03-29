import React, { useMemo, useState } from 'react';
import { MdInfoOutline } from 'react-icons/md';
import { ElementDesign } from '@/apis';
import FileEditorModal from '../../../modals/FileEditorModal';
import FileCreation from '../../../SmartCreate/CreateItem';
import InfoEditorModal from './FileInfoModal';

interface IFileCardProps {
  files: ElementDesign[];
}

const FilesCard: React.FC<IFileCardProps> = ({ files }) => {
  const [editingFile, setEditingFile] = useState<ElementDesign | null>(null);
  const [editorKind, setEditorKind] = useState<"editor" | "info">("editor");

  const openEditor = (file: ElementDesign, kind: "editor" | "info" = "editor") => {
    setEditingFile(file);
    setEditorKind(kind);
  };

  const Modal = useMemo(() => {
    const closeEditor = () => setEditingFile(null);
    const Modal = (editorKind === "info" || editingFile?.status === "pending") ? InfoEditorModal : FileEditorModal;
    return <Modal fileIdOrName={editingFile?.id} onClose={closeEditor} />
  }, [editingFile, editorKind]);

  return (
    <div className="flex flex-wrap items-start">
      {Modal}
      {files.map((file) => (
        <div
          key={file.id}
          className="p-2.5 relative mr-4 mb-4 inline-block bg-white drop-shadow-md rounded-lg cursor-pointer w-64 text-left transition ease-in-out delay-100 hover:scale-110 duration-300"
          onClick={() => openEditor(file)}
          role="button"
          tabIndex={0}
        >
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-base truncate text-gray-700">
              {file.name.substring(0, file.name.lastIndexOf('.'))}
            </h3>
            <button className="text-gray-400 hover:text-gray-600 p-1 mr-[-0.25rem]" onClick={(ev) => {
              ev.stopPropagation();
              openEditor(file, "info");
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
