'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { apiClient, API_ENDPOINTS, saveAuthToken } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import toast, { Toaster } from 'react-hot-toast';
import { Lock, User, Key, Eye, EyeOff, Shield, Brain, Heart } from 'lucide-react';

interface GeneratedCredentials {
  username: string;
  password: string;
  expires_at: string;
}

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  
  const [loginType, setLoginType] = useState<'admin' | 'user'>('user');
  const [showAccessCodeModal, setShowAccessCodeModal] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Access code form
  const [accessCode, setAccessCode] = useState('');
  const [generatedCreds, setGeneratedCreds] = useState<GeneratedCredentials | null>(null);
  
  // Login forms
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);

  const validateForm = useCallback(() => {
    if (!username.trim()) {
      toast.error('Please enter username');
      return false;
    }
    if (!password.trim()) {
      toast.error('Please enter password');
      return false;
    }
    if (password.length < 3) {
      toast.error('Password must be at least 3 characters');
      return false;
    }
    return true;
  }, [username, password]);

  const clearAccessCodeData = useCallback(() => {
    setAccessCode('');
    setGeneratedCreds(null);
  }, []);

  const handleAdminVerifyCode = useCallback(async () => {
    if (!accessCode.trim()) {
      toast.error('Please enter access code');
      return;
    }

    setVerifyingCode(true);
    try {
      const response = await apiClient.post(API_ENDPOINTS.ADMIN_VERIFY_CODE, {
        access_code: accessCode,
      });
      
      setGeneratedCreds(response.data);
      setShowAccessCodeModal(false);
      setShowCredentialsModal(true);
      toast.success('Admin credentials generated successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Invalid access code');
    } finally {
      setVerifyingCode(false);
    }
  }, [accessCode]);

  const handleLogin = useCallback(async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const endpoint = loginType === 'admin' 
        ? API_ENDPOINTS.ADMIN_LOGIN 
        : API_ENDPOINTS.USER_LOGIN;

      const response = await apiClient.post(endpoint, {
        username,
        password,
      });

      const { access_token, ...userData } = response.data;
      
      saveAuthToken(access_token, loginType);
      setUser(userData as any, loginType);
      
      toast.success('Login successful!');
      
      // Redirect based on user type
      if (loginType === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/user/dashboard');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  }, [username, password, loginType, router, setUser, validateForm]);

  const copyCredentials = useCallback(() => {
    if (!generatedCreds) return;
    const text = `Username: ${generatedCreds.username}\nPassword: ${generatedCreds.password}`;
    navigator.clipboard.writeText(text);
    toast.success('Credentials copied to clipboard!');
  }, [generatedCreds]);

  const fillCredentialsAndClose = useCallback(() => {
    if (!generatedCreds) return;
    setUsername(generatedCreds.username);
    setPassword(generatedCreds.password);
    setShowCredentialsModal(false);
    clearAccessCodeData();
    toast.success('Credentials filled in login form');
  }, [generatedCreds, clearAccessCodeData]);

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-black">
      <Toaster position="top-right" />
      
      {/* Left side - Beautiful Static Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-purple-900 via-black to-blue-900">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/50 via-transparent to-transparent"></div>
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full text-white p-12">
          <div className="text-center max-w-md">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Brain className="w-10 h-10" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <Heart className="w-4 h-4" />
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              AI Therapy Assistant
            </h1>
            
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Secure, compassionate mental health support powered by advanced AI technology.
            </p>
            
            <div className="space-y-4 text-left">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-gray-300">End-to-end encrypted</span>
              </div>
              <div className="flex items-center space-x-3">
                <Brain className="w-5 h-5 text-purple-400" />
                <span className="text-gray-300">AI-powered insights</span>
              </div>
              <div className="flex items-center space-x-3">
                <Heart className="w-5 h-5 text-pink-400" />
                <span className="text-gray-300">24/7 compassionate support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <Card className="w-full max-w-md border-gray-800 bg-black/50 backdrop-blur-xl shadow-2xl">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-3xl font-bold text-center text-white">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center text-gray-400">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Login Type Selector */}
            <div className="flex gap-2 p-1 bg-gray-800/50 rounded-lg">
              <button
                onClick={() => setLoginType('user')}
                className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  loginType === 'user'
                    ? 'bg-white text-black shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <User className="inline-block w-4 h-4 mr-2" />
                User
              </button>
              <button
                onClick={() => setLoginType('admin')}
                className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  loginType === 'admin'
                    ? 'bg-white text-black shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <Lock className="inline-block w-4 h-4 mr-2" />
                Admin
              </button>
            </div>

            {/* Login Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Username</label>
                <Input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-white transition-colors"
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  autoFocus
                />
              </div>

              <div className="space-y-2 relative">
                <label className="text-sm font-medium text-gray-300">Password</label>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-white transition-colors pr-10"
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <Button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-white text-black hover:bg-gray-200 transition-all duration-200 font-semibold py-3"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>

              {/* Admin Create Account Button */}
              {loginType === 'admin' && (
                <Button
                  onClick={() => setShowAccessCodeModal(true)}
                  variant="outline"
                  className="w-full border-gray-700 text-white hover:bg-gray-800 hover:border-gray-600 transition-all duration-200"
                >
                  <Key className="w-4 h-4 mr-2" />
                  Create Admin Account
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Access Code Modal */}
      {showAccessCodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <Card className="w-full max-w-md mx-4 border-gray-800 bg-black/90 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white">Enter Access Code</CardTitle>
              <CardDescription className="text-gray-400">
                Enter your admin access code to generate credentials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="text"
                placeholder="Access Code"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className="bg-gray-800/50 border-gray-700 text-white focus:border-white"
                onKeyPress={(e) => e.key === 'Enter' && handleAdminVerifyCode()}
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleAdminVerifyCode}
                  disabled={verifyingCode}
                  className="flex-1 bg-white text-black hover:bg-gray-200 transition-all"
                >
                  {verifyingCode ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                      Verifying...
                    </div>
                  ) : (
                    'Verify Code'
                  )}
                </Button>
                <Button
                  onClick={() => {
                    setShowAccessCodeModal(false);
                    clearAccessCodeData();
                  }}
                  variant="outline"
                  className="flex-1 border-gray-700 text-white hover:bg-gray-800 transition-all"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Generated Credentials Modal */}
      {showCredentialsModal && generatedCreds && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <Card className="w-full max-w-md mx-4 border-gray-800 bg-black/90 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white">Admin Credentials Generated</CardTitle>
              <CardDescription className="text-yellow-500 bg-yellow-500/10 p-2 rounded text-sm">
                ⚠️ Save these credentials securely. They will only be shown once!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gray-900 rounded-lg space-y-3 border border-gray-700">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Username</p>
                  <p className="text-white font-mono text-lg bg-black/50 p-2 rounded">{generatedCreds.username}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Password</p>
                  <p className="text-white font-mono text-lg bg-black/50 p-2 rounded">{generatedCreds.password}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Expires At</p>
                  <p className="text-white text-sm bg-black/50 p-2 rounded">
                    {new Date(generatedCreds.expires_at).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={copyCredentials}
                  variant="outline"
                  className="flex-1 border-gray-700 text-white hover:bg-gray-800 transition-all"
                >
                  Copy Credentials
                </Button>
                <Button
                  onClick={fillCredentialsAndClose}
                  className="flex-1 bg-white text-black hover:bg-gray-200 transition-all"
                >
                  Use Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}