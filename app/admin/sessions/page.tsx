'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAllSessions, downloadSessionReport, triggerBrowserDownload } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import toast, { Toaster } from 'react-hot-toast';
import { ArrowLeft, Search, MessageSquare, Clock, User, FileText, Download } from 'lucide-react';
import { Session } from '@/lib/types';
import { formatDate, formatRelativeTime } from '@/lib/utils';

export default function AdminSessionsPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [downloadingSessionId, setDownloadingSessionId] = useState<string | null>(null);

  useEffect(() => {
    fetchSessions();
  }, [statusFilter]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await getAllSessions(statusFilter || undefined);
      
      const sessionsData = Array.isArray(response.data) ? response.data : [];
      setSessions(sessionsData);
    } catch (error) {
      console.error('Failed to load sessions:', error);
      toast.error('Failed to load sessions');
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async (sessionId: string, userName: string) => {
    try {
      setDownloadingSessionId(sessionId);
      
      const response = await downloadSessionReport(sessionId);
      const filename = `report_${userName}_${sessionId}.pdf`;
      
      triggerBrowserDownload(response.data, filename);
      toast.success('Report downloaded successfully!');
    } catch (error: any) {
      console.error('Failed to download report:', error);
      toast.error(error.response?.data?.detail || 'Failed to download report');
    } finally {
      setDownloadingSessionId(null);
    }
  };

  const filteredSessions = sessions.filter(
    (session) =>
      session.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.session_id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <Toaster position="top-right" />

      <header className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-800 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push('/admin/dashboard')}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">All Sessions</h1>
              <p className="text-gray-400 mt-1">Monitor therapy sessions across all users</p>
            </div>
          </div>
        </div>
      </header>

      <div className="px-8 py-6">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search sessions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-900 border-gray-800 text-white"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-md text-white"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="analyzed">Analyzed</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-12">Loading sessions...</div>
        ) : filteredSessions.length === 0 ? (
          <Card className="border-gray-800 bg-gray-900/50">
            <CardContent className="py-12 text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400">
                {searchQuery ? 'No sessions found matching your search' : 'No sessions found'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredSessions.map((session) => (
              <Card key={session.session_id} className="border-gray-800 bg-gray-900/50 hover:bg-gray-800/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                        <MessageSquare className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-white">
                            {session.user_name || 'Unknown User'}
                          </h3>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              session.status === 'completed'
                                ? 'bg-green-500/20 text-green-400'
                                : session.status === 'analyzed'
                                ? 'bg-blue-500/20 text-blue-400'
                                : 'bg-yellow-500/20 text-yellow-400'
                            }`}
                          >
                            {session.status || 'unknown'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400">ID: {session.session_id}</p>
                        {session.start_time && (
                          <p className="text-sm text-gray-500 mt-1">
                            Started {formatRelativeTime(session.start_time)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-white">{session.message_count || 0}</p>
                        <p className="text-sm text-gray-400">messages</p>
                      </div>
                      
                      {session.has_report && (
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 text-green-400">
                            <FileText className="w-5 h-5" />
                            <span className="text-sm">Report Available</span>
                          </div>
                          <Button
                            onClick={() => handleDownloadReport(session.session_id, session.user_name || 'user')}
                            disabled={downloadingSessionId === session.session_id}
                            className="bg-green-500 text-white hover:bg-green-600 flex items-center gap-2"
                            size="sm"
                          >
                            <Download className="w-4 h-4" />
                            {downloadingSessionId === session.session_id ? 'Downloading...' : 'Download'}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {session.end_time && (
                    <div className="mt-4 pt-4 border-t border-gray-800 flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>
                          Duration:{' '}
                          {Math.round(
                            (new Date(session.end_time).getTime() -
                              new Date(session.start_time).getTime()) /
                              60000
                          )}{' '}
                          minutes
                        </span>
                      </div>
                      <span>Ended {formatRelativeTime(session.end_time)}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}