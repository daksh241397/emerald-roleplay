import { v4 as uuidv4 } from 'uuid';

export interface Session {
  token: string;
  userId: string;
  expiresAt: number;
  lastActivity: number;
  deviceInfo: {
    userAgent: string;
    ip: string;
    location: string;
    deviceType: string;
    browser?: string;
    os?: string;
  };
  refreshToken?: string;
  createdAt: number;
}

const FOUR_DAYS_MS = 4 * 24 * 60 * 60 * 1000;
const EXPIRATION_WARNING_MS = 30 * 60 * 1000; // 30 minutes before expiration

class SessionManager {
  private static instance: SessionManager;
  private sessions: Map<string, Session>;

  private constructor() {
    this.sessions = new Map();
    this.loadPersistedSessions();
  }

  private loadPersistedSessions() {
    try {
      const persistedSessions = localStorage.getItem('sessions');
      if (persistedSessions) {
        const sessions = JSON.parse(persistedSessions);
        this.sessions = new Map(Object.entries(sessions));
      }
    } catch (error) {
      console.error('Failed to load persisted sessions:', error);
    }
  }

  private persistSessions() {
    try {
      const sessions = Object.fromEntries(this.sessions);
      localStorage.setItem('sessions', JSON.stringify(sessions));
    } catch (error) {
      console.error('Failed to persist sessions:', error);
    }
  }

  public static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  public createSession(userId: string, deviceInfo: { userAgent: string; ip: string; }): Session {
    const token = uuidv4();
    const now = Date.now();
    const deviceType = this.detectDeviceType(deviceInfo.userAgent);
    const { browser, os } = this.parseUserAgent(deviceInfo.userAgent);
    
    const session: Session = {
      token,
      userId,
      expiresAt: now + FOUR_DAYS_MS,
      lastActivity: now,
      createdAt: now,
      deviceInfo: {
        ...deviceInfo,
        location: 'Unknown', // Will be updated by geolocation service
        deviceType,
        browser,
        os
      }
    };

    const refreshToken = uuidv4();
    session.refreshToken = refreshToken;
    session.deviceInfo = deviceInfo;

    this.sessions.set(token, session);
    this.persistSessions();
    return session;
  }

  public validateSession(token: string): Session | null {
    const session = this.sessions.get(token);
    if (!session) return null;

    const now = Date.now();
    if (now > session.expiresAt) {
      this.invalidateSession(token);
      return null;
    }

    return session;
  }

  public refreshSession(token: string, refreshToken?: string): Session | null {
    const session = this.sessions.get(token);
    if (!session) return null;

    const now = Date.now();
    if (now > session.expiresAt) {
      this.invalidateSession(token);
      return null;
    }

    if (refreshToken && session.refreshToken !== refreshToken) {
      return null;
    }

    session.lastActivity = now;
    session.expiresAt = now + FOUR_DAYS_MS;
    this.persistSessions();
    return session;
  }

  public invalidateSession(token: string): void {
    this.sessions.delete(token);
    this.persistSessions();
  }

  public isSessionExpiring(token: string): boolean {
    const session = this.sessions.get(token);
    if (!session) return false;

    const now = Date.now();
    return now > session.expiresAt - EXPIRATION_WARNING_MS;
  }

  private detectDeviceType(userAgent: string): string {
    if (/mobile/i.test(userAgent)) return 'Mobile';
    if (/tablet/i.test(userAgent)) return 'Tablet';
    return 'Desktop';
  }

  private parseUserAgent(userAgent: string): { browser: string; os: string } {
    let browser = 'Unknown';
    let os = 'Unknown';

    // Browser detection
    if (/chrome/i.test(userAgent)) browser = 'Chrome';
    else if (/firefox/i.test(userAgent)) browser = 'Firefox';
    else if (/safari/i.test(userAgent)) browser = 'Safari';
    else if (/edge/i.test(userAgent)) browser = 'Edge';

    // OS detection
    if (/wEMERALDows/i.test(userAgent)) os = 'WEMERALDows';
    else if (/macintosh/i.test(userAgent)) os = 'macOS';
    else if (/linux/i.test(userAgent)) os = 'Linux';
    else if (/android/i.test(userAgent)) os = 'Android';
    else if (/iphone|ipad|ipod/i.test(userAgent)) os = 'iOS';

    return { browser, os };
  }

  public async updateSessionLocation(token: string, location: string): Promise<void> {
    const session = this.sessions.get(token);
    if (session) {
      session.deviceInfo.location = location;
      this.persistSessions();
    }
  }

  public getActiveSessions(userId: string): Session[] {
    return Array.from(this.sessions.values())
      .filter(session => session.userId === userId)
      .sort((a, b) => b.lastActivity - a.lastActivity);
  }

  public cleanupExpiredSessions(): void {
    const now = Date.now();
    for (const [token, session] of this.sessions.entries()) {
      if (now > session.expiresAt) {
        this.sessions.delete(token);
      }
    }
  }
}

export const sessionManager = SessionManager.getInstance();