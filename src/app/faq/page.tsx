'use client';

import React, { useState } from 'react';
import { ChevronDown, Search, MessageCircle, Mail, Phone } from 'lucide-react';

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      category: 'Getting Started',
      questions: [
        {
          question: 'How do I create an account?',
          answer: 'Click on the "Sign Up" button in the top right corner. Choose your role (Admin, Developer, or Client), fill in your details, and submit. If you\'re signing up as a Developer or Admin, your account will need to be approved by an administrator before you can access the full platform.'
        },
        {
          question: 'What are the different user roles?',
          answer: 'We have four user roles: Super Admin (full system access), Admin (can manage users, projects, and tasks), Developer (can work on assigned tasks and projects), and Client (can view projects and communicate with the team). Each role has specific permissions tailored to their needs.'
        },
        {
          question: 'How long does account approval take?',
          answer: 'Account approvals are typically processed within 24-48 hours. You\'ll receive an email notification once your account has been approved. If you need urgent access, please contact our support team.'
        }
      ]
    },
    {
      category: 'Projects & Tasks',
      questions: [
        {
          question: 'How do I create a new project?',
          answer: 'Admins and Super Admins can create projects by navigating to the Admin Dashboard, clicking on "Project Management", and then "Create Project". Fill in the project details, assign team members, and set deadlines. Projects can be managed throughout their lifecycle from the project dashboard.'
        },
        {
          question: 'Can I assign multiple developers to a task?',
          answer: 'Currently, each task can be assigned to one developer at a time. However, you can break larger tasks into subtasks and assign different developers to each subtask. This approach helps maintain clarity and accountability.'
        },
        {
          question: 'How do I track project progress?',
          answer: 'Project progress can be tracked through the Admin Dashboard. You\'ll see real-time updates on task completion, project milestones, and team performance. Developers update their task status as they work, providing live progress indicators.'
        },
        {
          question: 'What task statuses are available?',
          answer: 'Tasks can have four statuses: TODO (not started), IN_PROGRESS (actively being worked on), REVIEW (completed and awaiting review), and DONE (completed and approved). These statuses help track the workflow from start to finish.'
        }
      ]
    },
    {
      category: 'Account & Security',
      questions: [
        {
          question: 'How do I reset my password?',
          answer: 'Click on "Forgot Password" on the login page. Enter your email address, and we\'ll send you a password reset link. The link is valid for 1 hour. Follow the instructions in the email to create a new password.'
        },
        {
          question: 'Is my data secure?',
          answer: 'Yes! We take security seriously. All data is encrypted in transit using SSL/TLS. Passwords are hashed using industry-standard algorithms. We regularly perform security audits and follow best practices to protect your information.'
        },
        {
          question: 'Can I change my email address?',
          answer: 'Yes, you can update your email address from your profile settings. After changing your email, you\'ll receive a verification email to confirm the new address before the change takes effect.'
        },
        {
          question: 'How do I delete my account?',
          answer: 'To delete your account, contact our support team. Please note that account deletion is permanent and cannot be undone. All your data will be removed from our systems within 30 days, as per our data retention policy.'
        }
      ]
    },
    {
      category: 'Billing & Subscriptions',
      questions: [
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for enterprise accounts. All payments are processed securely through our payment partners.'
        },
        {
          question: 'Can I upgrade or downgrade my plan?',
          answer: 'Yes, you can change your plan at any time from the billing section of your account. Upgrades take effect immediately, while downgrades take effect at the start of your next billing cycle. You\'ll be prorated accordingly.'
        },
        {
          question: 'What is your refund policy?',
          answer: 'We offer a 30-day money-back guarantee for new subscriptions. If you\'re not satisfied within the first 30 days, contact us for a full refund. After 30 days, refunds are handled on a case-by-case basis.'
        },
        {
          question: 'Do you offer discounts for non-profits?',
          answer: 'Yes! We offer a 50% discount for registered non-profit organizations. Contact our sales team with your non-profit documentation to apply for this discount.'
        }
      ]
    },
    {
      category: 'Technical Support',
      questions: [
        {
          question: 'What browsers are supported?',
          answer: 'Our platform works best on the latest versions of Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated for the best experience and security.'
        },
        {
          question: 'Is there a mobile app?',
          answer: 'Currently, our platform is web-based and mobile-responsive, meaning it works great on mobile browsers. We\'re working on dedicated iOS and Android apps, which will be released in the coming months.'
        },
        {
          question: 'How do I report a bug?',
          answer: 'If you encounter a bug, please report it through the "Report Issue" link in your dashboard or email support@yourcompany.com with details about the issue, including screenshots if possible. We appreciate your help in improving our platform!'
        },
        {
          question: 'Do you offer API access?',
          answer: 'Yes, we provide REST API access for Business and Enterprise plans. API documentation is available in your account dashboard. Contact our support team for API keys and integration assistance.'
        }
      ]
    },
    {
      category: 'Features & Integrations',
      questions: [
        {
          question: 'What integrations do you support?',
          answer: 'We integrate with popular tools including GitHub, Slack, Google Drive, Trello, Jira, and more. Check our integrations page for a complete list. Enterprise customers can request custom integrations.'
        },
        {
          question: 'Can I export my data?',
          answer: 'Yes! You can export your data at any time in CSV or JSON format from your account settings. This includes projects, tasks, user data, and activity logs. We believe in data portability.'
        },
        {
          question: 'Do you offer team training?',
          answer: 'Yes, we offer onboarding sessions and team training for Business and Enterprise plans. We can customize training sessions to your team\'s specific needs. Contact our customer success team to schedule a session.'
        }
      ]
    }
  ];

  const filteredFAQs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      q =>
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  let questionIndex = -1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Find answers to common questions about our platform
          </p>

          {/* Search */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        {filteredFAQs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No questions found matching "{searchTerm}". Try a different search term.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {filteredFAQs.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="w-1.5 h-8 bg-blue-600 rounded-full"></span>
                  {category.category}
                </h2>

                <div className="space-y-4">
                  {category.questions.map((faq) => {
                    questionIndex++;
                    const currentIndex = questionIndex;
                    return (
                      <div
                        key={currentIndex}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <button
                          onClick={() => toggleQuestion(currentIndex)}
                          className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-semibold text-gray-900 text-lg">
                            {faq.question}
                          </span>
                          <ChevronDown
                            size={20}
                            className={`flex-shrink-0 text-blue-600 transition-transform ${
                              openIndex === currentIndex ? 'transform rotate-180' : ''
                            }`}
                          />
                        </button>

                        {openIndex === currentIndex && (
                          <div className="px-6 pb-5">
                            <div className="pt-2 border-t border-gray-100">
                              <p className="text-gray-600 leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Still Have Questions */}
      <div className="bg-blue-50 border-y border-blue-100 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Still have questions?
          </h2>
          <p className="text-gray-600 mb-8">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <a
              href="/support"
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all group"
            >
              <MessageCircle className="text-blue-600 mb-3 mx-auto group-hover:scale-110 transition-transform" size={32} />
              <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
              <p className="text-sm text-gray-600">Chat with our support team</p>
            </a>

            <a
              href="mailto:support@yourcompany.com"
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all group"
            >
              <Mail className="text-blue-600 mb-3 mx-auto group-hover:scale-110 transition-transform" size={32} />
              <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
              <p className="text-sm text-gray-600">support@yourcompany.com</p>
            </a>

            <a
              href="tel:+1234567890"
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all group"
            >
              <Phone className="text-blue-600 mb-3 mx-auto group-hover:scale-110 transition-transform" size={32} />
              <h3 className="font-semibold text-gray-900 mb-2">Call Us</h3>
              <p className="text-sm text-gray-600">+1 (234) 567-890</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}