import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { Lock, Mail, Eye, EyeOff, Loader2 } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../providers/AuthProvider';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      const { user, accessToken } = response.data.data;

      if (user.role !== 'admin') {
        toast.error('Access denied. Admin only.');
        setIsLoading(false);
        return;
      }

      // Update auth context
      login(accessToken, user);
      
      toast.success(`Welcome back, ${user.profile?.name || 'Admin'}!`);
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <Helmet>
        <title>Login | Farmy Back Office</title>
      </Helmet>

      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="bg-[#1A2315] p-6 rounded-full mb-4 shadow-accent-glow border border-accent-primary/20">
            <img 
              src="/assets/logo-app-no-bg.png" 
              alt="Farmy Logo" 
              className="h-16 w-auto"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).parentElement!.innerHTML += '<span class="text-accent-primary text-4xl font-sora font-bold">Farmy</span>';
              }}
            />
          </div>
          <h1 className="text-3xl text-white tracking-tight">Admin Portal</h1>
          <p className="text-dark-text mt-2 text-center">Enter your credentials to access the command center.</p>
        </div>

        {/* Login Form */}
        <div className="glass-card p-8 bg-[#1A2315]/80">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-dark-text mb-2 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-dark-text" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-12 bg-[#0B0F0A] border-dark-border text-white"
                  placeholder="admin@farmy.tn"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-text mb-2 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-dark-text" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-12 pr-12 bg-[#0B0F0A] border-dark-border text-white"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-text hover:text-accent-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-dark-text cursor-pointer">
                <input type="checkbox" className="rounded border-dark-border bg-[#0B0F0A] text-accent-primary focus:ring-accent-primary mr-2" />
                Remember me
              </label>
              <a href="#" className="text-accent-primary hover:underline">Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2 h-12"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Access Dashboard'
              )}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-dark-text text-sm">
          &copy; {new Date().getFullYear()} Farmy Agri-Tech. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
