
import { supabase } from './storage.ts';

const SESSION_KEY = 'ivision_admin_session';

/**
 * Vérifie le mot de passe en interrogeant la table admin_config dans Supabase.
 * On cherche une ligne où le mot de passe correspond à la saisie.
 */
export const login = async (password: string): Promise<boolean> => {
  try {
    // On tente de récupérer l'ID de la ligne si le mot de passe correspond
    const { data, error } = await supabase
      .from('admin_config')
      .select('id')
      .eq('password', password.trim())
      .maybeSingle();

    if (error) {
      console.error('Erreur lors de la vérification du mot de passe:', error);
      return false;
    }

    // Si une ligne est retournée, le mot de passe est correct
    if (data) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      return true;
    }
    
    return false;
  } catch (err) {
    console.error('Erreur technique auth:', err);
    return false;
  }
};

/**
 * Vérifie si l'utilisateur est authentifié localement (session en cours)
 */
export const isAuthenticated = (): boolean => {
  return sessionStorage.getItem(SESSION_KEY) === 'true';
};

/**
 * Déconnexion : supprime la clé de session
 */
export const logout = (): void => {
  sessionStorage.removeItem(SESSION_KEY);
};
