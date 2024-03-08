import { ChatInputType } from '@/utils/apis/chatRefine';
import NextImage from 'next/image';
import React, { useRef, useEffect, useState, ChangeEvent, useCallback, ReactNode, useMemo } from 'react';
import { MdSend, MdImage, MdClose, MdStop } from 'react-icons/md';
import { CgSpinner } from "react-icons/cg";
import { convertToBase64JPEG } from '@/utils';

interface IChatInputProps {
  onSend: (data: ChatInputType, abortController: AbortController) => Promise<void>;
  sendOnEmpty?: boolean;
  placeholder?: string;
  disabled?: boolean;
  disabledPlaceholder?: string;
  defaultText?: string;
  children?: ReactNode;
  maxLines?: number;
  ExtraButton?: ReactNode;
}

export const ImageChatInput: React.FC<IChatInputProps> = ({
  onSend,
  disabled = false,
  sendOnEmpty = false,
  placeholder = "Write your issues here..",
  defaultText = '',
  maxLines = 12,
}) => {

  const [chatImages, setBase64Images] = useState<string[]>([]);
  const removeImage = (index: number) => {
    setBase64Images(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const sendChat = useCallback(async (chat: ChatInputType, abortController: AbortController) => {
    if (chat && chatImages.length > 0)
      chat.images = chatImages;
    await onSend(chat, abortController);
    setBase64Images([]);
  }, [chatImages, onSend]);

  const ExtraButton = useMemo(() => {
    const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;
      const files = Array.from(e.target.files);
      const base64JPEGs = await Promise.all(files.map(convertToBase64JPEG));
      setBase64Images(prevImages => {
        const newImages = [...prevImages, ...base64JPEGs];
        while (newImages.length > 4)
          newImages.shift(); // Removes the first element
        return newImages;
      });
    };
    return (
      <label htmlFor="image-upload" className="left-2 mb-2 cursor-pointer">
        <MdImage size={20} />
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="hidden"
        />
      </label>
    )
  }, []);

  return <ChatInput onSend={sendChat} ExtraButton={ExtraButton} disabled={disabled} sendOnEmpty={sendOnEmpty} placeholder={placeholder} defaultText={defaultText} maxLines={maxLines} >
    <div className="flex space-x-2">
      {
        chatImages.map((file, index) => (
          <div key={index} className="relative">
            <NextImage src={file} className="w-16 h-16 object-cover" alt="thumbnail" width={8} height={8} />
            <button
              className="absolute top-1 right-1 rounded-full bg-black p-1"
              onClick={() => removeImage(index)}
            >
              <MdClose size={14} className="text-white" />
            </button>
          </div>
        ))
      }
    </div>
  </ChatInput >
}

const ChatInput: React.FC<IChatInputProps> = ({
  onSend,
  ExtraButton,
  children = null,
  disabled = false,
  sendOnEmpty = false,
  placeholder = "Write your issues here..",
  defaultText = '',
  maxLines = 12,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [chatText, setChatText] = useState<string>(defaultText);

  const buttonDisabled = disabled || !(chatText || sendOnEmpty);
  const [isSending, setIsSending] = useState(false);

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setChatText(e.target.value);
  };

  const abortController = useRef<AbortController | null>(null);

  const handleSend = useCallback(async () => {
    if (buttonDisabled) return;
    setIsSending(true); // Set sending state to true
    const chat: ChatInputType = { text: chatText.trim() };
    abortController.current = new AbortController();
    await onSend(chat, abortController.current);
    setChatText('');
    setIsSending(false); // Reset sending state after sending
  }, [chatText, onSend, buttonDisabled]);

  const handleStop = useCallback(() => {
    if (abortController.current)
      abortController.current.abort();
    setIsSending(false); // Reset sending state when stopped
  }, []);

  useEffect(() => {
    // Send message on ctrl + Enter key press
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter' && isSending)
        handleSend();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleSend, isSending]); // Depend on chatText

  useEffect(() => {
    // Adjust the number of rows based on the number of lines
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
  }, [chatText, maxLines]);

  return (
    <div className="relative flex flex-col p-1">
      {children}
      <div className="relative flex justify-between items-end">
        {ExtraButton}
        <textarea
          ref={textareaRef}
          className="w-full rounded-lg p-1.5 ml-2 pr-9 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-200 focus:border-indigo-200 shadow-md resize-none"
          value={chatText}
          onChange={handleTextChange}
          placeholder={placeholder}
          disabled={disabled}
        />
        {isSending ? (
          <button
            className='absolute font-bold right-2 bottom-1.5 text-indigo-600 hover:text-indigo-700 cursor-pointer flex justify-center items-center p-1'
            onClick={handleStop}
          >
            <MdStop size={20} />
            <CgSpinner className="slow-spin absolute" size={36} />
          </button>
        ) : (
          <button
            disabled={buttonDisabled}
            className={`absolute font-bold bg-indigo-600 right-2 bottom-1.5 py-1 px-1 text-white rounded-3xl shadow-md ${buttonDisabled ? 'opacity-50' : 'hover:bg-indigo-700 cursor-pointer'}`}
            onClick={handleSend}
          >
            <MdSend size={16} />
          </button>)}
      </div>
    </div>
  );
};

export default ChatInput;
