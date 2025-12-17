'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient, API_ENDPOINTS, getUserType } from '@/lib/api';
import { useChatStore, useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import toast, { Toaster } from 'react-hot-toast';
import {
  MessageSquare,
  Plus,
  Send,
  Mic,
  FileText,
  Download,
  LogOut,
  Menu,
  X,
  Loader2,
  User,
  Bot,
} from 'lucide-react';
import { Session, Message } from '@/lib/types';
import { formatRelativeTime } from '@/lib/utils';

export default function UserDashboard() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const { currentSession, messages, setCurrentSession, addMessage, clearMessages, setMessages } =
    useChatStore();

  const [sessions, setSessions] = useState<Session[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const userType = getUserType();
    if (userType !== 'user') {
      router.push('/login');
      return;
    }
    fetchSessions();
  }, [router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchSessions = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.SESSION_MY_SESSIONS);

    // Ensure sessions is always an array
    const sessionArray = Array.isArray(response.data)
      ? response.data
      : response.data.sessions || [];

    setSessions(sessionArray);
  } catch (error) {
    toast.error('Failed to load sessions');
  }
};


  const createNewSession = async () => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.SESSION_CREATE, {});
      setCurrentSession(response.data);
      clearMessages();
      setSessions([response.data, ...sessions]);
      toast.success('New session created');
    } catch (error) {
      toast.error('Failed to create session');
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !currentSession) return;

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    addMessage(userMessage);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await apiClient.post(API_ENDPOINTS.CHAT_MESSAGE, {
        session_id: currentSession.session_id,
        message: inputMessage,
      });

      const botMessage: Message = {
        role: 'assistant',
        content: response.data.bot_response,
        timestamp: response.data.timestamp,
      };

      addMessage(botMessage);
    } catch (error: any) {
      toast.error('Failed to send message');
      // Remove the user message if sending failed
      // In a production app, you'd want better error handling
    } finally {
      setLoading(false);
    }
  };

  const handleAudioUpload = async (file: File) => {
    if (!currentSession) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('audio', file);
      formData.append('session_id', currentSession.session_id);

      const response = await apiClient.post(API_ENDPOINTS.CHAT_AUDIO, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const userMessage: Message = {
        role: 'user',
        content: response.data.transcription,
        timestamp: response.data.timestamp,
      };

      const botMessage: Message = {
        role: 'assistant',
        content: response.data.bot_response,
        timestamp: response.data.timestamp,
      };

      addMessage(userMessage);
      addMessage(botMessage);
      toast.success('Audio message sent');
    } catch (error) {
      toast.error('Failed to process audio');
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    if (!currentSession) {
      toast.error('No active session');
      return;
    }

    if (messages.length === 0) {
      toast.error('Cannot generate report for empty session');
      return;
    }

    const toastId = toast.loading('Analyzing session...');

    try {
      // First analyze the session
      toast.loading('Analyzing conversation...', { id: toastId });
      await apiClient.post(API_ENDPOINTS.SESSION_ANALYZE(currentSession.session_id));

      // Then generate report
      toast.loading('Generating report...', { id: toastId });
      const response = await apiClient.post(
        API_ENDPOINTS.REPORT_GENERATE(currentSession.session_id),
        { include_conversation: true }
      );

      toast.success('Report generated successfully!', { id: toastId });

      // Wait a moment before downloading
      setTimeout(() => {
        downloadReport();
      }, 500);
    } catch (error: any) {
      console.error('Report generation error:', error);
      
      let errorMessage = 'Failed to generate report';
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.status === 400) {
        errorMessage = 'Session must be analyzed before generating report';
      } else if (error.response?.status === 404) {
        errorMessage = 'Session not found';
      }
      
      toast.error(errorMessage, { id: toastId });
    }
  };

  const downloadReport = async () => {
    if (!currentSession) {
      toast.error('No active session');
      return;
    }

    try {
      toast.loading('Downloading report...', { id: 'download' });

      const response = await apiClient.get(
        API_ENDPOINTS.REPORT_DOWNLOAD(currentSession.session_id),
        { 
          responseType: 'blob',
          timeout: 30000 // 30 second timeout
        }
      );

      // Check if we received valid data
      if (!response.data || response.data.size === 0) {
        throw new Error('Empty response received');
      }

      // Create blob with explicit type
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `therapy_report_${currentSession.session_id}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);

      toast.success('Report downloaded successfully!', { id: 'download' });
    } catch (error: any) {
      console.error('Download error:', error);
      
      let errorMessage = 'Failed to download report';
      
      if (error.response?.status === 404) {
        errorMessage = 'Report not found. Please generate a report first.';
      } else if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to download this report.';
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Download timeout. Please try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage, { id: 'download' });
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="h-screen w-screen flex bg-black text-white overflow-hidden">
      <Toaster position="top-right" />

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-80' : 'w-0'
        } bg-gray-900 border-r border-gray-800 transition-all duration-300 flex flex-col overflow-hidden`}
      >
        <div className="p-4 border-b border-gray-800">
          <Button
            onClick={createNewSession}
            className="w-full bg-white text-black hover:bg-gray-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {sessions.map((session) => (
            <button
              key={session.session_id}
              onClick={() => {
                setCurrentSession(session);
                // Load session messages here
                clearMessages();
              }}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                currentSession?.session_id === session.session_id
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm font-medium truncate">
                  Session {session.session_id.slice(0, 8)}
                </span>
              </div>
             
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="text-lg font-semibold">
              {currentSession ? 'Therapy Session' : 'Select or create a session'}
            </h1>
          </div>

          {currentSession && messages.length > 0 && (
            <Button
              onClick={generateReport}
              variant="outline"
              className="border-gray-700 text-white hover:bg-gray-800"
            >
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          )}
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6">
          {!currentSession ? (
            <div className="h-full flex items-center justify-center">
              <Card className="border-gray-800 bg-gray-900/50 p-8 text-center max-w-md">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <h2 className="text-xl font-semibold mb-2">Start a New Session</h2>
                <p className="text-gray-400 mb-6">
                  Create a new therapy session to begin your conversation
                </p>
                <Button
                  onClick={createNewSession}
                  className="bg-white text-black hover:bg-gray-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Session
                </Button>
              </Card>
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-2xl">
                <h2 className="text-2xl font-semibold mb-4">How can I help you today?</h2>
                <p className="text-gray-400 mb-8">
                  Share your thoughts and feelings. I'm here to listen and support you.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card
                    className="border-gray-800 bg-gray-900/50 p-6 cursor-pointer hover:bg-gray-800/50 transition-colors"
                    onClick={() => setInputMessage("I've been feeling stressed lately...")}
                  >
                    <p className="text-sm">I've been feeling stressed lately...</p>
                  </Card>
                  <Card
                    className="border-gray-800 bg-gray-900/50 p-6 cursor-pointer hover:bg-gray-800/50 transition-colors"
                    onClick={() => setInputMessage("I need help managing my anxiety...")}
                  >
                    <p className="text-sm">I need help managing my anxiety...</p>
                  </Card>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-4 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] ${
                      message.role === 'user'
                        ? 'bg-white text-black'
                        : 'bg-gray-800 text-white'
                    } rounded-2xl px-6 py-4`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex gap-4 justify-start">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="bg-gray-800 rounded-2xl px-6 py-4">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        {currentSession && (
          <div className="border-t border-gray-800 p-6">
            <div className="max-w-3xl mx-auto">
              <div className="flex gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={(e) => e.target.files?.[0] && handleAudioUpload(e.target.files[0])}
                  className="hidden"
                />
               
                <Input
                  type="text"
                  placeholder="Type your message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  className="flex-1 bg-gray-900 border-gray-700 text-white"
                  disabled={loading}
                />
                <Button
                  onClick={sendMessage}
                  disabled={loading || !inputMessage.trim()}
                  className="bg-white text-black hover:bg-gray-200"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Press Enter to send, Shift + Enter for new line
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
