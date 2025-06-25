import type { ReactNode } from 'react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const tab = location.pathname === '/trade' ? 1 : 0;
  const [loginOpen, setLoginOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<null | { email: string }>(null);

  const handleLogin = () => {
    setUser({ email });
    setLoginOpen(false);
    setEmail('');
    setPassword('');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-sans">
      <header className="sticky top-0 z-20 w-full bg-white shadow flex items-center justify-between px-6 h-16">
        <div className="flex items-center gap-8">
          <span className="font-bold text-lg tracking-wide" style={{ color: 'var(--color-primary)' }}>
            React Crypto App
          </span>
          <nav className="flex gap-2">
            <button
              className={`px-4 py-2 rounded transition-colors font-medium ${tab === 0 ? 'bg-[var(--color-primary)] text-white' : 'hover:bg-gray-100'}`}
              onClick={() => navigate('/')}
            >
              Home
            </button>
            <button
              className={`px-4 py-2 rounded transition-colors font-medium ${tab === 1 ? 'bg-[var(--color-primary)] text-white' : 'hover:bg-gray-100'}`}
              onClick={() => navigate('/trade')}
            >
              Trade
            </button>
          </nav>
        </div>
        <div>
          {user ? (
            <span className="font-medium">{user.email}</span>
          ) : (
            <button
              className="px-4 py-2 rounded bg-[var(--color-primary)] text-white font-medium hover:bg-indigo-700 transition-colors"
              onClick={() => setLoginOpen(true)}
            >
              Log In
            </button>
          )}
        </div>
      </header>
      <main className="flex-1 px-4 py-8 max-w-3xl mx-auto w-full">{children}</main>
      {loginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm flex flex-col gap-4">
            <h2 className="text-xl font-bold mb-2 text-center">Log In</h2>
            <form
              className="flex flex-col gap-3"
              onSubmit={e => {
                e.preventDefault();
                handleLogin();
              }}
            >
              <input
                className="border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
              />
              <input
                className="border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                className="mt-2 px-4 py-2 rounded bg-[var(--color-primary)] text-white font-medium hover:bg-indigo-700 transition-colors"
                type="submit"
                disabled={!email || !password}
              >
                Log In
              </button>
              <button
                type="button"
                className="text-sm text-gray-500 hover:underline mt-2"
                onClick={() => setLoginOpen(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}; 