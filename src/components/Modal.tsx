import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, ReactNode } from "react";
import { MdClose } from 'react-icons/md'; // Import icons from react-icons

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  height?: string;
  svgButton1?: ReactNode;
  onSvgButton1Click?: () => void;
  svgButton2?: ReactNode;
  onSvgButton2Click?: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, height, svgButton1, onSvgButton1Click, svgButton2, onSvgButton2Click }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}
      enter="ease-out duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="ease-in duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0">
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={onClose}
      >
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-60" />
        <div className="flex items-center justify-center min-h-screen text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className={`inline-block w-full max-w-4xl my-8 overflow-y-auto text-left align-middle transition-all transform bg-gray-100 shadow-xl rounded-2xl text-gray-700 ${height ? `h-[${height}]` : ''} max-h-[88vh]`}>
              <div className="flex justify-between items-center border-b p-4">
                <Dialog.Title as="h3" className="text-xl leading-6 font-semibold">
                  {title}
                </Dialog.Title>
                <div>
                  {svgButton1 && (
                    <button onClick={onSvgButton1Click} className="mr-2">
                      {svgButton1}
                    </button>
                  )}
                  {svgButton2 && (
                    <button onClick={onSvgButton2Click} className="mr-2">
                      {svgButton2}
                    </button>
                  )}
                  <button onClick={onClose}>
                    <MdClose className="text-gray-400 hover:text-gray-500" />
                  </button>
                </div>
              </div>
              {children}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
