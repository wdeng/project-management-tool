// components/ChatButton.tsx

import React, { useState } from 'react';
import { Switch, Transition } from '@headlessui/react';
import { MdClose, MdOutlineChat, MdSend } from 'react-icons/md'; // Import icons from react-icons
import DisclosurePanel, {Option} from './Disclosure';

const mockCheckboxOptions = ['data_utils/data_utils.py', 'data_utils/api_utils.py', 'data_utils/database_utils.py', 'data_utils/others.py'];

const options = [
  {
    value: 'Option 1',
    initialOpen: true,
    children: [
      {
        value: 'Sub-Option 1.1',
        initialOpen: false,
        children: [
          { value: 'Sub-Sub-Option 1.1.1', initialOpen: true },
          { value: 'Sub-Sub-Option 1.1.2', initialOpen: false },
        ]
      },
      { value: 'Sub-Option 1.2', initialOpen: true },
    ],
  },
  { value: 'Option 2', initialOpen: false },
];

const ChatButton = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatText, setChatText] = useState('');
  const [selectedCheckboxOptions, setSelectedCheckboxOptions] = useState<string[]>([]);
  const [enabled, setEnabled] = useState(false); // For the Switch

  const handleButtonClick = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setChatText(event.target.value);
  };

  const handleCheckboxChange = (option: string) => {
    setSelectedCheckboxOptions((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  };

  const textAreaRows = Math.min(12, Math.max(1, chatText.split('\n').length));

  return (
    <div className="z-10 absolute bottom-10 right-12">
      <Transition
        show={isChatOpen}
        enter="transition-all transform duration-300"
        enterFrom="opacity-0 scale-90 origin-bottom-right"
        enterTo="opacity-100 scale-100"
        leave="transition-all transform duration-300"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-75 origin-bottom-right"
      >
        <div className="absolute bottom-0 text-gray-700 right-0 p-4 rounded-lg shadow-2xl bg-gray-200 w-[52rem] max-h-[92vh] flex flex-col">
          <button
            onClick={handleButtonClick}
            className="absolute top-3 right-3"
          >
            <MdClose className="text-gray-500 hover:text-gray-600" size={24} />
          </button>
          <div className="overflow-y-auto flex-grow mt-4">
            <h3 className="font-semibold text-lg">Select the resources to expose to Debugger</h3>
            <p className='text-gray-500 mb-5 text-sm'>Please note GPT-4 has 8k token limit</p>
            <hr className='border-gray-300 my-8' />

            <Switch.Group as="div" className="flex items-center space-x-3 pb-4">
              <Switch.Label className='font-semibold'>Project Outline</Switch.Label>
              <Switch
                checked={enabled}
                onChange={setEnabled}
                className={`${enabled ? 'bg-indigo-600' : 'bg-gray-400'
                  } relative inline-flex items-center h-6 rounded-full w-11`}
              >
                <span className="sr-only">Enable or disable</span>
                <span
                  className={`${enabled ? 'translate-x-6' : 'translate-x-1'
                    } inline-block w-4 h-4 transform bg-white rounded-full`}
                />
              </Switch>
            </Switch.Group>

            <p>Project Modules:</p>
            <div className="mt-6">
              {options.map((option) => (
                <DisclosurePanel
                  key={option.value}
                  option={option}
                  handleCheckboxChange={handleCheckboxChange}
                  mockCheckboxOptions={mockCheckboxOptions}
                  selectedCheckboxOptions={selectedCheckboxOptions}
                />
              ))}
            </div>
          </div>


          <div className="flex justify-between">
            <textarea
              className="w-full rounded-lg p-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 shadow-md resize-none"
              rows={textAreaRows}
              value={chatText}
              onChange={handleTextChange}
              placeholder='Type your issue here...'
            />
            <button
              className="absolute right-6 bottom-6 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-2 rounded-3xl transition-all duration-300 shadow-md"
            >
              <MdSend size={16} />
            </button>
          </div>
        </div>
      </Transition>

      <Transition
        as={React.Fragment}
        show={!isChatOpen}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300 delay-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <button
          className="absolute bottom-4 right-4 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-3 px-3 rounded-3xl drop-shadow-lg"
          onClick={handleButtonClick}
        >
          <MdOutlineChat size={20} />
        </button>
      </Transition>

    </div>
  );
};

export default ChatButton;
