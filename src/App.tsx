import React, { useState, useEffect } from 'react';
import { Release, Track, UserProfile } from './types';
import { INITIAL_RELEASES, USER_PROFILES } from './data/mockData';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { Sidebar, NavTab } from './components/Sidebar';
import { AudioPreviewPlayer } from './components/AudioPreviewPlayer';
import { DashboardView } from './components/DashboardView';
import { ReleaseCenterView } from './components/ReleaseCenterView';
import { ReleaseDetailView } from './components/ReleaseDetailView';
import { ReleaseBuilderModal } from './components/ReleaseBuilderModal';
import { DistributionView } from './components/DistributionView';
import { CatalogView } from './components/CatalogView';
import { AnalyticsView } from './components/AnalyticsView';
import { RoyaltiesView } from './components/RoyaltiesView';
import { PromotionView } from './components/PromotionView';
import { SonveraAssistView } from './components/SonveraAssistView';
import { LandingPageView } from './components/LandingPageView';
import { AdminView } from './components/AdminView';
import { TrustCenterModal } from './components/TrustCenterModal';
import { UserPrivacyRightsModal } from './components/UserPrivacyRightsModal';
import { DedicatedReportingModal } from './components/DedicatedReportingModal';
import { LegalPoliciesModal } from './components/LegalPoliciesModal';

