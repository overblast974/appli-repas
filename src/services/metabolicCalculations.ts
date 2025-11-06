import type {
  UserProfile,
  MetabolicResults,
  MacroNutrients,
  ActivityLevel,
  Goal,
} from '../types';

/**
 * Coefficients d'activité physique pour le calcul du TDEE
 * Basés sur les recommandations scientifiques standard
 */
const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2, // Peu ou pas d'exercice
  light: 1.375, // Exercice léger 1-3 jours/semaine
  moderate: 1.55, // Exercice modéré 3-5 jours/semaine
  active: 1.725, // Exercice intense 6-7 jours/semaine
  very_active: 1.9, // Exercice très intense, travail physique
};

/**
 * Ajustements caloriques selon l'objectif
 * Basés sur les recommandations scientifiques pour une perte/gain sain
 */
const GOAL_ADJUSTMENTS: Record<Goal, number> = {
  maintain: 1.0, // Maintien du poids
  lose_weight: 0.85, // -15% pour perte de poids progressive
  gain_muscle: 1.1, // +10% pour prise de muscle
  lose_fat_gain_muscle: 0.95, // -5% pour recomposition corporelle
  rebalance: 1.0, // Rééquilibrage sans changement calorique
};

/**
 * Formule de Mifflin-St Jeor (1990)
 * Considérée comme la plus précise pour la population générale
 *
 * Hommes: BMR = (10 × poids en kg) + (6.25 × taille en cm) - (5 × âge en années) + 5
 * Femmes: BMR = (10 × poids en kg) + (6.25 × taille en cm) - (5 × âge en années) - 161
 */
function calculateMifflinStJeor(
  weight: number,
  height: number,
  age: number,
  gender: 'male' | 'female'
): number {
  const base = 10 * weight + 6.25 * height - 5 * age;
  return gender === 'male' ? base + 5 : base - 161;
}

/*
 * Formule de Harris-Benedict révisée (1984)
 * Alternative valide, légèrement différente - gardée pour référence future
 *
 * Hommes: BMR = 88.362 + (13.397 × poids en kg) + (4.799 × taille en cm) - (5.677 × âge en années)
 * Femmes: BMR = 447.593 + (9.247 × poids en kg) + (3.098 × taille en cm) - (4.330 × âge en années)

function calculateHarrisBenedict(
  weight: number,
  height: number,
  age: number,
  gender: 'male' | 'female'
): number {
  if (gender === 'male') {
    return 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
  } else {
    return 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;
  }
}
*/

/**
 * Formule de Katch-McArdle
 * La plus précise quand le % de masse grasse est connu
 * Indépendante du genre
 *
 * BMR = 370 + (21.6 × masse maigre en kg)
 * Masse maigre = poids × (1 - % masse grasse / 100)
 */
function calculateKatchMcArdle(weight: number, bodyFatPercentage: number): number {
  const leanBodyMass = weight * (1 - bodyFatPercentage / 100);
  return 370 + 21.6 * leanBodyMass;
}

/**
 * Calcule les macronutriments recommandés selon l'objectif
 * Basé sur les recommandations scientifiques actuelles
 */
function calculateMacros(
  calories: number,
  weight: number,
  goal: Goal
): MacroNutrients {
  let proteinPerKg: number;
  let fatPercentage: number;

  switch (goal) {
    case 'lose_weight':
      proteinPerKg = 2.0; // Protéines élevées pour préserver la masse musculaire
      fatPercentage = 0.25; // 25% de lipides
      break;
    case 'gain_muscle':
      proteinPerKg = 2.2; // Protéines élevées pour la croissance musculaire
      fatPercentage = 0.25; // 25% de lipides
      break;
    case 'lose_fat_gain_muscle':
      proteinPerKg = 2.4; // Protéines très élevées pour la recomposition
      fatPercentage = 0.30; // 30% de lipides
      break;
    case 'rebalance':
    case 'maintain':
    default:
      proteinPerKg = 1.6; // Protéines modérées
      fatPercentage = 0.30; // 30% de lipides
      break;
  }

  const protein = Math.round(weight * proteinPerKg);
  const proteinCalories = protein * 4; // 4 kcal/g

  const fats = Math.round((calories * fatPercentage) / 9); // 9 kcal/g
  const fatCalories = fats * 9;

  const remainingCalories = calories - proteinCalories - fatCalories;
  const carbs = Math.round(remainingCalories / 4); // 4 kcal/g

  const fiber = Math.round(calories / 1000 * 14); // 14g de fibres pour 1000 kcal (recommandation)

  return {
    protein,
    carbs,
    fats,
    fiber,
  };
}

