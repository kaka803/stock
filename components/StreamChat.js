"use client";

import React, { useEffect, useState } from 'react';
import {
  Chat,
  Channel,
  MessageList,
  MessageInput,
  Thread,
  Window,
} from 'stream-chat-react';
import { StreamChat } from 'stream-chat';
import 'stream-chat-react/dist/css/v2/index.css';
import { MessageCircle, X, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useAuth } from "@/context/AuthContext";

const StreamChatComponent = () => {
  const { user } = useAuth();
  const [client, setClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith('/admin')) return;

    const initChat = async () => {
      // Don't re-init if already connecting or connected
      if (!user || client || loading) return;
      
      setLoading(true);
      console.log("🔵 Starting Stream Chat initialization...");
      
      try {
        console.log("📡 Fetching token from /api/chat/token...");
        const response = await fetch('/api/chat/token');
        const data = await response.json();
        
        if (!data.success) {
          console.error('❌ Failed to get chat token:', data.error);
          setLoading(false);
          return;
        }

        const chatClient = StreamChat.getInstance(data.apiKey);
        
        // If connected as someone else, disconnect first
        if (chatClient.userID && chatClient.userID !== data.user.id) {
          console.log("⚠️ Client connected as different user, disconnecting...");
          await chatClient.disconnectUser();
        }

        // Connect if not already connected
        if (!chatClient.userID) {
          console.log("🔌 Connecting user to Stream...");
          await chatClient.connectUser(
            {
              id: data.user.id,
              name: data.user?.name || 'User',
              image: data.user?.image || '',
              role: 'user',
            },
            data.token
          );
          console.log("✅ User connected successfully!");
        } else {
          console.log("♻️ Client already connected, skipping connectUser");
        }

        const supportAdminId = data.adminId || 'admin_primary';
        const currentUserId = data.user.id;
        
        // Handle channel creation
        if (data.user.role === 'admin') {
          const adminChannel = chatClient.channel('messaging', 'admin_general', {
            name: 'Admin Test Channel',
            members: [currentUserId],
          });
          await adminChannel.watch();
          setChannel(adminChannel);
        } else if (currentUserId !== supportAdminId) {
          const supportChannel = chatClient.channel('messaging', `support_${currentUserId}`, {
            name: 'Support Chat',
            members: [currentUserId, supportAdminId],
          });
          await supportChannel.watch();
          setChannel(supportChannel);
        }

        setClient(chatClient);
        setReady(true);
        setLoading(false);
        console.log("🎉 Stream Chat initialized successfully!");
      } catch (error) {
        console.error('❌ Stream Chat Init Error:', error);
        setReady(false);
        setLoading(false);
      }
    };

    initChat();

    return () => {
      // Cleanup: disconnect when component unmounts or user changes
      // Using a local variable to ensure we don't use stale state in the async part
      const cleanup = async () => {
        if (client) {
          console.log("🧹 Cleaning up Stream Chat client...");
          setReady(false);
          await client.disconnectUser().catch(err => console.error('Disconnect error:', err));
          setClient(null);
          setChannel(null);
        }
      };
      
      // We don't necessarily want to disconnect on every pathname change if the user is the same
      // and we are just switching between admin/user pages where both use Stream.
      // But the effect depends on pathname to re-init if needed.
      if (!pathname.startsWith('/admin')) {
          // cleanup(); // Temporarily disabled full disconnect to see if singleton reuse helps
      }
    };
  }, [user, pathname]);

  if (pathname.startsWith('/admin')) return null;

  const isActuallyLoading = loading || (user && !client);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden ring-1 ring-black/5"
          >
            {!user ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-zinc-50 dark:bg-zinc-950">
                <div className="w-20 h-20 bg-indigo-600/10 rounded-full flex items-center justify-center mb-6 text-indigo-600">
                  <MessageCircle size={40} />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 anta-regular">Need Help?</h3>
                <p className="text-sm text-zinc-500 mb-8 leading-relaxed">Please log in to start a conversation with our dedicated support team.</p>
                <button 
                  onClick={() => window.location.href = '/login'}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20"
                >
                  Login to Continue
                </button>
              </div>
            ) : (ready && client && channel && client.userID) ? (
              <Chat client={client} theme="messaging light">
                <div className="flex flex-col h-full overflow-hidden">
                  <div className="bg-indigo-600 p-5 flex items-center justify-between text-white shadow-lg z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">S</div>
                        <div>
                            <h3 className="font-bold text-sm tracking-tight">Support</h3>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                <span className="text-[10px] text-indigo-100 font-medium uppercase tracking-wider">Online</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                      <X size={20} />
                    </button>
                  </div>
                  <div className="flex-1 bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
                    <Channel channel={channel}>
                      <Window>
                        <MessageList />
                        <MessageInput />
                      </Window>
                      <Thread />
                    </Channel>
                  </div>
                </div>
              </Chat>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-zinc-50 dark:bg-zinc-950">
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-4 text-amber-600">
                  <X size={32} />
                </div>
                <h4 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">Connecting...</h4>
                <p className="text-xs text-zinc-500">Establishing a secure connection to support.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-indigo-600 hover:bg-indigo-700 text-white rounded-3xl shadow-2xl flex items-center justify-center transition-all group ring-4 ring-indigo-600/10"
      >
        {isOpen ? <Minus size={32} /> : (
            <div className="relative">
                <MessageCircle size={32} />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-indigo-600"></span>
            </div>
        )}
      </motion.button>

      <style jsx global>{`
        .str-chat {
          --str-chat__primary-color: #4f46e5;
          --str-chat__active-primary-color: #4338ca;
          --str-chat__surface-color: #ffffff;
          --str-chat__background-color: transparent;
          --str-chat__font-family: inherit;
        }
        .str-chat__message-list {
            background-color: transparent !important;
        }
        
        /* Scale down specific message header elements */
        .str-chat__message-simple-name {
            font-size: 0.75rem !important;
            font-weight: 600 !important;
        }
        .str-chat__message-simple-timestamp {
            font-size: 0.7rem !important;
        }
        
        /* Reduce text sizes */
        .str-chat__message-simple-text-inner {
            font-size: 0.85rem !important;
            padding: 8px 12px !important;
        }
        .str-chat__input-flat-wrapper textarea {
            font-size: 0.85rem !important;
        }
        .str-chat__date-separator {
            font-size: 0.75rem !important;
        }
        .str-chat__message-data {
            font-size: 0.7rem !important;
            line-height: 1.2 !important;
            margin-bottom: 2px !important;
        }

        /* Ensure input area matches theme */
        .str-chat__input-flat {
            border-top: 1px solid #f4f4f5 !important;
            background: #ffffff !important;
        }
        .str-chat__input-flat-wrapper {
            background: #f8fafc !important;
            border: 1px solid #e2e8f0 !important;
        }
      `}</style>
    </div>
  );
};

export default StreamChatComponent;
