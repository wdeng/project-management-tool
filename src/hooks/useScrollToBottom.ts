import { ReactElement, useEffect, useRef } from 'react';

const useScrollToBottom = (trigger: ReactElement | null) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    if (trigger && bottomRef.current) {
      (bottomRef.current as any).scrollIntoView({ behavior: 'smooth' });
    }
  }, [trigger]);

  return bottomRef;
};

export default useScrollToBottom;
