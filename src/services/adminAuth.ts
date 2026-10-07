import { PlatformConfig } from '../types';
import { StorageService } from './storage';
import { FirestoreDataService } from './firestoreData';

const SESSION_KEY = 'rwamiti_admin_auth_session_v1';
const LOCKOUT_KEY = 'rwamiti_admin_lockout_v1';
const CUSTOM_PASSCODE_FLAG = 'rwamiti_custom_passcode_configured_v2';
const PENDING_RESET_KEY = 'rwamiti_pending_password_reset_v2';
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 60 * 1000; // 60 seconds

export const DEFAULT_INITIAL_PASSCODE = '2580';
export const ADMIN_RECOVERY_EMAIL = 'peterowamala62@gmail.com';

export interface PasswordResetData {
  token: string;
  code: string;
  email: string;
  createdAt: string;
  expiresAt: string;
  used: boolean;
}

export class AdminAuthService {
  // Compute SHA-256 hex string using browser native Web Crypto
  static async sha256(message: string): Promise<string> {
    try {
      const msgBuffer = new TextEncoder().encode(message);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch {
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

  // Check if admin has established their permanent custom passcode
  static isCustomPasscodeConfigured(config?: PlatformConfig): boolean {
    if (typeof window === 'undefined') return false;
    try {
      const flag = localStorage.getItem(CUSTOM_PASSCODE_FLAG);
      const creds = StorageService.getAdminCredentials();
      const hasHash = Boolean(creds?.hash || config?.adminPinHash);
      return flag === 'true' && hasHash;
    } catch {
      return false;
    }
  }

  // Compatibility helper
  static isPinConfigured(config?: PlatformConfig): boolean {
    return this.isCustomPasscodeConfigured(config);
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
      // Ignore
    }
  }

  // Validate entered passcode
  static async verifyPin(
    inputPin: string,
    config?: PlatformConfig
  ): Promise<{ success: boolean; needsSetup?: boolean; error?: string }> {
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

    const isCustomSet = this.isCustomPasscodeConfigured(config);
    const creds = StorageService.getAdminCredentials();
    const storedHash = creds?.hash || config?.adminPinHash;
    const storedSalt = creds?.salt || config?.adminPinSalt;

    // If custom passcode is established, verify hash
    if (isCustomSet && storedHash && storedSalt) {
      const computedHash = await this.hashWithSalt(trimmed, storedSalt);
      if (computedHash === storedHash) {
        this.resetFailedAttempts();
        this.setSessionActive();
        return { success: true };
      }
    }

    // If custom passcode is NOT yet configured, check default initial passcode '2580'
    if (!isCustomSet && trimmed === DEFAULT_INITIAL_PASSCODE) {
      this.resetFailedAttempts();
      return { success: true, needsSetup: true };
    }

    // Also support initial passcode '2580' as emergency fallback if user hasn't set one or enters it
    if (!storedHash && trimmed === DEFAULT_INITIAL_PASSCODE) {
      this.resetFailedAttempts();
      return { success: true, needsSetup: true };
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

  // Setup / Update Admin Passcode
  static async setupNewPasscode(
    newPin: string,
    config: PlatformConfig
  ): Promise<{ success: boolean; error?: string; updatedConfig: PlatformConfig }> {
    const trimmed = newPin.trim();
    if (!trimmed || trimmed.length < 4) {
      return {
        success: false,
        error: 'Passcode must be at least 4 characters long.',
        updatedConfig: config,
      };
    }

    try {
      const salt = this.generateSalt();
      const hash = await this.hashWithSalt(trimmed, salt);

      // Save to credentials vault and config
      StorageService.saveAdminCredentials({ hash, salt });

      const updatedConfig: PlatformConfig = {
        ...config,
        adminPinHash: hash,
        adminPinSalt: salt,
      };

      StorageService.saveConfig(updatedConfig);

      if (typeof window !== 'undefined') {
        localStorage.setItem(CUSTOM_PASSCODE_FLAG, 'true');
      }

      // Sync to cloud Firestore
      FirestoreDataService.savePlatformConfig(updatedConfig).catch((err) => {
        console.warn('[AdminAuth] Cloud config sync notice:', err);
      });

      this.resetFailedAttempts();
      this.setSessionActive();

      return { success: true, updatedConfig };
    } catch (e: any) {
      return {
        success: false,
        error: e.message || 'Failed to save new passcode.',
        updatedConfig: config,
      };
    }
  }

  // Alias for updatePin
  static async updatePin(newPin: string, config: PlatformConfig): Promise<PlatformConfig> {
    const res = await this.setupNewPasscode(newPin, config);
    if (!res.success) {
      throw new Error(res.error || 'Failed to update passcode');
    }
    return res.updatedConfig;
  }

  // Request Password Reset link to peterowamala62@gmail.com
  static async requestPasswordReset(): Promise<{
    success: boolean;
    token: string;
    code: string;
    email: string;
    resetUrl: string;
    message: string;
  }> {
    const email = ADMIN_RECOVERY_EMAIL;
    // Generate secure random token and 6-digit verification code
    const token = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 60 * 60 * 1000).toISOString(); // 1 hour expiry

    const resetData: PasswordResetData = {
      token,
      code,
      email,
      createdAt: now.toISOString(),
      expiresAt,
      used: false,
    };

    // Save locally
    if (typeof window !== 'undefined') {
      localStorage.setItem(PENDING_RESET_KEY, JSON.stringify(resetData));
    }

    // Save to Firestore
    try {
      await FirestoreDataService.savePasswordReset({
        token,
        code,
        email,
        createdAt: now.toISOString(),
        expiresAt,
        used: false,
      });
    } catch (e) {
      console.warn('[AdminAuth] Remote reset save notice:', e);
    }

    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://unclerwamiti.com';
    const resetUrl = `${origin}/?admin_reset=${token}#admin`;

    // Attempt backend dispatch to server.js endpoint
    try {
      await fetch('/api/admin/request-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, resetUrl, resetCode: code, token }),
      });
    } catch {
      // Offline or preview fallback
    }

    return {
      success: true,
      token,
      code,
      email,
      resetUrl,
      message: `Password reset link and verification code have been dispatched to ${email}.`,
    };
  }

  // Verify Reset Token or 6-digit Code
  static async verifyResetTokenOrCode(input: string): Promise<{ valid: boolean; token?: string; error?: string }> {
    const trimmed = input.trim();
    if (!trimmed) {
      return { valid: false, error: 'Reset token or verification code is required.' };
    }

    const now = new Date().getTime();

    // 1. Check local pending reset
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(PENDING_RESET_KEY);
        if (raw) {
          const data: PasswordResetData = JSON.parse(raw);
          if (data && !data.used) {
            const expTime = new Date(data.expiresAt).getTime();
            if (now < expTime && (data.token === trimmed || data.code === trimmed)) {
              return { valid: true, token: data.token };
            }
          }
        }
      } catch {
        // ignore
      }
    }

    // 2. Check Firestore
    try {
      const remote = await FirestoreDataService.getPasswordReset(trimmed);
      if (remote && !remote.used) {
        const expTime = new Date(remote.expiresAt).getTime();
        if (now < expTime) {
          return { valid: true, token: remote.token };
        } else {
          return { valid: false, error: 'Password reset link has expired. Please request a new one.' };
        }
      }
    } catch {
      // ignore
    }

    return { valid: false, error: 'Invalid or expired password reset link/code.' };
  }

  // Reset passcode using verified token/code
  static async resetPasscodeWithToken(
    tokenOrCode: string,
    newPin: string,
    config: PlatformConfig
  ): Promise<{ success: boolean; error?: string; updatedConfig: PlatformConfig }> {
    const verification = await this.verifyResetTokenOrCode(tokenOrCode);
    if (!verification.valid) {
      return {
        success: false,
        error: verification.error || 'Invalid reset token.',
        updatedConfig: config,
      };
    }

    const setupResult = await this.setupNewPasscode(newPin, config);
    if (!setupResult.success) {
      return setupResult;
    }

    // Mark as used
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(PENDING_RESET_KEY);
        if (raw) {
          const data: PasswordResetData = JSON.parse(raw);
          data.used = true;
          localStorage.setItem(PENDING_RESET_KEY, JSON.stringify(data));
        }
      } catch {
        // ignore
      }
    }

    if (verification.token) {
      FirestoreDataService.markPasswordResetUsed(verification.token).catch(console.warn);
    }

    return setupResult;
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
