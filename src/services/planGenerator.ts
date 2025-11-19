import type {
  Meal,
  MealPlan,
  DailyMealPlan,
  MealWithQuantity,
  MetabolicResults,
  UserProfile,
  MealType,
} from '../types';
import { MEAL_DATABASE } from './mealDatabase';

const MAX_DEVIATION = 0.05; // 5% de marge d'erreur maximum
const MIN_MULTIPLIER = 0.5; // Multiplicateur minimum pour les portions (50%)
const MAX_MULTIPLIER = 2.0; // Multiplicateur maximum pour les portions (200%)
const MAX_ATTEMPTS = 50; // Nombre maximum de tentatives pour trouver une combinaison valide

/**
 * Calcule les quantités ajustées d'un ingrédient selon le nombre de portions
 * @param ingredient - L'ingrédient à ajuster
 * @param servings - Nombre de portions (par défaut 1)
 * @returns L'ingrédient avec quantités ajustées
 */
export function getAdjustedIngredient(
  ingredient: { name: string; quantity: number; unit: string; calories: number; protein: number; carbs: number; fats: number },
  servings: number = 1
) {
  return {
    ...ingredient,
    quantity: Math.round(ingredient.quantity * servings * 10) / 10, // Arrondi à 1 décimale
    calories: Math.round(ingredient.calories * servings),
    protein: Math.round(ingredient.protein * servings * 10) / 10,
    carbs: Math.round(ingredient.carbs * servings * 10) / 10,
    fats: Math.round(ingredient.fats * servings * 10) / 10,
  };
}

/**
 * Calcule la nutrition ajustée selon le nombre de portions
 * @param nutrition - Info nutritionnelle de base
 * @param servings - Nombre de portions (par défaut 1)
 * @returns Nutrition ajustée
 */
export function getAdjustedNutrition(
  nutrition: { calories: number; macros: { protein: number; carbs: number; fats: number; fiber: number } },
  servings: number = 1
) {
  return {
    calories: Math.round(nutrition.calories * servings),
    macros: {
      protein: Math.round(nutrition.macros.protein * servings * 10) / 10,
      carbs: Math.round(nutrition.macros.carbs * servings * 10) / 10,
      fats: Math.round(nutrition.macros.fats * servings * 10) / 10,
      fiber: Math.round(nutrition.macros.fiber * servings * 10) / 10,
    },
  };
}

/**
 * Détecte automatiquement les allergènes dans un repas basé sur les ingrédients
 */
function detectAllergens(meal: Meal): string[] {
  const allergens: string[] = [];
  const ingredientsText = meal.ingredients
    .map(ing => ing.name.toLowerCase())
    .join(' ');

  // Détection des allergènes courants
  if (ingredientsText.includes('lait') || ingredientsText.includes('fromage') ||
      ingredientsText.includes('yaourt') || ingredientsText.includes('whey') ||
      ingredientsText.includes('crème') || ingredientsText.includes('beurre')) {
    allergens.push('Lactose');
  }

  if (ingredientsText.includes('farine') || ingredientsText.includes('pain') ||
      ingredientsText.includes('pâtes') || ingredientsText.includes('blé')) {
    allergens.push('Gluten');
  }

  if (ingredientsText.includes('amande') || ingredientsText.includes('noix') ||
      ingredientsText.includes('noisette') || ingredientsText.includes('cajou') ||
      ingredientsText.includes('pistache')) {
    allergens.push('Fruits à coque');
  }

  if (ingredientsText.includes('arachide') || ingredientsText.includes('cacahuète')) {
    allergens.push('Arachides');
  }

  if (ingredientsText.includes('œuf') || ingredientsText.includes('oeuf')) {
    allergens.push('Œufs');
  }

  if (ingredientsText.includes('poisson') || ingredientsText.includes('saumon') ||
      ingredientsText.includes('thon') || ingredientsText.includes('cabillaud')) {
    allergens.push('Poisson');
  }

  if (ingredientsText.includes('crevette') || ingredientsText.includes('crabe') ||
      ingredientsText.includes('homard') || ingredientsText.includes('crustacé')) {
    allergens.push('Crustacés');
  }

  if (ingredientsText.includes('soja') || ingredientsText.includes('tofu') ||
      ingredientsText.includes('tempeh')) {
    allergens.push('Soja');
  }

  if (ingredientsText.includes('sésame')) {
    allergens.push('Sésame');
  }

  return allergens;
}

