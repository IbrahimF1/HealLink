import React, { useState } from 'react';
import { MessageCircle, Send, UserCircle } from 'lucide-react';
import { Card } from '../components/Card';

const inputClass = "w-full rounded-xl border px-3 py-2 dark:bg-neutral-950 dark:border-neutral-700 dark:text-neutral-200 placeholder:dark:text-neutral-500";
const primaryBtn = "rounded-xl bg-black px-4 py-2 text-white dark:bg-white dark:text-black";
const ghostBtn = "rounded-xl border px-3 py-2 text-sm dark:border-neutral-700";

export function ChatPage({ match, onExit }) {
  const { mentor, introduction } = match;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;
    setMessages([...messages, { from: "me", text: input.trim() }]);
    setInput("");
    // Mock mentor reply
    setTimeout(() => {
      setMessages(curr => [...curr, { from: "them", text: "Thanks for reaching out! I'm happy to chat." }]);
    }, 1000);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800"><UserCircle /></div>
            <div>
              <div className="font-semibold">{mentor.name}</div>
              <div className="text-xs text-gray-500 dark:text-neutral-500">{mentor.procedure} · {mentor.stage}</div>
            </div>
          </div>
          <button onClick={onExit} className={ghostBtn}>Back to Matches</button>
        </div>
      </Card>
      <div className="rounded-2xl border bg-white p-4 dark:bg-neutral-900 dark:border-neutral-800">
        <div className="mb-3 flex items-center gap-2 text-sm text-gray-600 dark:text-neutral-400">
          <MessageCircle className="h-4 w-4" /> In-app messages
        </div>
        <div className="mb-3 rounded-xl border bg-amber-50 p-3 text-sm text-amber-900 dark:border-neutral-800 dark:bg-amber-900/20 dark:text-amber-200">
          <div className="mb-1 font-medium">✨ AI-Powered Introduction</div>
          <p className="whitespace-pre-wrap">{introduction}</p>
        </div>
        <div className="h-72 overflow-y-auto rounded-2xl border bg-gray-50 p-3 dark:bg-neutral-950 dark:border-neutral-800">
          {messages.length === 0 && (
            <div className="text-center text-sm text-gray-500 dark:text-neutral-500">The introduction has been sent. Say hello!</div>
          )}
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
        <div className="mt-3 flex gap-2">
          <input className={inputClass + " flex-1"} value={input} onChange={e => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && send()} placeholder="Write a message…" />
          <button onClick={send} className={`inline-flex items-center gap-2 ${primaryBtn}`}><Send className="h-4 w-4" /> Send</button>
        </div>
      </div>
    </div>
  );
}