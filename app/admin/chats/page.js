"use client";

import React, { useEffect, useState } from 'react';
import {
  Chat,
  Channel,
  ChannelHeader,
  ChannelList,
  MessageList,
  MessageInput,
  Thread,
  Window,
  useChatContext,
} from 'stream-chat-react';
import { StreamChat } from 'stream-chat';
import 'stream-chat-react/dist/css/v2/index.css';
import { Trash2, Loader2 } from 'lucide-react';
import AdminPanelLayout from "@/components/AdminPanelLayout";
import { useAuth } from "@/context/AuthContext";

const CustomChannelHeader = () => {
  const { channel, client } = useChatContext();
  
  if (!channel || !client || !client.userID) return null;

  // Get other member's info - try multiple sources
  const members = Object.values(channel.state.members || {});
  const otherMember = members.find(m => m.user?.id !== client.userID);
  
  // Fallback to channel name if it contains user info
  let displayName = 'Support User';
  let displayImage = '';
  let isOnline = false;
  
  if (otherMember?.user) {
    displayName = otherMember.user.name || otherMember.user.id || 'Support User';
    displayImage = otherMember.user.image || '';
    isOnline = otherMember.user.online || false;
  } else if (channel.data?.created_by) {
    // Fallback to channel creator if member data not available
    displayName = channel.data.created_by.name || channel.data.created_by.id || 'Support User';
    displayImage = channel.data.created_by.image || '';
  }


  return (
    <div className="flex items-center justify-between w-full h-16 px-6 bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full border-2 border-indigo-500/20 dark:border-white/10 overflow-hidden bg-linear-to-br from-indigo-50 to-white dark:from-zinc-900 dark:to-zinc-800 flex items-center justify-center font-bold text-indigo-600 dark:text-zinc-100 shadow-sm">
            {displayImage ? (
              <img src={displayImage} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-lg">{displayName[0]?.toUpperCase()}</span>
            )}
          </div>
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-zinc-900 rounded-full shadow-sm"></span>
          )}
        </div>
        <div>
          <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm leading-tight">{displayName}</h3>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium flex items-center gap-1.5 leading-tight mt-0.5">
            <span className={`w-1 h-1 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-zinc-400'}`}></span>
            {isOnline ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>
    </div>
  );
};

const CustomChannelPreview = (props) => {
  const { channel, setActiveChannel, activeChannel } = props;
  const { client } = useChatContext();
  
  if (!channel || !client || !client.userID) return null;

  // Get other member's info - try multiple sources
  const members = Object.values(channel.state.members || {});
  const otherMember = members.find(m => m.user?.id !== client.userID);
  
  // Fallback chain for display name
  let displayName = 'Support User';
  let displayImage = '';
  let isOnline = false;
  
  if (otherMember?.user) {
    displayName = otherMember.user.name || otherMember.user.id || 'Support User';
    displayImage = otherMember.user.image || '';
    isOnline = otherMember.user.online || false;
  } else if (channel.data?.created_by) {
    // Fallback to channel creator
    displayName = channel.data.created_by.name || channel.data.created_by.id || 'Support User';
    displayImage = channel.data.created_by.image || '';
  }

  const isActive = activeChannel?.id === channel.id;
  const lastMessage = channel.state.messages?.[channel.state.messages.length - 1];

  return (
    <div 
      onClick={() => setActiveChannel(channel)}
      className={`relative mx-2 my-1 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
        isActive 
          ? 'bg-zinc-100 dark:bg-zinc-800 shadow-sm' 
          : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-lg overflow-hidden border-2 shadow-sm ${
            isActive 
              ? 'bg-white dark:bg-zinc-900 border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400' 
              : 'bg-zinc-50 dark:bg-zinc-800 border-white dark:border-zinc-700 text-zinc-500'
          }`}>
            {displayImage ? (
              <img src={displayImage} alt="" className="w-full h-full object-cover" />
            ) : (
              <span>{displayName[0]?.toUpperCase()}</span>
            )}
          </div>
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-zinc-900 rounded-full"></span>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-baseline mb-0.5">
            <h4 className={`font-bold text-sm truncate ${
              isActive ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-700 dark:text-zinc-300'
            }`}>
              {displayName}
            </h4>
            <span className={`text-xs font-medium whitespace-nowrap ml-2 ${
              isActive ? 'text-indigo-500 dark:text-indigo-400' : 'text-zinc-400'
            }`}>
              {channel.state.last_message_at ? new Date(channel.state.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
            </span>
          </div>
          <p className={`text-xs truncate font-medium ${
            isActive ? 'text-zinc-600 dark:text-zinc-400' : 'text-zinc-500'
          }`}>
            {lastMessage?.text || 'Start conversation'}
          </p>
        </div>
      </div>
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-r-full"></div>
      )}
    </div>
  );
};

