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
  className?: string; // Add a className prop
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, height, svgButton1, onSvgButton1Click, svgButton2, onSvgButton2Click, className }) => {
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
        className="fixed inset-0 z-10"
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
            <div className={`w-full max-w-4xl text-left align-middle bg-gray-100 shadow-xl rounded-2xl overflow-clip text-gray-700`}>
              <div className="sticky inset-x-0 top-0 flex justify-between items-center z-10 bg-gray-100 border-b p-4">
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
              <div className={`overflow-y-auto ${height ? `h-[${height}]` : ''} max-h-[80vh] ${className}`}>
                {children}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;

