import { Menu } from '@headlessui/react';
import React, { useState, useRef, useEffect } from 'react';
import { MdKeyboardArrowDown, MdMenu } from 'react-icons/md';
import Dropdown from './Dropdown';
import { contextMenuItemStyles, contextMenuStyles } from '@/utils/tailwindStyles';


interface Props {
  children?: React.ReactNode;
}
const RetractMenu: React.FC<Props> = ({
  children,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [menuHeight, setMenuHeight] = useState(0);
  const menuRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (menuRef.current) {
      setMenuHeight(isMenuOpen ? menuRef.current.scrollHeight : 0);
    }
  }, [isMenuOpen]);

  return (
    <div className="w-full text-white">
      <div className="flex justify-between items-center">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center w-full p-2 text-xs font-medium text-left uppercase"
        >
          <MdKeyboardArrowDown className={`mr-1 w-5 h-5 transition-transform ${isMenuOpen ? 'rotate-180' : 'rotate-0'}`} />
          Group 1
        </button>
        <Menu as="div" className="relative mb-2">
          <Menu.Button className='p-2 hover:text-gray-300' >
            <MdMenu size={16} />
          </Menu.Button>
          <Dropdown>
            <Menu.Items className={`${contextMenuStyles} w-24`}>
              <Menu.Item>
                <button
                  className={contextMenuItemStyles}
                >
                  Rename
                </button>
              </Menu.Item>
              <Menu.Item>
                <button
                  className={contextMenuItemStyles}
                  onClick={() => { console.log('Import Project') }}
                >
                  Info
                </button>
              </Menu.Item>
            </Menu.Items>
          </Dropdown>
        </Menu>
      </div>
      <ul
        ref={menuRef}
        style={{
          height: menuHeight,
          transition: 'height 150ms ease-in-out',
          overflowY: 'hidden',
        }}
      >
        {children}
      </ul>
    </div>
  );
};

export default RetractMenu;
