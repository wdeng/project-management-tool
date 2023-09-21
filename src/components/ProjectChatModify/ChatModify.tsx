import React, { useState } from 'react';
import { Transition } from '@headlessui/react';
import { MdClose, MdOutlineChat } from 'react-icons/md';
import DisclosurePanel from './Disclosure';
import { useSelected } from '@/hooks/useSelectedContext';
import { ProposedDirectAnswer, ProposedItem, REFINE_RESOURCES, RefineResource, resolveIssues } from '@/utils/apis/chatRefine';
import { ModuleHierarchy } from '@/utils/apis';
import ToggleSwitch from '../general/ToggleSwitch';
import ChatInput from '../general/ChatTextArea';
import ChangesReviewPanel from './ModificationPanel';
import ChatHistory from './ChatHistory';
import Spinner from '../general/Spinner';
import NextSteps from './NextStepsPanel';

interface ChatButtonProps {
  moduleIdPath: number[];
  modules: ModuleHierarchy[];
}

const ChatButton = ({ moduleIdPath, modules }: ChatButtonProps) => {
  const { selectedProjectId } = useSelected();
  const [isChatOpen, setIsChatOpen] = useState(false);
  // resources for GPT
  const [selectedCheckboxOptions, setSelectedCheckboxOptions] = useState<number[]>([]);
  const [resourcesEnabled, setResourcesEnabled] = useState<RefineResource[]>(['outline', 'read_more_files']);

  const [currentIssueId, setIssueId] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [proposedChanges, setProposedChanges] = useState<ProposedItem[] | ProposedDirectAnswer>([]);
  const [nextSteps, setNextSteps] = useState<string[]>([]);
  const [resolving, setResolving] = useState(false);

  const clearHistory = () => {
    setHistory([]);
    setIssueId(null);
    setNextSteps([]);
    setResolving(false);
  }
  const resetHistory = (h?: string[] | null) => {
    if (h != null)
      setHistory(h);
    else {
      clearHistory();
    }
    setProposedChanges([]);
    setResolving(false);
  }
  const toggleChat = () => setIsChatOpen(!isChatOpen);

  const handleCheckboxChange = (option: number) => {
    setSelectedCheckboxOptions((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  };

  const handleChatSubmit = async (issues: string | null = null) => {
    if (!selectedProjectId || !issues && !currentIssueId) return;
    if (issues != null)
      setHistory(prev => [...prev, `User issue: ${issues}`]);
    setResolving(true);
    const { toolType, changes, issueId, steps } = await resolveIssues(
      selectedProjectId, issues, currentIssueId, selectedCheckboxOptions, resourcesEnabled
    );
    if (issueId !== currentIssueId)
      setIssueId(issueId);

    if (toolType === 'ReadMoreFiles') {
      setHistory(prev => [...prev, `Read more files: ${changes.content}`]);
      setSelectedCheckboxOptions(v => [...v, ...changes.fileIds])
      setResolving(false);
    } else if (toolType === 'TaskComplete') {
      setHistory(prev => [...prev, `Task completed: ${changes}`]);
      setResolving(false);
    } else
      setProposedChanges(changes);
    const _steps = steps || [];
    _steps.shift();
    setNextSteps(_steps);
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
            {!!Object.keys(proposedChanges).length ? <ChangesReviewPanel
              changes={proposedChanges}
              issueId={currentIssueId}
              reset={resetHistory}
            /> : <NextSteps
              steps={nextSteps}
              proceed={()=>handleChatSubmit(null)}
              deny={() => setNextSteps([])}
            />}
            <ChatHistory steps={history} clearHistory={clearHistory} />
          </div>
          <div className='p-4 pt-0'>
            {resolving ? <Spinner spinnerSize={24} className='mt-4' /> : <ChatInput onSend={handleChatSubmit} />}
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
          className="absolute bottom-4 right-4 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-3 rounded-3xl drop-shadow-lg transition ease-in-out hover:scale-105"
          onClick={toggleChat}
        >
          <MdOutlineChat size={20} />
        </button>
      </Transition>
    </div>
  );
};

export default ChatButton;
