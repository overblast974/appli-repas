// Types pour le questionnaire utilisateur
export type Gender = 'male' | 'female';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type Goal = 'maintain' | 'lose_weight' | 'gain_muscle' | 'lose_fat_gain_muscle' | 'rebalance';

export interface UserProfile {
  // Données anthropométriques
  age: number;
  gender: Gender;
  weight: number; // kg
  height: number; // cm
  bodyFat?: number; // % (optionnel pour Katch-McArdle)

  // Habitudes de vie
  activityLevel: ActivityLevel;
  exerciseFrequency: number; // jours par semaine
  sleepHours: number;

  // Objectifs
  goal: Goal;
  targetWeight?: number; // kg (optionnel)
  timeframe?: number; // semaines (optionnel)

  // Préférences alimentaires
  mealsPerDay: 3 | 4;
  includeSnacks: boolean;
  usesWhey: boolean; // Utilise ou accepte les protéines whey
  isVegetarian: boolean; // Préfère des repas végétariens

  // Allergies et restrictions alimentaires
  allergies: string[]; // Liste des allergènes à éviter
  dietaryRestrictions?: string[];
}

// Types pour les calculs métaboliques
export interface MetabolicResults {
  bmr: number; // Métabolisme de base (kcal/jour)
  tdee: number; // Dépense énergétique totale (kcal/jour)
  adjustedCalories: number; // Calories ajustées selon l'objectif (kcal/jour)
  macros: MacroNutrients;
  method: 'mifflin-st-jeor' | 'harris-benedict' | 'katch-mcardle';
}

export interface MacroNutrients {
  protein: number; // grammes
  carbs: number; // grammes
  fats: number; // grammes
  fiber: number; // grammes
}

export interface MicroNutrients {
  vitaminA?: number; // µg
  vitaminB6?: number; // mg
  vitaminB12?: number; // µg
  vitaminC?: number; // mg
  vitaminD?: number; // µg
  vitaminE?: number; // mg
  calcium?: number; // mg
  iron?: number; // mg
  magnesium?: number; // mg
  potassium?: number; // mg
  sodium?: number; // mg
  zinc?: number; // mg
  omega3?: number; // mg
  selenium?: number; // µg
  folate?: number; // µg
  lycopene?: number; // mg
}

// Types pour les repas
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface Meal {
  id: string;
  name: string;
  type: MealType;
  description: string;
  ingredients: Ingredient[];
  nutrition: NutritionInfo;
  preparationTime: number; // minutes
  difficulty: 'easy' | 'medium' | 'hard';
  imageUrl?: string;
  allergens?: string[]; // Liste des allergènes présents dans le repas
  shopping_list?: string[]; // Liste de courses pour le repas
  preparation_steps?: string[]; // Étapes de préparation simplifiées
  isVegetarian?: boolean; // Indique si le plat est végétarien
}

export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface NutritionInfo {
  calories: number;
  macros: MacroNutrients;
  micros?: MicroNutrients;
}

// Types pour le planning
export interface DailyMealPlan {
  date: Date;
  meals: MealWithQuantity[];
  totalNutrition: NutritionInfo;
  targetCalories: number;
  deviation: number; // % de déviation par rapport à l'objectif
}

export interface MealWithQuantity extends Meal {
  multiplier: number; // Facteur multiplicateur pour ajuster les quantités nutritionnelles
  servings?: number; // Nombre de portions/personnes (par défaut 1) - Feature premium
}

export interface MealPlan {
  id: string;
  userId: string;
  startDate: Date;
  duration: 1 | 7 | 31; // jours
  dailyPlans: DailyMealPlan[];
  userProfile: UserProfile;
  metabolicResults: MetabolicResults;
  createdAt: Date;
}

// Types pour la navigation
export type AppStep = 'welcome' | 'questionnaire' | 'results' | 'plan' | 'details' | 'history';

export interface AppState {
  currentStep: AppStep;
  userProfile: Partial<UserProfile>;
  metabolicResults?: MetabolicResults;
  selectedPlanDuration?: 1 | 7 | 31;
  currentMealPlan?: MealPlan;
}
