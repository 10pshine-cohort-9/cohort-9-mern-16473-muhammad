import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthLayout from '../components/AuthLayout';
import FormInput from '../components/FormInput';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, login } = useAuth();
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    await signup(name, email, password);
  } catch (err) {
    setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    setLoading(false);
    return;
  }

  try {
    await login(email, password);
    navigate('/dashboard');
  } catch {
    // Account was genuinely created — a failure here is just the auto-login
    // step, not signup itself, so send them to log in manually instead of
    // showing an error that implies account creation failed.
    navigate('/login', { state: { message: 'Account created! Please log in.' } });
  } finally {
    setLoading(false);
  }
};

  return (
    <AuthLayout title="Create your account" subtitle="Start capturing your ideas today">
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jane Doe"
        />
        <FormInput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        <FormInput
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
        />

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-red-400 mb-4"
          >
            {error}
          </motion.p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
        >
          {loading ? 'Creating account...' : 'Sign up'}
        </button>
      </form>

      <p className="mt-6 text-center text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Signup;