export default function AdminChatsPage() {
  const { user, loading: authLoading } = useAuth();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clearing, setClearing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to delete ALL chat conversations? This action cannot be undone.')) return;
    
    setClearing(true);
    try {
      const res = await fetch('/api/admin/chats/clear', { method: 'POST' });
      const data = await res.json();
      
      if (data.success) {
        alert(data.message || 'All chats cleared successfully.');
        setRefreshKey(prev => prev + 1); // Refresh list without reload
      } else {
        alert(data.error || 'Failed to clear chats.');
      }
    } catch (err) {
      alert('An error occurred while clearing chats.');
    } finally {
      setClearing(false);
    }
  };

  useEffect(() => {
    const initChat = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        console.log("🔵 Admin Chat: Fetching token...");
        const response = await fetch('/api/chat/token');
        const data = await response.json();

        if (!data.success) {
          console.error('❌ Failed to get chat token:', data.error);
          setError(data.error || 'Failed to connect');
          setLoading(false);
          return;
        }

        console.log("✅ Admin Chat: Token received");
        const chatClient = StreamChat.getInstance(data.apiKey);

        const userId = data.user?.id || data.user?._id || 'admin_primary';
        
        await chatClient.connectUser(
          {
            id: userId,
            name: data.user?.name || 'Admin',
            image: data.user?.image || '',
            role: 'admin',
          },
          data.token
        );

        console.log("✅ Admin Chat: Connected successfully");
        setClient(chatClient);
        setLoading(false);
      } catch (err) {
        console.error('❌ Admin Chat Init Error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (!authLoading) {
      initChat();
    }

    return () => {
      if (client && client.userID) {
        console.log("🧹 Admin Chat: Cleaning up client...");
        client.disconnectUser().catch(err => console.error('Disconnect error:', err));
      }
    };
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <AdminPanelLayout>
        <div className="flex h-[600px] items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </AdminPanelLayout>
    );
  }

  if (error) {
    return (
      <AdminPanelLayout>
        <div className="text-center p-12 text-red-600 dark:text-red-400 font-medium bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/20">
          <p className="text-lg font-bold mb-2">Connection Error</p>
          <p className="text-sm">{error}</p>
        </div>
      </AdminPanelLayout>
    );
  }

  if (!user || (user.role !== 'admin' && user.role !== 'sub-admin')) {
    return (
      <AdminPanelLayout>
        <div className="text-center p-12 font-bold text-zinc-600 dark:text-zinc-400">
          Access Denied. Admins Only.
        </div>
      </AdminPanelLayout>
    );
  }

  if (!client) {
    return (
      <AdminPanelLayout>
        <div className="flex h-[600px] items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </AdminPanelLayout>
    );
  }

  const filters = { type: 'messaging', members: { $in: [client.userID] } };
  const sort = { last_message_at: -1 };

  return (
    <AdminPanelLayout>
      <div className="h-[calc(100vh-6rem)] -m-8 relative">
        <div className="absolute inset-0 bg-white dark:bg-zinc-900 overflow-hidden">
          <Chat client={client} theme="messaging light">
            <div className="flex h-full">
              {/* Channel List Sidebar */}
              <div className="w-80 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex flex-col">
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 shrink-0 flex items-center justify-between">
                  <h2 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">All Conversations</h2>
                  <button 
                    onClick={handleClearAll}
                    disabled={clearing}
                    className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-all"
                    title="Clear All Chats"
                  >
                    {clearing ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  <ChannelList
                    key={refreshKey}
                    filters={filters}
                    sort={sort}
                    Preview={CustomChannelPreview}
                    options={{ state: true, presence: true, limit: 20 }}
                  />
                </div>
              </div>

              {/* Chat Area */}
              <div className="flex-1 flex flex-col min-w-0">
                <Channel>
                  <Window>
                    <CustomChannelHeader />
                    <MessageList />
                    <MessageInput />
                  </Window>
                  <Thread />
                </Channel>
              </div>
            </div>
          </Chat>
        </div>
      </div>

      <style jsx global>{`
        .str-chat {
          --str-chat__primary-color: #4f46e5;
          --str-chat__active-primary-color: #4338ca;
          --str-chat__surface-color: #ffffff;
          --str-chat__background-color: transparent;
          height: 100%;
        }
        .dark .str-chat {
          --str-chat__surface-color: #18181b;
          --str-chat__background-color: transparent;
        }
        .str-chat__main-panel {
          height: 100% !important;
          min-height: 0 !important;
        }
        .str-chat__list {
          height: 100% !important;
          background: transparent !important;
        }
        .str-chat__channel-list {
          height: 100% !important;
          background: transparent !important;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.3);
          border-radius: 20px;
        }
        .str-chat__input-flat {
          padding: 0 !important;
          background: transparent !important;
        }
        .str-chat__input-flat-wrapper {
          background: #f8fafc !important;
          border-radius: 1rem !important;
          border: 1px solid #e2e8f0 !important;
          padding: 0.75rem 1rem !important;
        }
        .dark .str-chat__input-flat-wrapper {
          background: #27272a !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
      `}</style>
    </AdminPanelLayout>
  );
}
