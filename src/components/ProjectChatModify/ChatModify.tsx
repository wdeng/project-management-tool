import React, { useState, ReactElement, useEffect } from 'react';
import { Transition } from '@headlessui/react';
import { MdClose, MdOutlineChat } from 'react-icons/md';
import DisclosurePanel from './Disclosure';
import { useSelected } from '@/hooks/useSelectedContext';
import { ChatInputType, ProposedDirectAnswer, ProposedItem, REFINE_RESOURCES, RefineResource, clearIssueHistory, getIssueHistory, resolveIssues } from '@/utils/apis/chatRefine';
import { ModuleHierarchy } from '@/utils/apis';
import ToggleSwitch from '../general/ToggleSwitch';
import ChatInput from '../general/ChatTextArea';
import FilesOutlinePanel from './AnswerPanels/FilesOutlinePanel';
import ChatHistory from './ChatHistory';
import DirectAnswerPanel from './AnswerPanels/DirectAnswerPanel';
import useScrollToBottom from '@/hooks/useScrollToBottom';

interface ChatButtonProps {
  moduleIdPath: number[];
  modules: ModuleHierarchy[];
}

const ChatButton = ({ moduleIdPath, modules }: ChatButtonProps) => {
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

  const handleCheckboxChange = (option: number) => {
    setSelectedCheckboxOptions((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  }

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
            <h2 className="font-semibold text-2xl">Select the resources to expose to Debugger</h2>
            <p className='text-gray-500 mb-5 text-sm'>Please note GPT-4 has 8k token limit</p>
            <div className="mb-4 bg-white px-6 py-3 rounded-lg drop-shadow-sm">
              {Object.entries(REFINE_RESOURCES).map(([resource, label], index) => (
                <div key={resource}>
                  {index ? <hr className='border-gray-300 my-3 mr-[-1.5rem]' /> : null}
                  <ToggleSwitch
                    enabled={resourcesEnabled.includes(resource as RefineResource)}
                    setEnabled={(newState) => {
                      setResourcesEnabled(prevState =>
                        newState ? [...prevState, resource as RefineResource] : prevState.filter(res => res !== resource)
                      );
                    }}
                    label={label}
                  />
                </div>
              ))}
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
            <ChatInput onSend={submitUserIssue} />
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
