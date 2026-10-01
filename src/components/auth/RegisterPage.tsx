import React from 'react';
import { SignupSection } from './SignupSection';

export interface RegisterPageProps {
  onSuccess: (data: { email: string; firstName: string; lastName: string }) => void;
  onSocialSuccess?: (data: { email: string; name: string }) => void;
  onNavigateLogin: () => void;
  onOpenTerms?: () => void;
  onOpenPrivacy?: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onSuccess,
  onNavigateLogin,
  onOpenTerms,
  onOpenPrivacy,
}) => {
  return (
    <SignupSection
      onSuccess={onSuccess}
      onSwitchToLogin={onNavigateLogin}
      onOpenTerms={onOpenTerms}
      onOpenPrivacy={onOpenPrivacy}
      showTabs={true}
    />
  );
};
