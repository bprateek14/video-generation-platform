
import React, { useState } from 'react';
import LoginScreen from './components/LoginScreen';
import MainApp from './components/MainApp';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <div className="min-h-screen bg-base">
      {isLoggedIn ? <MainApp /> : <LoginScreen onLogin={handleLogin} />}
    </div>
  );
};

export default App;
