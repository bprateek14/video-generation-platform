
import React from 'react';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-base">
      <div className="w-full max-w-md p-8 space-y-8 bg-secondary border border-primary/20 rounded-lg shadow-lg shadow-primary/10">
        <div>
          <h1 className="text-4xl font-bold text-center text-primary">
            GenForge <span className="text-text-primary">Studio</span>
          </h1>
          <p className="mt-2 text-center text-sm text-text-secondary">
            [//] Authenticate to begin generation
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-primary/30 bg-base placeholder-text-secondary text-text-primary rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Username"
                defaultValue="operator"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-primary/30 bg-base placeholder-text-secondary text-text-primary rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Password"
                defaultValue="***********"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-base bg-primary text-black hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base focus:ring-primary transition-all duration-300"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                 &gt;
              </span>
              Authorize Access
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
