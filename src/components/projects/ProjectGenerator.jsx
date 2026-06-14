import { useState, useMemo, useCallback } from 'react';
import { useProfile } from '../../hooks/useProfile';
import { generateContent } from '../../services/gemini';
import { buildProjectPrompt, PROJECT_TRIGGER_PROMPT } from '../../services/projectPrompt';
import PageWrapper from '../layout/PageWrapper';
import { Button, Card, Spinner } from '../shared';

/**
 * Difficulty badge color map.
 */
const DIFFICULTY_COLORS = {
  beginner: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  intermediate: 'bg-amber-100 text-amber-700 border-amber-200',
  advanced: 'bg-red-100 text-red-700 border-red-200',
};

/**
 * Project Generator page.
 * Uses Gemini to generate personalized portfolio project ideas.
 *
 * @returns {JSX.Element}
 */
export default function ProjectGenerator() {
  const { profile } = useProfile();
  const [projects, setProjects] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const systemPrompt = useMemo(() => buildProjectPrompt(profile), [profile]);

  const generate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setProjects(null);

    try {
      const raw = await generateContent(systemPrompt, PROJECT_TRIGGER_PROMPT, {
        temperature: 0.9,
        maxOutputTokens: 3000,
      });

      const cleaned = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
      const parsed = JSON.parse(cleaned);
      setProjects(parsed.projects || []);
    } catch (err) {
      console.error('Project generation error:', err);
      setError(err instanceof SyntaxError
        ? 'AI returned an unexpected format. Please try again.'
        : 'Generation failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [systemPrompt]);

  return (
    <PageWrapper title="Projects" subtitle="AI-Powered Ideas">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Trigger card */}
        {!projects && !isLoading && (
          <Card className="text-center animate-fade-in">
            <div className="py-6">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-text mb-2">Generate Project Ideas</h2>
              <p className="text-text-light max-w-md mx-auto mb-8">
                Get personalized portfolio project ideas that align with your skills and career goals. Impress recruiters with projects that matter.
              </p>
              <Button size="lg" onClick={generate} id="generate-projects-button">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                </svg>
                Generate Ideas
              </Button>
            </div>
          </Card>
        )}

        {isLoading && (
          <Card className="text-center py-16 animate-fade-in">
            <Spinner size="lg" label="Generating project ideas..." />
            <p className="text-text-muted text-sm mt-4">Crafting personalized ideas...</p>
          </Card>
        )}

        {error && (
          <div className="p-4 bg-danger-50 border border-danger/20 rounded-card text-danger text-sm" role="alert">
            <p>{error}</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={generate}>Try Again</Button>
          </div>
        )}

        {/* Project cards */}
        {projects && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-text">Your Personalized Projects</h2>
              <Button variant="outline" size="sm" onClick={generate} disabled={isLoading}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
                </svg>
                Regenerate
              </Button>
            </div>

            {projects.map((project, i) => {
              const isExpanded = expandedId === i;
              return (
                <Card
                  key={i}
                  padding="none"
                  className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Card header */}
                  <div
                    className="p-6 cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : i)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-pill border ${DIFFICULTY_COLORS[project.difficulty] || DIFFICULTY_COLORS.intermediate}`}>
                            {project.difficulty}
                          </span>
                          <span className="px-2.5 py-0.5 text-[10px] font-medium rounded-pill bg-gray-100 text-text-muted border border-gray-200">
                            ⏱ {project.duration}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-text mb-1">{project.title}</h3>
                        <p className="text-sm text-text-light">{project.tagline}</p>
                      </div>
                      <svg
                        className={`w-5 h-5 text-text-muted transition-transform duration-200 flex-shrink-0 mt-1 ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                      </svg>
                    </div>

                    {/* Tech stack pills */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {project.techStack?.map((tech, j) => (
                        <span key={j} className="px-2 py-0.5 bg-primary-50 text-primary-700 text-xs font-medium rounded-pill border border-primary-100">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Expandable details */}
                  {isExpanded && (
                    <div className="px-6 pb-6 border-t border-gray-100 pt-4 animate-fade-in space-y-4">
                      <div>
                        <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Description</h4>
                        <p className="text-sm text-text-light leading-relaxed">{project.description}</p>
                      </div>

                      <div>
                        <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Key Features</h4>
                        <ul className="space-y-1.5">
                          {project.features?.map((f, j) => (
                            <li key={j} className="flex items-start gap-2 text-sm text-text-light">
                              <svg className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                              </svg>
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">What You'll Learn</h4>
                        <ul className="space-y-1.5">
                          {project.learningOutcomes?.map((l, j) => (
                            <li key={j} className="flex items-start gap-2 text-sm text-text-light">
                              <span className="text-secondary">📘</span>
                              {l}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {project.impressFactor && (
                        <div className="p-3 bg-secondary-50 border border-secondary-100 rounded-lg">
                          <p className="text-xs font-semibold text-secondary-700 mb-1">🌟 Why This Impresses Recruiters</p>
                          <p className="text-sm text-secondary-600">{project.impressFactor}</p>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
