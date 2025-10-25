/**
 * Authentication Form Component
 *
 * Handles user login and signup with email/password.
 * Provides a clean interface with validation and error handling.
 */

import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import './AuthForm.css';

interface AuthFormProps {
  mode?: 'signin' | 'signup';
}

export function AuthForm({ mode: initialMode = 'signin' }: AuthFormProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        await signUp({ email, password, name });
      } else {
        await signIn({ email, password });
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoMode = async () => {
    setError('');
    setLoading(true);

    // Demo credentials - auto-creates account if it doesn't exist
    const demoEmail = 'demo@example.com';
    const demoPassword = 'demo123456';
    const demoName = 'Demo User';

    try {
      // Try to sign in first
      try {
        await signIn({ email: demoEmail, password: demoPassword });
      } catch (signInError: any) {
        // If sign in fails, create the account
        if (signInError.message?.includes('Invalid login credentials')) {
          await signUp({ email: demoEmail, password: demoPassword, name: demoName });
        } else {
          throw signInError;
        }
      }
    } catch (err: any) {
      setError(err.message || 'Demo mode failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setError('');
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form-card">
        <div className="auth-header">
          <h1>Plant Health Diagnostic</h1>
          <p className="auth-subtitle">
            {mode === 'signin' ? 'Sign in to your account' : 'Create a new account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'signup' && (
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="form-input"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="form-input"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading} className="btn btn-primary btn-full">
            {loading ? 'Loading...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={handleDemoMode}
            className="btn btn-secondary btn-full"
            style={{ marginTop: 'var(--spacing-md)' }}
          >
            🚀 Demo Mode (Test Without Account)
          </button>
        </form>

        <div className="auth-footer">
          <button onClick={toggleMode} className="link-button">
            {mode === 'signin'
              ? "Don't have an account? Sign up"
              : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}
