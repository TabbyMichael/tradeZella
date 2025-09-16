import React, { useState } from 'react';
import { X } from 'lucide-react';
import Button from './common/Button';
import axios from 'axios';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          <X className="h-6 w-6" />
        </button>
        {isSignUp ? (
          <SignUpForm setIsSignUp={setIsSignUp} onClose={onClose} />
        ) : (
          <SignInForm setIsSignUp={setIsSignUp} onClose={onClose} />
        )}
      </div>
    </div>
  );
};

const SignUpForm: React.FC<{ setIsSignUp: (value: boolean) => void; onClose: () => void; }> = ({ setIsSignUp, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/auth/register', { email, password });
      localStorage.setItem('token', response.data.token);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Welcome to TradeZella</h2>
        <p className="text-gray-600">We help traders become profitable!</p>
      </div>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent" />
      <input type="password" placeholder="Create password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent" />
      <Button variant="gradient" className="w-full" onClick={handleSignUp}>Sign up</Button>
      <p className="text-center text-gray-500">
        Already have an account? <button onClick={() => setIsSignUp(false)} className="text-purple-600 hover:text-purple-700">Sign in</button>
      </p>
    </div>
  );
};

const SignInForm: React.FC<{ setIsSignUp: (value: boolean) => void; onClose: () => void; }> = ({ setIsSignUp, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Sign in</h2>
        <p className="text-gray-600">We help traders become profitable!</p>
      </div>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent" />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent" />
      <Button variant="gradient" className="w-full" onClick={handleSignIn}>Sign in</Button>
      <p className="text-center text-gray-500">
        Don't have an account? <button onClick={() => setIsSignUp(true)} className="text-purple-600 hover:text-purple-700">Sign up</button>
      </p>
    </div>
  );
};

export default AuthModal;
