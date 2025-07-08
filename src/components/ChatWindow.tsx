import React, { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';

interface ChatWindowProps {
  messages: { role: 'user' | 'assistant'; content: string }[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
  const endOfMessages = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessages.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-2">
      {messages.map((msg, idx) => (
        <MessageBubble key={idx} role={msg.role} content={msg.content} />
      ))}
      <div ref={endOfMessages} />
    </div>
  );
};

export default ChatWindow;