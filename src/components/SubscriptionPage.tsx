import React, { useState } from 'react';
import { ArrowLeft, Check, ShieldCheck, Smartphone, ArrowRight, Loader2, Sparkles, Lock } from 'lucide-react';
import { sound } from '../services/audio';
import { AnalyticsService } from '../services/analytics';
import { FirestoreDataService } from '../services/firestoreData';
import { Episode } from '../types';
import { RwamitiPosterArt } from './RwamitiPosterArt';

interface SubscriptionPageProps {
  targetEpisode?: Episode | null;
  priceUgx: number;
  recipientNumber?: string;
  merchantName?: string;
  onPaymentSuccess: () => void;
  onBackToCatalog: () => void;
}

type Step = 'select' | 'processing' | 'ussd_prompt' | 'confirmed';

export const SubscriptionPage: React.FC<SubscriptionPageProps> = ({
  targetEpisode,
  priceUgx,
  recipientNumber = '0772988640',
  merchantName = 'Uncle Rwamiti / Your Move',
  onPaymentSuccess,
  onBackToCatalog,
}) => {
  const [provider, setProvider] = useState<'mtn' | 'airtel'>('mtn');
  const [phoneNumber, setPhoneNumber] = useState('0772988640');
  const [step, setStep] = useState<Step>('select');
  const [isSimulating, setIsSimulating] = useState(false);

  const handlePay = () => {
    sound.playTap();
    AnalyticsService.track('unlock_clicked', { metadata: { provider, phoneNumber } });
    setStep('processing');

    setTimeout(() => {
      sound.playPing();
      setStep('ussd_prompt');
    }, 1200);
  };

  const handleConfirmUssd = () => {
    setIsSimulating(true);
    sound.playTap();

    setTimeout(() => {
      setIsSimulating(false);
      sound.playSuccess();
      setStep('confirmed');
      AnalyticsService.track('payment_completed', {
        metadata: {
          provider: provider === 'mtn' ? 'MTN Mobile Money' : 'Airtel Money',
          amount: priceUgx,
          currency: 'UGX',
        },
      });
      FirestoreDataService.registerSubscriber({
        phoneNumber,
        network: provider === 'mtn' ? 'MTN' : 'Airtel',
        amountPaid: priceUgx,
        currency: 'UGX',
      });
      onPaymentSuccess();
    }, 1400);
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-5 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
        <button
          onClick={() => {
            sound.playTap();
            onBackToCatalog();
          }}
          className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Stories</span>
        </button>

        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#e5a93b]/15 text-[#e5a93b] border border-[#e5a93b]/30 text-[10px] font-black uppercase tracking-wider">
          <Sparkles className="w-3 h-3" />
          <span>YOUR MOVE+</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-3 space-y-4">
        {/* STEP 1: Plan Details & Mobile Money */}
        {step === 'select' && (
          <div className="space-y-4 animate-in fade-in">
            {/* Locked Episode Banner */}
            {targetEpisode && (
              <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#e5a93b]/15 text-[#e5a93b] border border-[#e5a93b]/40 flex items-center justify-center shrink-0 mt-0.5">
                  <Lock className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold text-[#e5a93b] uppercase tracking-wider">
                    LOCKED STORY • EPISODE {targetEpisode.number}
                  </div>
                  <h3 className="text-sm font-black text-white truncate">
                    {targetEpisode.title}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">
                    {targetEpisode.teaser}
                  </p>
                </div>
              </div>
            )}

            {/* Value Proposition */}
            <div className="text-center pt-1 pb-1">
              <h2 className="text-xl font-black text-white tracking-tight uppercase">
                SUBSCRIBE TO UNLOCK
              </h2>
              <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
                Get instant access to locked Episodes 006–012 and all future exclusive dilemmas by Uncle Rwamiti.
              </p>
            </div>

            {/* Price Box */}
            <div className="bg-[#181922] p-4 rounded-xl border border-zinc-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-zinc-400 block uppercase font-bold tracking-wider">
                  Subscription Rate
                </span>
                <span className="text-2xl font-black text-white">UGX {priceUgx.toLocaleString()}</span>
                <span className="text-xs text-zinc-400 font-medium"> / month</span>
              </div>
              <span className="text-[10px] uppercase font-extrabold px-2.5 py-1 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-md">
                Cancel Anytime
              </span>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-2">
                Select Mobile Money Provider (Uganda)
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {/* MTN MoMo */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playTap();
                    setProvider('mtn');
                  }}
                  className={`p-3 rounded-xl border flex flex-col items-center text-center transition-all cursor-pointer ${
                    provider === 'mtn'
                      ? 'border-[#ffcc00] bg-[#ffcc00]/10 text-white shadow-sm'
                      : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-[#ffcc00] text-black font-black text-xs flex items-center justify-center mb-1">
                    MTN
                  </div>
                  <span className="text-xs font-bold text-white">MTN MoMo</span>
                  <span className="text-[10px] text-zinc-400">*165# Prompt</span>
                </button>

                {/* Airtel Money */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playTap();
                    setProvider('airtel');
                  }}
                  className={`p-3 rounded-xl border flex flex-col items-center text-center transition-all cursor-pointer ${
                    provider === 'airtel'
                      ? 'border-[#e60000] bg-[#e60000]/10 text-white shadow-sm'
                      : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-[#e60000] text-white font-black text-xs flex items-center justify-center mb-1">
                    airtel
                  </div>
                  <span className="text-xs font-bold text-white">Airtel Money</span>
                  <span className="text-[10px] text-zinc-400">*185# Prompt</span>
                </button>
              </div>
            </div>

            {/* Mobile Number Input */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                Your Mobile Money Phone Number (Uganda)
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 flex items-center gap-1.5 pointer-events-none text-zinc-400 text-xs font-semibold">
                  <span>🇺🇬 +256</span>
                </div>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\s+/g, ''))}
                  placeholder="0772988640"
                  className="w-full pl-20 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-sm focus:outline-none focus:border-[#e5a93b]"
                />
              </div>
              <div className="mt-2 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-zinc-300 flex items-start gap-2">
                <Smartphone className="w-4 h-4 text-[#e5a93b] shrink-0 mt-0.5" />
                <span>
                  Payments for MTN & Airtel go directly to default number{' '}
                  <strong className="text-white font-mono">{recipientNumber}</strong> ({merchantName}).
                </span>
              </div>
            </div>

            {/* Pay Button */}
            <div className="pt-2">
              <button
                onClick={handlePay}
                className="w-full py-4 px-4 rounded-xl bg-[#e5a93b] hover:bg-[#d8982a] text-black font-black text-sm uppercase tracking-wider transition-all shadow-xl shadow-[#e5a93b]/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>PAY UGX {priceUgx.toLocaleString()} VIA {provider.toUpperCase()}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-zinc-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Encrypted Telecom Gateway • Instant Unlock</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Processing Handshake */}
        {step === 'processing' && (
          <div className="py-12 text-center flex flex-col items-center justify-center animate-in fade-in">
            <Loader2 className="w-12 h-12 text-[#e5a93b] animate-spin mb-4" />
            <h4 className="text-base font-bold text-white mb-1">
              Connecting to {provider === 'mtn' ? 'MTN MoMo' : 'Airtel Money'}...
            </h4>
            <p className="text-xs text-zinc-400 max-w-xs leading-relaxed">
              Initiating secure USSD prompt to +256 {phoneNumber}. Keep your phone screen on.
            </p>
          </div>
        )}

        {/* STEP 3: Simulated USSD Prompt on Phone */}
        {step === 'ussd_prompt' && (
          <div className="space-y-4 py-4 animate-in fade-in">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/40 text-[#e5a93b] flex items-center justify-center mx-auto mb-2">
              <Smartphone className="w-6 h-6 animate-pulse" />
            </div>

            <div className="text-center">
              <h4 className="text-base font-black text-white">
                Approve Payment on Your Phone
              </h4>
              <p className="text-xs text-zinc-400 mt-1">
                USSD push sent to <span className="text-white font-mono">{phoneNumber}</span>
              </p>
            </div>

            {/* Phone Screen USSD Box */}
            <div className="bg-black/95 p-4 rounded-xl border border-zinc-700 font-mono text-xs shadow-inner">
              <div className="text-zinc-500 text-[10px] border-b border-zinc-800 pb-1 mb-2 uppercase">
                USSD SIM PROMPT • {provider.toUpperCase()}
              </div>
              <div className="text-amber-300 mb-1 font-semibold">
                Pay UGX {priceUgx.toLocaleString()} to {recipientNumber} ({merchantName})
              </div>
              <div className="text-zinc-400 text-[11px]">
                Ref: YOURMOVE-SUB
              </div>
              <div className="mt-3 p-2.5 bg-zinc-900 rounded border border-zinc-800 text-zinc-300 text-center text-xs">
                Enter Mobile Money PIN to authorize
              </div>
            </div>

            <button
              onClick={handleConfirmUssd}
              disabled={isSimulating}
              className="w-full py-3.5 px-4 rounded-xl bg-[#e5a93b] hover:bg-[#d8982a] text-black font-extrabold text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSimulating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Payment...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>I Have Entered My PIN (Complete)</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* STEP 4: Payment Confirmed */}
        {step === 'confirmed' && (
          <div className="py-10 text-center flex flex-col items-center justify-center animate-in fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mb-3">
              <Check className="w-8 h-8" />
            </div>

            <h4 className="text-xl font-black text-white mb-1">
              Payment Confirmed!
            </h4>
            <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider mb-2">
              YOUR MOVE+ ACTIVATED
            </div>
            <p className="text-xs text-zinc-300 max-w-xs mb-6 leading-relaxed">
              All episodes are now unlocked! You have full access to play Episode {targetEpisode?.number || ''} and the complete story library.
            </p>

            <button
              onClick={() => {
                sound.playTap();
                onBackToCatalog();
              }}
              className="w-full py-4 px-4 rounded-xl bg-[#e5a93b] hover:bg-[#d8982a] text-black font-black text-sm uppercase tracking-wider transition-all shadow-lg cursor-pointer"
            >
              START PLAYING NOW →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
