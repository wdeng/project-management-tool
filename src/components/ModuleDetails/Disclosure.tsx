import { Disclosure, Transition } from '@headlessui/react';
import { MdKeyboardArrowDown } from 'react-icons/md';
import EditorModal from '../EditorModal'; // Import your EditorModal
import { useState, useCallback } from 'react';

export interface Option {
  value: string,
  initialOpen?: boolean,
  children?: Option[]
}

interface DisclosurePanelProps {
  option: Option,
  handleCheckboxChange: (option: string) => void,
  mockCheckboxOptions: string[],
  selectedCheckboxOptions: string[],
}

const DisclosurePanel: React.FC<DisclosurePanelProps> = ({
  option,
  handleCheckboxChange,
  mockCheckboxOptions,
  selectedCheckboxOptions,
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
      <Disclosure defaultOpen={option.initialOpen}>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex justify-between w-full px-4 py-2 mt-2 text-sm font-medium text-left text-indigo-800 bg-indigo-100 rounded-lg hover:bg-indigo-200">
              <span>{option.value}</span>
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
              leave="transition-all duration-500 ease-out overflow-y-hidden"
              leaveFrom="max-h-[2000px] opacity-100"
              leaveTo="max-h-0 opacity-10"
            >
              <Disclosure.Panel className="px-4 pt-2 text-sm text-gray-500">
                Content for {option.value}
                <div className="flex flex-wrap items-center">
                  {mockCheckboxOptions.map((checkboxOption) => (
                    <div className="flex items-center space-x-2 mr-8 p-1" key={checkboxOption}>
                      <div className="hover:scale-105">
                      <input
                        type="checkbox"
                        id={checkboxOption}
                        checked={selectedCheckboxOptions.includes(checkboxOption)}
                        onChange={() => handleCheckboxChange(checkboxOption)}
                        className="form-checkbox h-5 w-5 border-gray-300 rounded-sm checked:bg-indigo-500 checked:hover:bg-indigo-500 focus:ring-0 focus:ring-offset-0"
                      />
                      </div>
                      <label
                        htmlFor={checkboxOption}
                        onClick={(event) => {
                          event.preventDefault(); 
                          openModal(checkboxOption);
                        }} 
                        className="cursor-pointer hover:text-indigo-700 hover:underline"
                      >
                        {checkboxOption}
                      </label>
                    </div>
                  ))}
                </div>
                {option.children?.map((childOption) => (
                  <DisclosurePanel
                    key={childOption.value}
                    option={childOption}
                    handleCheckboxChange={handleCheckboxChange}
                    mockCheckboxOptions={mockCheckboxOptions}
                    selectedCheckboxOptions={selectedCheckboxOptions}
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