/**
 * Vérifie si un repas est compatible avec les allergies de l'utilisateur
 */
function isMealCompatible(meal: Meal, userAllergies: string[]): boolean {
  if (!userAllergies || userAllergies.length === 0) {
    return true; // Pas d'allergies, tous les repas sont compatibles
  }

  // Détecter les allergènes dans le repas
  const mealAllergens = meal.allergens || detectAllergens(meal);

  // Vérifier s'il y a une correspondance avec les allergies de l'utilisateur
  return !mealAllergens.some(allergen =>
    userAllergies.some(userAllergen =>
      allergen.toLowerCase() === userAllergen.toLowerCase()
    )
  );
}

/**
 * Génère un planning alimentaire optimisé
 *
 * Règles:
 * - 1 repas maximum 1x/semaine (pour éviter la monotonie)
 * - Respect des macros avec ±5% de marge
 * - Filtrage selon allergies et préférences
 */
export function generateMealPlan(
  userProfile: UserProfile,
  metabolicResults: MetabolicResults,
  duration: 1 | 7 | 31
): MealPlan {
  const dailyPlans: DailyMealPlan[] = [];
  const startDate = new Date();
  const usedMealIds = new Set<string>(); // Suivre les repas utilisés dans la semaine

  for (let day = 0; day < duration; day++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + day);

    // Réinitialiser les repas utilisés chaque semaine (7 jours)
    if (day > 0 && day % 7 === 0) {
      usedMealIds.clear();
    }

    const dailyPlan = generateDailyPlan(
      userProfile,
      metabolicResults,
      currentDate,
      day,
      usedMealIds
    );

    dailyPlans.push(dailyPlan);
  }

  // Générer le plan final
  const plan: MealPlan = {
    id: generatePlanId(),
    userId: 'user_' + Date.now(),
    startDate,
    duration,
    dailyPlans,
    userProfile,
    metabolicResults,
    createdAt: new Date(),
  };

  // Vérifier la qualité du plan
  const quality = evaluatePlanQuality(plan);

  if (quality.score < 80) {
    console.warn('Plan de qualité moyenne:', quality);
  }

  return plan;
}

/**
 * Calcule un score de qualité pour une combinaison de macros
 * Plus le score est bas, meilleure est la combinaison
 */
function calculateMacroScore(
  actualMacros: { protein: number; carbs: number; fats: number },
  targetMacros: { protein: number; carbs: number; fats: number }
): number {
  const proteinDeviation = Math.abs(actualMacros.protein - targetMacros.protein) / targetMacros.protein;
  const carbsDeviation = Math.abs(actualMacros.carbs - targetMacros.carbs) / targetMacros.carbs;
  const fatsDeviation = Math.abs(actualMacros.fats - targetMacros.fats) / targetMacros.fats;

  // Score = somme pondérée des déviations (plus c'est bas, mieux c'est)
  return proteinDeviation * 2 + carbsDeviation + fatsDeviation; // Protéines x2 car prioritaires
}

/**
 * Génère un plan alimentaire pour une journée
 * Utilise un système de réessais pour garantir les macros dans la marge de 5%
 */
