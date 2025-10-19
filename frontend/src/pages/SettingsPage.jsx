import React, { useState } from 'react';
import { Bell, Shield, Moon, Globe, MessageSquare, Eye, EyeOff, Trash2, LogOut, Mail, Lock, User } from 'lucide-react';
import { Card } from '../components/Card';
import { deleteUser } from '../api/apiClient';

const primaryBtn = "rounded-xl bg-black px-4 py-2 text-white dark:bg-white dark:text-black";

export function SettingsPage({ user, onProfileUpdate, onLogout, navigate }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Settings state
  const [settings, setSettings] = useState({
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    newMessageAlerts: true,
    matchAlerts: true,
    weeklyDigest: false,
    
    // Privacy
    profileVisibility: 'mentors', // 'everyone', 'mentors', 'private'
    showOnlineStatus: true,
    allowMessageRequests: true,
    
    // Appearance
    darkMode: false,
    language: 'English',
    
    // Chat
    readReceipts: true,
    typingIndicators: true,
  });

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };
  
  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      setLoading(true);
      setError("");
      try {
        await deleteUser(user.id);
        alert("Account deleted successfully.");
        onLogout();
      } catch (err) {
        setError("Failed to delete account. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const ToggleSwitch = ({ enabled, onChange }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-neutral-700'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-2 py-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-neutral-100">Settings</h1>
        <p className="text-lg text-gray-600 dark:text-neutral-400">Customize your HealLink experience</p>
      </div>

      {/* Account Section */}
      <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-neutral-900 dark:to-neutral-950 border-2 dark:border-neutral-700 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/40">
            <User className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Account</h2>
            <p className="text-sm text-gray-500 dark:text-neutral-400">Manage your account information</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-gray-500 dark:text-neutral-400" />
              <div>
                <p className="font-medium text-gray-900 dark:text-neutral-100">Email</p>
                <p className="text-sm text-gray-500 dark:text-neutral-400">{user.email}</p>
              </div>
            </div>
          </div>
          <button 
            onClick={() => navigate && navigate('profile')}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-gray-500 dark:text-neutral-400" />
              <div className="text-left">
                <p className="font-medium text-gray-900 dark:text-neutral-100">Edit Profile</p>
                <p className="text-sm text-gray-500 dark:text-neutral-400">Update your personal information</p>
              </div>
            </div>
            <span className="text-gray-400">→</span>
          </button>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm border border-gray-200 dark:border-neutral-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/40">
            <Bell className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Notifications</h2>
            <p className="text-sm text-gray-500 dark:text-neutral-400">Manage how you receive updates</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-neutral-100">Email Notifications</p>
              <p className="text-sm text-gray-500 dark:text-neutral-400">Receive updates via email</p>
            </div>
            <ToggleSwitch enabled={settings.emailNotifications} onChange={() => toggleSetting('emailNotifications')} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-neutral-100">New Message Alerts</p>
              <p className="text-sm text-gray-500 dark:text-neutral-400">Get notified when you receive messages</p>
            </div>
            <ToggleSwitch enabled={settings.newMessageAlerts} onChange={() => toggleSetting('newMessageAlerts')} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-neutral-100">Match Alerts</p>
              <p className="text-sm text-gray-500 dark:text-neutral-400">Notify when you get a new match</p>
            </div>
            <ToggleSwitch enabled={settings.matchAlerts} onChange={() => toggleSetting('matchAlerts')} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-neutral-100">Weekly Digest</p>
              <p className="text-sm text-gray-500 dark:text-neutral-400">Summary of your activity</p>
            </div>
            <ToggleSwitch enabled={settings.weeklyDigest} onChange={() => toggleSetting('weeklyDigest')} />
          </div>
        </div>
      </Card>

      {/* Privacy */}
      <Card className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm border border-gray-200 dark:border-neutral-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/40">
            <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Privacy & Security</h2>
            <p className="text-sm text-gray-500 dark:text-neutral-400">Control your privacy settings</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block font-medium text-gray-900 dark:text-neutral-100 mb-2">Profile Visibility</label>
            <select 
              className="w-full rounded-xl border-2 border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-4 py-2.5 text-sm focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900/50 transition-all"
              value={settings.profileVisibility}
              onChange={e => updateSetting('profileVisibility', e.target.value)}
            >
              <option value="everyone">Everyone</option>
              <option value="mentors">Mentors Only</option>
              <option value="private">Private</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-neutral-100">Show Online Status</p>
              <p className="text-sm text-gray-500 dark:text-neutral-400">Let others see when you're active</p>
            </div>
            <ToggleSwitch enabled={settings.showOnlineStatus} onChange={() => toggleSetting('showOnlineStatus')} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-neutral-100">Allow Message Requests</p>
              <p className="text-sm text-gray-500 dark:text-neutral-400">Receive messages from new connections</p>
            </div>
            <ToggleSwitch enabled={settings.allowMessageRequests} onChange={() => toggleSetting('allowMessageRequests')} />
          </div>
        </div>
      </Card>

      {/* Chat Settings */}
      <Card className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm border border-gray-200 dark:border-neutral-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-100 dark:bg-cyan-900/40">
            <MessageSquare className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Chat Preferences</h2>
            <p className="text-sm text-gray-500 dark:text-neutral-400">Customize your messaging experience</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-neutral-100">Read Receipts</p>
              <p className="text-sm text-gray-500 dark:text-neutral-400">Let others know when you've read their messages</p>
            </div>
            <ToggleSwitch enabled={settings.readReceipts} onChange={() => toggleSetting('readReceipts')} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-neutral-100">Typing Indicators</p>
              <p className="text-sm text-gray-500 dark:text-neutral-400">Show when you're typing a message</p>
            </div>
            <ToggleSwitch enabled={settings.typingIndicators} onChange={() => toggleSetting('typingIndicators')} />
          </div>
        </div>
      </Card>

      {/* Actions */}
      <Card className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm border border-gray-200 dark:border-neutral-800">
        <div className="space-y-3">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600 transition-colors"
          >
            <div className="flex items-center gap-3">
              <LogOut className="h-5 w-5 text-gray-600 dark:text-neutral-400" />
              <span className="font-medium text-gray-900 dark:text-neutral-100">Log Out</span>
            </div>
            <span className="text-gray-400">→</span>
          </button>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="border-2 border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40">
            <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">Danger Zone</h2>
            <p className="text-sm text-red-600/70 dark:text-red-400/70">Irreversible actions</p>
          </div>
        </div>
        <div className="flex items-center justify-between p-4 border-2 border-red-300 dark:border-red-800 rounded-xl bg-white dark:bg-neutral-900">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-neutral-100">Delete Account</h3>
            <p className="text-sm text-gray-600 dark:text-neutral-400">Permanently remove your account and all associated data.</p>
          </div>
          <button disabled={loading} onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-5 py-2.5 text-sm font-semibold inline-flex items-center gap-2 transition-all hover:scale-[1.02] shadow-lg disabled:opacity-40">
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        </div>
      </Card>
    </div>
  );
}