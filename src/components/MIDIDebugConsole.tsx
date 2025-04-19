import React, { useEffect, useRef, useState } from 'react';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { Terminal, MinimizeIcon, Numbers } from 'lucide-react';
import { useKeyOverlay } from '@/contexts/KeyOverlayContext';

interface DebugMessage {
  id: number;
  timestamp: string;
  type: string;
  message: string;
}

const MIDIDebugConsole = () => {
  const { showNumbers, toggleNumbers } = useKeyOverlay();
  const [messages, setMessages] = useState<DebugMessage[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
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

  // Auto-scroll effect
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollArea) {
        scrollArea.scrollTop = scrollArea.scrollHeight;
      }
    }
  }, [messages]);

  if (!isExpanded) {
    return (
      <Button
        onClick={() => setIsExpanded(true)}
        className="fixed bottom-4 right-4 p-2"
        variant="outline"
        size="icon"
      >
        <Terminal className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-64 bg-slate-900/90 border border-slate-700 rounded-lg shadow-xl">
      <div className="flex items-center justify-between p-2 border-b border-slate-700">
        <h3 className="text-sm font-medium text-slate-200">Debug Console</h3>
        <div className="flex space-x-2">
          <Button
            onClick={toggleNumbers}
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-slate-400 hover:text-slate-200"
            title={showNumbers ? "Hide key numbers" : "Show key numbers"}
          >
            <Numbers className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => setIsExpanded(false)}
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-slate-400 hover:text-slate-200"
          >
            <MinimizeIcon className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => setMessages([])}
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-slate-400 hover:text-slate-200"
          >
            <Terminal className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <ScrollArea className="h-[calc(100%-2.5rem)]" ref={scrollAreaRef}>
        <div className="p-2 space-y-1 font-mono text-xs">
          {messages.map((msg) => (
            <div key={msg.id} className="flex gap-2">
              <span className="text-slate-500">{msg.timestamp}</span>
              <span className={
                msg.type === 'midi' ? 'text-green-400' :
                msg.type === 'touch' ? 'text-blue-400' :
                msg.type === 'error' ? 'text-red-400' :
                msg.type === 'warning' ? 'text-yellow-400' :
                msg.type === 'success' ? 'text-green-400' :
                'text-slate-400'
              }>
                {msg.type}
              </span>
              <span className="text-slate-300 whitespace-pre-wrap break-all">{msg.message}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default MIDIDebugConsole;
