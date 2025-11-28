import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      await axios.post(`${API_BASE_URL}/api/auth/reset-password`, { token, password });
      setMessage('Your password has been successfully reset. You can now log in with your new password.');
      setError('');
      setTimeout(() => navigate('/login'), 5000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred.');
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Reset your password
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            {error && <p className="text-red-500 text-center">{error}</p>}
            {message && <p className="text-green-500 text-center">{message}</p>}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                New password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Confirm new password
              </label>
              <div className="mt-1">
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />
              </div>
            </div>

            <div>
              <Button variant="gradient" className="w-full" onClick={handleResetPassword}>
                Reset password
              </Button>
            </div>
            <div className="text-sm text-center">
                <Link to="/login" className="font-medium text-purple-600 hover:text-purple-500">
                  Return to login
                </Link>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;