import { Disclosure, Transition } from '@headlessui/react';
import { MdKeyboardArrowDown } from 'react-icons/md';
import FileEditorModal from '../general/FileEditorModal'; // Import your EditorModal
import { useState } from 'react';
import { ModuleHierarchy } from '@/utils/apis';
import { checkboxStyles } from '@/utils/tailwindStyles';

export interface Option {
  value: string,
  initialOpen?: boolean,
  children?: Option[]
}

interface DisclosurePanelProps {
  aModule: ModuleHierarchy,
  handleCheckboxChange: (fileRelPath: number) => void,
  selectedCheckboxOptions: number[],  // relative paths
  isInitOpen: boolean,
  moduleIdPath: number[],
}

// TODO:
// - [ ] if selectedCheckboxOptions changed should show the ones that are selected
const DisclosurePanel: React.FC<DisclosurePanelProps> = ({
  aModule,
  handleCheckboxChange,
  selectedCheckboxOptions,
  isInitOpen,
  moduleIdPath,
}) => {
  // Create new state for the modal open state and the content to display
  const [editingFileId, setEditingFileId] = useState<number | null>(null);

  const openEditor = (fileId: number) => {
    setEditingFileId(fileId);
  };

  const closeEditor = () => {
    setEditingFileId(null);
  };

  return (
    <>
      <Disclosure defaultOpen={isInitOpen}>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex justify-between w-full px-4 py-2 mt-2 text-sm font-medium text-left text-indigo-800 bg-indigo-100 rounded-lg hover:bg-indigo-200">
              <span>{aModule.name}</span>
              <MdKeyboardArrowDown
                className={`${open ? 'transform rotate-180' : ''
                  } w-5 h-5 text-indigo-500`}
              />
            </Disclosure.Button>
            <Transition
              show={open}
              enter="transition-all duration-500 ease-in overflow-y-hidden"
              enterFrom="max-h-0"
              enterTo="max-h-[2000px]"
              leave="transition-all duration-300 ease-out overflow-y-hidden"
              leaveFrom="max-h-[2000px] opacity-100"
              leaveTo="max-h-0 opacity-10"
            >
              <Disclosure.Panel className="px-4 pt-2 text-sm text-gray-500">
                <div className="flex flex-wrap items-center">
                  {aModule.files?.map((file) => (
                    <div className="flex items-center space-x-2 mr-8 p-1" key={file.path}>
                      <div className="hover:scale-110">
                        <input
                          type="checkbox"
                          id={file.path}
                          checked={selectedCheckboxOptions.includes(file.id)}
                          onChange={() => handleCheckboxChange(file.id)}
                          className={checkboxStyles}
                        />
                      </div>
                      <label
                        htmlFor={file.path}
                        onClick={(event) => {
                          event.preventDefault();
                          openEditor(file.id);
                        }}
                        className="cursor-pointer hover:text-indigo-700 hover:underline"
                      >
                        {file.path}
                      </label>
                    </div>
                  ))}
                </div>
                {aModule.modules?.map((subModule) => (
                  <DisclosurePanel
                    key={subModule.id}
                    aModule={subModule}
                    handleCheckboxChange={handleCheckboxChange}
                    selectedCheckboxOptions={selectedCheckboxOptions}
                    isInitOpen={moduleIdPath[0] === subModule.id}
                    moduleIdPath={moduleIdPath.slice(1)}
                  />
                ))}
              </Disclosure.Panel>
            </Transition>
          </>
        )}
      </Disclosure>
      <FileEditorModal fileId={editingFileId} onClose={closeEditor} />
    </>
  );
};

export default DisclosurePanel;
