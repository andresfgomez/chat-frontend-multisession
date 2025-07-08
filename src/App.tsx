import React, { useEffect, useState } from 'react';
import ChatWindow from './components/ChatWindow';
import SessionSidebar from './components/SessionSidebar';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshSidebar, setRefreshSidebar] = useState(false);

  const connectWebSocket = (newSession: boolean = false) => {
    const ws = new WebSocket('ws://localhost:8080/ws/chat');
    ws.onopen = () => {
      if (newSession) {
        setMessages([]);
        setRefreshSidebar(prev => !prev);
      }
    };
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.session_id) {
        setSessionId(data.session_id);
      }
      if (data.response) {
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === 'assistant') {
            last.content = data.response;
            return [...prev.slice(0, -1), last];
          } else {
            return [...prev, { role: 'assistant', content: data.response }];
          }
        });
        setIsLoading(false);
      }
    };
    setSocket(ws);
  };

  useEffect(() => {
    connectWebSocket(true);
  }, []);

  const sendMessage = () => {
    if (socket && input.trim()) {
      setMessages([...messages, { role: 'user', content: input }, { role: 'assistant', content: '' }]);
      socket.send(JSON.stringify({ message: input, session_id: sessionId }));
      setInput('');
      setIsLoading(true);
    }
  };

  const selectSession = (id: string) => {
    fetch(`http://localhost:8080/api/sessions/${id}/history`)
      .then(res => res.json())
      .then(data => {
        setSessionId(id);
        setMessages(data.messages);
      });
  };

  const newSession = () => {
    connectWebSocket(true);
    // setRefreshSidebar(prev => !prev);
    setTimeout(() => setRefreshSidebar(prev => !prev), 500);
  };

  return (
    <div className="h-screen flex">
      <SessionSidebar onSelectSession={selectSession} 
                      onNewSession={newSession} 
                      refreshTrigger={refreshSidebar}
                      activeSessionId={sessionId} />                      
      <div className="flex-1 flex flex-col">
        <header className="bg-blue-600 text-white text-center py-3 font-semibold text-lg">MyChatGPT</header>
        <ChatWindow messages={messages} />
        <div className="flex p-4 border-t">
          <input
            className="flex-1 p-2 border rounded mr-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            onClick={sendMessage}
            disabled={isLoading}
          >
            {isLoading ? '...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;