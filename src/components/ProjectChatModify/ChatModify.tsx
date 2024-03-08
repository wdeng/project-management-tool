import React, { useState, ReactElement, useEffect } from 'react';
import { Transition } from '@headlessui/react';
import { MdClose, MdOutlineChat } from 'react-icons/md';
import { useSelected } from '@/hooks/useSelectedContext';
import { ChatInputType, ProposedDirectAnswer, ProposedItem, RefineResource, clearIssueHistory, getIssueHistory, resolveIssues } from '@/utils/apis/chatRefine';
import FilesOutlinePanel from './AnswerPanels/FilesOutlinePanel';
import ChatHistory from './ChatHistory';
import DirectAnswerPanel from './AnswerPanels/DirectAnswerPanel';
import useScrollToBottom from '@/hooks/useScrollToBottom';
import ResourcesSelector from '../general/ResourcesSelector';
import ImageChatInput from '../general/ChatFields/ImageChat';

interface ChatButtonProps {
}

const ChatButton = ({ }: ChatButtonProps) => {
  const { selectedProjectId } = useSelected();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedCheckboxOptions, setSelectedCheckboxOptions] = useState<number[]>([]);
  const [resourcesEnabled, setResourcesEnabled] = useState<RefineResource[]>(['outline', 'read_more_files']);

  const [interactHistory, setHistory] = useState<string[]>([]);
  const [ChangesPanel, setProposePanel] = useState<ReactElement | null>(null);

  const syncHistory = async (h?: string[] | null) => {
    h && setHistory(h);
    setProposePanel(null);
  }
  const toggleChat = () => setIsChatOpen(!isChatOpen);

  useEffect(() => {
    if (isChatOpen && selectedProjectId) {
      const getHistory = async () => {
        const data = await getIssueHistory(selectedProjectId);
        setHistory(data.history);
        if (data.toolType)
          applyIssueResolve(data.toolType, data.changes);
      }
      getHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isChatOpen, selectedProjectId])

  const submitUserIssue = async (issues: ChatInputType = null, abortController: AbortController | undefined = undefined) => {
    if (!selectedProjectId) return;
    if (issues != null)
      setHistory(prev => [...prev, `userIssue: ${issues.text}`]);
    const data = await resolveIssues(
      selectedProjectId,
      issues,
      selectedCheckboxOptions,
      resourcesEnabled,
      abortController,
    );
    if (data) {
      setProposePanel(null);
      applyIssueResolve(data.toolType, data.changes);
    }
  }

  const applyIssueResolve = (toolType: string, changes: any) => {
    switch (toolType) {
      case 'ReadMoreFiles':
        setHistory(prev => [...prev, `Read more files: ${changes.content}`]);
        setSelectedCheckboxOptions(v => [...v, ...changes.fileIds])
        break;
      case 'TaskComplete':
        setHistory(prev => [...prev, `Task completed: ${changes}`]);
        break;
      case 'DirectAnswer':
        setProposePanel(<DirectAnswerPanel answer={changes as ProposedDirectAnswer} />);
        break;
      default:
        setProposePanel(
          <FilesOutlinePanel changes={changes as ProposedItem[]} syncHistory={syncHistory} nextStep={submitUserIssue} />
        );
    }
  }

  const bottomRef = useScrollToBottom(ChangesPanel)

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
        <div className="absolute bottom-0 text-gray-700 right-0 rounded-lg shadow-2xl bg-gray-200 w-[48rem] max-h-[92vh] flex flex-col">
          <button
            onClick={toggleChat}
            className="absolute top-3 right-3 z-10"
          >
            <MdClose className="text-gray-500 hover:text-gray-600" size={24} />
          </button>
          <div className="overflow-y-auto flex-grow p-4">
            <ResourcesSelector
              resourcesEnabled={resourcesEnabled}
              setResourcesEnabled={setResourcesEnabled}
              selectedCheckboxOptions={selectedCheckboxOptions}
              setSelectedCheckboxOptions={setSelectedCheckboxOptions}
            />
            <ChatHistory
              steps={interactHistory}
              clearHistory={() => {
                clearIssueHistory(selectedProjectId!);
                syncHistory([]);
                setProposePanel(null);
              }}
            />
            {ChangesPanel}
            <div ref={bottomRef} />
          </div>
          <div className='p-2 pt-0'>
            <ImageChatInput onSend={submitUserIssue} />
          </div>
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
          className="absolute bottom-3 right-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-2 rounded-3xl drop-shadow-lg transition ease-in-out hover:scale-105"
          onClick={toggleChat}
        >
          <MdOutlineChat size={20} />
        </button>
      </Transition>
    </div>
  );
};

export default ChatButton;