/**
 * Fonction principale de calcul des besoins métaboliques
 * Utilise la formule la plus appropriée selon les données disponibles
 */
export function calculateMetabolicNeeds(profile: UserProfile): MetabolicResults {
  let bmr: number;
  let method: 'mifflin-st-jeor' | 'harris-benedict' | 'katch-mcardle';

  // Choisir la meilleure formule selon les données disponibles
  if (profile.bodyFat && profile.bodyFat > 0 && profile.bodyFat < 50) {
    // Si le % de masse grasse est connu, utiliser Katch-McArdle (plus précis)
    bmr = calculateKatchMcArdle(profile.weight, profile.bodyFat);
    method = 'katch-mcardle';
  } else {
    // Sinon, utiliser Mifflin-St Jeor (standard actuel)
    bmr = calculateMifflinStJeor(
      profile.weight,
      profile.height,
      profile.age,
      profile.gender
    );
    method = 'mifflin-st-jeor';
  }

  // Calculer le TDEE (Total Daily Energy Expenditure)
  const activityMultiplier = ACTIVITY_MULTIPLIERS[profile.activityLevel];
  const tdee = Math.round(bmr * activityMultiplier);

  // Ajuster selon l'objectif
  const goalAdjustment = GOAL_ADJUSTMENTS[profile.goal];
  const adjustedCalories = Math.round(tdee * goalAdjustment);

  // Calculer les macronutriments
  const macros = calculateMacros(adjustedCalories, profile.weight, profile.goal);

  return {
    bmr: Math.round(bmr),
    tdee,
    adjustedCalories,
    macros,
    method,
  };
}

/**
 * Fonction utilitaire pour estimer le % de masse grasse si non fourni
 * Basée sur des moyennes statistiques (moins précis que des mesures réelles)
 */
export function estimateBodyFat(
  age: number,
  gender: 'male' | 'female',
  bmi: number
): number {
  // Formule de Deurenberg et al. (1991)
  const genderFactor = gender === 'male' ? 1 : 0;
  return 1.2 * bmi + 0.23 * age - 10.8 * genderFactor - 5.4;
}

/**
 * Calcule l'IMC (Indice de Masse Corporelle)
 */
export function calculateBMI(weight: number, height: number): number {
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
}

/**
 * Valide les données du profil utilisateur
 */
export function validateUserProfile(profile: Partial<UserProfile>): string[] {
  const errors: string[] = [];

  if (!profile.age || profile.age < 16 || profile.age > 100) {
    errors.push('L\'âge doit être entre 16 et 100 ans');
  }

  if (!profile.weight || profile.weight < 30 || profile.weight > 300) {
    errors.push('Le poids doit être entre 30 et 300 kg');
  }

  if (!profile.height || profile.height < 120 || profile.height > 250) {
    errors.push('La taille doit être entre 120 et 250 cm');
  }

  if (profile.bodyFat && (profile.bodyFat < 3 || profile.bodyFat > 60)) {
    errors.push('Le pourcentage de masse grasse doit être entre 3% et 60%');
  }

  if (!profile.gender) {
    errors.push('Le genre doit être spécifié');
  }

  if (!profile.activityLevel) {
    errors.push('Le niveau d\'activité doit être spécifié');
  }

  if (!profile.goal) {
    errors.push('L\'objectif doit être spécifié');
  }

  return errors;
}
