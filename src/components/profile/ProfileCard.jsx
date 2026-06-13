import { useProfile } from '../../hooks/useProfile';
import { useAuth } from '../../hooks/useAuth';
import { YEAR_OPTIONS } from '../../utils/validate';

/**
 * Read-only profile summary card.
 * Displays the user's profile information in a clean card layout.
 * Used on the dashboard and sidebar.
 *
 * @param {object} [props]
 * @param {boolean} [props.compact=false] - If true, shows a condensed version
 * @returns {JSX.Element}
 */
export default function ProfileCard({ compact = false }) {
  const { user } = useAuth();
  const { profile } = useProfile();

  if (!profile) return null;

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3">
        <img
          src={profile.photoURL || user?.photoURL || ''}
          alt={profile.name}
          className="w-10 h-10 rounded-full border-2 border-primary/20"
          referrerPolicy="no-referrer"
        />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-text truncate">{profile.name}</p>
          <p className="text-xs text-text-light truncate">{profile.degree}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-card border border-gray-100 shadow-md overflow-hidden">
      {/* Header gradient */}
      <div className="h-24 bg-gradient-to-r from-primary to-secondary relative">
        <div className="absolute -bottom-10 left-6">
          <img
            src={profile.photoURL || user?.photoURL || ''}
            alt={profile.name}
            className="w-20 h-20 rounded-full border-4 border-surface shadow-lg"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Content */}
      <div className="pt-14 px-6 pb-6">
        <h3 className="text-xl font-bold text-text">{profile.name}</h3>
        <p className="text-text-light text-sm mt-0.5">
          {profile.degree} &bull; {profile.yearOfStudy} Year
        </p>
        <p className="text-text-light text-xs mt-0.5">{profile.email}</p>

        {/* Skills */}
        <div className="mt-5">
          <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
            Skills
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {profile.skills?.map((skill) => (
              <span
                key={skill}
                className="px-2.5 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-pill border border-primary-100"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div className="mt-4">
          <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
            Interests
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {profile.interests?.map((interest) => (
              <span
                key={interest}
                className="px-2.5 py-1 bg-secondary-50 text-secondary-700 text-xs font-medium rounded-pill border border-secondary-100"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* Career Goals */}
        <div className="mt-4">
          <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
            Career Goals
          </h4>
          <p className="text-sm text-text-light leading-relaxed">
            {profile.careerGoals}
          </p>
        </div>
      </div>
    </div>
  );
}
