// components/ChatButton.tsx

import React, { useState } from 'react';
import { Transition } from '@headlessui/react';
import { MdClose, MdOutlineChat } from 'react-icons/md'; // Import icons from react-icons
import DisclosurePanel from './Disclosure';
import { useSelected } from '@/hooks/useSelectedContext';
import { ProposedItem, resolveIssues } from '@/utils/apis/chatRefine';
import { ModuleHierarchy } from '@/utils/apis';
import ToggleSwitch from '../general/ToggleSwitch';
import ChatInput from '../general/ChatTextArea';
// import ModificationButtons from './ModificationSection';
import ChangesReviewPanel from './ModificationPanel';
import ChatHistory from './ChatHistory';

// export const outlineButtonStyles = "bg-white border-2 border-indigo-500 text-black px-2 rounded-full hover:bg-indigo-500 hover:text-white transition-colors duration-300 disableStyle";

interface ChatButtonProps {
  moduleIdPath: number[];
  modules: ModuleHierarchy[];
}

const ChatButton = ({ moduleIdPath, modules }: ChatButtonProps) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedCheckboxOptions, setSelectedCheckboxOptions] = useState<number[]>([]);
  const [outlineUsed, setUseOutline] = useState(true); // For the Switch
  const [readMore, allowReadMore] = useState(true); // For the Switch
  const { selectedProjectId } = useSelected();

  const [proposedChanges, setProposedChanges] = useState<ProposedItem[]>([
    {
      type: 'module',
      name: 'UserAuth',
      revisionType: "modify",
      original: 'Old module content here\nhello\nworld',
      content: 'New module content here\nhello\nworld',
    },
    {
      type: 'file',
      content: 'New file content here',
      original: 'Old file content here',
      goal: 'Improve readability. Add event listener to update state whenever the content in the editor changes Add event listener to update state whenever the content in the editor changes Add event listener to update state whenever the content in the editor changes',
      module: 'UserAuth',
      name: '/src/UserAuth.js',
      revisionType: 'delete',
    },
    {
      type: 'file',
      content: 'Another new file content',
      original: 'Another old file content',
      goal: 'Refactor code',
      module: 'UserProfile',
      name: '/src/UserProfile.js',
      revisionType: 'modify',
    },
    {
      type: 'file',
      content: 'Yet another new content',
      original: 'Yet another old content',
      goal: 'Add feature',
      module: 'Dashboard',
      name: '/src/Dashboard.js',
      revisionType: 'add',
    },
  ]);


  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleCheckboxChange = (option: number) => {
    setSelectedCheckboxOptions((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  };

  const handleChatSubmit = async (issues: string) => {
    console.log('issues', issues);
    if (selectedProjectId) {
      const data = await resolveIssues(
        selectedProjectId, issues, readMore, selectedCheckboxOptions
      );

      if (data.type === 'readFiles') {
        setSelectedCheckboxOptions(v => [...v, ...data.fileIds])
      } else {
        Array.isArray(data) ? setProposedChanges(data) : setProposedChanges([data]);
      }
    }
  }

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
        <div className="absolute bottom-0 text-gray-700 right-0 p-4 rounded-lg shadow-2xl bg-gray-200 w-[48rem] max-h-[92vh] flex flex-col">
          <button
            onClick={toggleChat}
            className="absolute top-3 right-3"
          >
            <MdClose className="text-gray-500 hover:text-gray-600" size={24} />
          </button>
          <div className="overflow-y-auto flex-grow my-4">
            <h2 className="font-semibold text-2xl">Select the resources to expose to Debugger</h2>
            <p className='text-gray-500 mb-5 text-sm'>Please note GPT-4 has 8k token limit</p>
            <ChatHistory steps={[]} />
            <div className="mb-4 bg-white px-6 py-3 rounded-lg drop-shadow-sm">
              <ToggleSwitch enabled={outlineUsed} setEnabled={setUseOutline} label='Project Outline' />
              <hr className='border-gray-300 my-3 mr-[-1.5rem]' />
              <ToggleSwitch enabled={readMore} setEnabled={allowReadMore} label='Agent Read More Files' />
            </div>
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
            {proposedChanges && <ChangesReviewPanel changes={proposedChanges} />}
          </div>
          <ChatInput onSend={handleChatSubmit} />
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
