import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, UserCircle } from 'lucide-react';
import { Card } from '../components/Card';

const inputClass = "w-full rounded-xl border px-3 py-2 dark:bg-neutral-950 dark:border-neutral-700 dark:text-neutral-200 placeholder:dark:text-neutral-500";
const primaryBtn = "rounded-xl bg-black px-4 py-2 text-white dark:bg-white dark:text-black";
const ghostBtn = "rounded-xl border px-3 py-2 text-sm dark:border-neutral-700";

export function ChatPage({ currentUser, otherUser, introduction, onExit }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const ws = useRef(null);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom of the chat box whenever messages change
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!currentUser?.id) return;

    // Establish WebSocket connection
    ws.current = new WebSocket(`ws://localhost:8000/ws/${currentUser.id}`);

    ws.current.onopen = () => console.log(`WebSocket connected for user ${currentUser.id}`);
    ws.current.onclose = () => console.log(`WebSocket disconnected for user ${currentUser.id}`);

    // Listen for incoming messages
    ws.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        const from = message.sender_id === currentUser.id ? 'me' : 'them';
        setMessages(prev => [...prev, { from, text: message.text }]);
      } catch (error) {
        console.error("Failed to parse incoming message:", event.data);
      }
    };

    // Cleanup on component unmount
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [currentUser.id]);

  const send = () => {
    if (!input.trim() || !ws.current || ws.current.readyState !== WebSocket.OPEN) {
      console.warn("Cannot send message. WebSocket is not open.");
      return;
    }
    
    const messagePayload = {
      text: input.trim(),
      recipient_id: otherUser.id
    };

    ws.current.send(JSON.stringify(messagePayload));

    // Optimistic UI update: add sent message immediately to the list
    setMessages(prev => [...prev, { from: 'me', text: input.trim() }]);
    setInput("");
  };

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800"><UserCircle /></div>
            <div>
              <div className="font-semibold">Chatting with {otherUser.name}</div>
              <div className="text-xs text-gray-500 dark:text-neutral-500">{otherUser.procedure} · {otherUser.stage}</div>
            </div>
          </div>
          <button onClick={onExit} className={ghostBtn}>Back</button>
        </div>
      </Card>
      
      <div className="rounded-2xl border bg-white p-4 dark:bg-neutral-900 dark:border-neutral-800">
        <div className="mb-3 flex items-center gap-2 text-sm text-gray-600 dark:text-neutral-400">
          <MessageCircle className="h-4 w-4" /> Real-Time Messages
        </div>
        
        {introduction && (
          <div className="mb-3 rounded-xl border bg-amber-50 p-3 text-sm text-amber-900 dark:border-neutral-800 dark:bg-amber-900/20 dark:text-amber-200">
            <div className="mb-1 font-medium">✨ AI Introduction</div>
            <p className="whitespace-pre-wrap">{introduction}</p>
          </div>
        )}

        <div ref={chatBoxRef} className="h-72 overflow-y-auto rounded-2xl border bg-gray-50 p-3 dark:bg-neutral-950 dark:border-neutral-800 scroll-smooth">
          <div className="space-y-2">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] rounded-2xl px-3 py-2 text-sm ${m.from === "me" ? "bg-black text-white dark:bg-white dark:text-black" : "bg-white border dark:bg-neutral-900 dark:border-neutral-700"}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
        </div>

        <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); send(); }}>
          <input className={inputClass + " flex-1"} value={input} onChange={e => setInput(e.target.value)} placeholder="Write a message…" />
          <button type="submit" className={`inline-flex items-center gap-2 ${primaryBtn}`}><Send className="h-4 w-4" /> Send</button>
        </form>
      </div>
    </div>
  );
}
