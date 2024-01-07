import React, { useState, useRef, useEffect } from 'react';
import { Disclosure, Transition } from '@headlessui/react';
import { MdKeyboardArrowDown } from 'react-icons/md';
import FileEditorModal from '../general/FileEditorModal'; // Import your EditorModal
import { ModuleHierarchy } from '@/utils/apis';
import { checkboxStyles } from '@/utils/tailwindStyles';

export interface Option {
  value: string;
  initialOpen?: boolean;
  children?: Option[];
}

interface DisclosurePanelProps {
  aModule: ModuleHierarchy;
  handleCheckboxChange: (fileRelPath: number) => void;
  selectedCheckboxOptions: number[]; // relative paths
  isInitOpen: boolean;
  moduleIdPath: number[];
}

const DisclosurePanel: React.FC<DisclosurePanelProps> = ({
  aModule,
  handleCheckboxChange,
  selectedCheckboxOptions,
  isInitOpen,
  moduleIdPath,
}) => {
  const [editingFileId, setEditingFileId] = useState<number | null>(null);
  const [panelHeight, setPanelHeight] = useState<number | undefined>(0);
  const panelRef = useRef<HTMLDivElement>(null);

  const openEditor = (fileId: number) => {
    setEditingFileId(fileId);
  };

  const closeEditor = () => {
    setEditingFileId(null);
  };

  useEffect(() => {
    if (panelRef.current) {
      setPanelHeight(isInitOpen ? panelRef.current.scrollHeight : 0);
    }
  }, [isInitOpen]);

  return (
    <>
      <Disclosure defaultOpen={isInitOpen} as="div" className="w-full">
        {({ open }) => (
          <>
            <Disclosure.Button className="flex justify-between w-full px-4 py-2 mt-2 text-sm font-medium text-left text-indigo-800 bg-indigo-100 rounded-lg hover:bg-indigo-200">
              <span>{aModule.name}</span>
              <MdKeyboardArrowDown
                className={`transition-transform ${open ? 'rotate-180' : ''} w-5 h-5 text-indigo-500`}
              />
            </Disclosure.Button>
            <Transition
              show={open}
              enter="transition-height duration-300 ease-out"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-height duration-300 ease-in"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterEnter={() => {
                if (panelRef.current) {
                  setPanelHeight(panelRef.current.scrollHeight);
                }
              }}
              beforeLeave={() => {
                if (panelRef.current) {
                  setPanelHeight(0);
                }
              }}
            >
              <Disclosure.Panel
                static
                className="text-sm text-gray-500"
                style={{ height: panelHeight }}
              >
                <div ref={panelRef} className="overflow-hidden transition-all">
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
                </div>
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
