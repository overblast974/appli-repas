import { supabase } from '../lib/supabase';
import type { User, AuthError, Session } from '@supabase/supabase-js';

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: AuthError | null;
}

/**
 * Service d'authentification utilisant Supabase
 */
export const authService = {
  /**
   * Inscription d'un nouvel utilisateur
   */
  async signUp(email: string, password: string, fullName?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) throw error;

    // Créer le profil utilisateur
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email: data.user.email!,
          full_name: fullName || null,
        });

      if (profileError) {
        console.error('Erreur lors de la création du profil:', profileError);
      }
    }

    return data;
  },

  /**
   * Connexion d'un utilisateur existant
   */
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  /**
   * Déconnexion
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Réinitialisation du mot de passe
   */
  async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;
    return data;
  },

  /**
   * Mise à jour du mot de passe
   */
  async updatePassword(newPassword: string) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
    return data;
  },

  /**
   * Récupérer la session actuelle
   */
  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.warn('Erreur lors de la récupération de la session:', error);
        return null;
      }
      return data.session;
    } catch (error) {
      // Gestion des erreurs CORS ou réseau
      console.warn('Impossible de se connecter à Supabase:', error);
      return null;
    }
  },

  /**
   * Récupérer l'utilisateur actuel
   */
  async getCurrentUser() {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.warn('Erreur lors de la récupération de l\'utilisateur:', error);
        return null;
      }
      return data.user;
    } catch (error) {
      // Gestion des erreurs CORS ou réseau
      console.warn('Impossible de se connecter à Supabase:', error);
      return null;
    }
  },

  /**
   * Écouter les changements d'état d'authentification
   */
  onAuthStateChange(callback: (session: Session | null) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(session);
    });
  },
};
