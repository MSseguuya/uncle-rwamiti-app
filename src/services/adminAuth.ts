import { PlatformConfig } from '../types';

const SESSION_KEY = 'rwamiti_admin_auth_session_v1';
const LOCKOUT_KEY = 'rwamiti_admin_lockout_v1';
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 60 * 1000; // 60 seconds

export class AdminAuthService {
  // Compute SHA-256 hex string using browser native Web Crypto
  static async sha256(message: string): Promise<string> {
    try {
      const msgBuffer = new TextEncoder().encode(message);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch {
      // Fallback simple numeric hash if subtle crypto fails in unusual contexts
      let hash = 0;
      for (let i = 0; i < message.length; i++) {
        const char = message.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0;
      }
      return 'fallback_' + Math.abs(hash).toString(16);
    }
  }

  // Generate a random 8-character salt
  static generateSalt(): string {
    const chars = 'abcdef0123456789';
    let salt = '';
    for (let i = 0; i < 8; i++) {
      salt += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return salt;
  }

  // Hash pin with salt
  static async hashWithSalt(pin: string, salt: string): Promise<string> {
    return this.sha256(`${salt}:${pin.trim()}`);
  }

  // Check if admin has established a passcode
  static isPinConfigured(config: PlatformConfig): boolean {
    return Boolean(config.adminPinHash || (config.adminPin && config.adminPin !== '1234'));
  }

  // Check if console is currently in lockout due to brute-force attempts
  static getLockoutStatus(): { isLocked: boolean; remainingSeconds: number } {
    if (typeof window === 'undefined') return { isLocked: false, remainingSeconds: 0 };
    try {
      const raw = sessionStorage.getItem(LOCKOUT_KEY);
      if (!raw) return { isLocked: false, remainingSeconds: 0 };
      const data = JSON.parse(raw);
      const now = Date.now();
      if (data.lockedUntil && data.lockedUntil > now) {
        const remainingSeconds = Math.ceil((data.lockedUntil - now) / 1000);
        return { isLocked: true, remainingSeconds };
      }
      return { isLocked: false, remainingSeconds: 0 };
    } catch {
      return { isLocked: false, remainingSeconds: 0 };
    }
  }

  // Record a failed attempt and trigger lockout if limit reached
  static recordFailedAttempt(): { remainingAttempts: number; isLocked: boolean; remainingSeconds: number } {
    if (typeof window === 'undefined') {
      return { remainingAttempts: MAX_FAILED_ATTEMPTS, isLocked: false, remainingSeconds: 0 };
    }
    try {
      const raw = sessionStorage.getItem(LOCKOUT_KEY);
      let data = raw ? JSON.parse(raw) : { count: 0, lockedUntil: 0 };
      data.count = (data.count || 0) + 1;

      if (data.count >= MAX_FAILED_ATTEMPTS) {
        const lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
        data = { count: 0, lockedUntil };
        sessionStorage.setItem(LOCKOUT_KEY, JSON.stringify(data));
        return { remainingAttempts: 0, isLocked: true, remainingSeconds: 60 };
      }

      sessionStorage.setItem(LOCKOUT_KEY, JSON.stringify(data));
      const remainingAttempts = Math.max(0, MAX_FAILED_ATTEMPTS - data.count);
      return { remainingAttempts, isLocked: false, remainingSeconds: 0 };
    } catch {
      return { remainingAttempts: 3, isLocked: false, remainingSeconds: 0 };
    }
  }

  // Clear failed attempts counter upon successful login
  static resetFailedAttempts(): void {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.removeItem(LOCKOUT_KEY);
    } catch {
      // Ignore storage errors
    }
  }

  // Validate entered PIN against stored configuration
  static async verifyPin(
    inputPin: string,
    config: PlatformConfig
  ): Promise<{ success: boolean; error?: string }> {
    const trimmed = inputPin.trim();
    if (!trimmed) {
      return { success: false, error: 'Passcode cannot be empty.' };
    }

    const lockout = this.getLockoutStatus();
    if (lockout.isLocked) {
      return {
        success: false,
        error: `Too many failed attempts. Access locked for ${lockout.remainingSeconds}s.`,
      };
    }

    let matches = false;

    // Check modern hashed PIN
    if (config.adminPinHash) {
      const salt = config.adminPinSalt || '';
      const inputHash = await this.hashWithSalt(trimmed, salt);
      matches = inputHash === config.adminPinHash;
    } else if (config.adminPin && config.adminPin !== '1234') {
      // Legacy custom plaintext PIN (migrate on match)
      matches = trimmed === config.adminPin;
    } else {
      // Unconfigured or legacy default: do not allow silent 1234 bypass without explicit prompt
      return {
        success: false,
        error: 'Admin passcode has not been initialized. Please set up your administrator credentials.',
      };
    }

    if (matches) {
      this.resetFailedAttempts();
      this.setSessionActive();
      return { success: true };
    }

    const { remainingAttempts, isLocked, remainingSeconds } = this.recordFailedAttempt();
    if (isLocked) {
      return {
        success: false,
        error: `Too many failed attempts. Security lockout active for ${remainingSeconds}s.`,
      };
    }

    return {
      success: false,
      error: `Incorrect passcode. ${remainingAttempts} attempt${remainingAttempts === 1 ? '' : 's'} remaining.`,
    };
  }

  // Set or update the Admin passcode with cryptographic salt + hash
  static async updatePin(newPin: string, config: PlatformConfig): Promise<PlatformConfig> {
    const trimmed = newPin.trim();
    if (trimmed.length < 4) {
      throw new Error('Passcode must be at least 4 characters long.');
    }

    const salt = this.generateSalt();
    const hash = await this.hashWithSalt(trimmed, salt);

    return {
      ...config,
      adminPinHash: hash,
      adminPinSalt: salt,
      adminPin: undefined, // Clear any legacy plaintext PIN
    };
  }

  // Session Management
  static isSessionActive(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      return sessionStorage.getItem(SESSION_KEY) === 'active';
    } catch {
      return false;
    }
  }

  static setSessionActive(): void {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.setItem(SESSION_KEY, 'active');
      window.dispatchEvent(new Event('rwamiti-admin-session-change'));
    } catch {
      // Ignore
    }
  }

  static clearSession(): void {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.removeItem(SESSION_KEY);
      window.dispatchEvent(new Event('rwamiti-admin-session-change'));
    } catch {
      // Ignore
    }
  }
}
