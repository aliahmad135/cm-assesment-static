
export class Storage {
  private static readonly USER_ID_KEY = 'cm_assessment_user_id';
  private static readonly USER_STATE_KEY = 'cm_assessment_user_state';

  static saveUserId(userId: string): void {
    try {
      localStorage.setItem(this.USER_ID_KEY, userId);
    } catch (error) {
      console.error('Failed to save user ID:', error);
    }
  }

  static getUserId(): string | null {
    try {
      return localStorage.getItem(this.USER_ID_KEY);
    } catch (error) {
      console.error('Failed to get user ID:', error);
      return null;
    }
  }

  static saveUserState(state: string): void {
    try {
      localStorage.setItem(this.USER_STATE_KEY, state);
    } catch (error) {
      console.error('Failed to save user state:', error);
    }
  }

  static getUserState(): string | null {
    try {
      return localStorage.getItem(this.USER_STATE_KEY);
    } catch (error) {
      console.error('Failed to get user state:', error);
      return null;
    }
  }

  static clear(): void {
    try {
      localStorage.removeItem(this.USER_ID_KEY);
      localStorage.removeItem(this.USER_STATE_KEY);
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }
}

