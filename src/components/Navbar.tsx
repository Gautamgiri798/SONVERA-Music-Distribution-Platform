import React, { useState } from 'react';
import {
  Search,
  Bell,
  Plus,
  Radio,
  ExternalLink,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  onSwitchUser: (user: UserProfile) => void;
  onOpenNewRelease: () => void;
  onToggleLandingPage: () => void;
  isLandingPage: boolean;
  onNavigateTab?: (tab: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  allUsers,
  onSwitchUser,
  onOpenNewRelease,
  onToggleLandingPage,
  isLandingPage,
  onNavigateTab,
}) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  return (
    <header
      style={{
        height: '66px',
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        position: 'sticky',
        top: 0,
        zIndex: 90,
      }}
    >
      {/* Left: Nav Links Matching Screenshot */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <button
          onClick={onToggleLandingPage}
          style={{
            background: isLandingPage ? '#0f172a' : '#f1f5f9',
            color: isLandingPage ? '#ffffff' : '#334155',
            border: '1px solid #cbd5e1',
            borderRadius: '999px',
            padding: '5px 12px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span>{isLandingPage ? '← Back to Dashboard' : 'View Public Landing Page'}</span>
        </button>

        {onNavigateTab && currentUser.role === 'administrator' && (
          <button
            onClick={() => onNavigateTab('admin')}
            style={{
              background: '#fee2e2',
              color: '#dc2626',
              border: '1px solid #e2e8f0',
              borderRadius: '999px',
              padding: '5px 12px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            title="Open Administrator Control Plane"
          >
            <ShieldCheck size={14} color="#dc2626" />
            <span>Admin View</span>
          </button>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
          <span onClick={onToggleLandingPage} style={{ cursor: 'pointer', color: '#0f172a' }}>Product</span>
          <span onClick={onToggleLandingPage} style={{ cursor: 'pointer' }}>Pricing</span>
          <span onClick={onToggleLandingPage} style={{ cursor: 'pointer' }}>For Labels</span>
          <span onClick={onToggleLandingPage} style={{ cursor: 'pointer' }}>Resources</span>
        </div>
      </div>

      {/* Center: Search Bar Matching Screenshot */}
      <div style={{ position: 'relative', width: '280px' }}>
        <Search
          size={15}
          color="#94a3b8"
          style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
        />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search music..."
          style={{
            width: '100%',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '999px',
            padding: '7px 14px 7px 34px',
            fontSize: '12.5px',
            color: '#0f172a',
            outline: 'none',
          }}
        />
      </div>

      {/* Right: Create Button, Notifications, Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={onOpenNewRelease}
          style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            color: '#ffffff',
            border: 'none',
            padding: '8px 18px',
            borderRadius: '999px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 10px rgba(99, 102, 241, 0.35)',
          }}
        >
          <Plus size={15} strokeWidth={2.5} />
          <span>Create Release</span>
        </button>

        {/* Notifications */}
        <button
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
            cursor: 'pointer',
            position: 'relative',
          }}
        >
          <Bell size={16} />
          <span
            style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#ef4444',
            }}
          />
        </button>

        {/* User Avatar & Menu */}
        <div style={{ position: 'relative' }}>
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', cursor: 'pointer', border: '2px solid #e2e8f0' }}
          />

          {showRoleDropdown && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '240px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                padding: '8px',
                zIndex: 150,
              }}
            >
              <div style={{ padding: '8px 10px', fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                Switch Account Persona
              </div>
              {allUsers
                .filter((u) => currentUser.role === 'administrator' || u.role !== 'administrator')
                .map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    onSwitchUser(u);
                    setShowRoleDropdown(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    background: u.id === currentUser.id ? '#f1f5f9' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <img
                    src={u.avatar}
                    alt={u.name}
                    style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{u.name}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{u.role}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
