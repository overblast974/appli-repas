import type { Meal, MealType } from '../types';

/**
 * Base de données des repas prédéfinis
 * Valeurs nutritionnelles calculées pour des portions standards
 * Source: Tables CIQUAL (ANSES) et bases de données nutritionnelles
 */

// ============================================
// PETITS DÉJEUNERS (10 options)
// ============================================
const BREAKFASTS: Meal[] = [
  {
    id: 'bf_001',
    name: 'Porridge protéiné aux fruits rouges',
    type: 'breakfast',
    description: 'Flocons d\'avoine, protéines en poudre, fruits rouges, graines de chia',
    ingredients: [
      { name: 'Flocons d\'avoine', quantity: 60, unit: 'g', calories: 228, protein: 7.8, carbs: 38.4, fats: 4.2 },
      { name: 'Protéines whey', quantity: 30, unit: 'g', calories: 120, protein: 24, carbs: 3, fats: 1.5 },
      { name: 'Fruits rouges', quantity: 100, unit: 'g', calories: 50, protein: 1, carbs: 10, fats: 0.3 },
      { name: 'Graines de chia', quantity: 15, unit: 'g', calories: 73, protein: 2.5, carbs: 6.3, fats: 4.6 },
    ],
    nutrition: {
      calories: 471,
      macros: { protein: 35.3, carbs: 57.7, fats: 10.6, fiber: 12.5 },
      micros: { vitaminC: 50, calcium: 180, iron: 4.2, magnesium: 150 },
    },
    preparationTime: 10,
    difficulty: 'easy',
  },
  {
    id: 'bf_002',
    name: 'Omelette complète aux légumes',
    type: 'breakfast',
    description: 'Œufs, épinards, tomates, fromage, pain complet',
    ingredients: [
      { name: 'Œufs entiers', quantity: 3, unit: 'pièces', calories: 210, protein: 18.9, carbs: 1.2, fats: 15 },
      { name: 'Épinards frais', quantity: 80, unit: 'g', calories: 18, protein: 2.3, carbs: 1.4, fats: 0.3 },
      { name: 'Tomates cerises', quantity: 100, unit: 'g', calories: 18, protein: 0.9, carbs: 2.8, fats: 0.2 },
      { name: 'Fromage râpé', quantity: 30, unit: 'g', calories: 120, protein: 7.5, carbs: 0.3, fats: 10 },
      { name: 'Pain complet', quantity: 50, unit: 'g', calories: 120, protein: 4.5, carbs: 22, fats: 1.5 },
    ],
    nutrition: {
      calories: 486,
      macros: { protein: 34.1, carbs: 27.7, fats: 27, fiber: 5.2 },
      micros: { vitaminA: 450, vitaminC: 30, calcium: 350, iron: 4.5 },
    },
    preparationTime: 15,
    difficulty: 'easy',
  },
  {
    id: 'bf_003',
    name: 'Pancakes protéinés à la banane',
    type: 'breakfast',
    description: 'Banane, œufs, farine complète, sirop d\'érable',
    ingredients: [
      { name: 'Banane', quantity: 100, unit: 'g', calories: 89, protein: 1.1, carbs: 22.8, fats: 0.3 },
      { name: 'Œufs entiers', quantity: 2, unit: 'pièces', calories: 140, protein: 12.6, carbs: 0.8, fats: 10 },
      { name: 'Farine complète', quantity: 40, unit: 'g', calories: 136, protein: 5.2, carbs: 27.2, fats: 0.8 },
      { name: 'Sirop d\'érable', quantity: 20, unit: 'ml', calories: 52, protein: 0, carbs: 13.4, fats: 0 },
      { name: 'Beurre de cacahuète', quantity: 15, unit: 'g', calories: 89, protein: 3.8, carbs: 3.2, fats: 7.5 },
    ],
    nutrition: {
      calories: 506,
      macros: { protein: 22.7, carbs: 67.4, fats: 18.6, fiber: 6.8 },
      micros: { vitaminB6: 0.4, potassium: 422, magnesium: 75 },
    },
    preparationTime: 20,
    difficulty: 'medium',
  },
  {
    id: 'bf_004',
    name: 'Bowl yaourt grec et granola maison',
    type: 'breakfast',
    description: 'Yaourt grec, granola, miel, fruits frais, noix',
    ingredients: [
      { name: 'Yaourt grec 0%', quantity: 200, unit: 'g', calories: 116, protein: 20, carbs: 8, fats: 0.8 },
      { name: 'Granola', quantity: 50, unit: 'g', calories: 215, protein: 5.5, carbs: 35, fats: 6 },
      { name: 'Miel', quantity: 15, unit: 'g', calories: 46, protein: 0.1, carbs: 12.4, fats: 0 },
      { name: 'Fruits frais mélangés', quantity: 100, unit: 'g', calories: 55, protein: 0.8, carbs: 13, fats: 0.3 },
      { name: 'Amandes', quantity: 20, unit: 'g', calories: 116, protein: 4.2, carbs: 4, fats: 10 },
    ],
    nutrition: {
      calories: 548,
      macros: { protein: 30.6, carbs: 72.4, fats: 17.1, fiber: 7.5 },
      micros: { calcium: 280, vitaminE: 5.2, magnesium: 90 },
    },
    preparationTime: 5,
    difficulty: 'easy',
  },
  {
    id: 'bf_005',
    name: 'Toast avocat saumon fumé',
    type: 'breakfast',
    description: 'Pain complet, avocat, saumon fumé, œuf poché, graines de sésame',
    ingredients: [
      { name: 'Pain complet', quantity: 70, unit: 'g', calories: 168, protein: 6.3, carbs: 30.8, fats: 2.1 },
      { name: 'Avocat', quantity: 80, unit: 'g', calories: 128, protein: 1.6, carbs: 6.9, fats: 11.7 },
      { name: 'Saumon fumé', quantity: 50, unit: 'g', calories: 90, protein: 11, carbs: 0, fats: 5 },
      { name: 'Œuf poché', quantity: 1, unit: 'pièce', calories: 70, protein: 6.3, carbs: 0.4, fats: 5 },
      { name: 'Graines de sésame', quantity: 10, unit: 'g', calories: 57, protein: 1.8, carbs: 2.3, fats: 5 },
    ],
    nutrition: {
      calories: 513,
      macros: { protein: 27, carbs: 40.4, fats: 28.8, fiber: 10.2 },
      micros: { omega3: 1200, vitaminD: 8, calcium: 120 },
    },
    preparationTime: 15,
    difficulty: 'medium',
  },
  {
    id: 'bf_006',
    name: 'Smoothie bowl énergétique',
    type: 'breakfast',
    description: 'Banane, baies, épinards, protéines, beurre d\'amande, toppings',
    ingredients: [
      { name: 'Banane congelée', quantity: 150, unit: 'g', calories: 134, protein: 1.7, carbs: 34.2, fats: 0.5 },
      { name: 'Baies mélangées', quantity: 100, unit: 'g', calories: 50, protein: 1, carbs: 10, fats: 0.3 },
      { name: 'Épinards', quantity: 30, unit: 'g', calories: 7, protein: 0.9, carbs: 0.5, fats: 0.1 },
      { name: 'Protéines végétales', quantity: 30, unit: 'g', calories: 115, protein: 22, carbs: 4, fats: 1.5 },
      { name: 'Beurre d\'amande', quantity: 20, unit: 'g', calories: 120, protein: 4, carbs: 4, fats: 10 },
      { name: 'Granola topping', quantity: 30, unit: 'g', calories: 129, protein: 3.3, carbs: 21, fats: 3.6 },
    ],
    nutrition: {
      calories: 555,
      macros: { protein: 32.9, carbs: 73.7, fats: 16, fiber: 12 },
      micros: { vitaminC: 60, iron: 5, calcium: 200 },
    },
    preparationTime: 10,
    difficulty: 'easy',
  },
  {
    id: 'bf_007',
    name: 'Crêpes complètes jambon-fromage',
    type: 'breakfast',
    description: 'Galettes de sarrasin, jambon, fromage, œuf',
    ingredients: [
      { name: 'Farine de sarrasin', quantity: 60, unit: 'g', calories: 201, protein: 7.8, carbs: 42.6, fats: 1.8 },
      { name: 'Jambon blanc', quantity: 50, unit: 'g', calories: 54, protein: 10.5, carbs: 0.5, fats: 1.5 },
      { name: 'Fromage emmental', quantity: 30, unit: 'g', calories: 117, protein: 8.7, carbs: 0.2, fats: 9 },
      { name: 'Œuf', quantity: 1, unit: 'pièce', calories: 70, protein: 6.3, carbs: 0.4, fats: 5 },
      { name: 'Salade verte', quantity: 50, unit: 'g', calories: 8, protein: 0.7, carbs: 1.5, fats: 0.1 },
    ],
    nutrition: {
      calories: 450,
      macros: { protein: 34, carbs: 45.2, fats: 17.4, fiber: 5.5 },
      micros: { calcium: 280, iron: 2.5, vitaminA: 150 },
    },
    preparationTime: 20,
    difficulty: 'medium',
  },
  {
    id: 'bf_008',
    name: 'Muesli bircher protéiné',
    type: 'breakfast',
    description: 'Flocons d\'avoine trempés, pomme râpée, yaourt, noix',
    ingredients: [
      { name: 'Flocons d\'avoine', quantity: 60, unit: 'g', calories: 228, protein: 7.8, carbs: 38.4, fats: 4.2 },
      { name: 'Pomme râpée', quantity: 100, unit: 'g', calories: 52, protein: 0.3, carbs: 13.8, fats: 0.2 },
      { name: 'Yaourt nature', quantity: 150, unit: 'g', calories: 90, protein: 8.3, carbs: 9, fats: 2.3 },
      { name: 'Noix de Grenoble', quantity: 25, unit: 'g', calories: 164, protein: 3.8, carbs: 3.4, fats: 16.3 },
      { name: 'Raisins secs', quantity: 20, unit: 'g', calories: 60, protein: 0.6, carbs: 15.8, fats: 0.1 },
    ],
    nutrition: {
      calories: 594,
      macros: { protein: 20.8, carbs: 80.4, fats: 23.1, fiber: 9.8 },
      micros: { omega3: 2200, calcium: 230, iron: 3.5 },
    },
    preparationTime: 5,
    difficulty: 'easy',
  },
  {
    id: 'bf_009',
    name: 'Petit-déjeuner anglais léger',
    type: 'breakfast',
    description: 'Œufs brouillés, bacon de dinde, champignons, tomates, pain complet',
    ingredients: [
      { name: 'Œufs', quantity: 2, unit: 'pièces', calories: 140, protein: 12.6, carbs: 0.8, fats: 10 },
      { name: 'Bacon de dinde', quantity: 40, unit: 'g', calories: 56, protein: 9.2, carbs: 0.4, fats: 2 },
      { name: 'Champignons', quantity: 100, unit: 'g', calories: 22, protein: 3.1, carbs: 3.3, fats: 0.3 },
      { name: 'Tomates', quantity: 100, unit: 'g', calories: 18, protein: 0.9, carbs: 2.8, fats: 0.2 },
      { name: 'Pain complet', quantity: 60, unit: 'g', calories: 144, protein: 5.4, carbs: 26.4, fats: 1.8 },
    ],
    nutrition: {
      calories: 380,
      macros: { protein: 31.2, carbs: 33.7, fats: 14.3, fiber: 6.5 },
      micros: { vitaminB12: 1.5, selenium: 35, iron: 3.8 },
    },
    preparationTime: 20,
    difficulty: 'medium',
  },
  {
    id: 'bf_010',
    name: 'Cottage cheese et fruits bowl',
    type: 'breakfast',
    description: 'Fromage blanc, fruits frais, miel, graines de lin',
    ingredients: [
      { name: 'Fromage blanc 0%', quantity: 250, unit: 'g', calories: 115, protein: 20, carbs: 12.5, fats: 0.5 },
      { name: 'Fruits de saison', quantity: 150, unit: 'g', calories: 75, protein: 1.2, carbs: 18, fats: 0.4 },
      { name: 'Miel', quantity: 20, unit: 'g', calories: 61, protein: 0.1, carbs: 16.5, fats: 0 },
      { name: 'Graines de lin', quantity: 15, unit: 'g', calories: 80, protein: 2.7, carbs: 4.4, fats: 6.3 },
      { name: 'Noix de coco râpée', quantity: 10, unit: 'g', calories: 66, protein: 0.7, carbs: 2.4, fats: 6.4 },
    ],
    nutrition: {
      calories: 397,
      macros: { protein: 24.7, carbs: 53.8, fats: 13.6, fiber: 8.5 },
      micros: { calcium: 310, vitaminC: 45, omega3: 2400 },
    },
    preparationTime: 5,
    difficulty: 'easy',
  },
];

