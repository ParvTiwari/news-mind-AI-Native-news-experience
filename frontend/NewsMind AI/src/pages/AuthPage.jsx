import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthPage({ mode = 'login' }) {
  const { loginEmail, signupEmail, loginGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isLogin = mode === 'login';

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await loginEmail(email, password);
      } else {
        await signupEmail(email, password);
      }
      navigate('/interests');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onGoogleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      await loginGoogle();
      navigate('/interests');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page" id="landing-page">
      <h1>{isLogin ? 'Login' : 'Create account'}</h1>
      <form className="chat" onSubmit={onSubmit}>
        {error ? <p className="error-text">{error}</p> : null}
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" required />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          required
        />
        <button id="send-btn" type="submit" disabled={loading}>
          {isLogin ? 'Login' : 'Sign up'}
        </button>
        <button type="button" className="secondary" disabled={loading} onClick={onGoogleLogin}>
          Continue with Google
        </button>
      </form>
      <p>
        {isLogin ? 'No account?' : 'Have an account?'}{' '}
        <Link to={isLogin ? '/signup' : '/login'}>{isLogin ? 'Sign up' : 'Login'}</Link>
      </p>
    </main>
  );
}
