import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InterestSelector from '../components/InterestSelector';
import { getUserProfile, saveUserInterests } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function InterestSelectionPage() {
  const { user, initialLoading } = useAuth();
  const [selected, setSelected] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (initialLoading || !user) return;
    (async () => {
      try {
        const profile = await getUserProfile(user.uid);
        setSelected(profile.interests || []);
      } catch {
        setSelected([]);
      }
    })();
  }, [initialLoading, user]);

  if (initialLoading) return <main className="page">Loading...</main>;
  if (!user) {
    navigate('/login');
    return null;
  }

  const onToggle = (interest) => {
    setSelected((prev) => (prev.includes(interest) ? prev.filter((item) => item !== interest) : [...prev, interest]));
  };

  const onSave = async () => {
    if (!selected.length) {
      setError('Select at least one interest');
      return;
    }

    setSaving(true);
    setError('');

    try {
      await saveUserInterests({ userId: user.uid, interests: selected });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="page" id="landing-page">
      <h1>Personalize your feed</h1>
      {error ? <p className="error-text">{error}</p> : null}
      <InterestSelector selected={selected} onToggle={onToggle} />
      <button id="start-btn" type="button" disabled={saving} onClick={onSave}>
        Save interests
      </button>
    </main>
  );
}