function generateDailyPlan(
  userProfile: UserProfile,
  metabolicResults: MetabolicResults,
  date: Date,
  dayIndex: number,
  usedMealIds: Set<string>
): DailyMealPlan {
  const targetCalories = metabolicResults.adjustedCalories;
  const { mealsPerDay, includeSnacks } = userProfile;

  // Répartition calorique par repas (en pourcentage)
  // RÈGLE: Toujours avoir au minimum 1 breakfast, 1 lunch, 1 dinner
  let calorieDistribution: { type: MealType; percentage: number }[];

  if (mealsPerDay === 3 && !includeSnacks) {
    // 3 repas classiques: petit-déjeuner, déjeuner, dîner
    calorieDistribution = [
      { type: 'breakfast', percentage: 0.30 },
      { type: 'lunch', percentage: 0.40 },
      { type: 'dinner', percentage: 0.30 },
    ];
  } else if (mealsPerDay === 3 && includeSnacks) {
    // 3 repas + 1 collation (donc 4 items au total)
    calorieDistribution = [
      { type: 'breakfast', percentage: 0.25 },
      { type: 'lunch', percentage: 0.35 },
      { type: 'snack', percentage: 0.10 },
      { type: 'dinner', percentage: 0.30 },
    ];
  } else if (mealsPerDay === 4 && !includeSnacks) {
    // 4 repas sans collation: on double le déjeuner (repas le plus important)
    calorieDistribution = [
      { type: 'breakfast', percentage: 0.25 },
      { type: 'lunch', percentage: 0.30 },
      { type: 'lunch', percentage: 0.15 }, // Second déjeuner/en-cas principal
      { type: 'dinner', percentage: 0.30 },
    ];
  } else {
    // 4 repas avec collation (donc 5 items au total) - CORRIGÉ
    calorieDistribution = [
      { type: 'breakfast', percentage: 0.20 },
      { type: 'lunch', percentage: 0.30 },
      { type: 'snack', percentage: 0.10 },
      { type: 'dinner', percentage: 0.25 },
      { type: 'snack', percentage: 0.15 }, // Collation du soir
    ];
  }

  // Essayer plusieurs combinaisons jusqu'à trouver une valide
  let bestMeals: MealWithQuantity[] | null = null;
  let bestScore = Infinity;
  let bestMacroValidation: { isValid: boolean; deviations: any } | null = null;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    // CORRECTION: Réinitialiser la copie temporaire à chaque tentative
    const tempUsedMealIds = new Set(usedMealIds);

    // Sélectionner et ajuster les repas
    const meals = selectAndAdjustMeals(
      calorieDistribution,
      targetCalories,
      metabolicResults.macros,
      dayIndex,
      userProfile,
      tempUsedMealIds,
      attempt
    );

    // Calculer la nutrition totale
    const totalNutrition = calculateTotalNutrition(meals);

    // Valider les macros
    const macroValidation = validateMacroTargets(
      totalNutrition.macros,
      metabolicResults.macros
    );

    // Calculer le score de cette combinaison
    const score = calculateMacroScore(totalNutrition.macros, metabolicResults.macros);

    // Si cette combinaison est meilleure, la garder
    if (score < bestScore) {
      bestScore = score;
      bestMeals = meals;
      bestMacroValidation = macroValidation;

      // Si les macros sont dans la marge de 5%, on arrête les tentatives
      if (macroValidation.isValid) {
        break;
      }
    }
  }

  // Utiliser la meilleure combinaison trouvée
  const meals = bestMeals!;
  const totalNutrition = calculateTotalNutrition(meals);
  const macroValidation = bestMacroValidation!;

  // CORRECTION: Toujours marquer les repas comme utilisés (même si pas parfait)
  meals.forEach(meal => usedMealIds.add(meal.id));

  // Calculer la déviation par rapport à l'objectif calorique
  const deviation =
    Math.abs(totalNutrition.calories - targetCalories) / targetCalories;

  // Afficher un avertissement si les macros ne respectent pas les cibles
  if (!macroValidation.isValid) {
    console.warn(
      `Jour ${dayIndex + 1}: Macros hors cible (±5%) après ${MAX_ATTEMPTS} tentatives`,
      `Protéines: ${(macroValidation.deviations.protein * 100).toFixed(1)}%`,
      `Glucides: ${(macroValidation.deviations.carbs * 100).toFixed(1)}%`,
      `Lipides: ${(macroValidation.deviations.fats * 100).toFixed(1)}%`
    );
  }

  return {
    date,
    meals,
    totalNutrition,
    targetCalories,
    deviation,
  };
}

/**
 * Sélectionne et ajuste les repas pour atteindre les objectifs caloriques et macros
 * @param attempt - Numéro de tentative pour introduire de la variabilité
 */
