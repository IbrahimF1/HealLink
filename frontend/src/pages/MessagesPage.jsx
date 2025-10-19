import React, { useEffect, useState } from 'react';
import { Card } from '../components/Card';
import { MessageSquare } from 'lucide-react';
import { getAllUsers } from '../api/apiClient';

export function MessagesPage({ user, onEnterChat }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      setError('');
      try {
        const allUsers = await getAllUsers();
        // Exclude self
        setUsers(allUsers.filter(u => u.id !== user.id));
      } catch (err) {
        setError('Failed to fetch users.');
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, [user.id]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-2 py-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-neutral-100">Your Messages</h1>
        <p className="text-lg text-gray-600 dark:text-neutral-400">Connect with your mentors and mentees</p>
      </div>

      <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-neutral-900 dark:to-neutral-950 border-2 dark:border-neutral-700 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/40">
            <MessageSquare className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Conversations</h2>
            <p className="text-sm text-gray-500 dark:text-neutral-400">Start or continue your chats</p>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-flex h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600 dark:border-neutral-700 dark:border-t-indigo-400"></div>
            <p className="mt-4 text-gray-500">Loading conversations...</p>
          </div>
        ) : error ? (
          <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="h-16 w-16 mx-auto text-gray-300 dark:text-neutral-700 mb-4" />
            <p className="text-gray-500 text-lg">No conversations yet</p>
            <p className="text-sm text-gray-400 mt-2">Find a mentor to start chatting</p>
          </div>
        ) : (
          <div className="space-y-3">
            {users.map(u => (
              <div key={u.id} className="group flex items-center justify-between p-4 rounded-xl border-2 border-gray-200 dark:border-neutral-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all duration-200 hover:shadow-md">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {(u.name || u.email).charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-lg text-gray-900 dark:text-neutral-100">{u.name || u.email}</div>
                    <div className="text-sm text-gray-500 dark:text-neutral-400">{u.procedure || 'No procedure info'}</div>
                  </div>
                </div>
                <button 
                  onClick={() => onEnterChat(u)} 
                  className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 text-white font-semibold dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-all hover:scale-[1.02] shadow-lg inline-flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  Open Chat
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
