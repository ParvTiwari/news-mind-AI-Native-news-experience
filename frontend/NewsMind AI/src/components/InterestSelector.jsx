const INTERESTS = ['markets', 'startups', 'ai', 'policy', 'global', 'earnings', 'fintech'];

export default function InterestSelector({ selected, onToggle }) {
  return (
    <section>
      <h2>Select your interests</h2>
      <div className="interests">
        {INTERESTS.map((interest) => (
          <button
            key={interest}
            type="button"
            className={`interest-btn ${selected.includes(interest) ? 'active' : ''}`}
            onClick={() => onToggle(interest)}
          >
            {interest}
          </button>
        ))}
      </div>
    </section>
  );
}