// ============================================
// DÉJEUNERS (10 options)
// ============================================
const LUNCHES: Meal[] = [
  {
    id: 'lunch_001',
    name: 'Poulet grillé, quinoa et légumes',
    type: 'lunch',
    description: 'Poulet mariné, quinoa, brocolis et carottes rôties',
    ingredients: [
      { name: 'Poulet', quantity: 150, unit: 'g', calories: 247, protein: 46.5, carbs: 0, fats: 5.4 },
      { name: 'Quinoa cuit', quantity: 150, unit: 'g', calories: 180, protein: 6, carbs: 30, fats: 3 },
      { name: 'Brocolis', quantity: 150, unit: 'g', calories: 51, protein: 4.2, carbs: 9.9, fats: 0.6 },
      { name: 'Carottes', quantity: 100, unit: 'g', calories: 41, protein: 0.9, carbs: 9.6, fats: 0.2 },
      { name: 'Huile d\'olive', quantity: 10, unit: 'ml', calories: 90, protein: 0, carbs: 0, fats: 10 },
    ],
    nutrition: {
      calories: 609,
      macros: { protein: 57.6, carbs: 49.5, fats: 19.2, fiber: 10.5 },
      micros: { vitaminA: 850, vitaminC: 90, iron: 4.5 },
    },
    preparationTime: 30,
    difficulty: 'medium',
  },
  {
    id: 'lunch_002',
    name: 'Saumon, riz basmati et asperges',
    type: 'lunch',
    description: 'Pavé de saumon, riz basmati, asperges vapeur',
    ingredients: [
      { name: 'Saumon', quantity: 150, unit: 'g', calories: 270, protein: 33, carbs: 0, fats: 15 },
      { name: 'Riz basmati cuit', quantity: 150, unit: 'g', calories: 195, protein: 4.5, carbs: 42, fats: 0.5 },
      { name: 'Asperges', quantity: 150, unit: 'g', calories: 30, protein: 3, carbs: 5.7, fats: 0.2 },
      { name: 'Citron', quantity: 20, unit: 'g', calories: 6, protein: 0.2, carbs: 1.9, fats: 0.1 },
    ],
    nutrition: {
      calories: 501,
      macros: { protein: 40.7, carbs: 49.6, fats: 15.8, fiber: 3.5 },
      micros: { omega3: 2200, vitaminD: 12, vitaminB12: 3.5 },
    },
    preparationTime: 25,
    difficulty: 'easy',
  },
  {
    id: 'lunch_003',
    name: 'Bœuf, patate douce et salade',
    type: 'lunch',
    description: 'Steak de bœuf, patate douce rôtie, salade verte',
    ingredients: [
      { name: 'Bœuf maigre', quantity: 150, unit: 'g', calories: 271, protein: 42, carbs: 0, fats: 10.5 },
      { name: 'Patate douce', quantity: 200, unit: 'g', calories: 172, protein: 3.2, carbs: 40, fats: 0.2 },
      { name: 'Salade verte', quantity: 100, unit: 'g', calories: 15, protein: 1.4, carbs: 2.9, fats: 0.2 },
      { name: 'Vinaigrette', quantity: 15, unit: 'ml', calories: 75, protein: 0, carbs: 1.5, fats: 7.5 },
    ],
    nutrition: {
      calories: 533,
      macros: { protein: 46.6, carbs: 44.4, fats: 18.4, fiber: 6.5 },
      micros: { vitaminA: 950, iron: 5.5, zinc: 7 },
    },
    preparationTime: 30,
    difficulty: 'easy',
  },
  {
    id: 'lunch_004',
    name: 'Pâtes complètes au thon et tomates',
    type: 'lunch',
    description: 'Pâtes complètes, thon, tomates cerises, basilic',
    ingredients: [
      { name: 'Pâtes complètes cuites', quantity: 200, unit: 'g', calories: 260, protein: 10, carbs: 52, fats: 2 },
      { name: 'Thon au naturel', quantity: 100, unit: 'g', calories: 116, protein: 26, carbs: 0, fats: 1 },
      { name: 'Tomates cerises', quantity: 150, unit: 'g', calories: 27, protein: 1.4, carbs: 4.2, fats: 0.3 },
      { name: 'Parmesan', quantity: 20, unit: 'g', calories: 80, protein: 7.2, carbs: 0.8, fats: 5.4 },
      { name: 'Huile d\'olive', quantity: 10, unit: 'ml', calories: 90, protein: 0, carbs: 0, fats: 10 },
    ],
    nutrition: {
      calories: 573,
      macros: { protein: 44.6, carbs: 57, fats: 18.7, fiber: 8 },
      micros: { vitaminC: 25, calcium: 280, selenium: 55 },
    },
    preparationTime: 20,
    difficulty: 'easy',
  },
  {
    id: 'lunch_005',
    name: 'Curry de poulet aux légumes',
    type: 'lunch',
    description: 'Poulet au curry, lait de coco, légumes variés, riz',
    ingredients: [
      { name: 'Poulet', quantity: 140, unit: 'g', calories: 230, protein: 43, carbs: 0, fats: 5 },
      { name: 'Lait de coco', quantity: 100, unit: 'ml', calories: 190, protein: 2, carbs: 6, fats: 18 },
      { name: 'Légumes mélangés', quantity: 200, unit: 'g', calories: 80, protein: 4, carbs: 16, fats: 0.5 },
      { name: 'Riz basmati cuit', quantity: 120, unit: 'g', calories: 156, protein: 3.6, carbs: 33.6, fats: 0.4 },
    ],
    nutrition: {
      calories: 656,
      macros: { protein: 52.6, carbs: 55.6, fats: 23.9, fiber: 5.5 },
      micros: { vitaminA: 600, vitaminC: 45, iron: 3.5 },
    },
    preparationTime: 35,
    difficulty: 'medium',
  },
];

