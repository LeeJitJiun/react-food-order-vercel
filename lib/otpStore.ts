// Shared OTP storage across all auth routes
// In production, use Redis or database instead
interface OTPData {
  otp: string;
  expiresAt: number;
}

class OTPStore {
  private store: Map<string, OTPData>;

  constructor() {
    this.store = new Map();
  }

  set(email: string, otp: string, expiresAt: number) {
    this.store.set(email, { otp, expiresAt });
    console.log(`[OTPStore] Stored OTP for ${email}:`, { otp, expiresAt });
  }

  get(email: string): OTPData | undefined {
    const data = this.store.get(email);
    console.log(`[OTPStore] Retrieved OTP for ${email}:`, data);
    return data;
  }

  delete(email: string) {
    this.store.delete(email);
    console.log(`[OTPStore] Deleted OTP for ${email}`);
  }

  has(email: string): boolean {
    return this.store.has(email);
  }
}

// Use global variable to persist across hot reloads in development
declare global {
  var otpStoreInstance: OTPStore | undefined;
}

// Export a singleton instance that persists across module reloads
export const otpStore = globalThis.otpStoreInstance ?? new OTPStore();

if (process.env.NODE_ENV !== 'production') {
  globalThis.otpStoreInstance = otpStore;
}
