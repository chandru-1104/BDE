import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Lead, Activity } from '../lib/supabase';
import {
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Calendar,
  Plus,
  LogOut,
  BarChart3,
  Phone,
  Mail as MailIcon,
  Video,
  FileText,
  CheckCircle,
  Clock,
  Edit2,
  Trash2,
} from 'lucide-react';
import LeadModal from './LeadModal';
import ActivityModal from './ActivityModal';
import { BarChart, PieChart, LineChart, getLeadsByStatus, getLeadsBySource } from './Charts';
import { seedSampleData } from '../lib/seedData';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'activities' | 'analytics'>('overview');
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | undefined>();
  const [editingActivity, setEditingActivity] = useState<Activity | undefined>();
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [leadsRes, activitiesRes] = await Promise.all([
        supabase.from('leads').select('*').order('created_at', { ascending: false }),
        supabase.from('activities').select('*').order('scheduled_at', { ascending: false }),
      ]);

      if (leadsRes.data) setLeads(leadsRes.data);
      if (activitiesRes.data) setActivities(activitiesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLead = (lead: Lead) => {
    setLeads((prev) => {
      const existing = prev.find((l) => l.id === lead.id);
      if (existing) {
        return prev.map((l) => (l.id === lead.id ? lead : l));
      }
      return [lead, ...prev];
    });
  };

  const handleSaveActivity = (activity: Activity) => {
    setActivities((prev) => {
      const existing = prev.find((a) => a.id === activity.id);
      if (existing) {
        return prev.map((a) => (a.id === activity.id ? activity : a));
      }
      return [activity, ...prev];
    });
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;

    try {
      const { error } = await supabase.from('leads').delete().eq('id', id);
      if (error) throw error;
      setLeads((prev) => prev.filter((l) => l.id !== id));
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  const handleDeleteActivity = async (id: string) => {
    if (!confirm('Are you sure you want to delete this activity?')) return;

    try {
      const { error } = await supabase.from('activities').delete().eq('id', id);
      if (error) throw error;
      setActivities((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      console.error('Error deleting activity:', error);
    }
  };

  const handleToggleActivityComplete = async (activity: Activity) => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .update({ completed: !activity.completed })
        .eq('id', activity.id)
        .select()
        .single();

      if (error) throw error;
      if (data) handleSaveActivity(data);
    } catch (error) {
      console.error('Error updating activity:', error);
    }
  };

  const stats = {
    totalLeads: leads.length,
    activeLeads: leads.filter((l) => ['new', 'contacted', 'qualified', 'negotiating'].includes(l.status)).length,
    totalValue: leads.reduce((sum, l) => sum + (l.estimated_value || 0), 0),
    wonDeals: leads.filter((l) => l.status === 'won').length,
    upcomingActivities: activities.filter((a) => !a.completed).length,
  };

  const monthlyData = [
    { month: 'Jan', revenue: 45000, leads: 12 },
    { month: 'Feb', revenue: 52000, leads: 15 },
    { month: 'Mar', revenue: 48000, leads: 10 },
    { month: 'Apr', revenue: 61000, leads: 18 },
    { month: 'May', revenue: 55000, leads: 14 },
    { month: 'Jun', revenue: 70000, leads: 20 },
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      new: 'bg-blue-100 text-blue-700',
      contacted: 'bg-yellow-100 text-yellow-700',
      qualified: 'bg-emerald-100 text-emerald-700',
      negotiating: 'bg-orange-100 text-orange-700',
      won: 'bg-green-100 text-green-700',
      lost: 'bg-red-100 text-red-700',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const getActivityIcon = (type: string) => {
    const icons = {
      call: Phone,
      email: MailIcon,
      meeting: Video,
      demo: BarChart3,
      proposal: FileText,
    };
    const Icon = icons[type as keyof typeof icons] || Calendar;
    return <Icon className="w-4 h-4" />;
  };

  const handleAddNew = () => {
    if (activeTab === 'leads') {
      setEditingLead(undefined);
      setIsLeadModalOpen(true);
    } else if (activeTab === 'activities') {
      setEditingActivity(undefined);
      setIsActivityModalOpen(true);
    } else {
      setEditingLead(undefined);
      setIsLeadModalOpen(true);
    }
  };

  const handleSeedData = async () => {
    if (!confirm('This will add sample data to your dashboard. Continue?')) return;

    setSeeding(true);
    const success = await seedSampleData();
    if (success) {
      await fetchData();
    }
    setSeeding(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500 p-2 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">BDE Dashboard</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600">{user?.email}</span>
              {leads.length === 0 && !loading && (
                <button
                  onClick={handleSeedData}
                  disabled={seeding}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg font-medium transition disabled:opacity-50"
                >
                  {seeding ? 'Loading...' : 'Load Sample Data'}
                </button>
              )}
              <button
                onClick={signOut}
                className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 transition"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back!</h1>
          <p className="text-slate-600">Here's what's happening with your sales pipeline today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-slate-600">Active Leads</span>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">{stats.activeLeads}</div>
            <div className="text-sm text-slate-500">of {stats.totalLeads} total</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-emerald-100 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="text-sm font-medium text-slate-600">Pipeline Value</span>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">
              ${(stats.totalValue / 1000).toFixed(0)}K
            </div>
            <div className="text-sm text-slate-500">Total potential</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm font-medium text-slate-600">Won Deals</span>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">{stats.wonDeals}</div>
            <div className="text-sm text-slate-500">This month</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-sm font-medium text-slate-600">Activities</span>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">{stats.upcomingActivities}</div>
            <div className="text-sm text-slate-500">Upcoming</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-8">
          <div className="border-b border-slate-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    activeTab === 'overview'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('leads')}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    activeTab === 'leads'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Leads
                </button>
                <button
                  onClick={() => setActiveTab('activities')}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    activeTab === 'activities'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Activities
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    activeTab === 'analytics'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Analytics
                </button>
              </div>
              <button
                onClick={handleAddNew}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition"
              >
                <Plus className="w-4 h-4" />
                Add New
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Sales Pipeline</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {['new', 'contacted', 'qualified', 'negotiating', 'won', 'lost'].map((status) => (
                      <div key={status} className="bg-slate-50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-slate-900 mb-1">
                          {leads.filter((l) => l.status === status).length}
                        </div>
                        <div className="text-sm text-slate-600 capitalize">{status}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {activities.length === 0 ? (
                      <div className="text-center py-8 text-slate-500">
                        No activities yet. Click "Add New" to create your first activity.
                      </div>
                    ) : (
                      activities.slice(0, 5).map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition"
                        >
                          <div className="flex items-center gap-3">
                            <div className="bg-white p-2 rounded-lg border border-slate-200">
                              {getActivityIcon(activity.activity_type)}
                            </div>
                            <div>
                              <div className="font-medium text-slate-900">{activity.title}</div>
                              <div className="text-sm text-slate-500 capitalize">{activity.activity_type}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {activity.completed ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                              <Clock className="w-5 h-5 text-orange-500" />
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'leads' && (
              <div className="space-y-3">
                {leads.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    No leads yet. Click "Add New" to create your first lead.
                  </div>
                ) : (
                  leads.map((lead) => (
                    <div
                      key={lead.id}
                      className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-emerald-300 hover:shadow-md transition"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-slate-900">{lead.company_name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                            {lead.status}
                          </span>
                        </div>
                        <div className="text-sm text-slate-600">
                          {lead.contact_person} • {lead.industry}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-semibold text-slate-900">${lead.estimated_value.toLocaleString()}</div>
                          <div className="text-sm text-slate-500">{lead.probability}% probability</div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingLead(lead);
                              setIsLeadModalOpen(true);
                            }}
                            className="p-2 hover:bg-slate-100 rounded-lg transition"
                          >
                            <Edit2 className="w-4 h-4 text-slate-600" />
                          </button>
                          <button
                            onClick={() => handleDeleteLead(lead.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'activities' && (
              <div className="space-y-3">
                {activities.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    No activities scheduled. Click "Add New" to create an activity.
                  </div>
                ) : (
                  activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-emerald-300 hover:shadow-md transition"
                    >
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleToggleActivityComplete(activity)}
                          className="bg-slate-100 p-3 rounded-lg hover:bg-slate-200 transition"
                        >
                          {getActivityIcon(activity.activity_type)}
                        </button>
                        <div>
                          <h4 className="font-semibold text-slate-900">{activity.title}</h4>
                          <div className="text-sm text-slate-600 capitalize">{activity.activity_type}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm text-slate-600">
                            {new Date(activity.scheduled_at).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-slate-500">
                            {new Date(activity.scheduled_at).toLocaleTimeString()}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleToggleActivityComplete(activity)}
                            className="p-2 hover:bg-slate-100 rounded-lg transition"
                          >
                            {activity.completed ? (
                              <CheckCircle className="w-6 h-6 text-green-500" />
                            ) : (
                              <Clock className="w-6 h-6 text-orange-500" />
                            )}
                          </button>
                          <button
                            onClick={() => {
                              setEditingActivity(activity);
                              setIsActivityModalOpen(true);
                            }}
                            className="p-2 hover:bg-slate-100 rounded-lg transition"
                          >
                            <Edit2 className="w-4 h-4 text-slate-600" />
                          </button>
                          <button
                            onClick={() => handleDeleteActivity(activity.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <PieChart data={getLeadsByStatus(leads)} title="Leads by Status" />
                  <BarChart data={getLeadsBySource(leads)} title="Leads by Source" />
                </div>
                <LineChart data={monthlyData} title="Monthly Performance" />
              </div>
            )}
          </div>
        </div>
      </div>

      <LeadModal
        isOpen={isLeadModalOpen}
        onClose={() => {
          setIsLeadModalOpen(false);
          setEditingLead(undefined);
        }}
        onSave={handleSaveLead}
        lead={editingLead}
      />

      <ActivityModal
        isOpen={isActivityModalOpen}
        onClose={() => {
          setIsActivityModalOpen(false);
          setEditingActivity(undefined);
        }}
        onSave={handleSaveActivity}
        activity={editingActivity}
      />
    </div>
  );
}
