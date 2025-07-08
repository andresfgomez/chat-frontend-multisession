import React, { useEffect, useState } from 'react';

interface Session {
  session_id: string;
  created_at: string;
}

interface SidebarProps {
  onSelectSession: (sessionId: string) => void;
  onNewSession: () => void;
  refreshTrigger: any;
  activeSessionId: string | null;
}

const SessionSidebar: React.FC<SidebarProps> = ({ onSelectSession, onNewSession, refreshTrigger, activeSessionId }) => {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/sessions')
      .then(res => {
        console.log("Fetching sessions from API"); 
        return res.json() 
      })
      .then(data => {
          console.log("Fetched sessions:", data);
          setSessions(data)
        });
  }, [refreshTrigger]);

  return (
    <div className="w-64 bg-gray-200 p-4 overflow-y-auto">
      <button
        onClick={onNewSession}
        className="w-full mb-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        + New Chat
      </button>
      <h2 className="font-semibold mb-2">Sessions</h2>
      <ul>
        {sessions.map(session => (
          <li key={session.session_id}>
            <button
              onClick={() => onSelectSession(session.session_id)}              
              className={`w-full text-left p-2 rounded hover:bg-gray-300 ${session.session_id === activeSessionId ? "bg-blue-300 font-bold" : ""}`}
            >
              <div className="text-xs text-gray-500">
                {new Date(session.created_at).toLocaleString()}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SessionSidebar;