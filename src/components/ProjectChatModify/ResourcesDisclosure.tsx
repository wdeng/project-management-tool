import { MdKeyboardArrowDown } from 'react-icons/md';
import FileEditorModal from '../modals/FileEditorModal'; // Import your EditorModal
import { useState } from 'react';
import { ModuleHierarchy } from '@/apis';
import { checkboxStyles } from '@/utils/tailwindStyles';
import useRetract from '@/hooks/useRetract';

export interface Option {
  value: string,
  initialOpen?: boolean,
  children?: Option[]
}

interface DisclosurePanelProps {
  aModule: ModuleHierarchy,
  handleCheckboxChange: (fileRelPath: number) => void,
  selectedCheckboxOptions: number[],  // relative paths
  isInitOpen?: boolean,
}

const DisclosurePanel: React.FC<DisclosurePanelProps> = ({
  aModule,
  handleCheckboxChange,
  selectedCheckboxOptions,
  isInitOpen = false,
}) => {
  const [menuHeight, isMenuOpen, toggleMenu, menuRef] = useRetract(isInitOpen);

  const [editingFileId, setEditingFileId] = useState<number | null>(null);
  const openEditor = (fileId: number) => setEditingFileId(fileId);
  const closeEditor = () => setEditingFileId(null);

  return (
    <>
      <div className="w-full">
        <button className="flex justify-between w-full px-4 py-2 mt-2 text-sm font-medium text-left text-indigo-800 bg-indigo-100 rounded-lg hover:bg-indigo-200" onClick={toggleMenu} >
          <span>{aModule.name}</span>
          <MdKeyboardArrowDown
            className={`transition-transform ${isMenuOpen && menuHeight ? 'rotate-180' : ''} w-5 h-5 text-indigo-500`}
          />
        </button>
        {isMenuOpen && <div
          ref={menuRef}
          className="text-sm text-gray-500"
          style={{
            height: menuHeight,
            transition: 'height 160ms ease-in-out',
            overflowY: 'hidden',
          }}
        >
          <div className="px-3 pt-2 flex flex-wrap items-center">
            {aModule.files?.map((file) => {
              if (file.status !== "pending")
                return (
                  <div className="flex items-center space-x-2 mr-8 p-1" key={file.id}>
                    <div className="hover:scale-110">
                      <input
                        type="checkbox"
                        id={file.name}
                        checked={selectedCheckboxOptions.includes(file.id)}
                        onChange={() => handleCheckboxChange(file.id)}
                        className={checkboxStyles}
                      />
                    </div>
                    <label
                      htmlFor={file.name}
                      onClick={(event) => {
                        event.preventDefault();
                        openEditor(file.id);
                      }}
                      className="cursor-pointer hover:text-indigo-700 hover:underline"
                    >
                      {file.name}
                    </label>
                  </div>
                )
            })}
          </div>
          {aModule.modules?.map((subModule, idx) => (
            <DisclosurePanel
              key={subModule.id}
              aModule={subModule}
              handleCheckboxChange={handleCheckboxChange}
              selectedCheckboxOptions={selectedCheckboxOptions}
              isInitOpen={idx === 0}
            />
          ))}
        </div>}
      </div>
      <FileEditorModal fileIdOrName={editingFileId} onClose={closeEditor} allowChat={false} />
    </>
  );
};

export default DisclosurePanel;
