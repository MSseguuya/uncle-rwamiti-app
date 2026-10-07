import React, { useState } from 'react';
import { X, Mail, Shield, FileText, ExternalLink } from 'lucide-react';

export type LegalTab = 'contact' | 'privacy' | 'terms';

interface LegalModalProps {
  isOpen: boolean;
  initialTab?: LegalTab;
  onClose: () => void;
  onOpenAdmin?: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  initialTab = 'contact',
  onClose,
  onOpenAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);

  // Sync tab if opened with new initialTab
  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/70">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#e5a93b]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Petero's Paths • Uncle Rwamiti
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-zinc-800 bg-zinc-950/40 px-5 pt-2 gap-2">
          <button
            onClick={() => setActiveTab('contact')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'contact'
                ? 'border-[#e5a93b] text-[#e5a93b]'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Contact</span>
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'privacy'
                ? 'border-[#e5a93b] text-[#e5a93b]'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Privacy</span>
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'terms'
                ? 'border-[#e5a93b] text-[#e5a93b]'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Terms</span>
          </button>
        </div>

        {/* Content body */}
        <div className="p-5 overflow-y-auto text-xs text-zinc-300 space-y-4 leading-relaxed">
          {activeTab === 'contact' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Get in Touch</h4>
                <p className="text-zinc-400">
                  Have feedback, dilemma submissions, or partnership inquiries for Uncle Rwamiti Stories? We'd love to hear from you.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">General & Editorial:</span>
                  <a
                    href="mailto:peterowamala62@gmail.com?subject=Uncle%20Rwamiti%20Editorial"
                    className="font-mono text-[#e5a93b] hover:underline flex items-center gap-1"
                  >
                    peterowamala62@gmail.com
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Story Submissions:</span>
                  <a
                    href="mailto:peterowamala62@gmail.com?subject=Uncle%20Rwamiti%20Story%20Submission"
                    className="font-mono text-[#e5a93b] hover:underline flex items-center gap-1"
                  >
                    peterowamala62@gmail.com
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Publisher:</span>
                  <button
                    onClick={() => {
                      onClose();
                      if (onOpenAdmin) {
                        onOpenAdmin();
                      } else {
                        window.dispatchEvent(new CustomEvent('open-admin-cms'));
                      }
                    }}
                    className="text-zinc-300 hover:text-[#e5a93b] font-medium transition-colors cursor-pointer flex items-center gap-1.5 group"
                    title="Authorised Editorial Access"
                  >
                    <span>Petero's Paths Interactive</span>
                    <Shield className="w-3 h-3 text-zinc-600 group-hover:text-[#e5a93b] transition-colors" />
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-zinc-400">
                Responses are usually sent within 24–48 hours on business days.
              </p>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white">Privacy Policy</h4>
              <p>
                At Petero's Paths, we believe interactive stories should be private, personal, and safe.
              </p>
              <div className="space-y-2">
                <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
                  <div className="font-semibold text-white mb-0.5">Device-Local Progress</div>
                  <p className="text-zinc-400">
                    Your reading history, story choices, and completion milestones are stored locally on your device storage. We do not track individual reading profiles across the web.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
                  <div className="font-semibold text-white mb-0.5">Aggregate Story Statistics</div>
                  <p className="text-zinc-400">
                    To show community dilemma percentages (e.g. "62% chose to tell the truth"), anonymized choice counts are aggregated without personal identifiers.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
                  <div className="font-semibold text-white mb-0.5">Payment Security</div>
                  <p className="text-zinc-400">
                    Mobile Money transactions (MTN MoMo and Airtel Money) are handled directly through authorized payment gateways. We never store your mobile money PIN.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white">Terms of Use</h4>
              <p>
                Welcome to Uncle Rwamiti Stories by Petero's Paths. By accessing or playing these interactive episodes, you agree to the following terms:
              </p>
              <div className="space-y-2 text-zinc-400">
                <p>
                  <strong className="text-white">1. Fiction & Life Dilemmas:</strong> All stories, characters, and scenarios depicted under Uncle Rwamiti are works of interactive fiction designed for adult reflection, ethics exploration, and entertainment.
                </p>
                <p>
                  <strong className="text-white">2. Free & Premium Access:</strong> Free launch episodes are open to all players with no registration required. Exclusive serialized episodes are unlocked through Your Move+ access passes.
                </p>
                <p>
                  <strong className="text-white">3. Intellectual Property:</strong> Story scripts, original character artwork, branching narratives, and audio motifs are copyright © Petero's Paths.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-zinc-800 bg-zinc-950/70 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
