/**
 * Visual skill level bar component.
 * Shows current level vs required level with color-coded gap indicator.
 *
 * @param {object} props
 * @param {string} props.name - Skill name
 * @param {number} props.currentLevel - Current proficiency (0-100)
 * @param {number} props.requiredLevel - Required proficiency (0-100)
 * @param {'high'|'medium'|'low'} [props.priority='medium']
 * @param {boolean} [props.isMissing=false] - True if this is a missing skill
 * @returns {JSX.Element}
 */
export default function SkillBar({
  name,
  currentLevel = 0,
  requiredLevel = 100,
  priority = 'medium',
  isMissing = false,
}) {
  const gap = requiredLevel - currentLevel;
  const gapPercent = Math.max(0, gap);

  const priorityColors = {
    high: { bg: 'bg-danger/10', text: 'text-danger', badge: 'bg-danger', bar: 'bg-danger' },
    medium: { bg: 'bg-amber-50', text: 'text-amber-600', badge: 'bg-amber-500', bar: 'bg-amber-400' },
    low: { bg: 'bg-emerald-50', text: 'text-emerald-600', badge: 'bg-emerald-500', bar: 'bg-emerald-400' },
  };

  const colors = priorityColors[priority] || priorityColors.medium;

  return (
    <div className="space-y-2">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-text">{name}</span>
          <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-pill text-white ${colors.badge}`}>
            {priority}
          </span>
          {isMissing && (
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-pill bg-gray-800 text-white">
              NEW
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs">
          {!isMissing && (
            <span className="text-text-light">
              Current: <strong className="text-text">{currentLevel}%</strong>
            </span>
          )}
          <span className="text-text-light">
            Required: <strong className="text-text">{requiredLevel}%</strong>
          </span>
          {gapPercent > 0 && (
            <span className={`font-bold ${colors.text}`}>
              Gap: {gapPercent}%
            </span>
          )}
        </div>
      </div>

      {/* Bar */}
      <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
        {/* Required level marker */}
        <div
          className="absolute top-0 bottom-0 border-r-2 border-dashed border-gray-400 z-10"
          style={{ left: `${requiredLevel}%` }}
        />

        {/* Current level fill */}
        {!isMissing && (
          <div
            className="absolute top-0 bottom-0 left-0 bg-primary rounded-full transition-all duration-700 ease-out"
            style={{ width: `${currentLevel}%` }}
          />
        )}

        {/* Gap fill */}
        {gapPercent > 0 && !isMissing && (
          <div
            className={`absolute top-0 bottom-0 ${colors.bar} opacity-30 rounded-r-full transition-all duration-700 ease-out`}
            style={{ left: `${currentLevel}%`, width: `${gapPercent}%` }}
          />
        )}

        {/* Missing skill — show full gap */}
        {isMissing && (
          <div
            className={`absolute top-0 bottom-0 left-0 ${colors.bar} opacity-30 rounded-full transition-all duration-700 ease-out`}
            style={{ width: `${requiredLevel}%` }}
          />
        )}
      </div>
    </div>
  );
}
