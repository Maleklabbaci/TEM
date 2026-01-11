
const SESSION_KEY = 'ivision_admin_session';
const ADMIN_PASSWORD = 'adminadmin';

/**
 * Vérifie le mot de passe pour l'accès admin.
 * Utilise une comparaison directe pour garantir que "ça entre" à tous les coups.
 */
export const login = async (password: string): Promise<boolean> => {
  // Un petit délai pour le feeling "chargement"
  await new Promise(r => setTimeout(r, 300));
  
  if (password.trim() === ADMIN_PASSWORD) {
    sessionStorage.setItem(SESSION_KEY, 'true');
    return true;
  }
  return false;
};

/**
 * Vérifie si l'utilisateur est authentifié
 */
export const isAuthenticated = (): boolean => {
  return sessionStorage.getItem(SESSION_KEY) === 'true';
};

/**
 * Déconnexion
 */
export const logout = (): void => {
  sessionStorage.removeItem(SESSION_KEY);
};
