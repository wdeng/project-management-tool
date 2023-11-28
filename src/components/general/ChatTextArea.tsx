import { ChatInputType } from '@/utils/apis/chatRefine';
import NextImage from 'next/image';
import React, { useRef, useEffect, useState, ChangeEvent, useCallback } from 'react';
import { MdSend, MdImage, MdClose } from 'react-icons/md';

interface IChatInputProps {
  onSend: (data: ChatInputType) => Promise<void>;
  sendOnEmpty?: boolean;
  placeholder?: string;
  disabled?: boolean;
  disabledPlaceholder?: string;
  defaultText?: string;
}

const convertToBase64JPEG = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx!.drawImage(img, 0, 0);
        const base64JPEG = canvas.toDataURL('image/jpeg');
        resolve(base64JPEG);
      };
      img.onerror = reject;
      img.src = e.target!.result as string;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const ChatInput: React.FC<IChatInputProps> = ({
  onSend,
  disabled = false,
  sendOnEmpty = false,
  placeholder = "Write your issues here..",
  defaultText = '',
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [chatText, setChatText] = useState<string>(defaultText);
  const [chatImages, setBase64Images] = useState<string[]>([]);
  const maxLines = 12;
  const buttonDisabled = disabled || !(chatText || sendOnEmpty);

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setChatText(e.target.value);
  };

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

  const removeImage = (index: number) => {
    setBase64Images(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const handleSend = useCallback(async () => {
    if (buttonDisabled) return;
    const chat: ChatInputType = { text: chatText.trim() };
    if (chatImages.length > 0)
      chat.images = chatImages;
    await onSend(chat);
    setBase64Images([]); // Clear the images after sending
    setChatText('');
  }, [chatText, chatImages, onSend, buttonDisabled]);

  // Add this useEffect
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter')
        handleSend();
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
    <div className="relative flex flex-col">
      <div className="flex space-x-2 p-2">
        {chatImages.map((file, index) => (
          <div key={index} className="relative">
            <NextImage src={file} className="w-16 h-16 object-cover" alt="thumbnail" width={8} height={8} />
            <button
              className="absolute top-1 right-1 rounded-full bg-black p-1"
              onClick={() => removeImage(index)}
            >
              <MdClose size={14} className="text-white" />
            </button>
          </div>
        ))}
      </div>
      <div className="relative flex justify-between items-end">
        <label htmlFor="image-upload" className="absolute left-2 top-4 cursor-pointer">
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
        <textarea
          ref={textareaRef}
          className="w-full rounded-lg p-3 pl-7 pr-9 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 shadow-md resize-none"
          value={chatText}
          onChange={handleTextChange}
          placeholder={placeholder}
          disabled={disabled}
        />
        <button
          disabled={buttonDisabled}
          className={`absolute right-2 bottom-2 bg-indigo-500 text-white font-bold py-2 px-2 rounded-3xl shadow-md ${buttonDisabled ? 'opacity-50' : 'hover:bg-indigo-600 cursor-pointer'}`}
          onClick={handleSend}
        // style={{ marginBottom: '1.5rem' }}
        >
          <MdSend size={16} />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
