import React, { useState } from 'react';
import { Menu } from '@headlessui/react';
import { MdSearch, MdRefresh, MdNotifications, MdSettings } from 'react-icons/md';
import Dropdown from '../general/Dropdown';
import { useSelected } from '@/hooks/useSelectedContext';
import { deleteAllFiles, deleteProject } from '@/utils/apis';

interface TopBarProps {
  syncProject: () => void;
}

const TopBar = ({ syncProject }: TopBarProps) => {
  const { selectedProjectId, setSelectedProjectId, setSelectedModule } = useSelected();
  const [searchActive, setSearchActive] = useState(false);
  const [newNotifications, setNewNotifications] = useState(true); // set to true for demo

  const _deleteProject = async () => {
    if (selectedProjectId && window.confirm("Are you sure to delete this project?")) {
      await deleteProject(selectedProjectId);
      setSelectedModule(null);
      setSelectedProjectId(null);
    }
  };

  const _deleteAllFiles = async () => {
    if (selectedProjectId && window.confirm("Are you sure to delete all files in this project?")) {
      await deleteAllFiles(selectedProjectId);
    }
  }


  return (
    <div className="bg-gray-100 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Search Bar */}
        <div className="relative">
          <MdSearch className="text-gray-600 absolute top-[50%] left-3 transform -translate-y-1/2 text-2xl" />
          <input
            type="text"
            placeholder="Search..."
            onFocus={() => setSearchActive(true)}
            onBlur={() => setSearchActive(false)}
            className="pl-10 pr-4 py-2 rounded-full border-0 bg-white focus:ring-0 focus:outline-none shadow-lg w-72"
          />
          <Dropdown show={searchActive}>
            <div className="absolute left-0 mt-1 w-full bg-white rounded border shadow-lg z-10 p-2">
              {/* Your dropdown items here */}
              <p>Item 1</p>
              <p>Item 2</p>
              {/* ... */}
            </div>
          </Dropdown>
        </div>
        {/* Icons on the right */}
        <div className="flex items-center space-x-5">
          <button onClick={syncProject}>
            <MdRefresh className="text-gray-600 text-2xl" />
          </button>
          <button onClick={() => console.log('Notifications clicked')}>
            <div className="relative">
              <MdNotifications className="text-gray-600 text-2xl" />
              {newNotifications && <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-red-500 border-2 border-gray-100" />}
            </div>
          </button>
          <Menu as="div" className="relative h-6">
            <Menu.Button as="button">
              <MdSettings className="text-gray-600 text-2xl" />
            </Menu.Button>
            <Dropdown>
              <Menu.Items className="absolute right-0 mt-0 w-48 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none">
                <Menu.Item>
                  <button
                    className='hover:bg-gray-100 group flex items-center w-full px-4 py-2 text-sm text-gray-700'
                    onClick={_deleteProject}
                  >
                    Delete Project
                  </button>
                </Menu.Item>
                <Menu.Item>
                  <button
                    className='hover:bg-gray-100 group flex items-center w-full px-4 py-2 text-sm text-gray-700'
                    onClick={_deleteAllFiles}
                  >
                    Clear Files
                  </button>
                </Menu.Item>
              </Menu.Items>
            </Dropdown>
          </Menu>
        </div>

      </div>
      <div className="border-t mt-4"></div>
    </div>
  );
};

export default TopBar;