function selectAndAdjustMeals(
  distribution: { type: MealType; percentage: number }[],
  targetCalories: number,
  targetMacros: { protein: number; carbs: number; fats: number },
  dayIndex: number,
  userProfile: UserProfile,
  usedMealIds: Set<string>,
  attempt: number = 0
): MealWithQuantity[] {
  const selectedMeals: MealWithQuantity[] = [];

  // Calculer les macros cibles par repas (proportionnellement aux calories)
  for (const { type, percentage } of distribution) {
    const targetMealCalories = targetCalories * percentage;
    const targetMealProtein = targetMacros.protein * percentage;
    const targetMealCarbs = targetMacros.carbs * percentage;
    const targetMealFats = targetMacros.fats * percentage;

    const meal = selectMealForType(
      type,
      dayIndex,
      selectedMeals.length,
      userProfile,
      usedMealIds,
      attempt
    );

    if (meal) {
      // NE PAS marquer comme utilisé ici - sera fait dans generateDailyPlan si la combinaison est retenue

      // Calculer le multiplicateur optimal en tenant compte des macros ET des calories
      // On privilégie l'équilibre des macros en calculant plusieurs multiplicateurs possibles
      const calorieMultiplier = targetMealCalories / meal.nutrition.calories;
      const proteinMultiplier = targetMealProtein / meal.nutrition.macros.protein;
      const carbsMultiplier = targetMealCarbs / meal.nutrition.macros.carbs;
      const fatsMultiplier = targetMealFats / meal.nutrition.macros.fats;

      // Utiliser une moyenne pondérée des multiplicateurs
      // Protéines x3 car prioritaires, calories x2, carbs et fats x1
      let multiplier =
        (proteinMultiplier * 3 + calorieMultiplier * 2 + carbsMultiplier + fatsMultiplier) / 7;

      // Ajouter une petite variation aléatoire pour explorer différentes solutions
      if (attempt > 0) {
        const variation = 0.95 + Math.random() * 0.1; // variation de -5% à +5%
        multiplier *= variation;
      }

      // Appliquer les limites min/max pour éviter des portions irréalistes
      multiplier = Math.max(MIN_MULTIPLIER, Math.min(MAX_MULTIPLIER, multiplier));

      const mealWithQuantity: MealWithQuantity = {
        ...meal,
        multiplier,
        nutrition: {
          calories: meal.nutrition.calories * multiplier,
          macros: {
            protein: meal.nutrition.macros.protein * multiplier,
            carbs: meal.nutrition.macros.carbs * multiplier,
            fats: meal.nutrition.macros.fats * multiplier,
            fiber: meal.nutrition.macros.fiber * multiplier,
          },
          micros: meal.nutrition.micros,
        },
        ingredients: meal.ingredients.map((ing) => ({
          ...ing,
          quantity: ing.quantity * multiplier,
          calories: ing.calories * multiplier,
          protein: ing.protein * multiplier,
          carbs: ing.carbs * multiplier,
          fats: ing.fats * multiplier,
        })),
      };

      selectedMeals.push(mealWithQuantity);
    }
  }

  return selectedMeals;
}

/**
 * Sélectionne un repas pour un type donné avec rotation
 * S'assure qu'on a toujours des repas différents et appropriés
 *
 * RÈGLE: 1 repas maximum 1x/semaine (pour éviter la monotonie)
 * @param attempt - Numéro de tentative pour sélectionner des repas différents
 */
function selectMealForType(
  type: MealType,
  _dayIndex: number,
  _mealIndex: number,
  userProfile: UserProfile,
  usedMealIds: Set<string>,
  attempt: number = 0
): Meal | null {
  let availableMeals: Meal[] = [];

  switch (type) {
    case 'breakfast':
      availableMeals = [...MEAL_DATABASE.breakfasts];
      break;
    case 'lunch':
      availableMeals = [...MEAL_DATABASE.lunches];
      break;
    case 'dinner':
      availableMeals = [...MEAL_DATABASE.dinners];
      break;
    case 'snack':
      // Utiliser toutes les collations de la base de données
      availableMeals = [...MEAL_DATABASE.snacks];
      break;
  }

  if (availableMeals.length === 0) return null;

  // Filtrer selon les allergies de l'utilisateur
  const userAllergies = userProfile.allergies || [];
  availableMeals = availableMeals.filter(meal => isMealCompatible(meal, userAllergies));

  // Filtrer les repas contenant de la whey si l'utilisateur n'en veut pas
  if (!userProfile.usesWhey) {
    availableMeals = availableMeals.filter(meal => {
      const ingredientsText = meal.ingredients
        .map(ing => ing.name.toLowerCase())
        .join(' ');
      return !ingredientsText.includes('whey') && !ingredientsText.includes('protéines en poudre');
    });
  }

  // Filtrer selon la préférence végétarienne
  if (userProfile.isVegetarian) {
    availableMeals = availableMeals.filter(meal => meal.isVegetarian === true);
  }

  // Filtrer les repas déjà utilisés dans la semaine (sauf pour snacks)
  if (type !== 'snack') {
    availableMeals = availableMeals.filter(meal => !usedMealIds.has(meal.id));
  }

  if (availableMeals.length === 0) {
    console.warn(`Aucun repas disponible pour le type ${type} après tous les filtrages`);
    // Si plus de repas disponibles, réinitialiser et utiliser n'importe quel repas valide
    availableMeals = [];
    switch (type) {
      case 'breakfast':
        availableMeals = MEAL_DATABASE.breakfasts;
        break;
      case 'lunch':
        availableMeals = MEAL_DATABASE.lunches;
        break;
      case 'dinner':
        availableMeals = MEAL_DATABASE.dinners;
        break;
    }
    // Appliquer les filtres essentiels (allergies et végétarien) même en fallback
    availableMeals = availableMeals.filter(meal => isMealCompatible(meal, userAllergies));
    if (userProfile.isVegetarian) {
      availableMeals = availableMeals.filter(meal => meal.isVegetarian === true);
    }
    if (availableMeals.length === 0) return null;
  }

  // Mélanger les repas disponibles pour plus de variété
  // Utiliser attempt comme seed pour obtenir des combinaisons différentes à chaque tentative
  const shuffled = [...availableMeals].sort(() => Math.random() - 0.5);

  // Sélectionner un repas aléatoire parmi les X premiers (X augmente avec attempt)
  // Pour attempt=0, on prend le premier. Pour attempt>0, on explore plus de possibilités
  const poolSize = Math.min(shuffled.length, Math.max(1, Math.floor(attempt / 5) + 1));
  const randomIndex = Math.floor(Math.random() * poolSize);

  return shuffled[randomIndex];
}


