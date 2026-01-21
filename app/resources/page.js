'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link2, Clock, CheckCircle, Shield, ShoppingBag, History, Gift, ArrowRight, Loader2 } from 'lucide-react';

export default function ResourcesPage() {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('earn');
  const [userData, setUserData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(null);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const userId = user?._id || user?.id;
    if (userId) {
      fetchData(userId);
    }
  }, [user]);

  const fetchData = async (userId) => {
    try {
      setLoading(true);
      
      // Separate fetches so one failure doesn't block others
      const fetchUser = async () => {
        try {
          const res = await axios.get(`/api/loyalty/user/${userId}`);
          if (res.data.success) setUserData(res.data.user);
        } catch (e) {
          console.error("User loyalty data fetch failed", e);
        }
      };

      const fetchTasks = async () => {
        try {
          const res = await axios.get('/api/loyalty/tasks');
          if (res.data.success) setTasks(res.data.tasks);
        } catch (e) {
          console.error("Tasks fetch failed", e);
        }
      };

      const fetchRewards = async () => {
        try {
          const res = await axios.get('/api/loyalty/rewards');
          if (res.data.success) setRewards(res.data.rewards);
        } catch (e) {
          console.error("Rewards fetch failed", e);
        }
      };

      await Promise.all([fetchUser(), fetchTasks(), fetchRewards()]);
    } catch (error) {
      console.error("Global fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskClick = async (task) => {
    if (task.type === 'link' || task.type === 'social') {
      window.open(task.url, '_blank');
      setClaiming(task._id);
      
      setTimeout(async () => {
        if (confirm(`Did you complete the task: ${task.title}?`)) {
           await claimTask(task._id);
        }
        setClaiming(null);
      }, task.timer * 1000);
    } else if (task.type === 'referral') {
      setShowReferralModal(true);
    } else {
      alert('Follow instructions to complete this task.');
    }
  };

  const copyReferralLink = () => {
    const link = `${window.location.origin}/signup?ref=${userData?.referralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const claimTask = async (taskId) => {
    try {
      const res = await axios.post('/api/loyalty/claim', {
        userId: user._id, 
        taskId
      });
      if (res.data.success) {
        // Optimistic UI update could go here, but fetching is safer for sync
        alert('Points Claimed!');
        fetchData(user._id);
      }
    } catch (error) {
      alert(error.response?.data?.error || 'Claim failed');
    }
  };

  const redeemReward = async (rewardId) => {
    if (!confirm('Are you sure you want to redeem this reward?')) return;
    try {
      const res = await axios.post('/api/loyalty/redeem', {
         userId: user._id,
         rewardId
      });
      if (res.data.success) {
        alert('Reward Redeemed! Check your Inventory.');
        fetchData(user._id);
      }
    } catch (error) {
        alert(error.response?.data?.error || 'Redemption failed');
    }
  };

  if (authLoading) {
      return (
        <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
            <Loader2 className="animate-spin text-blue-500 w-10 h-10" />
        </div>
      );
  }
  
  if (!user) {
      // Simple redirect shim or message
      return (
        <main className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex flex-col items-center justify-center p-10 text-center">
            <h1 className="text-3xl font-bold mb-4">Access Restricted</h1>
            <p className="mb-6 text-gray-500">Please login to access the Loyalty Program.</p>
            <a href="/login" className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold">Login Now</a>
        </main>
      );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-black text-black dark:text-white selection:bg-blue-500/30 font-sans transition-colors duration-300">
      <Navbar />
      
      <div className="h-24"></div>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 lg:px-12 py-12">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 dark:border-zinc-800 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
             
             <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                 <div className="max-w-xl">
                      <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                          Rewards Program
                      </span>
                      <h1 className="text-4xl md:text-5xl font-bold mb-4 anta-regular">Resources & Tools</h1>
                      <p className="text-gray-600 dark:text-gray-400 text-lg">
                          Complete tasks to earn points and unlock exclusive trading perks and discounts.
                      </p>
                 </div>
                 
                 <div className="bg-gray-50 dark:bg-black p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 text-center min-w-[200px]">
                      <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Your Balance</p>
                      <div className="text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                          {userData?.loyaltyPoints || 0}
                      </div>
                      <p className="text-xs text-gray-400 mt-2 font-bold">POINTS</p>
                 </div>
             </div>
          </div>
      </section>

      {/* Main Interface */}
      <section className="mx-auto max-w-7xl px-6 lg:px-12 pb-20">
          
          {/* Tabs */}
          <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
             <button onClick={() => setActiveTab('earn')} className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${activeTab === 'earn' ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg' : 'bg-white dark:bg-zinc-900 text-gray-500 hover:text-black dark:hover:text-white'}`}>
                <CheckCircle size={18} /> Earn Points
             </button>
             <button onClick={() => setActiveTab('redeem')} className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${activeTab === 'redeem' ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg' : 'bg-white dark:bg-zinc-900 text-gray-500 hover:text-black dark:hover:text-white'}`}>
                <ShoppingBag size={18} /> Rewards Shop
             </button>
             <button onClick={() => setActiveTab('inventory')} className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${activeTab === 'inventory' ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg' : 'bg-white dark:bg-zinc-900 text-gray-500 hover:text-black dark:hover:text-white'}`}>
                <Gift size={18} /> My Inventory
             </button>
             <button onClick={() => setActiveTab('history')} className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${activeTab === 'history' ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg' : 'bg-white dark:bg-zinc-900 text-gray-500 hover:text-black dark:hover:text-white'}`}>
                <History size={18} /> History
             </button>
          </div>

          <div className="min-h-[400px]">
            
            {/* EARN POINTS */}
            {activeTab === 'earn' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tasks.map(task => {
                        const isCompleted = userData?.completedTaskIds?.includes(task._id);
                        
                        return (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={task._id} 
                                className={`rounded-2xl p-6 border shadow-sm transition-all flex flex-col justify-between ${
                                    isCompleted 
                                    ? 'bg-gray-50/50 dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-800 opacity-80'
                                    : task.type === 'referral' 
                                      ? 'bg-linear-to-br from-indigo-50 to-white dark:from-indigo-950/20 dark:to-zinc-900 border-indigo-200 dark:border-indigo-800' 
                                      : 'bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 hover:border-blue-500'
                                }`}
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                         <div className={`p-3 rounded-xl ${
                                             isCompleted ? 'bg-gray-200 dark:bg-zinc-800 text-gray-400' :
                                             task.type === 'link' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' :
                                             task.type === 'referral' ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600' :
                                             'bg-purple-100 dark:bg-purple-900/30 text-purple-600'
                                         }`}>
                                             {isCompleted ? <CheckCircle size={24}/> : (task.type === 'link' ? <Link2 size={24}/> : task.type === 'referral' ? <Gift size={24}/> : <Shield size={24}/>)}
                                         </div>
                                         <div className="flex flex-col items-end gap-2">
                                            <span className={`${isCompleted ? 'bg-gray-400' : 'bg-gray-900 dark:bg-white'} text-white dark:text-black px-3 py-1 rounded-full text-xs font-bold`}>
                                                +{task.points} PTS
                                            </span>
                                            {isCompleted && (
                                                <span className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-tighter flex items-center gap-1">
                                                    <CheckCircle size={10}/> Completed
                                                </span>
                                            )}
                                         </div>
                                    </div>
                                    <h3 className={`text-xl font-bold mb-2 ${isCompleted ? 'text-gray-400 line-through' : ''}`}>{task.title}</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{task.description}</p>
                                </div>
                                
                                {claiming === task._id ? (
                                    <button disabled className="w-full py-3 rounded-xl bg-orange-500 text-white font-bold flex items-center justify-center gap-2 animate-pulse">
                                        <Clock size={18}/> Verifying ({task.timer}s)...
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => handleTaskClick(task)}
                                        disabled={isCompleted && task.type !== 'referral'}
                                        className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 group ${
                                            isCompleted && task.type !== 'referral'
                                            ? 'bg-gray-200 dark:bg-zinc-800 text-gray-400 cursor-not-allowed'
                                            : task.type === 'referral'
                                              ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-md'
                                              : 'bg-gray-100 dark:bg-zinc-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white text-black dark:text-white'
                                        }`}
                                    >
                                        {isCompleted && task.type !== 'referral' ? 'Task Completed' : (
                                            <>
                                                {task.type === 'link' ? 'Start Task' : 
                                                 task.type === 'referral' ? 'Get My Code' : 'Complete'} 
                                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
                                            </>
                                        )}
                                    </button>
                                )}
                            </motion.div>
                        );
                    })}
                    {loading && <div className="col-span-full text-center py-20"><Loader2 className="animate-spin inline-block w-8 h-8 text-blue-500"/></div>}
                    {!loading && tasks.length === 0 && <div className="col-span-full text-center py-20 text-gray-500">No active tasks available right now.</div>}
                </div>
            )}

            {/* REDEEM REWARDS */}
            {activeTab === 'redeem' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rewards.map(reward => (
                         <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            key={reward._id} 
                            className="bg-white dark:bg-zinc-900 rounded-2xl p-1 border border-gray-100 dark:border-zinc-800 hover:shadow-xl transition-all"
                        >
                            <div className="p-6 bg-linear-to-br from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-black rounded-t-xl flex flex-col items-center justify-center py-10">
                                <div className="w-24 h-24 bg-linear-to-tr from-purple-600 to-pink-600 rounded-2xl shadow-lg flex items-center justify-center text-white text-3xl font-bold transform -rotate-6">
                                    {reward.value}%
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-lg font-bold">{reward.name}</h3>
                                    <span className="font-bold text-blue-600 dark:text-blue-400">{reward.cost} PTS</span>
                                </div>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{reward.description || 'Exclusive discount card for trading fees.'}</p>
                                
                                <button 
                                    onClick={() => redeemReward(reward._id)}
                                    disabled={userData?.loyaltyPoints < reward.cost}
                                    className={`w-full py-3 rounded-xl font-bold transition-all ${
                                        userData?.loyaltyPoints >= reward.cost
                                        ? 'bg-black dark:bg-white text-white dark:text-black hover:opacity-80'
                                        : 'bg-gray-200 dark:bg-zinc-800 text-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    {userData?.loyaltyPoints >= reward.cost ? 'Redeem Now' : 'Insufficient Points'}
                                </button>
                            </div>
                         </motion.div>
                    ))}
                </div>
            )}

            {/* INVENTORY */}
            {activeTab === 'inventory' && (
                <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-gray-100 dark:border-zinc-800 shadow-sm min-h-[300px]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {userData?.inventory?.length > 0 ? (
                            userData.inventory.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-black border border-gray-100 dark:border-zinc-800">
                                    <div className="w-16 h-16 bg-linear-to-tr from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                                        {item.value}%
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-lg">{item.name}</h4>
                                        <p className="text-xs text-gray-500">Acquired: {new Date(item.acquiredAt).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${item.isUsed ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                            {item.isUsed ? 'Used' : 'Active'}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400">
                                <Gift size={48} className="mb-4 opacity-20"/>
                                <p>Your inventory is empty.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* HISTORY */}
            {activeTab === 'history' && (
                <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-gray-100 dark:border-zinc-800 shadow-sm">
                    <div className="space-y-6">
                        {userData?.history?.map((tx, idx) => (
                            <div key={idx} className="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-zinc-800 last:border-0 last:pb-0">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                        tx.type === 'earn' ? 'bg-green-100 text-green-600 dark:bg-green-900/20' : 'bg-red-100 text-red-600 dark:bg-red-900/20'
                                    }`}>
                                        {tx.type === 'earn' ? <CheckCircle size={18}/> : <ShoppingBag size={18}/>}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm md:text-base">{tx.description}</p>
                                        <p className="text-xs text-gray-500">{new Date(tx.createdAt).toLocaleDateString()} • {new Date(tx.createdAt).toLocaleTimeString()}</p>
                                    </div>
                                </div>
                                <div className={`font-bold text-lg ${tx.type === 'earn' ? 'text-green-600' : 'text-red-600'}`}>
                                    {tx.type === 'earn' ? '+' : ''}{tx.points}
                                </div>
                            </div>
                        ))}
                         {userData?.history?.length === 0 && (
                            <div className="text-center py-20 text-gray-400">
                                No history available.
                            </div>
                        )}
                    </div>
                </div>
            )}

          </div>
      </section>

      {/* Referral Modal */}
      {showReferralModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-zinc-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-100 dark:border-zinc-800 relative"
              >
                  <button onClick={() => setShowReferralModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-black dark:hover:text-white">
                      ✕
                  </button>
                  <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Gift size={32}/>
                      </div>
                      <h2 className="text-2xl font-bold mb-2">Invite Your Friends</h2>
                      <p className="text-gray-500 text-sm">Earn points for every friend who joins using your unique code.</p>
                  </div>

                  <div className="space-y-6">
                      <div className="p-4 bg-gray-50 dark:bg-black rounded-2xl border border-dashed border-indigo-300 dark:border-indigo-800 text-center">
                          <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-2">Your Referral Code</p>
                          <div className="text-3xl font-black tracking-widest text-black dark:text-white">
                              {userData?.referralCode || 'GENERATING...'}
                          </div>
                      </div>

                      <button 
                        onClick={copyReferralLink}
                        className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                            copied ? 'bg-green-600 text-white' : 'bg-black dark:bg-white text-white dark:text-black hover:opacity-90'
                        }`}
                      >
                         {copied ? (
                             <><CheckCircle size={20}/> Link Copied!</>
                         ) : (
                             <><Link2 size={20}/> Copy Invite Link</>
                         )}
                      </button>

                      <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl text-xs text-blue-600 dark:text-blue-400">
                          <strong>Note:</strong> Points will be awarded automatically once your friend verifies their email address.
                      </div>
                  </div>
              </motion.div>
          </div>
      )}

      <Footer />
    </main>
  );
}
