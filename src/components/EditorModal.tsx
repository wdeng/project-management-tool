import React from 'react';
import { Transition, Dialog } from '@headlessui/react';
import { FiX } from 'react-icons/fi';
import Editor from "@monaco-editor/react";

interface EditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  onChange: (value: string | undefined) => void;
}

const EditorModal: React.FC<EditorModalProps> = ({ isOpen, onClose, value, onChange }) => {
  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={onClose}>
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        <div className="min-h-screen px-4 text-center">
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >&#8203;</span>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div 
              className="inline-block w-full max-w-3xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
            >
              <div className="flex justify-between items-center border-b p-6">
                <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                  Editor
                </Dialog.Title>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-800">
                  <FiX size={24} />
                </button>
              </div>
              <div className="mt-2 p-6">
                <Editor
                  height="60vh"
                  defaultLanguage="typescript"
                  value={value}
                  onChange={onChange}
                  theme="vs-dark"
                />
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EditorModal;
