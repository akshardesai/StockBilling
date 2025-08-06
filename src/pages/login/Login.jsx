import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { account } from '../../utils/appWrite'; // ✅ make sure this path is correct

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    try {
      await account.createEmailPasswordSession(email, password);
      console.log('✅ Login successful');
      navigate('/dashboard');
    } catch (err) {
      console.error('❌ Login failed:', err.message);
      alert("Login failed: " + err.message);
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-lime-600 to-lime-300 rounded-lg mb-6">
            <span className="text-white font-bold text-xl font-mono">I</span>
          </div>
          <h1 className="text-white text-2xl font-semibold mb-2">Sign in to <span className='font-mono'>InWise</span></h1>
        </div>

        {/* Login Form */}
        <div className="space-y-4 flex flex-col items-center">
          <div className='w-full'>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
              placeholder="Enter your email"
            />
          </div>

          <div className='w-full'>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all pr-12"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
              >
                {/* Add eye icons if needed */}
              </button>
            </div>
          </div>

          <button
            onClick={(e)=>handleLogin(e)}
            className="w-1/2 bg-gradient-to-r from-lime-600 to-lime-300 hover:from-lime-300 hover:to-lime-600 text-white font-medium py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
