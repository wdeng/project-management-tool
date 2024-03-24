import React from 'react';
import Editor, { DiffEditor } from "@monaco-editor/react";
import { FileDesign } from '@/apis';

interface FileEditorProps {
  editorHeight?: string;
  handleContentChange?: (content: string | undefined) => void;
  langType?: string;
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

const ContentEditor: React.FC<FileEditorProps> = ({
  editorHeight = "90vh",
  langType = "yaml",
  content,
  original,
  handleContentChange,
}) => {
  if (original) {
    return (
      <DiffEditor
        beforeMount={handleEditorWillMount}
        height={editorHeight}
        language={langType || "yaml"}
        original={original}
        modified={content}
        onMount={(editor) => {
          editor.getModifiedEditor().onDidChangeModelContent(() => {
            const value = editor.getModifiedEditor().getValue();
            handleContentChange && handleContentChange(value);
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
      height={editorHeight}
      language={langType || "yaml"}
      value={content}
      onChange={handleContentChange}
      theme="vs-dark"
      options={{
        fontSize: 13,
        minimap: { enabled: false },
      }}
    />
  );
};

export default ContentEditor;


const areDiff = (file1: FileDesign, file2?: FileDesign | null): boolean => {
  if (!file2)
    return true
  const allKeys: (keyof FileDesign)[] = ["id", "name", "goal", "content"];

  for (const key of allKeys) {
    if (file1[key] !== file2[key as keyof FileDesign]) {
      return true;
    }
  }

  return false;
};