'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminPanelLayout from '@/components/AdminPanelLayout';
import { Plus, Trash2, Clock, Link as LinkIcon, Users, CreditCard, Gift, Loader2 } from 'lucide-react';

export default function AdminLoyaltyPage() {
  const [tasks, setTasks] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [activeTab, setActiveTab] = useState('tasks');
  const [loading, setLoading] = useState(true);

  // Task Form State
  const [taskForm, setTaskForm] = useState({
    title: '', description: '', points: 10, type: 'link', url: '', timer: 10
  });

  // Reward Form State
  const [rewardForm, setRewardForm] = useState({
    name: '', description: '', cost: 100, value: 30, type: 'freeze_card'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tasksRes, rewardsRes] = await Promise.all([
        axios.get('/api/loyalty/tasks'),
        axios.get('/api/loyalty/rewards')
      ]);
      if (tasksRes.data.success) setTasks(tasksRes.data.tasks);
      if (rewardsRes.data.success) setRewards(rewardsRes.data.rewards);
    } catch (error) {
       console.error(error);
    } finally {
       setLoading(false);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/loyalty/tasks', taskForm);
      alert('Task Created');
      setTaskForm({ title: '', description: '', points: 10, type: 'link', url: '', timer: 10 });
      fetchData();
    } catch (error) {
      alert('Error creating task');
    }
  };

  const createReward = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/loyalty/rewards', rewardForm);
      alert('Reward Created');
      setRewardForm({ name: '', description: '', cost: 100, value: 30, type: 'freeze_card' });
      fetchData();
    } catch (error) {
      alert('Error creating reward');
    }
  };

  return (
    <AdminPanelLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
             <div>
                <h1 className="text-3xl font-bold mb-2 anta-regular">Loyalty Management</h1>
                <p className="text-gray-500 dark:text-gray-400">Manage user tasks and reward redemption.</p>
             </div>
             <div className="flex bg-gray-100 dark:bg-zinc-800 p-1 rounded-lg w-full sm:w-auto">
                <button 
                    onClick={() => setActiveTab('tasks')}
                    className={`flex-1 sm:flex-none px-4 py-2 rounded-md font-medium text-sm transition-all ${activeTab === 'tasks' ? 'bg-white dark:bg-zinc-900 shadow-sm text-black dark:text-white' : 'text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white'}`}
                >
                    Tasks
                </button>
                <button 
                    onClick={() => setActiveTab('rewards')}
                    className={`flex-1 sm:flex-none px-4 py-2 rounded-md font-medium text-sm transition-all ${activeTab === 'rewards' ? 'bg-white dark:bg-zinc-900 shadow-sm text-black dark:text-white' : 'text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white'}`}
                >
                    Rewards
                </button>
             </div>
        </div>
        
        {loading ? (
             <div className="flex justify-center py-20">
                 <Loader2 className="animate-spin text-blue-500 w-10 h-10" />
             </div>
        ) : (
            <>
            {activeTab === 'tasks' && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Create Task Form */}
                <div className="xl:col-span-1">
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm sticky top-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <Plus size={20} />
                            </div>
                            <h2 className="text-xl font-bold">New Task</h2>
                        </div>
                        
                        <form onSubmit={createTask} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Title</label>
                                <input 
                                    value={taskForm.title} onChange={e => setTaskForm({...taskForm, title: e.target.value})}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all" 
                                    placeholder="e.g. Watch Daily Briefing"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Description</label>
                                <textarea 
                                    value={taskForm.description} onChange={e => setTaskForm({...taskForm, description: e.target.value})}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all min-h-[100px]"
                                    placeholder="Task instructions..."
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Type</label>
                                    <select 
                                        value={taskForm.type} onChange={e => setTaskForm({...taskForm, type: e.target.value})}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                    >
                                        <option value="link">Link & Timer</option>
                                        <option value="social">Social Follow</option>
                                        <option value="referral">Referral System</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Points</label>
                                    <input 
                                        type="number"
                                        value={taskForm.points} onChange={e => setTaskForm({...taskForm, points: e.target.value})}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                        required
                                    />
                                </div>
                            </div>
                            
                            {taskForm.type !== 'referral' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Target URL</label>
                                        <input 
                                            value={taskForm.url} onChange={e => setTaskForm({...taskForm, url: e.target.value})}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" 
                                            placeholder="https://..."
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Timer (Seconds)</label>
                                        <input 
                                            type="number"
                                            value={taskForm.timer} onChange={e => setTaskForm({...taskForm, timer: e.target.value})}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                        />
                                    </div>
                                </div>
                            )}

                            <button type="submit" className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-xl font-bold hover:opacity-90 transition-opacity">
                                Create Task
                            </button>
                        </form>
                    </div>
                </div>

                {/* Task List */}
                <div className="xl:col-span-2 space-y-4">
                    <h2 className="text-xl font-bold mb-4">Active Campaign Tasks</h2>
                    {tasks.map(task => (
                        <div key={task._id} className="group bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 shadow-sm transition-all">
                            <div className="flex justify-between items-start">
                                <div className="flex gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold
                                        ${task.type === 'link' ? 'bg-blue-500' : task.type === 'referral' ? 'bg-purple-500' : 'bg-pink-500'}
                                    `}>
                                        {task.type === 'link' && <LinkIcon size={20}/>}
                                        {task.type === 'referral' && <Users size={20}/>}
                                        {task.type === 'social' && <Users size={20}/>}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{task.title}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-lg mb-2">{task.description}</p>
                                        <div className="flex gap-2">
                                            <span className="px-2 py-1 bg-gray-100 dark:bg-zinc-800 rounded text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300">
                                                {task.type}
                                            </span>
                                            {task.timer && (
                                                <span className="px-2 py-1 bg-gray-100 dark:bg-zinc-800 rounded text-xs font-medium flex items-center gap-1 text-gray-600 dark:text-gray-300">
                                                    <Clock size={12}/> {task.timer}s
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                     <div className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-sm font-bold">
                                        +{task.points} PTS
                                     </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {tasks.length === 0 && (
                        <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-2xl border border-dashed border-gray-200 dark:border-zinc-800 text-gray-400">
                            No active tasks found. Create one to get started.
                        </div>
                    )}
                </div>
                </div>
            )}

            {activeTab === 'rewards' && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Create Reward Form */}
                <div className="xl:col-span-1">
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm sticky top-6">
                         <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                                <Gift size={20} />
                            </div>
                            <h2 className="text-xl font-bold">New Reward</h2>
                        </div>
                        
                        <form onSubmit={createReward} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Name</label>
                                <input 
                                    value={rewardForm.name} onChange={e => setRewardForm({...rewardForm, name: e.target.value})}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white transition-all" 
                                    placeholder="e.g. 50% Freeze Card"
                                    required
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Type</label>
                                    <select 
                                        value={rewardForm.type} onChange={e => setRewardForm({...rewardForm, type: e.target.value})}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
                                    >
                                        <option value="freeze_card">Freeze Card</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Cost (PTS)</label>
                                    <input 
                                        type="number"
                                        value={rewardForm.cost} onChange={e => setRewardForm({...rewardForm, cost: e.target.value})}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Value (%)</label>
                                <select 
                                    value={rewardForm.value} onChange={e => setRewardForm({...rewardForm, value: e.target.value})}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
                                >
                                    <option value={30}>30%</option>
                                    <option value={50}>50%</option>
                                    <option value={70}>70%</option>
                                </select>
                            </div>

                            <button type="submit" className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-xl font-bold hover:opacity-90 transition-opacity">
                                Create Reward
                            </button>
                        </form>
                    </div>
                </div>

                {/* Reward List */}
                <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-min">
                    {rewards.map(reward => (
                        <div key={reward._id} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 hover:border-purple-500 dark:hover:border-purple-500 shadow-sm transition-all relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-purple-600 text-white px-3 py-1 rounded-bl-xl text-xs font-bold">
                                {reward.cost} PTS
                            </div>
                            <div className="flex flex-col items-center text-center justify-center p-4">
                                <div className="w-20 h-20 bg-linear-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg transform rotate-3">
                                    {reward.value}%
                                </div>
                                <h3 className="font-bold text-lg mb-1">{reward.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{reward.type === 'freeze_card' ? 'Discount Card' : 'Item'}</p>
                            </div>
                        </div>
                    ))}
                     {rewards.length === 0 && (
                        <div className="col-span-2 text-center py-20 bg-white dark:bg-zinc-900 rounded-2xl border border-dashed border-gray-200 dark:border-zinc-800 text-gray-400">
                            No rewards active.
                        </div>
                    )}
                </div>
                </div>
            )}
            </>
        )}
      </div>
    </AdminPanelLayout>
  );
}
