import React, { ReactNode, useState } from 'react';
import { Tab } from '@headlessui/react';
import Spinner from '../general/Spinner';
import Modal from './Modal';

interface ModalProps {
  title: string;
  children: ReactNode;
  directInputComponent: ReactNode;
  height?: string;
  isLoading: boolean;
  isOpen: boolean;
  close: () => void;
}

const tabStyle = ({ selected }: any) => (
  `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-indigo-800 rounded-lg ring-white ring-opacity-60 ring-offset-2 ring-offset-indigo-400 focus:outline-none focus:ring-2 ${selected ? 'bg-white shadow' : 'text-indigo-100 hover:bg-white/[0.12] hover:text-white'}`
)

const ItemCreationModal: React.FC<ModalProps> = ({
  children,
  directInputComponent,
  title,
  height = 'h-[80vh]',
  isLoading,
  isOpen,
  close,
}) => {
  return (
    <Modal height={height} isOpen={isOpen} onClose={close} title={title} className={isLoading ? 'pointer-events-none' : ''}>
      {isLoading && (
        <div className={`absolute inset-0 flex items-center justify-center bg-white bg-opacity-40 z-50 pointer-events-auto`}>
          <Spinner />
        </div>
      )}
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-indigo-500 p-1 mx-4">
          <Tab className={tabStyle}>AI Agent</Tab>
          <Tab className={tabStyle}>Direct Input</Tab>
        </Tab.List>
        <Tab.Panels className="mt-2">
          <Tab.Panel>
            {children}
          </Tab.Panel>
          <Tab.Panel>
            {directInputComponent}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </Modal>
  );
};

export default ItemCreationModal;
