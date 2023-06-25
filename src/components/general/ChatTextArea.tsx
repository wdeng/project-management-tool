import React, { useRef, useEffect, useState, ChangeEvent, useCallback } from 'react';
import { MdSend } from 'react-icons/md';

interface IChatInputProps {
  onSend: (text: string) => void;
}

const ChatInput: React.FC<IChatInputProps> = ({ onSend }) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [chatText, setChatText] = useState<string>('');
  const maxLines = 12;

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setChatText(e.target.value);
  };

  const handleSend = useCallback(() => {
    console.log('Sending chat text:', chatText);
    onSend(chatText);
    setChatText('');
  }, [chatText, onSend]);

  // Add this useEffect
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
        handleSend();
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
  
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [chatText, handleSend]); // Depend on chatText

  useEffect(() => {
    if (textareaRef.current) {
      const textareaElem = textareaRef.current;
      const style = window.getComputedStyle(textareaElem);
      textareaElem.rows = 1;
      const lineHeight = parseFloat(style.getPropertyValue('line-height'));
      const padding = parseFloat(style.getPropertyValue('padding-top')) + parseFloat(style.getPropertyValue('padding-bottom'));
      const linesHeight = textareaElem.scrollHeight - padding;

      const currentLines = Math.round(linesHeight / lineHeight);
      const calculatedRows = Math.min(currentLines, maxLines);

      textareaElem.rows = calculatedRows;
    }
  }, [chatText]);

  return (
    <div className="flex justify-between">
      <textarea
        ref={textareaRef}
        className="w-full rounded-lg p-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 shadow-md resize-none"
        value={chatText}
        onChange={handleTextChange}
        placeholder='Write your issue here...'
      />
      <button
        disabled={!chatText}
        className={`absolute right-6 bottom-6 bg-indigo-500 text-white font-bold py-2 px-2 rounded-3xl shadow-md ${!chatText ? 'opacity-50' : 'hover:bg-indigo-600 cursor-pointer'}`}
        onClick={handleSend}
      >
        <MdSend size={16} />
      </button>
    </div>
  );
};

export default ChatInput;
