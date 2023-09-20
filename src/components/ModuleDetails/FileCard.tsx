import React, { useState, useRef } from 'react';
import { Popover } from '@headlessui/react';
import { MdInfoOutline } from 'react-icons/md';
import { FileDesign } from '@/utils/apis';

interface IFileCardProps {
  file: FileDesign;
  openEditor: (id: number) => void;
}

const FileCard: React.FC<IFileCardProps> = ({ file, openEditor }) => {
  const [popoverDirection, setPopoverDirection] = useState('bottom');
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleButtonClick = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPopoverDirection(rect.top > window.innerHeight / 2 ? 'top' : 'bottom');
    }
  };

  return (
    <div className="p-2 relative mb-4 inline-block">
      <button ref={buttonRef} onClick={() => openEditor(file.id)} className="bg-white drop-shadow-md rounded-lg p-3 mb-4 cursor-pointer w-52 text-left cursor-pointer transition ease-in-out delay-100 hover:scale-110 duration-300">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-l truncate text-gray-700">
            {file.path.split('/').pop()}
          </h3>
          <Popover className="relative">
            <Popover.Button as="div" className="text-gray-400 hover:text-gray-600">
              <MdInfoOutline />
            </Popover.Button>
            <Popover.Panel
              as="div"
              className={`absolute z-10 p-4 rounded-md shadow-lg bg-white dark:bg-gray-800 w-52 ${popoverDirection === 'bottom' ? 'bottom-0' : 'top-0'
                }`}
              focus
            >
              <div>
                <h3 className="font-semibold text-l text-gray-700 mb-2">File: {file.path}</h3>
                <input
                  type="text"
                  value={file.goal}
                  onChange={(e) => {
                    // Update file goal here
                  }}
                  className="mt-1 block w-full border-none outline-none resize-none rounded-md p-2 focus:ring-0"
                  placeholder="Edit goal"
                />
              </div>
            </Popover.Panel>
          </Popover>
        </div>
        <p className="text-gray-400 mt-4 text-sm">{file.goal}</p>
      </button>
    </div>
  );
};

export default FileCard;
