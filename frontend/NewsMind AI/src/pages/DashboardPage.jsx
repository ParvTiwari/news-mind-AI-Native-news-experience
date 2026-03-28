import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatPanel from '../components/ChatPanel';
import LoadingSkeleton from '../components/LoadingSkeleton';
import NewsCard from '../components/NewsCard';
import { useDebounce } from '../hooks/useDebounce';
import { getNews, getUserProfile } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user, initialLoading, logout } = useAuth();
  const [articles, setArticles] = useState([]);
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [seedQuestion, setSeedQuestion] = useState('');
  const [searchText, setSearchText] = useState('');
  const debouncedSearch = useDebounce(searchText, 350);
  const navigate = useNavigate();

  useEffect(() => {
    if (initialLoading || !user) return;

    (async () => {
      try {
        setLoading(true);
        const profile = await getUserProfile(user.uid);
        const profileInterests = profile?.interests || [];
        setInterests(profileInterests);
        const data = await getNews({ userId: user.uid, interests: profileInterests, roleType: profile?.roleType || 'student' });
        setArticles(data.articles || []);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [initialLoading, user]);

  const visibleArticles = useMemo(() => {
    if (!debouncedSearch.trim()) return articles;
    return articles.filter((article) => {
      const text = `${article.title} ${article.summary} ${article.source}`.toLowerCase();
      return text.includes(debouncedSearch.toLowerCase());
    });
  }, [articles, debouncedSearch]);

  if (initialLoading) return <main className="page">Loading...</main>;
  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <main className="page">
      <header className="navbar">
        <div>
          <h1>NewsMind AI</h1>
          <p className="muted">{interests.length ? `Interests: ${interests.join(', ')}` : 'No interests selected yet.'}</p>
        </div>
        <div className="navbar-actions">
          <button type="button" className="ghost-btn" onClick={() => navigate('/interests')}>
            Edit interests
          </button>
          <button
            type="button"
            className="ghost-btn"
            onClick={async () => {
              await logout();
              navigate('/');
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <div className="container">
        <section>
          <input
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search in feed"
            className="search"
          />
          {error ? <p className="error-text">{error}</p> : null}
          <div className="news">
            {loading
              ? [...Array.from({ length: 6 })].map((_, idx) => <LoadingSkeleton key={idx} />)
              : visibleArticles.map((article) => (
                  <NewsCard
                    key={article.id}
                    article={article}
                    onAsk={(selectedArticle) => setSeedQuestion(`Why does this matter for me: ${selectedArticle.title}?`)}
                  />
                ))}
          </div>
        </section>

        <ChatPanel userId={user.uid} seedQuestion={seedQuestion} />
      </div>
    </main>
  );
}
