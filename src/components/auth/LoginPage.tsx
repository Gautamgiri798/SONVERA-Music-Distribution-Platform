import React from 'react';
import { LoginSection } from './LoginSection';

export interface LoginPageProps {
  onSuccess: (userEmail: string) => void;
  onNavigateRegister: () => void;
  onNavigateForgotPassword?: () => void;
  onEnterAdmin?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onSuccess,
  onNavigateRegister,
  onNavigateForgotPassword,
  onEnterAdmin,
}) => {
  return (
    <LoginSection
      onSuccess={onSuccess}
      onSwitchToSignup={onNavigateRegister}
      onForgotPassword={onNavigateForgotPassword}
      onEnterAdmin={onEnterAdmin}
      showTabs={true}
    />
  );
};
