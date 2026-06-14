import { useState, useMemo, useCallback } from 'react';
import { useProfile } from '../../hooks/useProfile';
import { generateContent } from '../../services/gemini';
import { buildSkillGapPrompt, ANALYSIS_TRIGGER_PROMPT } from '../../services/skillGapPrompt';
import PageWrapper from '../layout/PageWrapper';
import SkillBar from './SkillBar';
import { Button, Card, Spinner } from '../shared';

/**
 * Skill Gap Analysis page.
 * Sends the student's profile to Gemini for structured skill assessment,
 * then renders visual skill bars, missing skills, and an action plan.
 *
 * @returns {JSX.Element}
 */
export default function SkillGapAnalysis() {
  const { profile } = useProfile();

  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const systemPrompt = useMemo(
    () => buildSkillGapPrompt(profile),
    [profile]
  );

  /**
   * Triggers the Gemini analysis and parses the JSON response.
   */
  const runAnalysis = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const raw = await generateContent(
        systemPrompt,
        ANALYSIS_TRIGGER_PROMPT,
        { temperature: 0.6, maxOutputTokens: 3000 }
      );

      /* Strip any markdown code fences if Gemini wraps the JSON */
      const cleaned = raw
        .replace(/```json\s*/gi, '')
        .replace(/```\s*/g, '')
        .trim();

      const parsed = JSON.parse(cleaned);
      setAnalysis(parsed);
    } catch (err) {
      console.error('Skill gap analysis error:', err);
      if (err instanceof SyntaxError) {
        setError('AI returned an unexpected format. Please try again.');
      } else if (err.message?.includes('API key')) {
        setError('Invalid API key. Check your Gemini configuration.');
      } else {
        setError('Analysis failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [systemPrompt]);

  return (
    <PageWrapper title="Skill Analysis" subtitle="AI-Powered Gap Assessment">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Intro card + trigger button */}
        {!analysis && !isLoading && (
          <Card className="text-center animate-fade-in">
            <div className="py-6">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-text mb-2">Analyze Your Skill Gaps</h2>
              <p className="text-text-light max-w-md mx-auto mb-8">
                Our AI will compare your current skills against industry requirements for your career goals and provide personalized recommendations.
              </p>

              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {(profile?.skills || []).slice(0, 6).map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 bg-primary-50 text-primary-700 text-sm font-medium rounded-pill border border-primary-100"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <Button size="lg" onClick={runAnalysis} id="run-analysis-button">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                </svg>
                Run AI Analysis
              </Button>
            </div>
          </Card>
        )}

        {/* Loading state */}
        {isLoading && (
          <Card className="text-center py-16 animate-fade-in">
            <Spinner size="lg" label="Analyzing your skills..." />
            <p className="text-text-muted text-sm mt-4">
              Comparing your skills against industry standards...
            </p>
          </Card>
        )}

        {/* Error state */}
        {error && (
          <div className="p-4 bg-danger-50 border border-danger/20 rounded-card text-danger text-sm animate-fade-in" role="alert">
            <p className="font-medium mb-2">Analysis Error</p>
            <p>{error}</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={runAnalysis}>
              Try Again
            </Button>
          </div>
        )}

        {/* ═══ RESULTS ═══ */}
        {analysis && (
          <div className="space-y-6 animate-fade-in">

            {/* Overall Readiness */}
            <Card>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Radial score */}
                <div className="relative w-32 h-32 flex-shrink-0">
                  <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="52" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                    <circle
                      cx="60" cy="60" r="52" fill="none"
                      stroke={analysis.overallReadiness >= 70 ? '#22c55e' : analysis.overallReadiness >= 40 ? '#f59e0b' : '#ef4444'}
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={`${(analysis.overallReadiness / 100) * 327} 327`}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-text">{analysis.overallReadiness}%</span>
                    <span className="text-xs text-text-muted">Ready</span>
                  </div>
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-xl font-bold text-text mb-2">Career Readiness Score</h3>
                  <p className="text-text-light leading-relaxed">{analysis.summary}</p>
                </div>
              </div>
            </Card>

            {/* Current Skills */}
            {analysis.currentSkills?.length > 0 && (
              <Card header={
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <h3 className="text-lg font-semibold text-text">Your Current Skills</h3>
                  <span className="text-sm text-text-muted">({analysis.currentSkills.length})</span>
                </div>
              }>
                <div className="space-y-5">
                  {analysis.currentSkills.map((skill, i) => (
                    <div key={i}>
                      <SkillBar
                        name={skill.name}
                        currentLevel={skill.currentLevel}
                        requiredLevel={skill.requiredLevel}
                        priority={skill.priority}
                      />
                      <div className="mt-2 ml-1">
                        <p className="text-xs text-text-light">{skill.recommendation}</p>
                        {skill.resources?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {skill.resources.map((r, j) => (
                              <span key={j} className="px-2 py-0.5 bg-gray-50 border border-gray-100 rounded text-[10px] text-text-muted">
                                📚 {r}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Missing Skills */}
            {analysis.missingSkills?.length > 0 && (
              <Card header={
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-text">Skills You Need to Learn</h3>
                  <span className="text-sm text-text-muted">({analysis.missingSkills.length})</span>
                </div>
              }>
                <div className="space-y-5">
                  {analysis.missingSkills.map((skill, i) => (
                    <div key={i}>
                      <SkillBar
                        name={skill.name}
                        currentLevel={0}
                        requiredLevel={skill.requiredLevel}
                        priority={skill.priority}
                        isMissing
                      />
                      <div className="mt-2 ml-1">
                        <p className="text-xs text-text-light">{skill.recommendation}</p>
                        {skill.resources?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {skill.resources.map((r, j) => (
                              <span key={j} className="px-2 py-0.5 bg-gray-50 border border-gray-100 rounded text-[10px] text-text-muted">
                                📚 {r}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Action Plan */}
            {analysis.actionPlan?.length > 0 && (
              <Card header={
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.841m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-text">Your 6-Month Action Plan</h3>
                </div>
              }>
                <ol className="space-y-4">
                  {analysis.actionPlan.map((step, i) => (
                    <li key={i} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">{i + 1}</span>
                      </div>
                      <p className="text-sm text-text-light leading-relaxed pt-1">{step}</p>
                    </li>
                  ))}
                </ol>
              </Card>
            )}

            {/* Re-run button */}
            <div className="flex justify-center pt-2 pb-4">
              <Button variant="outline" onClick={runAnalysis} disabled={isLoading}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
                </svg>
                Re-run Analysis
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
