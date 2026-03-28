import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <main className="page" id="landing-page">
      <p className="eyebrow">AI-native newsroom</p>
      <h1>NewsMind AI</h1>
      <p className="subtext">
        Personalized business news with AI summaries, context, and chat Q&A. NewsMind reads the market so you can
        focus on decisions.
      </p>
      <div className="card-actions">
        <Link className="link-btn" to="/login">
          Login
        </Link>
        <Link className="link-btn" to="/signup">
          Create account
        </Link>
      </div>
    </main>
  );
}
