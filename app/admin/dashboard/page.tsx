'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient, API_ENDPOINTS, getUserType } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import toast, { Toaster } from 'react-hot-toast';
import {
  Users,
  Activity,
  FileText,
  Download,
  TrendingUp,
  Plus,
  LogOut,
  Menu,
  X,
  UserPlus,
  BarChart3,
  MessageSquare
} from 'lucide-react';
import { DashboardStats } from '@/lib/types';

export default function AdminDashboard() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState<'overview' | 'users' | 'sessions' >('overview');

  useEffect(() => {
    const userType = getUserType();
    if (userType !== 'admin') {
      router.push('/login');
      return;
    }
    fetchStats();
  }, [router]);

  const fetchStats = async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ADMIN_STATS);
      setStats(response.data);
    } catch (error: any) {
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const StatCard = ({ title, value, icon: Icon, trend }: any) => (
    <Card className="border-gray-800 bg-gray-900/50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">{title}</p>
            <p className="text-3xl font-bold text-white mt-2">{value}</p>
            {trend && (
              <p className="text-sm text-green-500 mt-1 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                {trend}
              </p>
            )}
          </div>
          <div className="p-3 bg-white/10 rounded-lg">
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex bg-black text-white overflow-hidden">
      <Toaster position="top-right" />

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gray-900 border-r border-gray-800 transition-all duration-300 flex flex-col`}
      >
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold">Admin Panel</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavItem
            icon={BarChart3}
            label="Overview"
            active={activeView === 'overview'}
            collapsed={!sidebarOpen}
            onClick={() => setActiveView('overview')}
          />
          <NavItem
            icon={Users}
            label="Users"
            active={activeView === 'users'}
            collapsed={!sidebarOpen}
            onClick={() => router.push('/admin/users')}
          />
          <NavItem
            icon={MessageSquare}
            label="Sessions"
            active={activeView === 'sessions'}
            collapsed={!sidebarOpen}
            onClick={() => router.push('/admin/sessions')}
          />
         
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-800 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Dashboard Overview</h2>
              <p className="text-gray-400 mt-1">Monitor your therapy platform</p>
            </div>
            <Button
              onClick={() => router.push('/admin/create-user')}
              className="bg-white text-black hover:bg-gray-200"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Create User
            </Button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Users"
              value={stats?.total_users || 0}
              icon={Users}
              trend={`${stats?.new_users_this_week || 0} this week`}
            />
            <StatCard
              title="Active Sessions"
              value={stats?.active_sessions || 0}
              icon={Activity}
              trend={`${stats?.sessions_today || 0} today`}
            />
            <StatCard
              title="Reports Generated"
              value={stats?.total_reports_generated || 0}
              icon={FileText}
            />
            <StatCard
              title="Total Downloads"
              value={stats?.total_downloads || 0}
              icon={Download}
            />
          </div>

          {/* Most Active Users */}
          <Card className="border-gray-800 bg-gray-900/50">
            <CardHeader>
              <CardTitle className="text-white">Most Active Users</CardTitle>
              <CardDescription className="text-gray-400">
                Users with the highest session count
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.most_active_users?.map((user, index) => (
                  <div
                    key={user.user_id}
                    className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                    onClick={() => router.push(`/admin/users/${user.user_id}`)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg font-bold">
                        #{index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-white">{user.user_name}</p>
                        <p className="text-sm text-gray-400">{user.user_id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">{user.session_count}</p>
                      <p className="text-sm text-gray-400">sessions</p>
                    </div>
                  </div>
                )) || (
                  <p className="text-gray-400 text-center py-8">No active users yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card
              className="border-gray-800 bg-gray-900/50 cursor-pointer hover:bg-gray-800/50 transition-colors"
              onClick={() => router.push('/admin/users')}
            >
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-white" />
                <h3 className="text-lg font-semibold text-white mb-2">Manage Users</h3>
                <p className="text-sm text-gray-400">View and manage user accounts</p>
              </CardContent>
            </Card>

            <Card
              className="border-gray-800 bg-gray-900/50 cursor-pointer hover:bg-gray-800/50 transition-colors"
              onClick={() => router.push('/admin/sessions')}
            >
              <CardContent className="p-6 text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-white" />
                <h3 className="text-lg font-semibold text-white mb-2">View Sessions</h3>
                <p className="text-sm text-gray-400">Monitor all therapy sessions</p>
              </CardContent>
            </Card>

          
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon: Icon, label, active, collapsed, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        active
          ? 'bg-white text-black'
          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
      }`}
    >
      <Icon className="w-5 h-5" />
      {!collapsed && <span>{label}</span>}
    </button>
  );
}
