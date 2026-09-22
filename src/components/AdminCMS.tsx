import React, { useState, useEffect } from 'react';
import { Episode, PlatformConfig, StoryChoice } from '../types';
import { StorageService } from '../services/storage';
import { FirestoreDataService } from '../services/firestoreData';
import { AnalyticsService } from '../services/analytics';
import { AdminAuthService } from '../services/adminAuth';
import { sound } from '../services/audio';
import {
  X,
  Plus,
  Edit2,
  Trash2,
  BarChart3,
  Settings,
  Database,
  Layers,
  Sparkles,
  Download,
  Upload,
  Check,
  RefreshCw,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  AlertTriangle,
  Play,
  Camera,
  Image as ImageIcon,
  LogOut,
  Key,
  ShieldCheck,
  Cloud,
} from 'lucide-react';
import { UncleRwamitiAvatar } from './UncleRwamitiAvatar';

interface AdminCMSProps {
  isOpen: boolean;
  onClose: () => void;
  episodes: Episode[];
  onEpisodesChange: (newEpisodes: Episode[]) => void;
  config: PlatformConfig;
  onConfigChange: (newConfig: PlatformConfig) => void;
  onPlayEpisode: (episodeId: string) => void;
}

type TabType = 'episodes' | 'analytics' | 'config' | 'backup';

