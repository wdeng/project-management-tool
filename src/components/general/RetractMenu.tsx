import React, { useState, useRef, useEffect } from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';


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
      <button
        onClick={()=>setIsMenuOpen(!isMenuOpen)}
        className="flex items-center w-full p-2 text-xs font-medium text-left uppercase"
      >
        Group 1
        <MdKeyboardArrowDown className={`ml-1 w-5 h-5 transition-transform ${isMenuOpen ? 'rotate-180' : 'rotate-0'}`} />
      </button>
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
