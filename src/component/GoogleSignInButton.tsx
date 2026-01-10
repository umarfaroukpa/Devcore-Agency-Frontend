'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '../lib/store';
import api from '../lib/api';
import { Users, Code, Shield, X, CheckCircle, AlertCircle } from 'lucide-react';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement | null, config: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

type UserRole = 'ADMIN' | 'DEVELOPER' | 'CLIENT' | 'SUPER_ADMIN';

export default function GoogleSignInButton() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [googleCredential, setGoogleCredential] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>('CLIENT');
  const [inviteCode, setInviteCode] = useState('');
  const [inviteCodeVerified, setInviteCodeVerified] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roles = [
    { id: 'CLIENT' as UserRole, label: 'Client', icon: Users, color: 'blue', badge: 'Free Access', description: 'Post projects and hire developers' },
    { id: 'DEVELOPER' as UserRole, label: 'Developer', icon: Code, color: 'green', badge: 'Invite Only', description: 'Work on client projects' },
    { id: 'ADMIN' as UserRole, label: 'Admin', icon: Shield, color: 'purple', badge: 'Restricted', description: 'Manage projects and users' },
    { id: 'SUPER_ADMIN' as UserRole, label: 'Super Admin', icon: Shield, color: 'violet', badge: 'Restricted', description: 'Full system access' }
  ];

  const requiresInviteCode = selectedRole !== 'CLIENT';

  const verifyInviteCode = async () => {
    if (!inviteCode.trim()) {
      setError('Please enter an invite code');
      return;
    }

    setVerifyingCode(true);
    setError('');

    try {
      const response = await api.post('/auth/verify-invite', {
        code: inviteCode.toUpperCase()
      });

      if (response.data.success) {
        setInviteCodeVerified(true);
        setError('');
      }
    } catch (err: any) {
      setInviteCodeVerified(false);
      setError(err.response?.data?.error || 'Invalid invite code');
    } finally {
      setVerifyingCode(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!googleCredential) {
      setError('Google credential not found. Please try again.');
      return;
    }

    if (requiresInviteCode && !inviteCodeVerified) {
      setError('Please verify your invite code first');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const { data } = await api.post('/auth/google', {
        id_token: googleCredential,
        role: selectedRole,
        inviteCode: requiresInviteCode ? inviteCode.toUpperCase() : undefined
      });

      if (data.success) {
        if (data.token) {
          setAuth(data.user, data.token);
          
          if (selectedRole === 'CLIENT') {
            window.location.href = '/dashboard/clients';
          } else if (selectedRole === 'SUPER_ADMIN') {
            window.location.href = '/dashboard/admin';
          }
        } else {
          localStorage.setItem('pendingApproval', JSON.stringify({
            email: data.user.email,
            role: selectedRole,
            timestamp: new Date().toISOString(),
            status: 'pending'
          }));
          window.location.href = '/pending-approval';
        }
      }
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      
      if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Please check your internet connection.');
      } else {
        setError(err.response?.data?.error || 'Authentication failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCredentialResponse = (response: any) => {
    console.log('✅ Google credential received');
    setGoogleCredential(response.credential);
    setShowRoleModal(true);
  };

  const closeModal = () => {
    setShowRoleModal(false);
    setGoogleCredential(null);
    setSelectedRole('CLIENT');
    setInviteCode('');
    setInviteCodeVerified(false);
    setError('');
  };

  const triggerGoogleLogin = () => {
    // Find and click the hidden Google button
    const googleBtn = googleButtonRef.current?.querySelector('div[role="button"]') as HTMLElement;
    if (googleBtn) {
      googleBtn.click();
    }
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => console.log('✅ Google script loaded');
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    const initGoogleSignIn = () => {
      if (window.google?.accounts?.id && googleButtonRef.current) {
        console.log('✅ Initializing Google Sign-In');
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Render the actual Google button (hidden)
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular',
          width: 250,
        });
        
        console.log('✅ Google button rendered');
      }
    };

    if (window.google?.accounts?.id) {
      initGoogleSignIn();
    } else {
      const checkInterval = setInterval(() => {
        if (window.google?.accounts?.id) {
          initGoogleSignIn();
          clearInterval(checkInterval);
        }
      }, 100);

      return () => clearInterval(checkInterval);
    }
  }, []);

  return (
    <>
      {/* Hidden Google Button */}
      <div ref={googleButtonRef} className="hidden" />

      {/* Custom Google Sign-In Button */}
      <button
        type="button"
        onClick={triggerGoogleLogin}
        className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm hover:shadow-md cursor-pointer font-medium text-gray-700"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z" fill="#4285F4"/>
          <path d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0010 20z" fill="#34A853"/>
          <path d="M4.405 11.9c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V5.51H1.064A9.996 9.996 0 000 10c0 1.614.386 3.14 1.064 4.49l3.34-2.59z" fill="#FBBC05"/>
          <path d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.99 12.695 0 10 0 6.09 0 2.71 2.24 1.064 5.51l3.34 2.59C5.19 5.736 7.395 3.977 10 3.977z" fill="#EA4335"/>
        </svg>
        Sign in with Google
      </button>

      {/* Role Selection Modal */}
      {showRoleModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4"
          style={{ zIndex: 9999 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[95vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Choose Your Role</h2>
                  <p className="text-sm text-gray-600 mt-1">Select how you'll use Devcore</p>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  type="button"
                >
                  <X size={24} className="text-gray-500" />
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                  <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              )}

              {/* Role Selection */}
              <div className="space-y-3 mb-6">
                {roles.map((role) => {
                  const Icon = role.icon;
                  const isSelected = selectedRole === role.id;
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => {
                        setSelectedRole(role.id);
                        setInviteCodeVerified(false);
                        setInviteCode('');
                        setError('');
                      }}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        isSelected
                          ? 'border-gray-900 bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl ${
                          isSelected ? 'bg-gray-900' : 'bg-gray-100'
                        }`}>
                          <Icon size={24} className={
                            isSelected ? 'text-white' : 'text-gray-600'
                          } />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div className="font-semibold text-lg text-gray-900">{role.label}</div>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              role.id === 'CLIENT' 
                                ? 'bg-green-100 text-green-700'
                                : 'bg-orange-100 text-orange-700'
                            }`}>
                              {role.badge}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">{role.description}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Invite Code Section */}
              {requiresInviteCode && (
                <div className={`p-4 border-2 rounded-xl mb-6 ${
                  inviteCodeVerified 
                    ? 'bg-green-50 border-green-300' 
                    : 'bg-orange-50 border-orange-300'
                }`}>
                  <div className="flex gap-3">
                    {inviteCodeVerified ? (
                      <CheckCircle className="text-green-600 mt-0.5 flex-shrink-0" size={20} />
                    ) : (
                      <AlertCircle className="text-orange-600 mt-0.5 flex-shrink-0" size={20} />
                    )}
                    <div className="flex-1">
                      <p className={`font-semibold ${
                        inviteCodeVerified ? 'text-green-900' : 'text-orange-900'
                      }`}>
                        {inviteCodeVerified ? 'Invite Code Verified ✓' : 'Invite Code Required'}
                      </p>
                      
                      {!inviteCodeVerified && (
                        <>
                          <p className="text-sm text-orange-700 mt-1 mb-3">
                            This role requires a valid invite code to proceed
                          </p>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={inviteCode}
                              onChange={(e) => {
                                setInviteCode(e.target.value.toUpperCase());
                                setError('');
                              }}
                              placeholder="Enter invite code"
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none uppercase"
                              maxLength={8}
                            />
                            <button
                              type="button"
                              onClick={verifyInviteCode}
                              disabled={verifyingCode || !inviteCode.trim()}
                              className="px-4 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                            >
                              {verifyingCode ? 'Verifying...' : 'Verify'}
                            </button>
                          </div>
                        </>
                      )}
                      
                      {inviteCodeVerified && (
                        <p className="text-sm text-green-700 mt-1">
                          Your invite code has been verified successfully
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isSubmitting || (requiresInviteCode && !inviteCodeVerified)}
                  className="flex-1 px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      Continue
                      <CheckCircle size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}