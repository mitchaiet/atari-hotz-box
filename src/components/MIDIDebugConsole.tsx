import React, { useEffect, useRef, useState } from 'react';
import { ScrollArea } from './ui/scroll-area';

interface DebugMessage {
  id: number;
  timestamp: string;
  type: string;
  message: string;
}

const MIDIDebugConsole = () => {
  const [messages, setMessages] = useState<DebugMessage[]>([]);
  const messageIdCounter = useRef(0);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEvent = (event: CustomEvent<{ type: string; message: string }>) => {
      setMessages(prev => {
        const newMessages = [...prev, {
          id: messageIdCounter.current++,
          timestamp: new Date().toISOString().split('T')[1].slice(0, -1),
          type: event.detail.type,
          message: event.detail.message,
        }];
        // Keep only the last 100 messages
        return newMessages.slice(-100);
      });
    };

    window.addEventListener('midi-debug', handleEvent as EventListener);
    return () => window.removeEventListener('midi-debug', handleEvent as EventListener);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 w-96 h-64 bg-slate-900/90 border border-slate-700 rounded-lg shadow-xl">
      <div className="flex items-center justify-between p-2 border-b border-slate-700">
        <h3 className="text-sm font-medium text-slate-200">Debug Console</h3>
        <button
          onClick={() => setMessages([])}
          className="text-xs text-slate-400 hover:text-slate-200"
        >
          Clear
        </button>
      </div>
      <ScrollArea className="h-[calc(100%-2.5rem)]">
        <div className="p-2 space-y-1 font-mono text-xs">
          {messages.map((msg) => (
            <div key={msg.id} className="flex gap-2">
              <span className="text-slate-500">{msg.timestamp}</span>
              <span className={
                msg.type === 'midi' ? 'text-green-400' :
                msg.type === 'touch' ? 'text-blue-400' :
                'text-yellow-400'
              }>
                {msg.type}
              </span>
              <span className="text-slate-300">{msg.message}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default MIDIDebugConsole;
