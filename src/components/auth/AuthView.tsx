import React, { useState, useEffect } from 'react';
import { AuthLayout } from './AuthLayout';
import { LoginPage } from './LoginPage';
import { RegisterPage } from './RegisterPage';
import { ForgotPasswordPage } from './ForgotPasswordPage';
import { AuthCallbackPage } from './AuthCallbackPage';

export type AuthRouteMode = 'login' | 'register' | 'forgot-password' | 'callback';
export type AuthMode = AuthRouteMode;

interface AuthViewProps {
  initialMode?: AuthRouteMode;
  onAuthSuccess: (userData?: any) => void;
  onClose?: () => void;
  onOpenPolicy?: (slug: string) => void;
  onEnterAdmin?: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({
  initialMode,
  onAuthSuccess,
  onEnterAdmin,
}) => {
  // Detect route from window pathname or hash
  const detectInitialRoute = (): AuthRouteMode => {
    if (typeof window === 'undefined') return 'login';
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();

    if (path.includes('register') || hash.includes('register')) return 'register';
    if (path.includes('forgot') || hash.includes('forgot')) return 'forgot-password';
    if (path.includes('callback') || hash.includes('callback')) return 'callback';
    return initialMode || 'login';
  };

  const [routeMode, setRouteMode] = useState<AuthRouteMode>(detectInitialRoute);

  const navigateTo = (mode: AuthRouteMode) => {
    setRouteMode(mode);
    if (typeof window !== 'undefined') {
      const targetPath = mode === 'callback' ? '/auth/callback' : `/${mode}`;
      window.history.pushState(null, '', targetPath);
    }
  };

  // Listen to popstate (browser back/forward button navigation)
  useEffect(() => {
    const handlePopState = () => {
      setRouteMode(detectInitialRoute());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ backgroundColor: '#05060A' }}
    >
      <AuthLayout mode={routeMode}>
        {routeMode === 'login' && (
          <LoginPage
            onSuccess={(email) => {
              onAuthSuccess({ email, name: 'Gautam Giri' });
            }}
            onNavigateRegister={() => navigateTo('register')}
            onNavigateForgotPassword={() => navigateTo('forgot-password')}
            onEnterAdmin={onEnterAdmin}
          />
        )}

        {routeMode === 'register' && (
          <RegisterPage
            onSuccess={({ email, firstName, lastName }) => {
              onAuthSuccess({ email, name: `${firstName} ${lastName}` });
            }}
            onSocialSuccess={({ email, name }) => {
              onAuthSuccess({ email, name });
            }}
            onNavigateLogin={() => navigateTo('login')}
          />
        )}

        {routeMode === 'forgot-password' && (
          <ForgotPasswordPage onNavigateLogin={() => navigateTo('login')} />
        )}

        {routeMode === 'callback' && (
          <AuthCallbackPage
            onSuccess={(email) => {
              onAuthSuccess({ email, name: 'Gautam Giri' });
            }}
          />
        )}
      </AuthLayout>
    </div>
  );
};
