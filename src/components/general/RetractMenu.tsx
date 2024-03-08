import { Menu } from '@headlessui/react';
import React from 'react';
import { MdKeyboardArrowDown, MdMenu } from 'react-icons/md';
import Dropdown from './Dropdown';
import { contextMenuItemStyles, contextMenuStyles } from '@/utils/tailwindStyles';
import useRetract from '@/hooks/useRetract';


interface Props {
  children?: React.ReactNode;
}
const RetractMenu: React.FC<Props> = ({
  children,
}) => {
  const [menuHeight, isMenuOpen, toggleMenu, menuRef] = useRetract(true);

  return (
    <div className="w-full text-white">
      <div className="flex justify-between items-center">
        <button
          onClick={toggleMenu}
          className="flex items-center w-full p-2 text-xs font-medium text-left uppercase"
        >
          <MdKeyboardArrowDown className={`mr-1 w-5 h-5 transition-transform ${isMenuOpen && menuHeight ? 'rotate-180' : 'rotate-0'}`} />
          Group 1
        </button>
        <Menu as="div" className="relative">
          <Menu.Button className='p-2 hover:text-gray-300' >
            <MdMenu size={16} />
          </Menu.Button>
          <Dropdown>
            <Menu.Items className={`${contextMenuStyles} min-w-[100px]`}>
              <Menu.Item>
                <button className={contextMenuItemStyles}>Rename</button>
              </Menu.Item>
              <Menu.Item>
                <button className={contextMenuItemStyles}>Info</button>
              </Menu.Item>
            </Menu.Items>
          </Dropdown>
        </Menu>
      </div>
      {isMenuOpen && <ul
        ref={menuRef}
        style={{
          height: menuHeight,
          transition: 'height 150ms ease-in-out',
          overflowY: 'hidden',
        }}
      >
        {children}
      </ul>}
    </div>
  );
};

export default RetractMenu;
