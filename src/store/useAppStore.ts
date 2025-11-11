import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  AppState,
  AppStep,
  UserProfile,
} from '../types';
import { calculateMetabolicNeeds } from '../services/metabolicCalculations';
import { generateMealPlan } from '../services/planGenerator';

interface AppStore extends AppState {
  // Actions de navigation
  setStep: (step: AppStep) => void;
  nextStep: () => void;
  previousStep: () => void;

  // Actions de profil utilisateur
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  resetUserProfile: () => void;

  // Actions de calculs métaboliques
  calculateMetabolicResults: () => void;

  // Actions de planning
  selectPlanDuration: (duration: 1 | 7 | 31) => void;
  generatePlan: () => void;
  clearPlan: () => void;

  // Action de réinitialisation complète
  reset: () => void;
}

const STEPS_ORDER: AppStep[] = ['welcome', 'questionnaire', 'results', 'plan', 'details'];

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // État initial
      currentStep: 'welcome',
      userProfile: {
        usesWhey: true, // Par défaut, accepte la whey
        isVegetarian: false, // Par défaut, non végétarien
        allergies: [], // Par défaut, aucune allergie
      },
      metabolicResults: undefined,
      selectedPlanDuration: undefined,
      currentMealPlan: undefined,

      // Navigation
      setStep: (step) => set({ currentStep: step }),

      nextStep: () => {
        const currentIndex = STEPS_ORDER.indexOf(get().currentStep);
        if (currentIndex < STEPS_ORDER.length - 1) {
          set({ currentStep: STEPS_ORDER[currentIndex + 1] });
        }
      },

      previousStep: () => {
        const currentIndex = STEPS_ORDER.indexOf(get().currentStep);
        if (currentIndex > 0) {
          set({ currentStep: STEPS_ORDER[currentIndex - 1] });
        }
      },

      // Profil utilisateur
      updateUserProfile: (profile) =>
        set((state) => ({
          userProfile: { ...state.userProfile, ...profile },
        })),

      resetUserProfile: () => set({ userProfile: {} }),

      // Calculs métaboliques
      calculateMetabolicResults: () => {
        const profile = get().userProfile as UserProfile;
        try {
          const results = calculateMetabolicNeeds(profile);
          set({ metabolicResults: results });
        } catch (error) {
          console.error('Erreur lors du calcul des besoins métaboliques:', error);
        }
      },

      // Planning
      selectPlanDuration: (duration) =>
        set({ selectedPlanDuration: duration }),

      generatePlan: () => {
        const { userProfile, metabolicResults, selectedPlanDuration } = get();

        if (!metabolicResults || !selectedPlanDuration) {
          console.error('Données manquantes pour générer le plan');
          return;
        }

        try {
          const plan = generateMealPlan(
            userProfile as UserProfile,
            metabolicResults,
            selectedPlanDuration
          );
          set({ currentMealPlan: plan });
        } catch (error) {
          console.error('Erreur lors de la génération du plan:', error);
        }
      },

      clearPlan: () => set({ currentMealPlan: undefined, selectedPlanDuration: undefined }),

      // Réinitialisation
      reset: () =>
        set({
          currentStep: 'welcome',
          userProfile: {
            usesWhey: true,
            isVegetarian: false,
            allergies: [],
          },
          metabolicResults: undefined,
          selectedPlanDuration: undefined,
          currentMealPlan: undefined,
        }),
    }),
    {
      name: 'nutriplan-storage', // nom dans localStorage
      storage: createJSONStorage(() => localStorage),
      // Ne persister que certaines données
      partialize: (state) => ({
        userProfile: state.userProfile,
        metabolicResults: state.metabolicResults,
      }),
    }
  )
);
