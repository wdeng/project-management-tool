import { ChangeEvent, useCallback, useMemo, useState } from "react";
import ChatInput, { ChatInputProps } from "./ChatTextArea";
import { ChatInputType } from "@/apis";
import { convertToBase64JPEG } from "@/utils";
import { MdClose, MdImage } from "react-icons/md";
import NextImage from 'next/image';

const ImageChatInput: React.FC<ChatInputProps> = ({
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
      <label htmlFor="image-upload" className="mb-2 cursor-pointer">
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

export default ImageChatInput;