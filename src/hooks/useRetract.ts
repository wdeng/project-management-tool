import { useCallback, useEffect, useRef, useState } from 'react';

const useRetract = (isInitOpen: boolean): any => {
  const menuRef = useRef<HTMLDivElement>();
  const [menuHeight, setMenuHeight] = useState<number | undefined>(0);
  const [isMenuOpen, setIsMenuOpen] = useState(isInitOpen);

  useEffect(() => {
    if (isMenuOpen)
      setMenuHeight(menuRef.current?.scrollHeight)
  }, [isMenuOpen])

  const toggleMenu = useCallback(() => {
    if (isMenuOpen) {
      setMenuHeight(0);
      setTimeout(() => setIsMenuOpen(false), 200);
    } else
      setIsMenuOpen(true);
  }, [isMenuOpen]);

  return [menuHeight, isMenuOpen, toggleMenu, menuRef];
};

export default useRetract;
