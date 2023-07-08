// components/ChatButton.tsx

import React, { useState } from 'react';
import { Transition } from '@headlessui/react';
import { MdClose, MdOutlineChat } from 'react-icons/md'; // Import icons from react-icons
import DisclosurePanel from './ModuleDetails/Disclosure';
import { ModuleHierarchy } from '../utils/apiREAL';
import ToggleSwitch from './general/ToggleSwitch';
import ChatInput from './general/ChatTextArea';
import { outlineButtonStyles } from '@/utils/tailwindStyles';

// export const outlineButtonStyles = "bg-white border-2 border-indigo-500 text-black px-2 rounded-full hover:bg-indigo-500 hover:text-white transition-colors duration-300 disableStyle";

interface ChatButtonProps {
  moduleIdPath: number[];
  modules: ModuleHierarchy[];
}

const ChatButton = ({ moduleIdPath, modules }: ChatButtonProps) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedCheckboxOptions, setSelectedCheckboxOptions] = useState<string[]>([]);
  const [outlineUsed, setUseOutline] = useState(true); // For the Switch
  const [readMore, allowReadMore] = useState(true); // For the Switch

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleCheckboxChange = (option: string) => {
    setSelectedCheckboxOptions((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  };

  return (
    <div className="z-10 fixed bottom-10 right-12">
      <Transition
        show={isChatOpen}
        enter="transition-all transform duration-300"
        enterFrom="opacity-0 scale-75 origin-bottom-right"
        enterTo="opacity-100 scale-100"
        leave="transition-all transform duration-300"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-75 origin-bottom-right"
      >
        <div className="absolute bottom-0 text-gray-700 right-0 p-4 rounded-lg shadow-2xl bg-gray-200 w-[52rem] max-h-[92vh] flex flex-col">
          {/* close button */}
          <button
            onClick={toggleChat}
            className="absolute top-3 right-3"
          >
            <MdClose className="text-gray-500 hover:text-gray-600" size={24} />
          </button>
          <div className="overflow-y-auto flex-grow my-4">
            <h3 className="font-semibold text-lg">Select the resources to expose to Debugger</h3>
            <p className='text-gray-500 mb-5 text-sm'>Please note GPT-4 has 8k token limit</p>
            <hr className='border-gray-300 my-8' />
            <ToggleSwitch enabled={outlineUsed} setEnabled={setUseOutline} label='Project Outline' />
            <ToggleSwitch enabled={readMore} setEnabled={allowReadMore} label='Allow Agent to Read More Files' />
            <p>Project Modules:</p>
            <div className="mt-6">
              {modules.map((m) => (
                <DisclosurePanel
                  key={m.id}
                  isInitOpen={moduleIdPath[0] === m.id}
                  aModule={m}
                  handleCheckboxChange={handleCheckboxChange}
                  selectedCheckboxOptions={selectedCheckboxOptions}
                  moduleIdPath={moduleIdPath.slice(1)}
                />
              ))}
            </div>
            <div className="mt-6">
              <span className="mr-6">placeholder for response</span>
              <button
                className={`${outlineButtonStyles} mr-2`}
                disabled={false}
                onClick={() => { console.log('Will Integrate'); }}
              >
                Accept
              </button>
              <button
                disabled={true}
                className={`${outlineButtonStyles}`}
              >
                Reject
              </button>
            </div>
          </div>
          <ChatInput onSend={() => { }} />
        </div>
      </Transition>

      {/* main button */}
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
          onClick={toggleChat}
        >
          <MdOutlineChat size={20} />
        </button>
      </Transition>
    </div>
  );
};

export default ChatButton;
