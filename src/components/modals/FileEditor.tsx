import React, { useEffect, useState } from 'react';
import Editor, { DiffEditor } from "@monaco-editor/react";
import { FileDesign } from '@/apis';
import { getFileExtension, languageMap } from '@/utils';

interface FileEditorProps {
  handleContentChange?: (content: string | undefined) => void;
  path?: string;
  content?: string;
  original?: string;
}

function handleEditorWillMount(monaco: any) {
  monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true,
    noSyntaxValidation: true
  });
  monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true,
    noSyntaxValidation: true
  });
}

const FileEditor: React.FC<FileEditorProps> = ({
  path,
  content,
  original,
  handleContentChange,
}) => {
  const [languageType, setLanguageType] = useState<string>("");
  useEffect(() => {
    const ext = getFileExtension(path) || "yaml";
    setLanguageType(languageMap[ext] || ext);
  }, [path]);

  const handleEditorChange = (value?: string) => {
    console.log("Editor changed", value);
    handleContentChange && handleContentChange(value);
  };

  if (original) {
    return (
      <DiffEditor
        beforeMount={handleEditorWillMount}
        height="90vh"
        language={languageType}
        original={original}
        modified={content}
        onMount={(editor) => {
          editor.getModifiedEditor().onDidChangeModelContent(() => {
            const value = editor.getModifiedEditor().getValue();
            console.log("Editor changed",);
            handleEditorChange(value);
          });
        }}
        theme="vs-dark"
        options={{
          fontSize: 13,
          minimap: { enabled: false },
          readOnly: false,
          originalEditable: false,
        }}
      />
    );
  }

  return (
    <Editor
      beforeMount={handleEditorWillMount}
      height="90vh"
      language={languageType}
      value={content}
      onChange={handleEditorChange}
      theme="vs-dark"
      options={{
        fontSize: 13,
        minimap: { enabled: false },
      }}
    />
  );
};

export default FileEditor;


const areDiff = (file1: FileDesign, file2?: FileDesign | null): boolean => {
  if (!file2)
    return true
  const allKeys: (keyof FileDesign)[] = ["id", "path", "goal", "content"];

  for (const key of allKeys) {
    if (file1[key] !== file2[key as keyof FileDesign]) {
      return true;
    }
  }

  return false;
};