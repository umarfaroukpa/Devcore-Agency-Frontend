'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; 
import api from '../../lib/api'
import { Users, Code, Shield, CheckCircle, Lock, Eye, EyeOff, Mail, Phone, Building2, AlertCircle } from 'lucide-react';
  
type UserRole = 'ADMIN' | 'DEVELOPER' | 'CLIENT';

interface FormData {
  name: string;
  email: string;
  phone: string;
  inviteCode: string;
  companyName: string;
  industry: string;
  position: string;
  skills: string[];
  experience: string;
  githubUsername: string;
  portfolio: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export default function SignupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('CLIENT');
  const [isLoading, setIsLoading] = useState(false);
  const [inviteCodeVerified, setInviteCodeVerified] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: '', email: '', phone: '', inviteCode: '', companyName: '',
    industry: '', position: '', skills: [], experience: '', githubUsername: '',
    portfolio: '', password: '', confirmPassword: '', agreeToTerms: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const roles = [
    { id: 'CLIENT' as UserRole, label: 'Client', icon: Users, color: 'blue', badge: 'Open' },
    { id: 'DEVELOPER' as UserRole, label: 'Developer', icon: Code, color: 'green', badge: 'Invite Only' },
    { id: 'ADMIN' as UserRole, label: 'Admin', icon: Shield, color: 'purple', badge: 'Restricted' }
  ];

  const industries = ['Technology', 'Healthcare', 'Finance', 'E-commerce', 'Education', 'Other'];
  const skillsList = ['React', 'Node.js', 'Python', 'TypeScript', 'React Native', 'Flutter', 'DevOps', 'AWS'];
  const experienceLevels = ['Junior', 'Mid-level', 'Senior', 'Lead'];

  const requiresInviteCode = selectedRole === 'DEVELOPER' || selectedRole === 'ADMIN';

  //Verify invite code with backend
  const verifyInviteCode = async () => {
    if (!formData.inviteCode.trim()) {
      setErrors({ inviteCode: 'Please enter an invite code' });
      return;
    }

    setVerifyingCode(true);
    setErrors({});

    try {
      const response = await api.post('/auth/verify-invite', {
        code: formData.inviteCode.toUpperCase()
      });

      if (response.data.success) {
        setInviteCodeVerified(true);
        setErrors({ inviteCode: '' });
      }
    } catch (error: any) {
      setInviteCodeVerified(false);
      setErrors({ 
        inviteCode: error.response?.data?.error || 'Invalid invite code' 
      });
    } finally {
      setVerifyingCode(false);
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Full name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email address';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      
      //Check if invite code is verified for restricted roles
      if (requiresInviteCode) {
        if (!formData.inviteCode.trim()) {
          newErrors.inviteCode = 'Invite code is required';
        } else if (!inviteCodeVerified) {
          newErrors.inviteCode = 'Please verify your invite code';
        }
      }
    }

    if (step === 2) {
      if (selectedRole === 'CLIENT') {
        if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
        if (!formData.industry) newErrors.industry = 'Please select an industry';
      }
      if (selectedRole === 'DEVELOPER') {
        if (formData.skills.length === 0) newErrors.skills = 'Select at least one skill';
        if (!formData.experience) newErrors.experience = 'Experience level is required';
        if (!formData.githubUsername.trim()) newErrors.githubUsername = 'GitHub username is required';
      }
      if (selectedRole === 'ADMIN') {
        if (!formData.position.trim()) newErrors.position = 'Position is required';
      }
    }

    if (step === 3) {
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
      else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password))
        newErrors.password = 'Password must contain uppercase, lowercase, and number';

      if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = 'Passwords do not match';

