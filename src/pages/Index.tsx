import { useState } from 'react';
import AuthScreen from '@/components/AuthScreen';
import MainPlatform from '@/components/MainPlatform';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {!isAuthenticated ? (
        <AuthScreen onAuth={() => setIsAuthenticated(true)} />
      ) : (
        <MainPlatform />
      )}
    </div>
  );
};

export default Index;
