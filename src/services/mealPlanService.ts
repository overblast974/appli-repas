import { supabase } from '../lib/supabase';
import type { MealPlan } from '../types';

/**
 * Service de gestion des plans de repas dans Supabase
 */
export const mealPlanService = {
  /**
   * Sauvegarder un plan de repas
   */
  async saveMealPlan(userId: string, mealPlan: MealPlan) {
    // Calculer la date d'expiration (par exemple, 90 jours)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 90);

    const { data, error } = await supabase
      .from('meal_plans')
      .insert({
        user_id: userId,
        plan_data: mealPlan,
        duration: mealPlan.duration,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Récupérer tous les plans d'un utilisateur
   */
  async getUserMealPlans(userId: string) {
    const { data, error } = await supabase
      .from('meal_plans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Récupérer un plan spécifique
   */
  async getMealPlan(planId: string) {
    const { data, error } = await supabase
      .from('meal_plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Supprimer un plan
   */
  async deleteMealPlan(planId: string) {
    const { error } = await supabase
      .from('meal_plans')
      .delete()
      .eq('id', planId);

    if (error) throw error;
  },

  /**
   * Mettre à jour un plan
   */
  async updateMealPlan(planId: string, mealPlan: MealPlan) {
    const { data, error } = await supabase
      .from('meal_plans')
      .update({
        plan_data: mealPlan,
        duration: mealPlan.duration,
      })
      .eq('id', planId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