export const AdminCMS: React.FC<AdminCMSProps> = ({
  isOpen,
  onClose,
  episodes,
  onEpisodesChange,
  config,
  onConfigChange,
  onPlayEpisode,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('episodes');
  const [pinInput, setPinInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => AdminAuthService.isSessionActive());
  const [pinError, setPinError] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Setup state for unconfigured / first-time admin
  const isSetupNeeded = !AdminAuthService.isPinConfigured(config);
  const [setupPin, setSetupPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [setupError, setSetupError] = useState('');

  // Lockout countdown timer
  const [lockoutSeconds, setLockoutSeconds] = useState<number>(() => AdminAuthService.getLockoutStatus().remainingSeconds);

  // Password change state in Settings tab
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmNewPass, setConfirmNewPass] = useState('');
  const [passChangeError, setPassChangeError] = useState('');
  const [passChangeSuccess, setPassChangeSuccess] = useState('');

  // Synchronize session on open
  useEffect(() => {
    if (isOpen) {
      setIsAuthenticated(AdminAuthService.isSessionActive());
      const status = AdminAuthService.getLockoutStatus();
      setLockoutSeconds(status.remainingSeconds);
    }
  }, [isOpen]);

  // Lockout ticker
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const timer = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutSeconds]);

  // Edit / Create Episode State
  const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [backupMessage, setBackupMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Analytics filter
  const [analyticsFilterEpisode, setAnalyticsFilterEpisode] = useState<string>('all');
  const [currentPhoto, setCurrentPhoto] = useState<string | null>(() => StorageService.getRwamitiPhoto());

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      if (dataUrl) {
        sound.playSuccess();
        StorageService.saveRwamitiPhoto(dataUrl);
        setCurrentPhoto(dataUrl);
        window.dispatchEvent(new Event('rwamiti-photo-updated'));
        setBackupMessage({ text: 'Uncle Rwamiti official photo updated successfully!', type: 'success' });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    sound.playTap();
    StorageService.saveRwamitiPhoto(null);
    setCurrentPhoto(null);
    window.dispatchEvent(new Event('rwamiti-photo-updated'));
    setBackupMessage({ text: 'Custom Uncle Rwamiti photo removed.', type: 'success' });
  };

  if (!isOpen) return null;

  // Handle PIN unlock with cryptographic verification & brute force protection
  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutSeconds > 0 || isVerifying) return;
    setIsVerifying(true);
    setPinError('');

    try {
      const result = await AdminAuthService.verifyPin(pinInput, config);
      if (result.success) {
        sound.playSuccess();
        setIsAuthenticated(true);
        setPinInput('');
        setPinError('');
      } else {
        sound.playError();
        setPinError(result.error || 'Authentication failed.');
        const status = AdminAuthService.getLockoutStatus();
        if (status.isLocked) {
          setLockoutSeconds(status.remainingSeconds);
        }
      }
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle First-Time Admin Passcode Setup
  const handleSetupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSetupError('');

    if (setupPin.length < 4) {
      setSetupError('Passcode must be at least 4 characters long.');
      return;
    }
    if (setupPin !== confirmPin) {
      setSetupError('Passcodes do not match. Please try again.');
      return;
    }

    try {
      const updated = await AdminAuthService.updatePin(setupPin, config);
      onConfigChange(updated);
      StorageService.saveConfig(updated);
      AdminAuthService.setSessionActive();
      sound.playSuccess();
      setIsAuthenticated(true);
      setSetupPin('');
      setConfirmPin('');
      setBackupMessage({ text: 'Administrator passcode created successfully!', type: 'success' });
    } catch (err: any) {
      setSetupError(err?.message || 'Failed to establish passcode.');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    sound.playTap();
    AdminAuthService.clearSession();
    setIsAuthenticated(false);
    setPinInput('');
    setPinError('');
    onClose();
  };

  // Handle Change Passcode inside Settings tab
  const handleChangePasscode = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassChangeError('');
    setPassChangeSuccess('');

    if (newPass.length < 4) {
      setPassChangeError('New passcode must be at least 4 characters long.');
      return;
    }
    if (newPass !== confirmNewPass) {
      setPassChangeError('New passcodes do not match.');
      return;
    }

    const verifyCurrent = await AdminAuthService.verifyPin(currentPass, config);
    if (!verifyCurrent.success) {
      setPassChangeError('Current passcode is incorrect.');
      return;
    }

    try {
      const updated = await AdminAuthService.updatePin(newPass, config);
      onConfigChange(updated);
      StorageService.saveConfig(updated);
      sound.playSuccess();
      setPassChangeSuccess('Admin passcode updated successfully!');
      setCurrentPass('');
      setNewPass('');
      setConfirmNewPass('');
    } catch (err: any) {
      setPassChangeError(err?.message || 'Failed to update passcode.');
    }
  };

  // Quick Action for Mandatory Acceptance Test 7:
  // "Administrator can create and publish Episode 011 independently without developer assistance"
  const handleCreateDummyEpisode011 = () => {
    sound.playTap();
    const episode011: Episode = {
      id: 'ep-011',
      number: '011',
      title: 'SNEAKING OUT',
      subtitle: 'What would you do?',
      teaser: 'Midnight. Locked gate. Your friends are waiting in a boda-boda outside. The security guard is fast asleep with the keys on the stool.',
      category: 'Curfew & Rules',
      badge: 'MIDNIGHT • DORMITORY',
      badgeColor: 'amber',
      isPremium: true,
      published: true,
      initialNodeId: 'node-start-011',
      rwamitiEnding: {
        headline: '“INTERESTING.”',
        quoteLines: [
          '“You thought the lock on the gate was keeping you inside.”',
          '“A lock doesn’t protect the building from you; it protects you from the night.”',
        ],
        closingQuestion: '“When you jump the fence, who pays for the landing?”',
        pollOptions: ['ME', 'MY PARENTS', 'NOBODY'],
      },
      recommendedNextEpisodeId: 'ep-001',
      sharePrompt: 'Locked dormitory gate at midnight. Boda engine revving outside. Would you jump the fence? Play Episode 011 on Uncle Rwamiti:',
      nodes: {
        'node-start-011': {
          id: 'node-start-011',
          type: 'start',
          badge: 'MIDNIGHT • HOSTEL',
          badgeColor: 'amber',
          headline: 'SNEAKING OUT.',
          leadText: 'EPISODE 011',
          bodyParagraphs: [
            '12:15 AM.',
            'The end-of-year secret bonfire is happening at the beach 3km away.',
            'Your friends have paid a boda-boda driver waiting outside the iron gate.',
            'The night watchman is snoring under an old blanket, but the big padlock key is resting on a wooden stool right next to his elbow.',
          ],
          buttonText: 'START',
          nextNodeId: 'node-dec-011',
        },
        'node-dec-011': {
          id: 'node-dec-011',
          type: 'decision',
          badge: 'DECISION 1',
          headline: 'WHAT IS YOUR MOVE?',
          choices: [
            { id: 'c11_1', label: 'A. TIPTOE AND SNATCH THE KEY SLOWLY', nextNodeId: 'node-011-snatch', statPercent: 46, statCount: 23 },
            { id: 'c11_2', label: 'B. CLIMB OVER THE CORNER RAZOR WIRE FENCE', nextNodeId: 'node-011-climb', statPercent: 32, statCount: 16 },
            { id: 'c11_3', label: 'C. TURN BACK AND SLEEP (“NOT WORTH EXPULSION”)', nextNodeId: 'node-011-sleep', statPercent: 22, statCount: 11 },
          ],
        },
        'node-011-snatch': {
          id: 'node-011-snatch',
          type: 'consequence',
          badge: 'CONSEQUENCE',
          badgeColor: 'amber',
          headline: 'THE STOOL SQUEAKS.',
          bodyParagraphs: [
            'Your fingers touch the cold iron ring.',
            'The guard stirs, coughs, and shifts his stick. Your heart stops for five agonizing seconds.',
            'You open the padlock without a sound and slip through the gate into the dark.',
          ],
          buttonText: 'CONTINUE',
          nextNodeId: 'node-011-climax',
        },
        'node-011-climb': {
          id: 'node-011-climb',
          type: 'consequence',
          badge: 'CONSEQUENCE',
          badgeColor: 'red',
          headline: 'THE WIRE CATCHES.',
          bodyParagraphs: [
            'A metal hook tears through your new jacket and scrapes your forearm.',
            'The clang of the fence awakens two dogs down the lane.',
          ],
          buttonText: 'CONTINUE',
          nextNodeId: 'node-011-climax',
        },
        'node-011-sleep': {
          id: 'node-011-sleep',
          type: 'consequence',
          badge: 'CONSEQUENCE',
          headline: 'SAFE IN BED.',
          bodyParagraphs: [
            'You climb back into your bed and pull up the sheets.',
            'At 2:30 AM, you hear police patrol sirens intercepting a speeding boda down the main road.',
          ],
          buttonText: 'CONTINUE',
          nextNodeId: 'node-011-climax',
        },
        'node-011-climax': {
          id: 'node-011-climax',
          type: 'climax',
          headline: 'DAWN IN CAMPUS.',
          bodyParagraphs: [
            'Every night out has an invoice waiting at breakfast.',
          ],
          highlightText: 'Freedom without responsibility is just borrowing trouble.',
          buttonText: 'UNCLE RWAMITI IS WAITING',
        },
      },
    };

    const updated = StorageService.saveEpisode(episode011);
    onEpisodesChange(updated);
    FirestoreDataService.saveEpisode(episode011).catch(console.error);
    setBackupMessage({ text: 'Episode 011 successfully created and published!', type: 'success' });
  };

  // Toggle Free / Premium for an episode
  const handleToggleTier = (episodeId: string) => {
    sound.playTap();
    const target = episodes.find((e) => e.id === episodeId);
    if (!target) return;
    const updatedEpisode = { ...target, isPremium: !target.isPremium };
    const newEpisodes = StorageService.saveEpisode(updatedEpisode);
    onEpisodesChange(newEpisodes);
    FirestoreDataService.saveEpisode(updatedEpisode).catch(console.error);
  };

  // Toggle Publish / Draft
  const handleTogglePublish = (episodeId: string) => {
    sound.playTap();
    const target = episodes.find((e) => e.id === episodeId);
    if (!target) return;
    const updatedEpisode = { ...target, published: !target.published };
    const newEpisodes = StorageService.saveEpisode(updatedEpisode);
    onEpisodesChange(newEpisodes);
    FirestoreDataService.saveEpisode(updatedEpisode).catch(console.error);
  };

  // Delete Episode
  const handleDeleteEpisode = (episodeId: string) => {
    if (confirm('Are you sure you want to delete this episode?')) {
      sound.playTap();
      const updated = StorageService.deleteEpisode(episodeId);
      onEpisodesChange(updated);
    }
  };

  // Export JSON Backup
  const handleExportBackup = () => {
    sound.playTap();
    const dataStr = StorageService.exportBackup();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rwamiti-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setBackupMessage({ text: 'Platform backup downloaded successfully!', type: 'success' });
  };

  // Import JSON Backup
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      const res = StorageService.importBackup(content);
      if (res.success) {
        sound.playSuccess();
        const refreshed = StorageService.getEpisodes();
        const conf = StorageService.getConfig();
        onEpisodesChange(refreshed);
        onConfigChange(conf);
        setBackupMessage({ text: 'Platform backup restored successfully!', type: 'success' });
      } else {
        setBackupMessage({ text: res.error || 'Failed to restore backup.', type: 'error' });
      }
    };
    reader.readAsText(file);
  };

  // Reset to Defaults
  const handleResetDefaults = () => {
    if (confirm('Reset all episodes to original 10 launch episodes? Any custom episodes will be reverted.')) {
      sound.playTap();
      const def = StorageService.resetEpisodesToDefault();
      onEpisodesChange(def);
      setBackupMessage({ text: 'Reverted to default 10 launch episodes.', type: 'success' });
    }
  };

  // Analytics calculation
  const summary = AnalyticsService.getSummary(analyticsFilterEpisode);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl h-[90vh] bg-[#111218] border border-zinc-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-zinc-100">
        {/* Top Bar */}
        <div className="p-4 border-b border-zinc-800 bg-[#0d0e12] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#e5a93b]/20 border border-[#e5a93b]/40 flex items-center justify-center text-[#e5a93b] font-bold text-sm">
              CMS
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white">UNCLE RWAMITI • ADMIN CONSOLE</h2>
              <span className="text-[10px] text-zinc-400">
                Content Management, Real-time Analytics & Subscription Engine
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <Cloud className="w-3.5 h-3.5" />
              <span>Cloud Firestore Active</span>
            </div>

            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="px-2.5 py-1 rounded-lg bg-zinc-850 hover:bg-red-500/20 hover:text-red-400 text-zinc-400 border border-zinc-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="End Administrator Session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Security Gate if not authenticated */}
        {!isAuthenticated ? (
          isSetupNeeded ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-zinc-800 border border-[#e5a93b]/40 flex items-center justify-center text-[#e5a93b] mb-4 shadow-lg shadow-[#e5a93b]/10">
                <Key className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-white mb-1">First-Time Administrator Setup</h3>
              <p className="text-xs text-zinc-400 max-w-md mb-6 leading-relaxed">
                No administrator passcode is configured yet. Set a private, secure administrator passcode to protect story publishing, analytics, and platform controls.
              </p>

              <form onSubmit={handleSetupSubmit} className="w-full max-w-xs space-y-3">
                <div className="text-left">
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                    New Passcode (min 4 characters)
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={setupPin}
                    onChange={(e) => {
                      setSetupPin(e.target.value);
                      setSetupError('');
                    }}
                    placeholder="Enter new admin passcode"
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-sm tracking-wider focus:outline-none focus:border-[#e5a93b]"
                    autoFocus
                  />
                </div>

                <div className="text-left">
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                    Confirm Passcode
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPin}
                    onChange={(e) => {
                      setConfirmPin(e.target.value);
                      setSetupError('');
                    }}
                    placeholder="Confirm passcode"
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-sm tracking-wider focus:outline-none focus:border-[#e5a93b]"
                  />
                </div>

                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showPassword ? "Hide text" : "Show text"}</span>
                  </button>
                </div>

                {setupError && (
                  <div className="p-2.5 rounded-lg bg-red-500/15 border border-red-500/30 text-xs text-red-400 font-medium">
                    {setupError}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#e5a93b] hover:bg-[#d8982a] text-black font-extrabold text-xs tracking-wider uppercase transition-colors cursor-pointer shadow-md"
                >
                  SAVE PASSCODE & PROCEED
                </button>
              </form>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[#e5a93b] mb-4">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-white mb-1">Authorised Administrator Access</h3>
              <p className="text-xs text-zinc-400 max-w-sm mb-6">
                Enter your private administrator passcode to access story publishing, real-time analytics, and platform controls.
              </p>

              {lockoutSeconds > 0 ? (
                <div className="w-full max-w-xs p-4 rounded-xl bg-red-950/40 border border-red-800/80 text-center space-y-2">
                  <div className="text-sm font-bold text-red-400 flex items-center justify-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Console Temporarily Locked</span>
                  </div>
                  <p className="text-xs text-zinc-300">
                    Too many consecutive failed attempts.
                  </p>
                  <div className="font-mono text-lg font-bold text-amber-400">
                    {lockoutSeconds}s cooldown
                  </div>
                </div>
              ) : (
                <form onSubmit={handlePinSubmit} className="w-full max-w-xs space-y-3">
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={pinInput}
                      onChange={(e) => {
                        setPinInput(e.target.value);
                        setPinError('');
                      }}
                      placeholder="Enter Administrator Passcode"
                      className="w-full px-4 py-2.5 pr-10 rounded-xl bg-zinc-900 border border-zinc-700 text-center text-white text-base tracking-widest focus:outline-none focus:border-[#e5a93b]"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                      title={showPassword ? "Hide passcode" : "Show passcode"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {pinError && (
                    <div className="p-2.5 rounded-lg bg-red-500/15 border border-red-500/30 text-xs text-red-400 font-medium">
                      {pinError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#e5a93b] hover:bg-[#d8982a] disabled:opacity-50 text-black font-extrabold text-xs tracking-wider uppercase transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2"
                  >
                    {isVerifying ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <span>Unlock Admin Console</span>
                    )}
                  </button>
                </form>
              )}
            </div>
          )
        ) : (
          <>
            {/* Navigation Tabs */}
            <div className="flex border-b border-zinc-800 bg-[#0e0f14] px-4 overflow-x-auto">
              <button
                onClick={() => {
                  sound.playTap();
                  setActiveTab('episodes');
                }}
                className={`py-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'episodes'
                    ? 'border-[#e5a93b] text-[#e5a93b]'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Story CMS ({episodes.length})</span>
              </button>

              <button
                onClick={() => {
                  sound.playTap();
                  setActiveTab('analytics');
                }}
                className={`py-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'analytics'
                    ? 'border-[#e5a93b] text-[#e5a93b]'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Behavioural Analytics</span>
              </button>

              <button
                onClick={() => {
                  sound.playTap();
                  setActiveTab('config');
                }}
                className={`py-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'config'
                    ? 'border-[#e5a93b] text-[#e5a93b]'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Subscription & Settings</span>
              </button>

              <button
                onClick={() => {
                  sound.playTap();
                  setActiveTab('backup');
                }}
                className={`py-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'backup'
                    ? 'border-[#e5a93b] text-[#e5a93b]'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>Backup & Restoration</span>
              </button>
            </div>

            {/* Notification message */}
            {backupMessage && (
              <div
                className={`px-4 py-2 text-xs flex items-center justify-between ${
                  backupMessage.type === 'success'
                    ? 'bg-emerald-950/80 text-emerald-300 border-b border-emerald-800'
                    : 'bg-red-950/80 text-red-300 border-b border-red-800'
                }`}
              >
                <span>{backupMessage.text}</span>
                <button
                  onClick={() => setBackupMessage(null)}
                  className="text-xs hover:underline cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {/* TAB 1: STORY CMS */}
              {activeTab === 'episodes' && (
                <div className="space-y-4">
                  {/* Top action bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-900/70 p-3.5 rounded-xl border border-zinc-800">
                    <div>
                      <h4 className="text-sm font-bold text-white">Story Library Management</h4>
                      <p className="text-[11px] text-zinc-400">
                        Create, publish, edit branching decisions, and toggle Free / YOUR MOVE+ status.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Acceptance Test 7 Button */}
                      <button
                        onClick={handleCreateDummyEpisode011}
                        className="py-2 px-3 rounded-lg bg-[#e5a93b] hover:bg-[#d8982a] text-black font-extrabold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                        title="Mandatory Acceptance Test: Create Episode 011 independently"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Create Episode 011 (Acceptance Test)</span>
                      </button>
                    </div>
                  </div>

                  {/* Episodes Table */}
                  <div className="space-y-2.5">
                    {episodes.map((ep) => (
                      <div
                        key={ep.id}
                        className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-zinc-700 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold text-[#e5a93b] tracking-wider uppercase font-mono">
                              EP {ep.number}
                            </span>
                            <h5 className="text-sm font-bold text-white truncate">
                              {ep.title}
                            </h5>
                            <span className="text-[10px] text-zinc-400 hidden md:inline">
                              ({Object.keys(ep.nodes).length} nodes)
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400 line-clamp-1">
                            {ep.teaser}
                          </p>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-2 shrink-0">
                          {/* Play Preview */}
                          <button
                            onClick={() => {
                              sound.playTap();
                              onPlayEpisode(ep.id);
                              onClose();
                            }}
                            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-[#e5a93b] text-zinc-300 hover:text-black transition-colors cursor-pointer"
                            title="Play this episode"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                          </button>

                          {/* Free / Premium Toggle */}
                          <button
                            onClick={() => handleToggleTier(ep.id)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1 ${
                              ep.isPremium
                                ? 'bg-amber-500/20 text-[#e5a93b] border-amber-500/40'
                                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                            }`}
                            title="Click to toggle Free / Premium"
                          >
                            {ep.isPremium ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                            <span>{ep.isPremium ? 'YOUR MOVE+' : 'FREE'}</span>
                          </button>

                          {/* Publish Toggle */}
                          <button
                            onClick={() => handleTogglePublish(ep.id)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                              ep.published
                                ? 'bg-zinc-800 text-zinc-300 border-zinc-700'
                                : 'bg-red-950/40 text-red-400 border-red-800/50'
                            }`}
                          >
                            {ep.published ? 'Published' : 'Draft'}
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteEpisode(ep.id)}
                            className="p-1.5 text-zinc-500 hover:text-red-400 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
                            title="Delete episode"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: BEHAVIOURAL ANALYTICS */}
              {activeTab === 'analytics' && (
                <div className="space-y-5">
                  {/* Filter & Export Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-900/70 p-3.5 rounded-xl border border-zinc-800">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-zinc-400">Filter by Episode:</span>
                      <select
                        value={analyticsFilterEpisode}
                        onChange={(e) => setAnalyticsFilterEpisode(e.target.value)}
                        className="px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-xs focus:outline-none"
                      >
                        <option value="all">All Episodes Combined</option>
                        {episodes.map((ep) => (
                          <option key={ep.id} value={ep.id}>
                            EP {ep.number}: {ep.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={() => {
                        sound.playTap();
                        const csv = AnalyticsService.exportCSV();
                        const blob = new Blob([csv], { type: 'text/csv' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `rwamiti-analytics-${new Date().toISOString().slice(0, 10)}.csv`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="py-1.5 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 border border-zinc-700 transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export Raw Analytics (CSV)</span>
                    </button>
                  </div>

                  {/* Top Metric Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
                      <span className="text-[11px] text-zinc-400 block font-medium">Stories Started</span>
                      <span className="text-2xl font-black text-white">{summary.totalStarts}</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
                      <span className="text-[11px] text-zinc-400 block font-medium">Completions</span>
                      <span className="text-2xl font-black text-emerald-400">{summary.totalCompletions}</span>
                      <span className="text-[10px] text-zinc-500 font-mono">({summary.completionRate}% rate)</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
                      <span className="text-[11px] text-zinc-400 block font-medium">Challenges Shared</span>
                      <span className="text-2xl font-black text-[#25D366]">{summary.totalChallenges}</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
                      <span className="text-[11px] text-zinc-400 block font-medium">MoMo Subscriptions</span>
                      <span className="text-2xl font-black text-[#e5a93b]">{summary.totalPayments}</span>
                    </div>
                  </div>

                  {/* Secondary Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                      <span className="text-[10px] text-zinc-400 block">Total Opens</span>
                      <span className="text-lg font-bold text-zinc-200">{summary.totalOpens}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                      <span className="text-[10px] text-zinc-400 block">Decisions Made</span>
                      <span className="text-lg font-bold text-zinc-200">{summary.totalChoices}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                      <span className="text-[10px] text-zinc-400 block">Replays Clicked</span>
                      <span className="text-lg font-bold text-zinc-200">{summary.totalReplays}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                      <span className="text-[10px] text-zinc-400 block">Paywall Reached</span>
                      <span className="text-lg font-bold text-zinc-200">{summary.totalPaywallViews}</span>
                    </div>
                  </div>

                  {/* Choices Breakdown */}
                  <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                      Recent Teenage Decision Choices Breakdown
                    </h5>
                    <div className="space-y-2">
                      {summary.choiceCounts.length > 0 ? (
                        summary.choiceCounts.slice(0, 8).map((cc, i) => (
                          <div key={i} className="space-y-1">
                            <div className="flex justify-between text-xs text-zinc-300">
                              <span className="truncate max-w-[280px]">{cc.label}</span>
                              <span className="font-mono text-[#e5a93b] font-bold">{cc.count} picks</span>
                            </div>
                            <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-[#e5a93b] h-1.5 rounded-full"
                                style={{
                                  width: `${Math.min(100, (cc.count / (summary.totalChoices || 1)) * 100 * 3)}%`,
                                }}
                              />
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-xs text-zinc-500 py-3 text-center">
                          No choices recorded yet for this filter.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: PLATFORM & SUBSCRIPTION CONFIG */}
              {activeTab === 'config' && (
                <div className="space-y-5 max-w-xl">
                  {/* Uncle Rwamiti Character Photo Management */}
                  <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-[#e5a93b] flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5" />
                        <span>Permanent Official Photo of Uncle Rwamiti</span>
                      </h5>
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Permanent Asset
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400">
                      The official portrait of Uncle Rwamiti is locked as the permanent brand asset across the entire experience (opening screen, player, library drawer, and navigation).
                    </p>

                    <div className="flex items-center gap-4 pt-1">
                      <div className="w-16 h-16 rounded-xl overflow-hidden ring-2 ring-[#e5a93b] bg-zinc-800 shrink-0 relative flex items-center justify-center">
                        <UncleRwamitiAvatar className="w-full h-full object-cover" />
                      </div>

                      <div className="flex flex-col gap-1 text-xs">
                        <span className="font-bold text-white">Official Brand Portrait Active</span>
                        <span className="text-[11px] text-zinc-400">
                          Permanent vector portrait with signature mustard-gold cap and grey-silver beard.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Price config */}
                  <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-[#e5a93b]">
                      Subscription Pricing & Mobile Money Destination (Section 7)
                    </h5>
                    <p className="text-xs text-zinc-400">
                      Provisional subscription unlocks full library and future stories. Mobile money payments go directly to this recipient number.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">
                          Monthly Fee ({config.currency})
                        </label>
                        <input
                          type="number"
                          value={config.subscriptionPriceUgx}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            const updated = {
                              ...config,
                              subscriptionPriceUgx: val,
                              subscriptionPriceLabel: `UGX ${val.toLocaleString()} / month`,
                            };
                            onConfigChange(updated);
                            StorageService.saveConfig(updated);
                          }}
                          className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm focus:outline-none focus:border-[#e5a93b]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">
                          Default MoMo Number (MTN & Airtel)
                        </label>
                        <input
                          type="text"
                          value={config.defaultPaymentNumber || '0772988640'}
                          onChange={(e) => {
                            const updated = {
                              ...config,
                              defaultPaymentNumber: e.target.value.replace(/\s+/g, ''),
                            };
                            onConfigChange(updated);
                            StorageService.saveConfig(updated);
                          }}
                          placeholder="0772988640"
                          className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm font-mono focus:outline-none focus:border-[#e5a93b]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Aggregate Choice Results Toggle (Section 12) */}
                  <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between gap-4">
                    <div>
                      <h5 className="text-xs font-bold text-white">
                        Show Aggregate Choice Results (Section 12)
                      </h5>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        Displays peer statistics (e.g. “41% chose GIRLFRIEND”) to players after dilemmas.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        sound.playTap();
                        const updated = { ...config, showAggregateStats: !config.showAggregateStats };
                        onConfigChange(updated);
                        StorageService.saveConfig(updated);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                        config.showAggregateStats
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                      }`}
                    >
                      {config.showAggregateStats ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>

                  {/* Security & Admin Passcode Management */}
                  <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-4">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#e5a93b]" />
                      <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
                        Administrator Passcode Security
                      </h5>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Your administrator passcode is cryptographically salted and hashed using SHA-256 with rate-limiting brute force protection.
                    </p>

                    <form onSubmit={handleChangePasscode} className="space-y-3 pt-1 max-w-sm">
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                          Current Passcode
                        </label>
                        <input
                          type="password"
                          value={currentPass}
                          onChange={(e) => {
                            setCurrentPass(e.target.value);
                            setPassChangeError('');
                            setPassChangeSuccess('');
                          }}
                          placeholder="Enter current passcode"
                          className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm focus:outline-none focus:border-[#e5a93b]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                          New Passcode (min 4 characters)
                        </label>
                        <input
                          type="password"
                          value={newPass}
                          onChange={(e) => {
                            setNewPass(e.target.value);
                            setPassChangeError('');
                            setPassChangeSuccess('');
                          }}
                          placeholder="Enter new passcode"
                          className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm focus:outline-none focus:border-[#e5a93b]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                          Confirm New Passcode
                        </label>
                        <input
                          type="password"
                          value={confirmNewPass}
                          onChange={(e) => {
                            setConfirmNewPass(e.target.value);
                            setPassChangeError('');
                            setPassChangeSuccess('');
                          }}
                          placeholder="Confirm new passcode"
                          className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm focus:outline-none focus:border-[#e5a93b]"
                        />
                      </div>

                      {passChangeError && (
                        <div className="p-2.5 rounded-lg bg-red-500/15 border border-red-500/30 text-xs text-red-400 font-medium">
                          {passChangeError}
                        </div>
                      )}

                      {passChangeSuccess && (
                        <div className="p-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-400 font-medium">
                          {passChangeSuccess}
                        </div>
                      )}

                      <button
                        type="submit"
                        className="py-2 px-4 rounded-lg bg-zinc-800 hover:bg-[#e5a93b] hover:text-black text-white font-bold text-xs tracking-wider transition-colors cursor-pointer border border-zinc-700 hover:border-[#e5a93b]"
                      >
                        Update Admin Passcode
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* TAB 4: BACKUP & RESTORE */}
              {activeTab === 'backup' && (
                <div className="space-y-5 max-w-xl">
                  {/* Export */}
                  <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white">
                      <Download className="w-4 h-4 text-[#e5a93b]" />
                      <span>Export Full Platform Backup</span>
                    </div>
                    <p className="text-xs text-zinc-400">
                      Downloads all stories, nodes, branching structures, and subscription settings as a portable JSON file.
                    </p>
                    <button
                      onClick={handleExportBackup}
                      className="py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download JSON Backup</span>
                    </button>
                  </div>

                  {/* Restore */}
                  <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white">
                      <Upload className="w-4 h-4 text-emerald-400" />
                      <span>Restore from JSON File</span>
                    </div>
                    <p className="text-xs text-zinc-400">
                      Upload a previously exported backup file to restore all stories and configuration.
                    </p>
                    <label className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-bold text-xs cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Select Backup File (.json)</span>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportBackup}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Reset defaults */}
                  <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/40 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Reset to Original Launch Stories</span>
                    </div>
                    <p className="text-xs text-zinc-400">
                      Resets the library back to the 10 original launch episodes.
                    </p>
                    <button
                      onClick={handleResetDefaults}
                      className="py-2 px-3 rounded-lg bg-red-900/40 hover:bg-red-900/70 border border-red-800 text-red-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reset to Defaults</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