      if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
      setErrors({});
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
    setErrors({});
  };

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setErrors({});

  try {
    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: selectedRole,
      inviteCode: requiresInviteCode ? formData.inviteCode : undefined,
      companyName: formData.companyName || undefined,
      industry: formData.industry || undefined,
      position: formData.position || undefined,
      skills: formData.skills.length > 0 ? formData.skills : undefined,
      experience: formData.experience || undefined,
      githubUsername: formData.githubUsername || undefined,
      portfolio: formData.portfolio || undefined,
    };

    const response = await api.post("/auth/signup", payload);
    
    if (response.data.success) {
      // CLIENT gets a token and can log in immediately
      if (selectedRole === 'CLIENT' && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        router.push('/dashboard/clients');
      } 
      // DEVELOPER/ADMIN do NOT get a token and need approval
      else {
        // Store user data in a different key for pending approval page
        localStorage.setItem('pendingUser', JSON.stringify(response.data.user));
        router.push('/pending-approval');
      }
    }
  } catch (err: any) {
    const message =
      err.response?.data?.error ||
      err.message ||
      'Something went wrong. Please try again.';

    setErrors({ form: message });
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
      </div>

      <div className="relative max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">D</span>
            </div>
            <span className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Devcore
            </span>
          </Link>
        </div>

        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                  step < currentStep ? 'bg-green-500 text-white' :
                  step === currentStep ? 'bg-blue-600 text-white ring-4 ring-blue-200' :
                  'bg-gray-200 text-gray-500'
                }`}>
                  {step < currentStep ? <CheckCircle size={24} /> : step}
                </div>
                {step < 3 && (
                  <div className={`flex-1 h-1 mx-4 transition-all ${step < currentStep ? 'bg-green-500' : 'bg-gray-300'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3 text-sm font-medium text-gray-600">
            <span>Choose Role</span>
            <span>Profile Details</span>
            <span>Secure Account</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          {/* Step 1 */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Choose Your Role</h2>
                <p className="text-gray-600 mt-2">How will you use Devcore?</p>
              </div>

              <div className="grid gap-4">
                {roles.map((role) => {
                  const Icon = role.icon;
                  return (
                    <button
                      key={role.id}
                      onClick={() => {
                        setSelectedRole(role.id);
                        setInviteCodeVerified(false); // Reset verification when role changes
                      }}
                      className={`p-6 rounded-2xl border-2 text-left transition-all ${
                        selectedRole === role.id
                          ? 'border-blue-600 bg-blue-50 shadow-lg'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${selectedRole === role.id ? 'bg-blue-600' : 'bg-gray-100'}`}>
                          <Icon size={28} className={selectedRole === role.id ? 'text-white' : 'text-gray-600'} />
                        </div>
                        <div>
                          <div className="font-semibold text-lg">{role.label}</div>
                          <div className="text-sm text-gray-600">{role.badge}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/*ite Code Section with Verification */}
              {requiresInviteCode && (
                <div className={`p-5 border rounded-xl ${
                  inviteCodeVerified 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-orange-50 border-orange-200'
                }`}>
                  <div className="flex gap-3">
                    {inviteCodeVerified ? (
                      <CheckCircle className="text-green-600 mt-0.5" size={20} />
                    ) : (
                      <AlertCircle className="text-orange-600 mt-0.5" size={20} />
                    )}
                    <div className="flex-1">
                      <p className={`font-semibold ${inviteCodeVerified ? 'text-green-900' : 'text-orange-900'}`}>
                        {inviteCodeVerified ? 'Invite Code Verified ✓' : 'Invite Code Required'}
                      </p>
                      
                      {!inviteCodeVerified && (
                        <>
                          <div className="mt-3 flex gap-2">
                            <input
                              type="text"
                              value={formData.inviteCode}
                              onChange={(e) => {
                                setFormData({ ...formData, inviteCode: e.target.value.toUpperCase() });
                                setErrors({ ...errors, inviteCode: '' });
                              }}
                              placeholder="Enter your invite code"
                              className={`flex-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none uppercase ${
                                errors.inviteCode ? 'border-red-500' : 'border-gray-300'
                              }`}
                              maxLength={8}
                            />
                            <button
                              type="button"
                              onClick={verifyInviteCode}
                              disabled={verifyingCode || !formData.inviteCode.trim()}
                              className="px-6 py-3 bg-orange-600 text-white font-medium rounded-xl hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {verifyingCode ? 'Verifying...' : 'Verify'}
                            </button>
                          </div>
                          {errors.inviteCode && (
                            <p className="text-red-600 text-sm mt-2">{errors.inviteCode}</p>
                          )}
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

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="john@example.com"
                    />
                  </div>
                  {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="+234 801 234 5678"
                    />
                  </div>
                  {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 2 - Keep existing code */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {selectedRole === 'CLIENT' && (
                <>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Company Details</h2>
                    <p className="text-gray-600 mt-2">Tell us about your organization</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none ${
                          errors.companyName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Acme Technologies Ltd"
                      />
                    </div>
                    {errors.companyName && <p className="text-red-600 text-sm mt-1">{errors.companyName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                    <select
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none ${
                        errors.industry ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select industry</option>
                      {industries.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                    {errors.industry && <p className="text-red-600 text-sm mt-1">{errors.industry}</p>}
                  </div>
                </>
              )}

              {selectedRole === 'DEVELOPER' && (
                <>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Developer Profile</h2>
                    <p className="text-gray-600 mt-2">Showcase your skills and experience</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Your Skills</label>
                    <div className="grid grid-cols-2 gap-3">
                      {skillsList.map(skill => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => handleSkillToggle(skill)}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            formData.skills.includes(skill)
                              ? 'border-green-600 bg-green-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                              formData.skills.includes(skill) ? 'border-green-600 bg-green-600' : 'border-gray-300'
                            }`}>
                              {formData.skills.includes(skill) && <CheckCircle className="text-white" size={16} />}
                            </div>
                            <span className="font-medium">{skill}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                    {errors.skills && <p className="text-red-600 text-sm mt-2">{errors.skills}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                    <select
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none ${
                        errors.experience ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select level</option>
                      {experienceLevels.map(level => <option key={level} value={level}>{level}</option>)}
                    </select>
                    {errors.experience && <p className="text-red-600 text-sm mt-1">{errors.experience}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">GitHub Username</label>
                    <input
                      type="text"
                      value={formData.githubUsername}
                      onChange={(e) => setFormData({ ...formData, githubUsername: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none ${
                        errors.githubUsername ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="yourusername"
                    />
                    {errors.githubUsername && <p className="text-red-600 text-sm mt-1">{errors.githubUsername}</p>}
                  </div>
                </>
              )}

              {selectedRole === 'ADMIN' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Admin Access Request</h2>
                    <p className="text-gray-600 mt-2">Restricted administrative access</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Position</label>
                    <div className="relative">
                      <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none ${
                          errors.position ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="e.g. System Administrator"
                      />
                    </div>
                    {errors.position && <p className="text-red-600 text-sm mt-1">{errors.position}</p>}
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
                    <div className="flex gap-3">
                      <Shield className="text-purple-600" size={24} />
                      <div>
                        <h4 className="font-semibold text-purple-900">Admin Access Review</h4>
                        <p className="text-sm text-purple-700 mt-1">
                          Your application will be manually reviewed. You will receive an email within 24-48 hours.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3 - Keep existing code for password */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Secure Your Account</h2>
                <p className="text-gray-600 mt-2">Create a strong password</p>
              </div>

              {errors.form && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-700 font-medium">{errors.form}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`w-full pl-12 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className={`w-full pl-12 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                  className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  I agree to the <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link> and{' '}
                  <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
                </span>
              </label>
              {errors.agreeToTerms && <p className="text-red-600 text-sm">{errors.agreeToTerms}</p>}
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-4 mt-10">
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
              >
                Back
              </button>
            )}
            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    {selectedRole === 'CLIENT' ? 'Create Account' : 'Submit Application'}
                    <CheckCircle size={20} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <p className="mt-8 text-center text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}