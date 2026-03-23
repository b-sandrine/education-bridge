// USSD session state management
export class USSDSession {
  constructor(phoneNumber, language = 'en') {
    this.phoneNumber = phoneNumber;
    this.language = language;
    this.state = 'mainMenu';
    this.previousState = null;
    this.data = {};
    this.createdAt = new Date();
    this.lastActivityAt = new Date();
  }

  // Navigate to a new state
  navigateTo(state, data = {}) {
    this.previousState = this.state;
    this.state = state;
    this.data = { ...this.data, ...data };
    this.lastActivityAt = new Date();
  }

  // Go back to previous state
  goBack() {
    if (this.previousState) {
      this.state = this.previousState;
      this.lastActivityAt = new Date();
    }
  }

  // Check if session is expired (30 minutes)
  isExpired() {
    const now = new Date();
    const diffMs = now - this.lastActivityAt;
    const diffMins = Math.floor(diffMs / 60000);
    return diffMins > 30;
  }

  // Clear session data
  clear() {
    this.state = 'mainMenu';
    this.previousState = null;
    this.data = {};
  }
}

// In-memory session storage (would be Redis in production)
export const sessions = new Map();

export const getSession = (phoneNumber) => {
  return sessions.get(phoneNumber);
};

export const createSession = (phoneNumber, language = 'en') => {
  if (!sessions.has(phoneNumber)) {
    sessions.set(phoneNumber, new USSDSession(phoneNumber, language));
  }
  return sessions.get(phoneNumber);
};

export const deleteSession = (phoneNumber) => {
  sessions.delete(phoneNumber);
};
