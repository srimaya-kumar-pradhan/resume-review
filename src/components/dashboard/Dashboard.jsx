import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';
import PageWrapper from '../layout/PageWrapper';
import ProfileCard from '../profile/ProfileCard';
import { Card } from '../shared';

/**
 * Feature cards configuration for the dashboard.
 */
const FEATURES = [
  {
    path: '/advisor',
    title: 'Career Advisor',
    description: 'Get personalized career guidance powered by AI. Ask about career paths, internships, and more.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
      </svg>
    ),
    gradient: 'from-violet-500 to-purple-600',
    bgLight: 'bg-violet-50',
    textColor: 'text-violet-700',
    cta: 'Start Chat',
  },
  {
    path: '/skill-gap',
    title: 'Skill Analysis',
    description: 'Identify skill gaps between your current abilities and career requirements with visual charts.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    ),
    gradient: 'from-amber-500 to-orange-600',
    bgLight: 'bg-amber-50',
    textColor: 'text-amber-700',
    cta: 'Analyze Skills',
  },
  {
    path: '/projects',
    title: 'Project Ideas',
    description: 'Generate impressive portfolio project ideas tailored to your skills and career goals.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
      </svg>
    ),
    gradient: 'from-emerald-500 to-teal-600',
    bgLight: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    cta: 'Generate Ideas',
  },
  {
    path: '/resume',
    title: 'Resume Review',
    description: 'Get AI-powered feedback on your resume with section-by-section scoring and ATS checks.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
    gradient: 'from-rose-500 to-pink-600',
    bgLight: 'bg-rose-50',
    textColor: 'text-rose-700',
    cta: 'Review Resume',
  },
];

/**
 * Quick tips for the motivational section.
 */
const TIPS = [
  { emoji: '🎯', text: 'Update your skills regularly to get more accurate AI recommendations.' },
  { emoji: '📄', text: 'Tailor your resume for each job application — our AI can help with each version.' },
  { emoji: '🤝', text: 'Build at least 2-3 portfolio projects before applying to internships.' },
  { emoji: '📈', text: 'Run a skill gap analysis monthly to track your improvement over time.' },
];

/**
 * Main Dashboard page.
 * Central hub with welcome message, profile summary, feature cards, and tips.
 *
 * @returns {JSX.Element}
 */
export default function Dashboard() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();

  const displayName = profile?.name || user?.displayName || 'Student';
  const firstName = displayName.split(' ')[0];

  /* Greeting based on time of day */
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <PageWrapper title="Dashboard" subtitle="Overview">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* ═══ HERO WELCOME ═══ */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-primary-600 to-secondary p-6 lg:p-8 text-white">
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full blur-xl" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-white/80 text-sm mb-1">{greeting},</p>
              <h2 className="text-2xl lg:text-3xl font-bold mb-2">{firstName}! 👋</h2>
              <p className="text-white/70 text-sm max-w-lg">
                Ready to level up your career? Use our AI-powered tools to get personalized guidance, 
                analyze your skills, generate project ideas, and perfect your resume.
              </p>
            </div>

            <button
              onClick={() => navigate('/advisor')}
              className="px-5 py-2.5 bg-white text-primary font-semibold rounded-xl hover:bg-white/90 transition-colors shadow-lg shadow-black/10 flex items-center gap-2 text-sm flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
              </svg>
              Ask CareerBot
            </button>
          </div>
        </div>

        {/* ═══ MAIN GRID ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left column: Feature Cards (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-bold text-text flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
              AI Tools
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FEATURES.map((feature) => (
                <div
                  key={feature.path}
                  onClick={() => navigate(feature.path)}
                  className="group bg-surface rounded-card border border-gray-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  {/* Gradient accent bar */}
                  <div className={`h-1.5 bg-gradient-to-r ${feature.gradient}`} />

                  <div className="p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-xl ${feature.bgLight} flex items-center justify-center ${feature.textColor} group-hover:scale-110 transition-transform duration-300`}>
                        {feature.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-text group-hover:text-primary transition-colors">
                          {feature.title}
                        </h4>
                      </div>
                    </div>

                    <p className="text-xs text-text-light leading-relaxed mb-4">
                      {feature.description}
                    </p>

                    <div className={`inline-flex items-center gap-1.5 text-xs font-semibold ${feature.textColor} group-hover:gap-2.5 transition-all`}>
                      {feature.cta}
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column: Profile + Tips */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-text flex items-center gap-2">
              <svg className="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
              Your Profile
            </h3>

            {/* Compact Profile Card */}
            <ProfileCard compact />

            {/* Quick Tips */}
            <Card>
              <h4 className="text-sm font-bold text-text mb-3 flex items-center gap-2">
                <span>💡</span> Quick Tips
              </h4>
              <ul className="space-y-3">
                {TIPS.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="text-sm flex-shrink-0">{tip.emoji}</span>
                    <p className="text-xs text-text-light leading-relaxed">{tip.text}</p>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Stats mini card */}
            <Card>
              <h4 className="text-sm font-bold text-text mb-3 flex items-center gap-2">
                <span>📊</span> Your Stats
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-primary-50 rounded-xl">
                  <p className="text-2xl font-bold text-primary">{(profile?.skills || []).length}</p>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider">Skills</p>
                </div>
                <div className="text-center p-3 bg-secondary-50 rounded-xl">
                  <p className="text-2xl font-bold text-secondary">{(profile?.interests || []).length}</p>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider">Interests</p>
                </div>
                <div className="text-center p-3 bg-emerald-50 rounded-xl">
                  <p className="text-2xl font-bold text-emerald-600">{profile?.yearOfStudy || '—'}</p>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider">Year</p>
                </div>
                <div className="text-center p-3 bg-amber-50 rounded-xl">
                  <p className="text-2xl font-bold text-amber-600">4</p>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider">AI Tools</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
