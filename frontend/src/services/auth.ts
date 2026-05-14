export const storageKey = '@FocusFlow:user';

export const authService = {
  saveUser(user: { id: string; name: string }) {
    localStorage.setItem(storageKey, JSON.stringify(user));
  },
  getUser() {
    const data = localStorage.getItem(storageKey);
    return data ? JSON.parse(data) : null;
  },
  logout() {
    localStorage.removeItem(storageKey);
  }
};