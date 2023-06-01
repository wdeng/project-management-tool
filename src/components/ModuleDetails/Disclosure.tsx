import { Disclosure, Transition } from '@headlessui/react';
import { MdKeyboardArrowDown } from 'react-icons/md';
import EditorModal from '../EditorModal'; // Import your EditorModal
import { useState, useCallback } from 'react';
import { Module } from '@/utils/api';

export interface Option {
  value: string,
  initialOpen?: boolean,
  children?: Option[]
}

interface DisclosurePanelProps {
  mod: Module,
  handleCheckboxChange: (filePath: string) => void,
  selectedCheckboxOptions: string[],
  isInitOpen: boolean,
  moduleIdPath: number[],
}

const DisclosurePanel: React.FC<DisclosurePanelProps> = ({
  mod,
  handleCheckboxChange,
  selectedCheckboxOptions,
  isInitOpen,
  moduleIdPath,
}) => {
  // Create new state for the modal open state and the content to display
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const openModal = useCallback((content: string) => {
    setModalContent(content);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleModalChange = useCallback((value: string | undefined) => {
    // Handle modal content change
  }, []);

  return (
    <>
      <Disclosure defaultOpen={isInitOpen}>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex justify-between w-full px-4 py-2 mt-2 text-sm font-medium text-left text-indigo-800 bg-indigo-100 rounded-lg hover:bg-indigo-200">
              <span>{mod.name}</span>
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
                Content for {mod.name}
                <div className="flex flex-wrap items-center">
                  {mod.files?.map((file) => (
                    <div className="flex items-center space-x-2 mr-8 p-1" key={file.filePath}>
                      <div className="hover:scale-110">
                        <input
                          type="checkbox"
                          id={file.filePath}
                          checked={selectedCheckboxOptions.includes(file.filePath)}
                          onChange={() => handleCheckboxChange(file.filePath)}
                          className="form-checkbox h-5 w-5 border-gray-300 rounded-sm checked:bg-indigo-500 checked:hover:bg-indigo-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                        />
                      </div>
                      <label
                        htmlFor={file.filePath}
                        onClick={(event) => {
                          event.preventDefault();
                          openModal(file.filePath);
                        }}
                        className="cursor-pointer hover:text-indigo-700 hover:underline"
                      >
                        {file.filePath}
                      </label>
                    </div>
                  ))}
                </div>
                {mod.modules?.map((subModule) => (
                  <DisclosurePanel
                    key={subModule.id}
                    mod={subModule}
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
      <EditorModal isOpen={isModalOpen} onClose={closeModal} value={modalContent} onChange={handleModalChange} />
    </>
  );
};

export default DisclosurePanel;
