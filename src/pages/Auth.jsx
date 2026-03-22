import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AuthLayout({ children, title, sub }) {
  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>
          <svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#242424"/><path d="M12 28V12l8 10 8-10v16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
        </div>
        <h1 style={s.title}>{title}</h1>
        <p style={s.sub}>{sub}</p>
        {children}
        <p style={s.terms}>
          Click "Sign {title.includes('in') ? 'in' : 'up'}" to agree to Inkwell's{' '}
          <Link to="/terms" style={s.link}>Terms of Service</Link> and acknowledge that Inkwell's{' '}
          <Link to="/privacy" style={s.link}>Privacy Policy</Link> applies to you.
        </p>
      </div>
    </div>
  );
}

export function SignIn() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Sign in failed. Try again.');
    } finally { setLoading(false); }
  };

  return (
    <AuthLayout title="Welcome back." sub="Sign in to continue reading.">
      <form onSubmit={handleSubmit} style={s.form}>
        {error && <div style={s.error}>{error}</div>}
        <input style={s.input} type="email" placeholder="Email" value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })} required />
        <input style={s.input} type="password" placeholder="Password" value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })} required />
        <div style={{ textAlign: 'right', marginTop: -4 }}>
          <Link to="/forgot-password" style={{ fontSize: 13, color: '#6b6b6b' }}>Forgot password?</Link>
        </div>
        <button type="submit" disabled={loading} style={s.btn}>
          {loading ? 'Signing in...' : 'Sign in with Email'}
        </button>
        <p style={s.switchText}>
          No account? <Link to="/signup" style={s.link}>Create one</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export function SignUp() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Sign up failed. Try again.');
    } finally { setLoading(false); }
  };

  return (
    <AuthLayout title="Join Inkwell." sub="Create an account to start reading and writing.">
      <form onSubmit={handleSubmit} style={s.form}>
        {error && <div style={s.error}>{error}</div>}
        <input style={s.input} type="text" placeholder="Your name" value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })} required />
        <input style={s.input} type="email" placeholder="Email" value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })} required />
        <input style={s.input} type="password" placeholder="Password (min 6 chars)" value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })} required />
        <button type="submit" disabled={loading} style={s.btn}>
          {loading ? 'Creating account...' : 'Sign up with Email'}
        </button>
        <p style={s.switchText}>
          Already have an account? <Link to="/signin" style={s.link}>Sign in</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

const s = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: '#fff' },
  card: { width: '100%', maxWidth: 400, textAlign: 'center' },
  logo: { display: 'flex', justifyContent: 'center', marginBottom: 28 },
  title: { fontFamily: 'Lora, serif', fontSize: 28, fontWeight: 700, color: '#242424', marginBottom: 10 },
  sub: { fontSize: 15, color: '#6b6b6b', marginBottom: 32 },
  form: { display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 },
  error: { padding: '10px 14px', background: '#fff8f8', border: '1px solid #ffd0d0', borderRadius: 4, fontSize: 13, color: '#c00', textAlign: 'left' },
  input: { padding: '12px 14px', border: '1px solid #e6e6e6', borderRadius: 4, fontSize: 15, outline: 'none', color: '#242424', background: '#fafafa', textAlign: 'left' },
  btn: { padding: '13px', background: '#242424', color: '#fff', border: 'none', borderRadius: 999, fontSize: 15, fontWeight: 500, cursor: 'pointer' },
  switchText: { fontSize: 14, color: '#6b6b6b' },
  link: { color: '#1a8917', fontWeight: 500 },
  terms: { fontSize: 12, color: '#9b9b9b', lineHeight: 1.6, marginTop: 24 },
};