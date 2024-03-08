import React, { useEffect, useMemo, useRef, useState } from 'react';
import Modal from './Modal';
import Editor from "@monaco-editor/react";
import { useSelected } from '@/hooks/useSelectedContext';
import { FileDesign, fetchSourceCode, updateFile } from '@/utils/apis';
import { InfoEditor } from '../general/DescView';
import { getFileExtension, languageMap } from '@/utils';
import { MdOutlineChat, MdSave } from 'react-icons/md';
import ChatInput from '../general/ChatFields/ChatTextArea';

interface EditorModalProps {
  onClose: () => void;
  fileId?: number | null | string;
  onChange?: (value: string | undefined) => void;
  kind?: "editor" | "info";
}

const displayTypes = {
  path: "label",
  goal: "textfield",
  content: "textarea",
}

function handleEditorWillMount(monaco: any) {
  monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true,
    noSyntaxValidation: true
  });

  // For JavaScript:
  monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true,
    noSyntaxValidation: true
  });
}

const FileEditorModal: React.FC<EditorModalProps> = ({ onClose, fileId, onChange, kind = "editor" }) => {
  const { selectedProjectId } = useSelected();
  const [showChat, setShowChat] = useState(false);
  const [file, setFile] = useState<FileDesign | undefined>(undefined);
  const [languageType, setLanguageType] = useState<string>("");
  const orgFile = useRef<FileDesign | null>(null)

  useEffect(() => {
    if (fileId != null && selectedProjectId) {
      let target: "guidelines" | undefined = undefined
      if (kind === "info")
        target = "guidelines"
      fetchSourceCode(selectedProjectId, fileId, target).then(file => {
        setFile(file);
        orgFile.current = { ...file }
        let ext = "yaml"
        if (file.status !== "pending")
          ext = getFileExtension(file.path);
        setLanguageType(languageMap[ext] || ext);
      }).catch(err => {
        console.error(err);
      });
    }
  }, [selectedProjectId, fileId, kind]);

  const onCloseModal = () => {
    setTimeout(() => {
      setFile(undefined);
    }, 300);
    onClose();
  }

  const handleEditorChange = (value: string | undefined) => {
    setFile(v => v ? { ...v, content: value } : undefined);
    onChange && onChange(value);
  };

  const handleInfoChange = (key: string, value: any) => {
    console.log(key, value)
    setFile(v => v ? { ...v, [key]: value } : undefined);
    onChange && onChange(value);
  }

  const Buttons = useMemo(() => {
    const buttons = [
      <button key='chat' onClick={() => setShowChat(prev => !prev)}>
        <MdOutlineChat />
      </button>
    ]
    const curr = orgFile.current
    if (!selectedProjectId || !file?.id) return null
    if (curr?.content === file?.content && curr?.goal === file?.goal)
      return buttons

    const save = () => {
      const fields: any = { fileId: file.id }
      if (file?.content && curr?.content !== file?.content)
        fields["content"] = file?.content
      if (file?.goal && curr?.goal !== file?.goal)
        fields["goal"] = file?.goal
      if (kind === "info")
        fields["target"] = "guidelines"
      updateFile(selectedProjectId, fields)
    }
    buttons.push(<button key="save" onClick={save}>
      <MdSave />
    </button>)
    return buttons
  }, [file, selectedProjectId, kind])

  const Chat = useMemo(() => {
    return showChat && <ChatInput onSend={async () => { }} />
  }, [showChat])

  return (
    <Modal isOpen={fileId != null} onClose={onCloseModal} title={file?.path || "File Edit"} MoreButtons={Buttons} FieldBelow={Chat}>
      {kind === "editor" ? <Editor
        beforeMount={handleEditorWillMount}
        height="90vh"
        language={languageType}
        value={file?.content}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          fontSize: 13,
          minimap: { enabled: false },
        }}
      /> : <InfoEditor values={file} valueTypes={displayTypes} onUpdateField={handleInfoChange} />}
    </Modal>
  );
};

export default FileEditorModal;
