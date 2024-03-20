import { ChangeEvent, useCallback, useMemo, useState } from "react";
import ChatInput, { ChatInputProps } from "./ChatTextArea";
import { ChatInputType, RefineResource } from "@/apis/chatRefine";
import { convertToBase64JPEG } from "@/utils";
import { MdClose, MdImage, MdAdd, MdDescription, MdArticle } from "react-icons/md";
import NextImage from 'next/image';
import ResourcesSelector from "../ResourcesSelector";

const ComplexChat: React.FC<ChatInputProps> = ({
  onSend,
  placeholder = "Write your issues here..",
  defaultText = '',
  maxLines = 10,
}) => {

  const [selectedCheckboxOptions, setSelectedCheckboxOptions] = useState<number[]>([]);
  const [resourcesEnabled, setResourcesEnabled] = useState<RefineResource[]>(['outline', 'read_more_files']);

  const [chatImages, setBase64Images] = useState<string[]>([]);
  const [showButtons, setShowButtons] = useState(false);
  const [showResources, setShowResources] = useState(false);

  const sendChat = useCallback(async (chat: ChatInputType, abortController: AbortController) => {
    if (chat && chatImages.length > 0)
      chat.images = chatImages;
    await onSend(chat, abortController);
    setBase64Images([]);
  }, [chatImages, onSend]);

  const ImageUpload = useMemo(() => {
    const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;
      const files = Array.from(e.target.files);
      const base64JPEGs = await Promise.all(files.map(convertToBase64JPEG));
      setBase64Images(prevImages => {
        const newImages = [...prevImages, ...base64JPEGs];
        while (newImages.length > 4)
          newImages.shift();
        return newImages;
      });
    };
    return (
      <label htmlFor="image-upload" className={`p-1 cursor-pointer hover:text-indigo-700 ${chatImages.length > 0 ? 'text-indigo-500' : ''}`}>
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
  }, [chatImages]);

  const removeImage = (index: number) => {
    setBase64Images(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const ExtraButton = useMemo(() => {
    return (
      <button onClick={() => setShowButtons(p => !p)} className="ml-2 mb-2">
        <MdAdd size={24} />
      </button>
    )
  }, []);

  return <ChatInput onSend={sendChat} ExtraButton={ExtraButton} placeholder={placeholder} defaultText={defaultText} maxLines={maxLines} >
    {showButtons &&
      <>
        {showResources && <ResourcesSelector
          resourcesEnabled={resourcesEnabled}
          setResourcesEnabled={setResourcesEnabled}
          selectedCheckboxOptions={selectedCheckboxOptions}
          setSelectedCheckboxOptions={setSelectedCheckboxOptions}
        />}
        <div className="flex space-x-2">
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
        <div className="flex justify-start mb-2">
          {ImageUpload}
          <button onClick={() => setShowResources(p => !p)} className={`ml-3 p-1 hover:text-indigo-700 ${showResources ? 'text-indigo-500' : ''}`}>
            <MdDescription size={20} />
          </button>
        </div>
      </>}

  </ChatInput >
}

export default ComplexChat;