// ============================================
// DÎNERS (10 options - versions plus légères)
// ============================================
const DINNERS: Meal[] = [
  {
    id: 'dinner_001',
    name: 'Poisson blanc et légumes vapeur',
    type: 'dinner',
    description: 'Cabillaud, haricots verts, courgettes, citron',
    ingredients: [
      { name: 'Cabillaud', quantity: 150, unit: 'g', calories: 124, protein: 27, carbs: 0, fats: 1.5 },
      { name: 'Haricots verts', quantity: 150, unit: 'g', calories: 47, protein: 2.7, carbs: 9.9, fats: 0.3 },
      { name: 'Courgettes', quantity: 150, unit: 'g', calories: 26, protein: 1.8, carbs: 4.8, fats: 0.5 },
      { name: 'Pommes de terre', quantity: 100, unit: 'g', calories: 77, protein: 2, carbs: 17, fats: 0.1 },
      { name: 'Huile d\'olive', quantity: 10, unit: 'ml', calories: 90, protein: 0, carbs: 0, fats: 10 },
    ],
    nutrition: {
      calories: 364,
      macros: { protein: 33.5, carbs: 31.7, fats: 12.4, fiber: 6.5 },
      micros: { vitaminC: 35, potassium: 650, selenium: 40 },
    },
    preparationTime: 20,
    difficulty: 'easy',
  },
  {
    id: 'dinner_002',
    name: 'Omelette aux légumes et salade',
    type: 'dinner',
    description: 'Omelette 3 œufs, poivrons, champignons, salade',
    ingredients: [
      { name: 'Œufs', quantity: 3, unit: 'pièces', calories: 210, protein: 18.9, carbs: 1.2, fats: 15 },
      { name: 'Poivrons', quantity: 100, unit: 'g', calories: 31, protein: 1, carbs: 6, fats: 0.3 },
      { name: 'Champignons', quantity: 100, unit: 'g', calories: 22, protein: 3.1, carbs: 3.3, fats: 0.3 },
      { name: 'Fromage râpé', quantity: 30, unit: 'g', calories: 120, protein: 7.5, carbs: 0.3, fats: 10 },
      { name: 'Salade', quantity: 100, unit: 'g', calories: 15, protein: 1.4, carbs: 2.9, fats: 0.2 },
    ],
    nutrition: {
      calories: 398,
      macros: { protein: 31.9, carbs: 13.7, fats: 25.8, fiber: 4 },
      micros: { vitaminA: 450, vitaminC: 80, calcium: 320 },
    },
    preparationTime: 15,
    difficulty: 'easy',
  },
  {
    id: 'dinner_003',
    name: 'Soupe de lentilles et pain complet',
    type: 'dinner',
    description: 'Soupe maison aux lentilles, légumes, pain complet',
    ingredients: [
      { name: 'Lentilles cuites', quantity: 150, unit: 'g', calories: 174, protein: 13.5, carbs: 28.5, fats: 0.6 },
      { name: 'Légumes soupe', quantity: 200, unit: 'g', calories: 80, protein: 3, carbs: 16, fats: 0.5 },
      { name: 'Pain complet', quantity: 60, unit: 'g', calories: 144, protein: 5.4, carbs: 26.4, fats: 1.8 },
      { name: 'Huile d\'olive', quantity: 5, unit: 'ml', calories: 45, protein: 0, carbs: 0, fats: 5 },
    ],
    nutrition: {
      calories: 443,
      macros: { protein: 21.9, carbs: 70.9, fats: 7.9, fiber: 14 },
      micros: { iron: 5.5, vitaminC: 20, folate: 180 },
    },
    preparationTime: 30,
    difficulty: 'easy',
  },
  {
    id: 'dinner_004',
    name: 'Poulet rôti et ratatouille',
    type: 'dinner',
    description: 'Blanc de poulet, ratatouille maison',
    ingredients: [
      { name: 'Poulet', quantity: 120, unit: 'g', calories: 198, protein: 37.2, carbs: 0, fats: 4.3 },
      { name: 'Ratatouille', quantity: 300, unit: 'g', calories: 120, protein: 3, carbs: 18, fats: 4.5 },
      { name: 'Riz complet cuit', quantity: 100, unit: 'g', calories: 130, protein: 3, carbs: 27, fats: 1 },
    ],
    nutrition: {
      calories: 448,
      macros: { protein: 43.2, carbs: 45, fats: 9.8, fiber: 8 },
      micros: { vitaminC: 50, vitaminA: 400, lycopene: 15 },
    },
    preparationTime: 40,
    difficulty: 'medium',
  },
  {
    id: 'dinner_005',
    name: 'Salade complète thon et œuf',
    type: 'dinner',
    description: 'Salade composée, thon, œuf dur, légumes variés',
    ingredients: [
      { name: 'Salade verte', quantity: 150, unit: 'g', calories: 23, protein: 2.1, carbs: 4.4, fats: 0.3 },
      { name: 'Thon au naturel', quantity: 80, unit: 'g', calories: 93, protein: 20.8, carbs: 0, fats: 0.8 },
      { name: 'Œuf dur', quantity: 2, unit: 'pièces', calories: 140, protein: 12.6, carbs: 0.8, fats: 10 },
      { name: 'Tomates', quantity: 150, unit: 'g', calories: 27, protein: 1.4, carbs: 4.2, fats: 0.3 },
      { name: 'Maïs', quantity: 50, unit: 'g', calories: 43, protein: 1.6, carbs: 9.5, fats: 0.6 },
      { name: 'Vinaigrette', quantity: 15, unit: 'ml', calories: 75, protein: 0, carbs: 1.5, fats: 7.5 },
    ],
    nutrition: {
      calories: 401,
      macros: { protein: 38.5, carbs: 20.4, fats: 19.5, fiber: 5 },
      micros: { vitaminA: 350, vitaminC: 30, selenium: 50 },
    },
    preparationTime: 15,
    difficulty: 'easy',
  },
];

// Compléter avec 5 options supplémentaires pour chaque (copier/adapter les existantes)
for (let i = 0; i < 5; i++) {
  LUNCHES.push({ ...LUNCHES[i], id: `lunch_00${6 + i}` });
  DINNERS.push({ ...DINNERS[i], id: `dinner_00${6 + i}` });
}

export const MEAL_DATABASE = {
  breakfasts: BREAKFASTS,
  lunches: LUNCHES,
  dinners: DINNERS,
};

export function getMealsByType(type: MealType): Meal[] {
  switch (type) {
    case 'breakfast':
      return BREAKFASTS;
    case 'lunch':
      return MEAL_DATABASE.lunches;
    case 'dinner':
      return MEAL_DATABASE.dinners;
    default:
      return [];
  }
}

export function getMealById(id: string): Meal | undefined {
  return [...BREAKFASTS, ...LUNCHES, ...DINNERS].find(meal => meal.id === id);
}
