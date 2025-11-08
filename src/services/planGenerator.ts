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

/**
 * Génère un planning alimentaire optimisé
 */
export function generateMealPlan(
  userProfile: UserProfile,
  metabolicResults: MetabolicResults,
  duration: 1 | 7 | 31
): MealPlan {
  const dailyPlans: DailyMealPlan[] = [];
  const startDate = new Date();

  for (let day = 0; day < duration; day++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + day);

    const dailyPlan = generateDailyPlan(
      userProfile,
      metabolicResults,
      currentDate,
      day
    );

    dailyPlans.push(dailyPlan);
  }

  return {
    id: generatePlanId(),
    userId: 'user_' + Date.now(), // À remplacer par un vrai ID utilisateur
    startDate,
    duration,
    dailyPlans,
    userProfile,
    metabolicResults,
    createdAt: new Date(),
  };
}

/**
 * Génère un plan alimentaire pour une journée
 */
function generateDailyPlan(
  userProfile: UserProfile,
  metabolicResults: MetabolicResults,
  date: Date,
  dayIndex: number
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
    // 4 repas avec collation (donc 4 items au total)
    calorieDistribution = [
      { type: 'breakfast', percentage: 0.25 },
      { type: 'lunch', percentage: 0.35 },
      { type: 'snack', percentage: 0.10 },
      { type: 'dinner', percentage: 0.30 },
    ];
  }

  // Sélectionner et ajuster les repas
  const meals = selectAndAdjustMeals(
    calorieDistribution,
    targetCalories,
    dayIndex
  );

  // Calculer la nutrition totale
  const totalNutrition = calculateTotalNutrition(meals);

  // Calculer la déviation par rapport à l'objectif
  const deviation =
    Math.abs(totalNutrition.calories - targetCalories) / targetCalories;

  return {
    date,
    meals,
    totalNutrition,
    targetCalories,
    deviation,
  };
}

/**
 * Sélectionne et ajuste les repas pour atteindre les objectifs caloriques
 */
function selectAndAdjustMeals(
  distribution: { type: MealType; percentage: number }[],
  targetCalories: number,
  dayIndex: number
): MealWithQuantity[] {
  const selectedMeals: MealWithQuantity[] = [];

  for (const { type, percentage } of distribution) {
    const targetMealCalories = targetCalories * percentage;
    const meal = selectMealForType(type, dayIndex, selectedMeals.length);

    if (meal) {
      // Calculer le multiplicateur pour ajuster les quantités
      const multiplier = targetMealCalories / meal.nutrition.calories;

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
 */
function selectMealForType(
  type: MealType,
  dayIndex: number,
  mealIndex: number
): Meal | null {
  let availableMeals: Meal[] = [];

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
    case 'snack':
      // Créer des collations simples
      availableMeals = createSimpleSnacks();
      break;
  }

  if (availableMeals.length === 0) return null;

  // Rotation des repas pour éviter les répétitions
  // Utilise dayIndex et mealIndex pour varier
  const index = (dayIndex * 3 + mealIndex) % availableMeals.length;
  return availableMeals[index];
}

/**
 * Crée des collations simples
 */
function createSimpleSnacks(): Meal[] {
  return [
    {
      id: 'snack_001',
      name: 'Pomme et amandes',
      type: 'snack',
      description: 'Une pomme moyenne et une poignée d\'amandes',
      ingredients: [
        { name: 'Pomme', quantity: 150, unit: 'g', calories: 78, protein: 0.5, carbs: 20.7, fats: 0.3 },
        { name: 'Amandes', quantity: 30, unit: 'g', calories: 174, protein: 6.3, carbs: 6, fats: 15 },
      ],
      nutrition: {
        calories: 252,
        macros: { protein: 6.8, carbs: 26.7, fats: 15.3, fiber: 6.5 },
      },
      preparationTime: 2,
      difficulty: 'easy',
    },
    {
      id: 'snack_002',
      name: 'Yaourt grec et fruits',
      type: 'snack',
      description: 'Yaourt grec nature avec fruits frais',
      ingredients: [
        { name: 'Yaourt grec 0%', quantity: 150, unit: 'g', calories: 87, protein: 15, carbs: 6, fats: 0.6 },
        { name: 'Fruits rouges', quantity: 100, unit: 'g', calories: 50, protein: 1, carbs: 10, fats: 0.3 },
      ],
      nutrition: {
        calories: 137,
        macros: { protein: 16, carbs: 16, fats: 0.9, fiber: 3 },
      },
      preparationTime: 2,
      difficulty: 'easy',
    },
    {
      id: 'snack_003',
      name: 'Banane et beurre de cacahuète',
      type: 'snack',
      description: 'Banane avec une cuillère de beurre de cacahuète',
      ingredients: [
        { name: 'Banane', quantity: 120, unit: 'g', calories: 107, protein: 1.3, carbs: 27.4, fats: 0.4 },
        { name: 'Beurre de cacahuète', quantity: 20, unit: 'g', calories: 119, protein: 5.1, carbs: 4.3, fats: 10 },
      ],
      nutrition: {
        calories: 226,
        macros: { protein: 6.4, carbs: 31.7, fats: 10.4, fiber: 4 },
      },
      preparationTime: 2,
      difficulty: 'easy',
    },
    {
      id: 'snack_004',
      name: 'Cottage cheese et concombre',
      type: 'snack',
      description: 'Fromage blanc avec bâtonnets de concombre',
      ingredients: [
        { name: 'Fromage blanc 0%', quantity: 150, unit: 'g', calories: 69, protein: 12, carbs: 7.5, fats: 0.3 },
        { name: 'Concombre', quantity: 100, unit: 'g', calories: 15, protein: 0.7, carbs: 3.6, fats: 0.1 },
      ],
      nutrition: {
        calories: 84,
        macros: { protein: 12.7, carbs: 11.1, fats: 0.4, fiber: 0.5 },
      },
      preparationTime: 2,
      difficulty: 'easy',
    },
  ];
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
