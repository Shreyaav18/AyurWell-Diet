export const setAuthData = (token: string, user: any) => {
  localStorage.setItem('token', token);
  console.log('User data being stored:', user);
  localStorage.setItem('user', JSON.stringify(user));
};

export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};