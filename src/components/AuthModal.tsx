import React, { useState } from 'react';
    import { X } from 'lucide-react';
    import Button from './common/Button';
    
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
              <SignUpForm setIsSignUp={setIsSignUp} />
            ) : (
              <SignInForm setIsSignUp={setIsSignUp} />
            )}
          </div>
        </div>
      );
    };
    
    const SignUpForm: React.FC<{ setIsSignUp: (value: boolean) => void }> = ({ setIsSignUp }) => {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Welcome to TradeZella</h2>
            <p className="text-gray-600">We help traders become profitable!</p>
          </div>
          <Button variant="primary" className="w-full justify-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google Logo" className="h-5 w-5 mr-2" />
            Sign up with Google
          </Button>
          <div className="text-center text-gray-500">or</div>
          <input type="email" placeholder="Email" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent" />
          <input type="password" placeholder="Create password" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent" />
          <Button variant="gradient" className="w-full">Sign up</Button>
          <p className="text-center text-gray-500 text-sm">
            By creating an account you agree to our <a href="#" className="text-purple-600 hover:text-purple-700">Terms of Service</a> and <a href="#" className="text-purple-600 hover:text-purple-700">Privacy Policy</a>
          </p>
          <p className="text-center text-gray-500">
            Already have an account? <button onClick={() => setIsSignUp(false)} className="text-purple-600 hover:text-purple-700">Sign in</button>
          </p>
        </div>
      );
    };
    
    const SignInForm: React.FC<{ setIsSignUp: (value: boolean) => void }> = ({ setIsSignUp }) => {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Sign in</h2>
            <p className="text-gray-600">We help traders become profitable!</p>
          </div>
          <Button variant="primary" className="w-full justify-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google Logo" className="h-5 w-5 mr-2" />
            Sign in with Google
          </Button>
          <div className="text-center text-gray-500">or</div>
          <input type="email" placeholder="Email" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent" />
          <input type="password" placeholder="Password" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent" />
          <div className="text-right">
            <a href="#" className="text-purple-600 hover:text-purple-700 text-sm">Forgot password?</a>
          </div>
          <Button variant="gradient" className="w-full">Sign in</Button>
          <p className="text-center text-gray-500">
            Don't have an account? <button onClick={() => setIsSignUp(true)} className="text-purple-600 hover:text-purple-700">Sign up</button>
          </p>
        </div>
      );
    };
    
    export default AuthModal;
