import { api } from './api'; 

export const storageKey = '@FocusFlow:user';

export const authService = {

  async login(email: string, password: string) {
    const response = await api.post('/sessions', { email, password });
    
    if (response.data) {
      this.saveUser(response.data)
      return response.data;
    }
    return null;
  },

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