import React from 'react';
import {
  LayoutDashboard,
  Disc3,
  SendHorizontal,
  FolderKanban,
  BarChart3,
  DollarSign,
  Megaphone,
  Cpu,
  Radio,
  User,
  Settings,
  HelpCircle,
  ShieldCheck,
  Shield,
  Lock,
} from 'lucide-react';
import { UserProfile } from '../types';

export type NavTab =
  | 'dashboard'
  | 'releases'
  | 'distribution'
  | 'catalog'
  | 'analytics'
  | 'royalties'
  | 'promotion'
  | 'assist'
  | 'admin';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  currentUser: UserProfile;
  onOpenPrivacyRights?: () => void;
  onOpenTrustCenter?: () => void;
  onOpenSupportReporting?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  onOpenPrivacyRights,
  onOpenTrustCenter,
  onOpenSupportReporting,
}) => {
  const navItems = [
    { id: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'releases' as NavTab, label: 'Releases', icon: Disc3 },
    { id: 'distribution' as NavTab, label: 'Distribution', icon: SendHorizontal },
    { id: 'catalog' as NavTab, label: 'Catalog', icon: FolderKanban },
    { id: 'analytics' as NavTab, label: 'Analytics', icon: BarChart3 },
    { id: 'royalties' as NavTab, label: 'Royalties', icon: DollarSign },
    { id: 'promotion' as NavTab, label: 'Promotion', icon: Megaphone },
    { id: 'assist' as NavTab, label: 'SONVÉRA Assist', icon: Cpu },
    ...(currentUser.role === 'administrator'
      ? [{ id: 'admin' as NavTab, label: 'Admin Console', icon: ShieldCheck, isSuperuser: true }]
      : []),
  ];

  return (
    <aside
      style={{
        width: '240px',
        minWidth: '240px',
        background: '#0d111c',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '20px 14px',
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 95,
        color: '#ffffff',
      }}
    >
      <div>
        {/* Brand Header Matching Screenshot */}
        <div
          onClick={() => onSelectTab('dashboard')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '4px 10px 20px',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Radio size={18} color="#fff" strokeWidth={2.5} />
          </div>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '18px',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: '#ffffff',
            }}
          >
            SONVÉRA
          </div>
        </div>

        {/* User Card Matching Screenshot */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px',
            background: 'rgba(255, 255, 255, 0.04)',
            borderRadius: '12px',
            marginBottom: '20px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '13px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentUser.name}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>Artist</span>
              <span
                style={{
                  fontSize: '9.5px',
                  background: 'rgba(99, 102, 241, 0.25)',
                  color: '#a5b4fc',
                  padding: '1px 5px',
                  borderRadius: '4px',
                  fontWeight: 700,
                }}
              >
                Pro Plan
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: isActive ? '#1e2438' : 'transparent',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = '#94a3b8';
                }}
              >
                <Icon size={16} color={isActive ? '#818cf8' : item.id === 'admin' ? '#f87171' : 'currentColor'} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.id === 'admin' && (
                  <span
                    style={{
                      fontSize: '9.5px',
                      background: 'rgba(239, 68, 68, 0.2)',
                      color: '#f87171',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      fontWeight: 800,
                    }}
                  >
                    ROOT
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Profile, Privacy & Data, Trust, Support */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '12px' }}>
        {[
          {
            label: 'Privacy & Data (DPDP)',
            icon: Lock,
            onClick: onOpenPrivacyRights,
            badge: 'Self-Serve',
            badgeColor: '#35E59A',
          },
          {
            label: 'Trust & Status',
            icon: Shield,
            onClick: onOpenTrustCenter,
            badge: '99.98%',
            badgeColor: '#35D5FF',
          },
          {
            label: 'Support & Reports',
            icon: HelpCircle,
            onClick: onOpenSupportReporting,
          },
        ].map((b) => {
          const Icon = b.icon;
          return (
            <button
              key={b.label}
              onClick={b.onClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '7px 10px',
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
                borderRadius: '8px',
                textAlign: 'left',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#94a3b8';
                e.currentTarget.style.background = 'none';
              }}
            >
              <Icon size={14} color="#94a3b8" />
              <span style={{ flex: 1 }}>{b.label}</span>
              {b.badge && (
                <span
                  style={{
                    fontSize: '9.5px',
                    fontFamily: 'var(--font-mono)',
                    color: b.badgeColor,
                    background: `${b.badgeColor}18`,
                    border: `1px solid ${b.badgeColor}33`,
                    padding: '1px 5px',
                    borderRadius: '4px',
                    fontWeight: 700,
                  }}
                >
                  {b.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
};
