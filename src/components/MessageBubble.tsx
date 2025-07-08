import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ role, content }) => {
  const isUser = role === 'user';
  const avatar = isUser ? '/mickey_user.png' : '/wall-e_assistant.png';

  return (
    <div className={`flex items-start my-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && <img src={avatar} alt="avatar" className="w-8 h-8 rounded-full mr-2" />}
      <div
        className={`p-3 rounded-lg max-w-lg text-sm leading-relaxed whitespace-pre-wrap ${
          isUser ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-100 text-gray-900 rounded-bl-none'
        }`}
      >
        <ReactMarkdown
          children={content}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter
                  children={String(children).replace(/\n$/, '')}
                  style={oneDark}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                />
              ) : (
                <code className="bg-gray-200 rounded px-1 py-0.5 text-sm" {...props}>
                  {children}
                </code>
              );
            },
          }}
        />
      </div>
      {isUser && <img src={avatar} alt="avatar" className="w-8 h-8 rounded-full ml-2" />}
    </div>
  );
};

export default MessageBubble;