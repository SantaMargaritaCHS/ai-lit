import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { GraduationCap, Mail, ExternalLink, ChevronRight, Shield, BookOpen, Users, Lightbulb, Lock } from 'lucide-react';

const ACCESS_CODE = 'innovation';

export default function LandingPage() {
  const [accessGranted, setAccessGranted] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [showGate, setShowGate] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('ailit-access');
    if (stored === 'granted') setAccessGranted(true);
  }, []);

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.toLowerCase().trim() === ACCESS_CODE) {
      setAccessGranted(true);
      sessionStorage.setItem('ailit-access', 'granted');
      setError('');
    } else {
      setError('Incorrect access code. Please check your information card.');
    }
  };

  const modules = [
    {
      title: 'Introduction to Generative AI',
      description: 'Explore what generative AI is, how it works, and its growing role in everyday life.',
      level: 'Beginner',
      duration: '15 min',
      color: 'bg-purple-500',
    },
    {
      title: 'Understanding Large Language Models',
      description: 'Dive into how LLMs process language, generate text, and the technology behind tools like ChatGPT.',
      level: 'Intermediate',
      duration: '20 min',
      color: 'bg-cyan-500',
    },
    {
      title: 'Privacy and Data Rights',
      description: 'Learn how AI collects and uses your data, and what rights you have to protect your digital privacy.',
      level: 'Beginner',
      duration: '20 min',
      color: 'bg-green-500',
    },
    {
      title: 'AI Environmental Impact',
      description: 'Understand the energy costs and environmental footprint of training and running AI systems.',
      level: 'Intermediate',
      duration: '20 min',
      color: 'bg-emerald-500',
    },
    {
      title: 'Introduction to Prompting',
      description: 'Master the art of communicating with AI — learn techniques for writing effective prompts.',
      level: 'Beginner',
      duration: '20 min',
      color: 'bg-pink-500',
    },
    {
      title: 'AI Ethics: An Ancient Compass',
      description: 'Explore AI ethics through the lens of Catholic Social Teaching — Human Dignity, Common Good, and Solidarity.',
      level: 'Intermediate',
      duration: '25 min',
      color: 'bg-indigo-600',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-gradient-to-br from-[#002855] via-[#003a7a] to-[#00509e]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          }} />
        </div>
        <nav className="relative z-10 container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/images/smchs-logo.png"
              alt="Santa Margarita Catholic High School"
              className="h-12 w-auto"
            />
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://www.smhs.org/academics/ed-tech/ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white text-sm flex items-center gap-1 transition-colors"
            >
              Our AI Initiative <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </nav>

        <div className="relative z-10 container mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
            <GraduationCap className="w-4 h-4 text-amber-300" />
            <span className="text-white/90 text-sm font-medium">Santa Margarita Catholic High School</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            AI Literacy<br />
            <span className="text-amber-300">Learning Modules</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-10 leading-relaxed">
            Free, interactive learning experiences designed to help students understand
            artificial intelligence — its power, its limitations, and the responsibility
            that comes with using it.
          </p>

          {accessGranted ? (
            <Link href="/modules">
              <a className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-[#002855] font-semibold px-8 py-4 rounded-xl text-lg transition-all hover:shadow-lg hover:-translate-y-0.5">
                Explore the Modules <ChevronRight className="w-5 h-5" />
              </a>
            </Link>
          ) : (
            <button
              onClick={() => setShowGate(true)}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-[#002855] font-semibold px-8 py-4 rounded-xl text-lg transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              <Lock className="w-5 h-5" />
              Access the Modules
            </button>
          )}
        </div>

        {/* Wave divider */}
        <div className="relative z-10">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 80L60 74.7C120 69 240 59 360 53.3C480 48 600 48 720 53.3C840 59 960 69 1080 69.3C1200 69 1320 59 1380 53.3L1440 48V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" fill="white"/>
          </svg>
        </div>
      </header>

      {/* Access Code Gate Modal */}
      {showGate && !accessGranted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#002855]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-[#002855]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Access Code Required</h2>
              <p className="text-gray-600 mt-2">
                Enter the access code from your information card to explore the modules.
              </p>
            </div>
            <form onSubmit={handleCodeSubmit}>
              <input
                type="text"
                value={code}
                onChange={(e) => { setCode(e.target.value); setError(''); }}
                placeholder="Enter access code"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#002855] focus:outline-none text-center text-lg tracking-wider"
                autoFocus
              />
              {error && (
                <p className="text-red-600 text-sm mt-2 text-center">{error}</p>
              )}
              <button
                type="submit"
                className="w-full mt-4 bg-[#002855] hover:bg-[#003a7a] text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={() => setShowGate(false)}
                className="w-full mt-2 text-gray-500 hover:text-gray-700 text-sm py-2"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* About Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#002855]/10 rounded-lg flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-[#002855]" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Why We Built This</h2>
          </div>
          <div className="prose prose-lg text-gray-600 space-y-4">
            <p>
              At <strong>Santa Margarita Catholic High School</strong> in Rancho Santa Margarita, California,
              we believe that preparing students for the future means teaching them not just <em>how</em> to
              use AI, but <em>how to think</em> about it. Our guiding framework —
              <strong> "Our LIGHT"</strong> — calls us to form
              "thoughtful, courageous, and caring leaders and innovators who leverage technology to improve
              the human condition."
            </p>
            <p>
              Since the emergence of generative AI, our <strong>Innovation Taskforce</strong> — a monthly
              collaboration of 20+ administrators, teachers, students, and parents — has been at the
              forefront of responsible AI integration. We've developed school-wide policies, curated
              pre-approved tools, created professional development programs, and — most importantly — built
              these interactive AI literacy modules for our students.
            </p>
            <p>
              These modules aren't lectures. Each one is a <strong>self-paced, video-based learning
              experience</strong> with interactive activities, AI-powered reflection feedback, quizzes,
              and a completion certificate. Students explore everything from how large language models work
              to the environmental impact of AI — all grounded in critical thinking and, where
              appropriate, Catholic Social Teaching.
            </p>
          </div>
        </div>
      </section>

      {/* Module Preview Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">What's Inside</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Six interactive modules covering the foundations of AI literacy — from how the technology
              works to the ethical questions it raises.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {modules.map((mod) => (
              <div key={mod.title} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className={`${mod.color} h-1.5`} />
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{mod.level}</span>
                    <span className="text-xs text-gray-400">{mod.duration}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1.5">{mod.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{mod.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Approach Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Approach</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Responsible</h3>
              <p className="text-sm text-gray-600">
                Follow instructions, fact-check AI outputs, and always cite when AI assists your work.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Safe</h3>
              <p className="text-sm text-gray-600">
                Protect personal information, use pre-approved tools, and understand age-appropriate guidelines.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Ethical</h3>
              <p className="text-sm text-gray-600">
                Reject bias and harmful content, respect intellectual property, and consider AI's broader impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Notice */}
      <section className="bg-amber-50 border-y border-amber-100 py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Demo Access</h2>
            <p className="text-gray-700 leading-relaxed">
              These modules are provided as a <strong>free demonstration</strong> of our AI literacy curriculum.
              They are intended for preview purposes and should not be assigned to students outside of
              Santa Margarita Catholic High School. If you're interested in bringing this curriculum to
              your school or organization, we'd love to talk about a partnership.
            </p>
            {accessGranted ? (
              <Link href="/modules">
                <a className="inline-flex items-center gap-2 mt-6 bg-[#002855] hover:bg-[#003a7a] text-white font-semibold px-6 py-3 rounded-xl transition-colors">
                  Go to Modules <ChevronRight className="w-5 h-5" />
                </a>
              </Link>
            ) : (
              <button
                onClick={() => setShowGate(true)}
                className="inline-flex items-center gap-2 mt-6 bg-[#002855] hover:bg-[#003a7a] text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                <Lock className="w-5 h-5" />
                Enter Access Code
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Interested in a Partnership?</h2>
          <p className="text-gray-600 mb-8">
            We're happy to share what we've learned and explore how these resources
            might work for your school or organization.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <div className="bg-white rounded-xl border border-gray-200 p-6 flex-1 max-w-xs mx-auto sm:mx-0">
              <h3 className="font-semibold text-gray-900">Jorge Ledezma</h3>
              <p className="text-sm text-gray-500 mb-3">Director of Innovation</p>
              <a
                href="mailto:ledezmaj@smhs.org"
                className="inline-flex items-center gap-2 text-[#002855] hover:text-[#003a7a] text-sm font-medium"
              >
                <Mail className="w-4 h-4" /> ledezmaj@smhs.org
              </a>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 flex-1 max-w-xs mx-auto sm:mx-0">
              <h3 className="font-semibold text-gray-900">Michelle Cho</h3>
              <p className="text-sm text-gray-500 mb-3">AP of Innovation</p>
              <a
                href="mailto:chom@smhs.org"
                className="inline-flex items-center gap-2 text-[#002855] hover:text-[#003a7a] text-sm font-medium"
              >
                <Mail className="w-4 h-4" /> chom@smhs.org
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#002855] text-white py-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img
                src="/images/smchs-logo.png"
                alt="SMCHS"
                className="h-10 w-auto brightness-0 invert"
              />
              <div>
                <p className="font-semibold text-sm">Santa Margarita Catholic High School</p>
                <p className="text-white/60 text-xs">Rancho Santa Margarita, California</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a
                href="https://www.smhs.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors flex items-center gap-1"
              >
                smhs.org <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://www.smhs.org/academics/ed-tech/ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors flex items-center gap-1"
              >
                AI Initiative <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-white/40 text-xs">
              &copy; {new Date().getFullYear()} Santa Margarita Catholic High School. These modules are provided as a free demo and are not for classroom assignment without partnership agreement.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
