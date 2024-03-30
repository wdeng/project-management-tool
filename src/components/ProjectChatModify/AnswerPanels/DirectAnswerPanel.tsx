import React, { useState } from 'react';
import { ProposedDirectAnswer } from '@/apis';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// Choose a style for syntax highlighting
import { IoCopyOutline, IoCheckmark } from "react-icons/io5";
import { oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface ChangesReviewPanelProps {
  answer: ProposedDirectAnswer;
}

const inlineCodeStyle = {
  backgroundColor: '#eee',
  borderRadius: '4px',
  padding: '2px 4px',
};

const DirectAnswerPanel: React.FC<ChangesReviewPanelProps> = ({
  answer
}) => {
  return (
    <div className="m-1 bg-white p-3 rounded-lg drop-shadow-sm">
      <h3 className='font-semibold text-lg py-2'>Direct Answer: </h3>
      <Markdown remarkPlugins={[remarkGfm]} components={components}>{answer.content}</Markdown>
    </div>
  );
};

export default DirectAnswerPanel;

const components = {
  code({ node, inline, className, children, ...props }: any) {
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : 'plaintext';
    // Inline code
    if (!inline && match) {
      return (
        <CodeBlock language={language} value={String(children).trim()} />
      )
    } else {
      return <code className={className} style={inlineCodeStyle} {...props}>{children}</code>
    }
  }
};

const CodeBlock = ({ language, value }: { language: string; value: string }) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1000);
    });
  };

  return (
    <div className="code-block relative p-1">
      <SyntaxHighlighter className='rounded-lg text-sm' language={language} style={oneLight} PreTag="div">
        {value}
      </SyntaxHighlighter>
      <button
        className={`absolute top-4 right-2 p-1 rounded-md bg-gray-200 hover:bg-gray-300 focus:outline-none`}
        onClick={copyToClipboard}
      >
        {isCopied ? (
          <IoCheckmark className="text-blue-500" />
        ) : <IoCopyOutline className="text-gray-600" />}
      </button>
    </div>
  );
};