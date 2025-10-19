import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, UserCircle, Sparkles } from 'lucide-react';
import { Card } from '../components/Card';

const inputClass = "w-full rounded-xl border px-3 py-2 dark:bg-neutral-950 dark:border-neutral-700 dark:text-neutral-200 placeholder:dark:text-neutral-500";
const primaryBtn = "rounded-xl bg-black px-4 py-2 text-white dark:bg-white dark:text-black";
const ghostBtn = "rounded-xl border px-3 py-2 text-sm dark:border-neutral-700";

export function ChatPage({ currentUser, otherUser, introduction, onExit }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showIcebreaker, setShowIcebreaker] = useState(false);
  const [currentIcebreaker, setCurrentIcebreaker] = useState("");
  const [icebreakerUsed, setIcebreakerUsed] = useState(false);
  const ws = useRef(null);
  const chatBoxRef = useRef(null);
  
  const icebreakers = [
    `Hi ${otherUser.name}! I saw you're going through ${otherUser.procedure}. How are you feeling about everything?`,
    `Hey! I'd love to hear about your experience with ${otherUser.procedure}. What's been the most helpful for you?`,
    `Hi there! What advice would you give to someone just starting their ${otherUser.procedure} journey?`,
    `Hello! I'm curious about your recovery process. What surprised you most about ${otherUser.procedure}?`,
    `Hey ${otherUser.name}! What resources or support have you found most valuable during your treatment?`,
    `Hi! I'd love to know - what do you wish you'd known before starting ${otherUser.procedure}?`,
    `Hello! How has your support system helped you through ${otherUser.procedure}?`,
    `Hey! What's been your biggest challenge with ${otherUser.procedure}, and how did you overcome it?`,
    `Hi ${otherUser.name}! What positive changes have you noticed since starting your treatment?`,
    `Hello! I'm interested in hearing about your day-to-day routine. How has ${otherUser.procedure} affected it?`
  ];
  
  const generateIcebreaker = () => {
    const randomIcebreaker = icebreakers[Math.floor(Math.random() * icebreakers.length)];
    setCurrentIcebreaker(randomIcebreaker);
    setShowIcebreaker(true);
  };
  
  const useIcebreaker = () => {
    setInput(currentIcebreaker);
    setShowIcebreaker(false);
    setIcebreakerUsed(true);
  };

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
      {/* Enhanced Header Card */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-neutral-900 dark:to-neutral-800 border-2 dark:border-neutral-700 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 text-white font-bold text-xl shadow-lg">
              {otherUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-semibold text-xl text-gray-900 dark:text-neutral-100">Chatting with {otherUser.name}</div>
              <div className="text-sm text-gray-600 dark:text-neutral-400">{otherUser.procedure} · {otherUser.stage}</div>
            </div>
          </div>
          <button onClick={onExit} className={ghostBtn + " hover:bg-white dark:hover:bg-neutral-800 transition-colors"}>Back</button>
        </div>
      </Card>
      
      {/* Chat Container */}
      <Card className="bg-white dark:bg-neutral-900 border-2 dark:border-neutral-800 shadow-xl">
        <div className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-neutral-300">
          <MessageCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400" /> 
          <span>Real-Time Messages</span>
        </div>

        <div ref={chatBoxRef} className="h-96 overflow-y-auto rounded-2xl bg-gradient-to-b from-gray-50 to-white dark:from-neutral-950 dark:to-neutral-900 p-4 border-2 border-gray-200 dark:border-neutral-800 scroll-smooth">
          <div className="space-y-3">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-neutral-700" />
                <p className="text-gray-500 dark:text-neutral-400 mb-6">No messages yet. Start the conversation!</p>
                
                {/* AI Icebreaker Section - Inside Empty State */}
                {!icebreakerUsed && !showIcebreaker && (
                  <button
                    onClick={generateIcebreaker}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 px-5 py-3 text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
                  >
                    <Sparkles className="h-5 w-5" />
                    Generate AI Icebreaker
                  </button>
                )}

                {!icebreakerUsed && showIcebreaker && (
                  <div className="max-w-md mx-auto rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-2 border-indigo-200 dark:border-indigo-800 p-5 shadow-lg animate-in slide-in-from-top duration-300">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 dark:bg-indigo-500">
                        <Sparkles className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-semibold text-indigo-900 dark:text-indigo-200">AI Conversation Starter</span>
                    </div>
                    <p className="text-sm text-indigo-800 dark:text-indigo-300 leading-relaxed mb-4 text-center">
                      {currentIcebreaker}
                    </p>
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={useIcebreaker}
                        className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 text-sm text-white font-semibold transition-all hover:scale-[1.02] shadow-md"
                      >
                        Use This Message
                      </button>
                      <button
                        onClick={generateIcebreaker}
                        className="rounded-xl border-2 border-indigo-300 dark:border-indigo-700 px-5 py-2.5 text-sm text-indigo-700 dark:text-indigo-300 font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all"
                      >
                        Try Another
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              messages.map((m, i) => (
                <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${m.from === "me" ? "bg-indigo-600 text-white dark:bg-indigo-500 rounded-br-sm" : "bg-white border-2 border-gray-200 dark:bg-neutral-800 dark:border-neutral-700 text-gray-900 dark:text-neutral-100 rounded-bl-sm"}`}>
                    {m.text}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <form className="mt-4 flex gap-2" onSubmit={(e) => { e.preventDefault(); send(); }}>
          <input 
            className={inputClass + " flex-1 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all"} 
            value={input} 
            onChange={e => setInput(e.target.value)} 
            placeholder="Write a message…"
            autoComplete="off"
          />
          <button 
            type="submit" 
            disabled={!input.trim()}
            className={`inline-flex items-center gap-2 ${primaryBtn} px-6 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] transition-transform`}
          >
            <Send className="h-4 w-4" /> Send
          </button>
        </form>
      </Card>
    </div>
  );
}