/**
 * Vérifie si les macros du jour respectent les cibles avec ±5% de marge
 */
function validateMacroTargets(
  actualMacros: { protein: number; carbs: number; fats: number },
  targetMacros: { protein: number; carbs: number; fats: number }
): { isValid: boolean; deviations: { protein: number; carbs: number; fats: number } } {
  const proteinDeviation = Math.abs(actualMacros.protein - targetMacros.protein) / targetMacros.protein;
  const carbsDeviation = Math.abs(actualMacros.carbs - targetMacros.carbs) / targetMacros.carbs;
  const fatsDeviation = Math.abs(actualMacros.fats - targetMacros.fats) / targetMacros.fats;

  const isValid =
    proteinDeviation <= MAX_DEVIATION &&
    carbsDeviation <= MAX_DEVIATION &&
    fatsDeviation <= MAX_DEVIATION;

  return {
    isValid,
    deviations: {
      protein: proteinDeviation,
      carbs: carbsDeviation,
      fats: fatsDeviation,
    },
  };
}

/**
 * Calcule la nutrition totale d'une journée
 */
function calculateTotalNutrition(meals: MealWithQuantity[]) {
  return meals.reduce(
    (total, meal) => ({
      calories: total.calories + meal.nutrition.calories,
      macros: {
        protein: total.macros.protein + meal.nutrition.macros.protein,
        carbs: total.macros.carbs + meal.nutrition.macros.carbs,
        fats: total.macros.fats + meal.nutrition.macros.fats,
        fiber: total.macros.fiber + meal.nutrition.macros.fiber,
      },
    }),
    {
      calories: 0,
      macros: { protein: 0, carbs: 0, fats: 0, fiber: 0 },
    }
  );
}

/**
 * Génère un ID unique pour le plan
 */
function generatePlanId(): string {
  return 'plan_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Évalue la qualité d'un plan alimentaire
 */
export function evaluatePlanQuality(plan: MealPlan): {
  score: number;
  issues: string[];
} {
  const issues: string[] = [];
  let score = 100;

  plan.dailyPlans.forEach((day, index) => {
    // Vérifier la déviation calorique
    if (day.deviation > MAX_DEVIATION) {
      issues.push(
        `Jour ${index + 1}: Déviation calorique de ${(day.deviation * 100).toFixed(1)}% (max: ${MAX_DEVIATION * 100}%)`
      );
      score -= 10;
    }

    // Vérifier l'équilibre des macros
    const { protein, carbs, fats } = day.totalNutrition.macros;
    const totalMacroCalories = protein * 4 + carbs * 4 + fats * 9;

    const proteinPercent = (protein * 4) / totalMacroCalories;
    const fatsPercent = (fats * 9) / totalMacroCalories;

    // Protéines : 15-35%
    if (proteinPercent < 0.15 || proteinPercent > 0.35) {
      issues.push(`Jour ${index + 1}: Déséquilibre protéines`);
      score -= 5;
    }

    // Lipides : 20-35%
    if (fatsPercent < 0.20 || fatsPercent > 0.35) {
      issues.push(`Jour ${index + 1}: Déséquilibre lipides`);
      score -= 5;
    }
  });

  return { score: Math.max(0, score), issues };
}