export function App() {
  const [releases, setReleases] = useState<Release[]>(INITIAL_RELEASES);

  const [isLandingPage, setIsLandingPage] = useState<boolean>(() => {
    // 1. Check URL hash
    const hash = typeof window !== 'undefined' ? window.location.hash.toLowerCase() : '';
    if (
      hash === '#landing' ||
      hash === '#product' ||
      hash === '#pricing' ||
      hash === '#labels' ||
      hash === '#resources'
    ) {
      return true;
    }
    if (hash === '#app' || hash === '#dashboard' || hash === '#admin') {
      return false;
    }
    // 2. Check localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sonvera_is_landing');
      if (saved !== null) {
        return saved === 'true';
      }
    }
    // 3. Default to true (Public Landing Page)
    return true;
  });

  const [currentTab, setCurrentTab] = useState<NavTab>(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash.toLowerCase().replace('#', '') : '';
    const validTabs: NavTab[] = ['dashboard', 'releases', 'distribution', 'catalog', 'analytics', 'royalties', 'promotion', 'assist', 'admin'];
    if (validTabs.includes(hash as NavTab)) {
      return hash as NavTab;
    }
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sonvera_current_tab');
      if (saved && validTabs.includes(saved as NavTab)) {
        return saved as NavTab;
      }
    }
    return 'dashboard';
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    if (typeof window !== 'undefined') {
      const savedId = localStorage.getItem('sonvera_user_id');
      const match = USER_PROFILES.find((u) => u.id === savedId);
      if (match) return match;
    }
    return USER_PROFILES[0];
  });

  // Synchronize URL hash & localStorage on view/tab changes so refresh NEVER resets view
  useEffect(() => {
    try {
      localStorage.setItem('sonvera_is_landing', String(isLandingPage));
      localStorage.setItem('sonvera_current_tab', currentTab);
      localStorage.setItem('sonvera_user_id', currentUser.id);

      if (isLandingPage) {
        const curHash = window.location.hash.toLowerCase();
        if (
          ![
            '#product',
            '#pricing',
            '#labels',
            '#resources',
          ].includes(curHash)
        ) {
          window.history.replaceState(null, '', '#landing');
        }
      } else {
        window.history.replaceState(null, '', `#${currentTab}`);
      }
    } catch (e) {
      // ignore in restricted envs
    }
  }, [isLandingPage, currentTab, currentUser]);

  // Security guard: Non-administrators can never access admin portal
  useEffect(() => {
    if (currentTab === 'admin' && currentUser.role !== 'administrator') {
      setCurrentTab('dashboard');
    }
  }, [currentTab, currentUser]);

  // Audio Player State
  const [currentRelease, setCurrentRelease] = useState<Release | null>(INITIAL_RELEASES[0]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(INITIAL_RELEASES[0].tracks[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Release Detail / Builder Modal State
  const [selectedReleaseForDetail, setSelectedReleaseForDetail] = useState<Release | null>(null);
  const [editingRelease, setEditingRelease] = useState<Release | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);

  // Framework & Compliance Modals State (Accessible in App Workspace)
  const [showTrustCenter, setShowTrustCenter] = useState<boolean>(false);
  const [showPrivacyRights, setShowPrivacyRights] = useState<boolean>(false);
  const [showReporting, setShowReporting] = useState<boolean>(false);
  const [reportingType, setReportingType] = useState<'copyright' | 'vulnerability' | 'royalty_dispute'>('copyright');
  const [selectedPolicySlug, setSelectedPolicySlug] = useState<string | null>(null);

  // Initial load from backend API
  useEffect(() => {
    api.getReleases().then((data) => {
      if (data && data.length > 0) {
        setReleases(data);
        if (!currentRelease) {
          setCurrentRelease(data[0]);
          setCurrentTrack(data[0].tracks?.[0] || null);
        }
      }
    });
  }, []);

  // Play audio handler
  const handlePlayTrack = (track: Track, release: Release) => {
    setCurrentTrack(track);
    setCurrentRelease(release);
    setIsPlaying(true);
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Open Release Detail
  const handleOpenReleaseDetail = (release: Release) => {
    setSelectedReleaseForDetail(release);
    setCurrentTab('releases');
  };

  // Edit / Resolve release
  const handleEditRelease = (release: Release) => {
    setEditingRelease(release);
    setIsCreatingNew(false);
  };

  // Open new release creation
  const handleNewRelease = () => {
    setEditingRelease(null);
    setIsCreatingNew(true);
  };

  // Save release from builder
  const handleSaveRelease = async (updatedRelease: Release, wasSubmitted: boolean) => {
    const exists = releases.some((r) => r.id === updatedRelease.id);
    let saved: Release = updatedRelease;

    try {
      if (exists) {
        saved = await api.updateRelease(updatedRelease.id, updatedRelease);
      } else {
        saved = await api.createRelease(updatedRelease);
      }

      if (wasSubmitted) {
        await api.submitRelease(saved.id, saved.selectedDsps);
      }
    } catch (e) {
      console.warn('Backend sync failed, using optimistic state', e);
    }

    let newReleasesList: Release[];
    if (exists) {
      newReleasesList = releases.map((r) => (r.id === saved.id ? saved : r));
    } else {
      newReleasesList = [saved, ...releases];
    }

    setReleases(newReleasesList);
    setEditingRelease(null);
    setIsCreatingNew(false);

    if (selectedReleaseForDetail?.id === saved.id) {
      setSelectedReleaseForDetail(saved);
    }

    if (wasSubmitted) {
      setCurrentTab('distribution');
    } else {
      setCurrentTab('releases');
    }
  };

  // Execute Takedown
  const handleTakedownRelease = async (releaseId: string) => {
    try {
      await api.takedownRelease(releaseId);
    } catch (e) {
      console.warn('Backend takedown error, updating local state', e);
    }

    const updated = releases.map((r) => {
      if (r.id === releaseId) {
        return {
          ...r,
          status: 'TAKEDOWN_REQUESTED' as const,
          statusHistory: [
            ...r.statusHistory,
            {
              id: `sh-td-${Date.now()}`,
              status: 'TAKEDOWN_REQUESTED' as const,
              timestamp: new Date().toISOString(),
              note: 'Takedown notice broadcast to all partner DSP endpoints.',
              actor: currentUser.name,
            },
          ],
        };
      }
      return r;
    });

    setReleases(updated);
    if (selectedReleaseForDetail?.id === releaseId) {
      const match = updated.find((r) => r.id === releaseId);
      if (match) setSelectedReleaseForDetail(match);
    }
  };

  return (
    <>
      {isLandingPage ? (
        <LandingPageView
          onEnterDashboard={() => {
            setCurrentTab('dashboard');
            setIsLandingPage(false);
          }}
          onStartRelease={() => {
            setIsLandingPage(false);
            setIsCreatingNew(true);
          }}
          onEnterAdmin={() => {
            const adminUser = USER_PROFILES.find((u) => u.role === 'administrator') || USER_PROFILES[4];
            setCurrentUser(adminUser);
            setCurrentTab('admin');
            setIsLandingPage(false);
          }}
        />
      ) : (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f6fb' }}>
          {/* Primary Sidebar Navigation (Dark navy matching screenshot) */}
          <Sidebar
            currentTab={currentTab}
            onSelectTab={(tab) => {
              setCurrentTab(tab);
              if (tab !== 'releases') {
                setSelectedReleaseForDetail(null);
              }
            }}
            currentUser={currentUser}
            onOpenPrivacyRights={() => setShowPrivacyRights(true)}
            onOpenTrustCenter={() => setShowTrustCenter(true)}
            onOpenSupportReporting={() => {
              setReportingType('copyright');
              setShowReporting(true);
            }}
          />

          {/* Main Content Area */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, paddingBottom: '90px' }}>
            <Navbar
              currentUser={currentUser}
              allUsers={USER_PROFILES}
              onSwitchUser={(user) => {
                setCurrentUser(user);
                if (user.role === 'administrator') {
                  setCurrentTab('admin');
                }
              }}
              onOpenNewRelease={handleNewRelease}
              onToggleLandingPage={() => setIsLandingPage(true)}
              isLandingPage={false}
              onNavigateTab={(tab) => {
                setCurrentTab(tab);
                setSelectedReleaseForDetail(null);
              }}
            />

            <main style={{ flex: 1, padding: '28px 36px 60px', maxWidth: '1440px', width: '100%', margin: '0 auto' }}>
              {currentTab === 'dashboard' && (
                <DashboardView
                  releases={releases}
                  currentUser={currentUser}
                  onOpenRelease={handleOpenReleaseDetail}
                  onEditRelease={handleEditRelease}
                  onNewRelease={handleNewRelease}
                  onNavigateTab={(tab) => {
                    setCurrentTab(tab);
                    setSelectedReleaseForDetail(null);
                  }}
                  onPlayTrack={handlePlayTrack}
                />
              )}

              {currentTab === 'releases' && (
                <>
                  {selectedReleaseForDetail ? (
                    <ReleaseDetailView
                      release={selectedReleaseForDetail}
                      onBack={() => setSelectedReleaseForDetail(null)}
                      onEdit={handleEditRelease}
                      onPlayTrack={handlePlayTrack}
                      onTakedown={handleTakedownRelease}
                    />
                  ) : (
                    <ReleaseCenterView
                      releases={releases}
                      onOpenRelease={handleOpenReleaseDetail}
                      onEditRelease={handleEditRelease}
                      onNewRelease={handleNewRelease}
                      onPlayTrack={handlePlayTrack}
                      onTakedownRelease={handleTakedownRelease}
                    />
                  )}
                </>
              )}

              {currentTab === 'distribution' && (
                <DistributionView
                  releases={releases}
                  onOpenRelease={handleOpenReleaseDetail}
                />
              )}

              {currentTab === 'catalog' && (
                <CatalogView
                  releases={releases}
                  onPlayTrack={handlePlayTrack}
                  onOpenRelease={handleOpenReleaseDetail}
                />
              )}

              {currentTab === 'analytics' && (
                <AnalyticsView releases={releases} />
              )}

              {currentTab === 'royalties' && (
                <RoyaltiesView />
              )}

              {currentTab === 'promotion' && (
                <PromotionView releases={releases} />
              )}

              {currentTab === 'assist' && (
                <SonveraAssistView
                  releases={releases}
                  onOpenRelease={handleOpenReleaseDetail}
                  onEditRelease={handleEditRelease}
                />
              )}

              {currentTab === 'admin' && currentUser.role === 'administrator' && (
                <AdminView
                  releases={releases}
                  onRefreshReleases={() => {
                    api.getReleases().then((data) => {
                      if (data && data.length > 0) setReleases(data);
                    });
                  }}
                  onPlayTrack={handlePlayTrack}
                  onSwitchUser={(user) => {
                    setCurrentUser(user);
                    if (user.role !== 'administrator') {
                      setCurrentTab('dashboard');
                    }
                  }}
                />
              )}
            </main>
          </div>

          {/* Persistent Audio Preview Player */}
          <AudioPreviewPlayer
            currentTrack={currentTrack}
            currentRelease={currentRelease}
            isPlaying={isPlaying}
            onTogglePlay={handleTogglePlay}
            onSelectTrack={handlePlayTrack}
          />

          {/* Release Builder Modal (New or Edit - Screens 5 to 9) */}
          {(isCreatingNew || editingRelease) && (
            <ReleaseBuilderModal
              initialRelease={editingRelease}
              currentUser={currentUser}
              onClose={() => {
                setIsCreatingNew(false);
                setEditingRelease(null);
              }}
              onSaveRelease={handleSaveRelease}
            />
          )}

          {/* Framework & Governance Modals (Accessible inside Artist Workspace) */}
          <TrustCenterModal
            isOpen={showTrustCenter}
            onClose={() => setShowTrustCenter(false)}
          />
          <UserPrivacyRightsModal
            isOpen={showPrivacyRights}
            onClose={() => setShowPrivacyRights(false)}
          />
          <DedicatedReportingModal
            isOpen={showReporting}
            initialType={reportingType}
            onClose={() => setShowReporting(false)}
          />
          <LegalPoliciesModal
            isOpen={selectedPolicySlug !== null}
            initialSlug={selectedPolicySlug || 'terms-of-service'}
            onClose={() => setSelectedPolicySlug(null)}
          />
        </div>
      )}
    </>
  );
}

export default App;
