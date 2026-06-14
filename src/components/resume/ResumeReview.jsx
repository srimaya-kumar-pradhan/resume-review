import { useState, useMemo, useCallback } from 'react';
import { useProfile } from '../../hooks/useProfile';
import { generateContent } from '../../services/gemini';
import { buildResumePrompt, RESUME_REVIEW_PREFIX } from '../../services/resumePrompt';
import { validateResumeText } from '../../utils/validate';
import PageWrapper from '../layout/PageWrapper';
import { Button, Card, Spinner } from '../shared';

/**
 * Status color map for resume sections.
 */
const STATUS_COLORS = {
  good: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', icon: '✅' },
  'needs-work': { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: '⚠️' },
  missing: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: '❌' },
};

/**
 * Resume Review page.
 * User pastes their resume text, Gemini analyzes it section-by-section.
 *
 * @returns {JSX.Element}
 */
export default function ResumeReview() {
  const { profile } = useProfile();
  const [resumeText, setResumeText] = useState('');
  const [review, setReview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputError, setInputError] = useState(null);

  const systemPrompt = useMemo(() => buildResumePrompt(profile), [profile]);

  const handleSubmit = useCallback(async () => {
    /* Validate */
    const validationError = validateResumeText(resumeText);
    if (validationError) {
      setInputError(validationError);
      return;
    }

    setInputError(null);
    setIsLoading(true);
    setError(null);
    setReview(null);

    try {
      const raw = await generateContent(
        systemPrompt,
        RESUME_REVIEW_PREFIX + resumeText,
        { temperature: 0.5, maxOutputTokens: 4000 }
      );

      const cleaned = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
      const parsed = JSON.parse(cleaned);
      setReview(parsed);
    } catch (err) {
      console.error('Resume review error:', err);
      setError(err instanceof SyntaxError
        ? 'AI returned an unexpected format. Please try again.'
        : 'Review failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [resumeText, systemPrompt]);

  return (
    <PageWrapper title="Resume Review" subtitle="AI-Powered Analysis">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Input card */}
        <Card>
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
              <h2 className="text-lg font-bold text-text">Paste Your Resume</h2>
            </div>
            <p className="text-sm text-text-light">
              Paste the full text of your resume below. The AI will analyze each section and provide detailed feedback.
            </p>
            <textarea
              id="resume-text-input"
              value={resumeText}
              onChange={(e) => {
                setResumeText(e.target.value);
                if (inputError) setInputError(null);
              }}
              placeholder="Paste your resume text here (minimum 100 characters)..."
              rows={10}
              className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-input text-sm text-text placeholder:text-text-muted resize-none focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors ${inputError ? 'border-danger' : 'border-gray-200'}`}
            />
            <div className="flex items-center justify-between">
              {inputError ? (
                <p className="text-sm text-danger" role="alert">{inputError}</p>
              ) : (
                <span className={`text-xs ${resumeText.length >= 100 ? 'text-success' : 'text-text-muted'}`}>
                  {resumeText.length}/5000 characters
                </span>
              )}
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                loading={isLoading}
                id="submit-resume-button"
              >
                Analyze Resume
              </Button>
            </div>
          </div>
        </Card>

        {/* Loading */}
        {isLoading && (
          <Card className="text-center py-12 animate-fade-in">
            <Spinner size="lg" label="Analyzing your resume..." />
            <p className="text-text-muted text-sm mt-4">Evaluating content, format, and ATS compatibility...</p>
          </Card>
        )}

        {/* Error */}
        {error && (
          <div className="p-4 bg-danger-50 border border-danger/20 rounded-card text-danger text-sm" role="alert">
            <p>{error}</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={handleSubmit}>Try Again</Button>
          </div>
        )}

        {/* ═══ RESULTS ═══ */}
        {review && (
          <div className="space-y-6 animate-fade-in">

            {/* Overall Score */}
            <Card>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative w-32 h-32 flex-shrink-0">
                  <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="52" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                    <circle
                      cx="60" cy="60" r="52" fill="none"
                      stroke={review.overallScore >= 70 ? '#22c55e' : review.overallScore >= 40 ? '#f59e0b' : '#ef4444'}
                      strokeWidth="10" strokeLinecap="round"
                      strokeDasharray={`${(review.overallScore / 100) * 327} 327`}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-text">{review.overallScore}</span>
                    <span className="text-xs text-text-muted">/100</span>
                  </div>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-xl font-bold text-text mb-2">Resume Score</h3>
                  <p className="text-text-light leading-relaxed">{review.verdict}</p>
                </div>
              </div>
            </Card>

            {/* ATS Score */}
            {review.atsScore !== undefined && (
              <Card>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">🤖</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-sm font-bold text-text">ATS Compatibility</h4>
                      <span className={`text-sm font-bold ${review.atsScore >= 70 ? 'text-emerald-600' : review.atsScore >= 40 ? 'text-amber-600' : 'text-danger'}`}>
                        {review.atsScore}%
                      </span>
                    </div>
                    <p className="text-sm text-text-light">{review.atsNotes}</p>
                  </div>
                </div>
              </Card>
            )}

            {/* Section-by-Section */}
            {review.sections?.length > 0 && (
              <Card header="Section-by-Section Analysis" padding="none">
                <div className="divide-y divide-gray-100">
                  {review.sections.map((section, i) => {
                    const colors = STATUS_COLORS[section.status] || STATUS_COLORS['needs-work'];
                    return (
                      <div key={i} className="p-5">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span>{colors.icon}</span>
                            <h4 className="text-sm font-bold text-text">{section.name}</h4>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-pill border ${colors.bg} ${colors.border} ${colors.text}`}>
                              {section.status}
                            </span>
                            <span className="text-sm font-bold text-text">{section.score}%</span>
                          </div>
                        </div>
                        <p className="text-sm text-text-light mb-3">{section.feedback}</p>
                        {section.suggestions?.length > 0 && (
                          <ul className="space-y-1">
                            {section.suggestions.map((s, j) => (
                              <li key={j} className="flex items-start gap-2 text-xs text-text-muted">
                                <span className="text-primary mt-0.5">→</span>
                                {s}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}

            {/* Strengths + Improvements */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {review.strengths?.length > 0 && (
                <Card>
                  <h4 className="text-sm font-bold text-emerald-700 mb-3 flex items-center gap-2">
                    <span>💪</span> Strengths
                  </h4>
                  <ul className="space-y-2">
                    {review.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-text-light">
                        <svg className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                        {s}
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
              {review.improvements?.length > 0 && (
                <Card>
                  <h4 className="text-sm font-bold text-amber-700 mb-3 flex items-center gap-2">
                    <span>🎯</span> Top Improvements
                  </h4>
                  <ul className="space-y-2">
                    {review.improvements.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-text-light">
                        <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126Z" />
                        </svg>
                        {s}
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </div>

            {/* Rewritten Summary */}
            {review.rewrittenSummary && (
              <Card>
                <h4 className="text-sm font-bold text-text mb-3 flex items-center gap-2">
                  <span>✨</span> AI-Suggested Professional Summary
                </h4>
                <div className="p-4 bg-primary-50 border border-primary-100 rounded-lg">
                  <p className="text-sm text-primary-800 leading-relaxed italic">
                    "{review.rewrittenSummary}"
                  </p>
                </div>
                <p className="text-[10px] text-text-muted mt-2">
                  Copy this to your resume's summary section for a stronger first impression.
                </p>
              </Card>
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
