import { create } from 'zustand';
import type { User, Session } from '@supabase/supabase-js';
import { authService } from '../services/authService';
import { mealPlanService } from '../services/mealPlanService';
import type { MealPlan } from '../types';

interface AuthStore {
  // État d'authentification
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;

  // Meal plans de l'utilisateur
  userMealPlans: any[];
  loadingPlans: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;

  // Actions d'authentification
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;

  // Actions de meal plans
  loadUserMealPlans: () => Promise<void>;
  saveMealPlan: (mealPlan: MealPlan) => Promise<void>;
  deleteMealPlan: (planId: string) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  // État initial
  user: null,
  session: null,
  loading: true,
  initialized: false,
  userMealPlans: [],
  loadingPlans: false,

  // Setters simples
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setLoading: (loading) => set({ loading }),
  setInitialized: (initialized) => set({ initialized }),

  // Initialiser l'authentification au démarrage
  initialize: async () => {
    try {
      set({ loading: true });

      // Récupérer la session actuelle
      const session = await authService.getSession();

      if (session) {
        const user = await authService.getCurrentUser();
        set({ user, session });

        // Charger les meal plans de l'utilisateur
        await get().loadUserMealPlans();
      }

      // Écouter les changements d'authentification
      authService.onAuthStateChange(async (newSession) => {
        set({ session: newSession, user: newSession?.user || null });

        if (newSession) {
          await get().loadUserMealPlans();
        } else {
          set({ userMealPlans: [] });
        }
      });

      set({ initialized: true });
    } catch (error) {
      console.error('Erreur lors de l\'initialisation:', error);
    } finally {
      set({ loading: false });
    }
  },

  // Déconnexion
  signOut: async () => {
    try {
      await authService.signOut();
      set({
        user: null,
        session: null,
        userMealPlans: []
      });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      throw error;
    }
  },

  // Charger les meal plans de l'utilisateur
  loadUserMealPlans: async () => {
    const { user } = get();
    if (!user) return;

    try {
      set({ loadingPlans: true });
      const plans = await mealPlanService.getUserMealPlans(user.id);
      set({ userMealPlans: plans });
    } catch (error) {
      console.error('Erreur lors du chargement des plans:', error);
    } finally {
      set({ loadingPlans: false });
    }
  },

  // Sauvegarder un meal plan
  saveMealPlan: async (mealPlan: MealPlan) => {
    const { user } = get();
    if (!user) {
      throw new Error('Vous devez être connecté pour sauvegarder un plan');
    }

    try {
      await mealPlanService.saveMealPlan(user.id, mealPlan);
      // Recharger les plans
      await get().loadUserMealPlans();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du plan:', error);
      throw error;
    }
  },

  // Supprimer un meal plan
  deleteMealPlan: async (planId: string) => {
    try {
      await mealPlanService.deleteMealPlan(planId);
      // Recharger les plans
      await get().loadUserMealPlans();
    } catch (error) {
      console.error('Erreur lors de la suppression du plan:', error);
      throw error;
    }
  },
}));
