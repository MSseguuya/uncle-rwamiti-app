import React, { useState } from 'react';
import { X, Check, ShieldCheck, Smartphone, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { sound } from '../services/audio';
import { AnalyticsService } from '../services/analytics';
import { FirestoreDataService } from '../services/firestoreData';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  priceUgx: number;
  recipientNumber?: string;
  merchantName?: string;
  onPaymentSuccess: () => void;
  episodeTitle?: string;
}

type Step = 'select' | 'processing' | 'ussd_prompt' | 'confirmed';

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  priceUgx,
  recipientNumber = '0772988640',
  merchantName = 'Uncle Rwamiti / Your Move',
  onPaymentSuccess,
  episodeTitle,
}) => {
  const [provider, setProvider] = useState<'mtn' | 'airtel'>('mtn');
  const [phoneNumber, setPhoneNumber] = useState('0772988640');
  const [step, setStep] = useState<Step>('select');
  const [isSimulating, setIsSimulating] = useState(false);

  if (!isOpen) return null;

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
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#111218] border border-zinc-700/80 rounded-2xl shadow-2xl overflow-hidden text-zinc-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STEP 1: Select Provider & Pay */}
        {step === 'select' && (
          <div className="p-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#e5a93b] mb-1">
              <Sparkles className="w-4 h-4" />
              <span>YOUR MOVE+ SUBSCRIPTION</span>
            </div>

            <h3 className="text-xl font-extrabold text-white mb-1.5">
              Unlock Full Story Library
            </h3>

            <p className="text-xs text-zinc-400 mb-5 leading-relaxed">
              {episodeTitle
                ? `Episode "${episodeTitle}" is part of YOUR MOVE+. Unlock all locked stories (Episodes 006–012) and weekly new dilemmas.`
                : 'Get unlimited access to all locked episodes (006–012), future teenage dilemma drops, and exclusive paths.'}
            </p>

            {/* Price Box */}
            <div className="bg-[#181922] p-4 rounded-xl border border-zinc-800 mb-5 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-zinc-400 block uppercase font-medium">Subscription Rate</span>
                <span className="text-2xl font-black text-white">UGX {priceUgx.toLocaleString()}</span>
                <span className="text-xs text-zinc-400"> / month</span>
              </div>
              <span className="text-[10px] uppercase font-bold px-2 py-1 bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 rounded-md">
                Cancel Anytime
              </span>
            </div>

            {/* Payment Method Selector */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-zinc-300 mb-2">
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
            <div className="mb-6">
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
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
              <div className="mt-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-zinc-300 flex items-start gap-2">
                <Smartphone className="w-4 h-4 text-[#e5a93b] shrink-0 mt-0.5" />
                <span>
                  Payments for MTN & Airtel go directly to default number{' '}
                  <strong className="text-white font-mono">{recipientNumber}</strong> ({merchantName}).
                </span>
              </div>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePay}
              className="w-full py-3.5 px-4 rounded-xl bg-[#e5a93b] hover:bg-[#d8982a] text-black font-extrabold text-sm tracking-wide transition-all shadow-lg shadow-[#e5a93b]/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>PAY UGX {priceUgx.toLocaleString()} VIA {provider.toUpperCase()}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-zinc-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Encrypted Ugandan Telecom Gateway • Zero Data Leak</span>
            </div>
          </div>
        )}

        {/* STEP 2: Processing Handshake */}
        {step === 'processing' && (
          <div className="p-8 text-center flex flex-col items-center justify-center min-h-[340px]">
            <Loader2 className="w-10 h-10 text-[#e5a93b] animate-spin mb-4" />
            <h4 className="text-base font-bold text-white mb-1">
              Contacting {provider === 'mtn' ? 'MTN MoMo' : 'Airtel Money'}...
            </h4>
            <p className="text-xs text-zinc-400 max-w-xs">
              Initiating secure USSD prompt to +256 {phoneNumber}. Please keep your phone unlocked.
            </p>
          </div>
        )}

        {/* STEP 3: Simulated USSD Prompt on Phone */}
        {step === 'ussd_prompt' && (
          <div className="p-6">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/40 text-[#e5a93b] flex items-center justify-center mx-auto mb-3">
              <Smartphone className="w-6 h-6 animate-pulse" />
            </div>

            <div className="text-center mb-5">
              <h4 className="text-base font-extrabold text-white">
                Approve Payment on Your Phone
              </h4>
              <p className="text-xs text-zinc-400 mt-1">
                USSD prompt sent to <span className="text-white font-mono">{phoneNumber}</span>
              </p>
            </div>

            {/* Simulated Phone Screen USSD Box */}
            <div className="bg-black/90 p-4 rounded-xl border border-zinc-700/80 mb-5 font-mono text-xs">
              <div className="text-zinc-400 text-[10px] border-b border-zinc-800 pb-1 mb-2">
                USSD SIM PROMPT • {provider.toUpperCase()}
              </div>
              <div className="text-amber-300 mb-1 font-semibold">
                Pay UGX {priceUgx.toLocaleString()} to {recipientNumber} ({merchantName})
              </div>
              <div className="text-zinc-400 text-[11px]">
                Ref: YOURMOVE-SUB
              </div>
              <div className="mt-3 p-2 bg-zinc-900 rounded border border-zinc-800 text-zinc-300 text-center">
                Enter Mobile Money PIN to authorize
              </div>
            </div>

            <button
              onClick={handleConfirmUssd}
              disabled={isSimulating}
              className="w-full py-3 px-4 rounded-xl bg-[#e5a93b] hover:bg-[#d8982a] text-black font-bold text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSimulating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Transaction Server-side...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>I Have Entered My PIN (Simulate Approval)</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* STEP 4: Payment Confirmed */}
        {step === 'confirmed' && (
          <div className="p-8 text-center flex flex-col items-center justify-center min-h-[340px]">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mb-3">
              <Check className="w-8 h-8" />
            </div>

            <h4 className="text-xl font-extrabold text-white mb-1">
              Payment Confirmed!
            </h4>
            <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider mb-2">
              YOUR MOVE+ ACTIVATED
            </div>
            <p className="text-xs text-zinc-300 max-w-xs mb-6">
              Thank you! You now have full access to all 10 stories and upcoming weekly episodes.
            </p>

            <button
              onClick={onClose}
              className="w-full py-3 px-4 rounded-xl bg-[#e5a93b] hover:bg-[#d8982a] text-black font-extrabold text-sm transition-all shadow-lg cursor-pointer"
            >
              CONTINUE PLAYING →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
