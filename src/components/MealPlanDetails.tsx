import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  ChefHat,
  TrendingUp,
  Download,
  Share2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from './UI/Button';
import { Card } from './UI/Card';
import { ProgressBar } from './UI/ProgressBar';
import { useAppStore } from '../store/useAppStore';
import type { MealWithQuantity } from '../types';

export const MealPlanDetails: React.FC = () => {
  const { currentMealPlan, metabolicResults, reset } = useAppStore();
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [expandedMealId, setExpandedMealId] = useState<string | null>(null);

  if (!currentMealPlan || !metabolicResults) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Aucun planning disponible</p>
      </div>
    );
  }

  const selectedDay = currentMealPlan.dailyPlans[selectedDayIndex];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(date);
  };

  const getMealTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      breakfast: 'Petit-déjeuner',
      lunch: 'Déjeuner',
      dinner: 'Dîner',
      snack: 'Collation',
    };
    return labels[type] || type;
  };

  const getMealTypeEmoji = (type: string) => {
    const emojis: Record<string, string> = {
      breakfast: '🌅',
      lunch: '🍽️',
      dinner: '🌙',
      snack: '🍎',
    };
    return emojis[type] || '🍴';
  };

  const handleNewPlan = () => {
    reset();
  };

  return (
    <div className="min-h-screen p-4 py-12 pb-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                <span className="text-gradient">Votre Planning Alimentaire</span>
              </h1>
              <p className="text-gray-600">
                {currentMealPlan.duration} jour{currentMealPlan.duration > 1 ? 's' : ''} de repas équilibrés
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4" />
                Télécharger
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4" />
                Partager
              </Button>
              <Button variant="ghost" size="sm" onClick={handleNewPlan}>
                Nouveau planning
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Summary */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card glass className="text-center">
            <p className="text-sm text-gray-600 mb-1">Calories journalières</p>
            <p className="text-2xl font-bold text-gradient">
              {metabolicResults.adjustedCalories}
            </p>
            <p className="text-xs text-gray-500">kcal/jour</p>
          </Card>
          <Card glass className="text-center">
            <p className="text-sm text-gray-600 mb-1">Protéines</p>
            <p className="text-2xl font-bold text-primary-600">
              {metabolicResults.macros.protein}g
            </p>
          </Card>
          <Card glass className="text-center">
            <p className="text-sm text-gray-600 mb-1">Glucides</p>
            <p className="text-2xl font-bold text-blue-600">
              {metabolicResults.macros.carbs}g
            </p>
          </Card>
          <Card glass className="text-center">
            <p className="text-sm text-gray-600 mb-1">Lipides</p>
            <p className="text-2xl font-bold text-yellow-600">
              {metabolicResults.macros.fats}g
            </p>
          </Card>
        </div>

        {/* Days Selector */}
        {currentMealPlan.duration > 1 && (
          <Card glass className="mb-8">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {currentMealPlan.dailyPlans.map((_day, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedDayIndex(index)}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedDayIndex === index
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Jour {index + 1}
                </button>
              ))}
            </div>
          </Card>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Meals List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Day Header */}
            <Card glass>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {formatDate(selectedDay.date)}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Jour {selectedDayIndex + 1} / {currentMealPlan.duration}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Précision</p>
                  <p className={`text-2xl font-bold ${
                    selectedDay.deviation <= 0.05 ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {(selectedDay.deviation * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </Card>

            {/* Meals */}
            {selectedDay.meals.map((meal, index) => (
              <MealCard
                key={`${meal.id}-${index}`}
                meal={meal}
                isExpanded={expandedMealId === meal.id}
                onToggle={() => setExpandedMealId(expandedMealId === meal.id ? null : meal.id)}
                mealTypeLabel={getMealTypeLabel(meal.type)}
                mealTypeEmoji={getMealTypeEmoji(meal.type)}
              />
            ))}
          </div>

          {/* Daily Nutrition Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              <Card glass>
                <h3 className="text-xl font-bold mb-4 text-gray-800">
                  Résumé nutritionnel
                </h3>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Calories</span>
                      <span className="font-bold text-gray-800">
                        {Math.round(selectedDay.totalNutrition.calories)} kcal
                      </span>
                    </div>
                    <ProgressBar
                      progress={(selectedDay.totalNutrition.calories / selectedDay.targetCalories) * 100}
                      color="primary"
                      showPercentage={false}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Objectif: {selectedDay.targetCalories} kcal
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Protéines</span>
                      <span className="font-bold text-primary-600">
                        {Math.round(selectedDay.totalNutrition.macros.protein)}g
                      </span>
                    </div>
                    <ProgressBar
                      progress={(selectedDay.totalNutrition.macros.protein / metabolicResults.macros.protein) * 100}
                      color="primary"
                      showPercentage={false}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Glucides</span>
                      <span className="font-bold text-blue-600">
                        {Math.round(selectedDay.totalNutrition.macros.carbs)}g
                      </span>
                    </div>
                    <ProgressBar
                      progress={(selectedDay.totalNutrition.macros.carbs / metabolicResults.macros.carbs) * 100}
                      color="secondary"
                      showPercentage={false}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Lipides</span>
                      <span className="font-bold text-yellow-600">
                        {Math.round(selectedDay.totalNutrition.macros.fats)}g
                      </span>
                    </div>
                    <ProgressBar
                      progress={(selectedDay.totalNutrition.macros.fats / metabolicResults.macros.fats) * 100}
                      color="warning"
                      showPercentage={false}
                    />
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Fibres</span>
                      <span className="font-bold text-green-600">
                        {Math.round(selectedDay.totalNutrition.macros.fiber)}g
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card glass className="bg-gradient-to-r from-primary-50 to-secondary-50">
                <h4 className="font-semibold text-gray-800 mb-2">💡 Conseil du jour</h4>
                <p className="text-sm text-gray-700">
                  Pensez à bien vous hydrater tout au long de la journée.
                  Visez au moins 2L d'eau pour optimiser votre métabolisme.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant MealCard
const MealCard: React.FC<{
  meal: MealWithQuantity;
  isExpanded: boolean;
  onToggle: () => void;
  mealTypeLabel: string;
  mealTypeEmoji: string;
}> = ({ meal, isExpanded, onToggle, mealTypeLabel, mealTypeEmoji }) => {
  const difficultyColors = {
    easy: 'text-green-600 bg-green-100',
    medium: 'text-yellow-600 bg-yellow-100',
    hard: 'text-red-600 bg-red-100',
  };

  const difficultyLabels = {
    easy: 'Facile',
    medium: 'Moyen',
    hard: 'Difficile',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card glass hover className="cursor-pointer" onClick={onToggle}>
        {/* Meal Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{mealTypeEmoji}</span>
              <span className="text-sm font-medium text-gray-600">{mealTypeLabel}</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800">{meal.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{meal.description}</p>
          </div>
          <button className="flex-shrink-0 ml-4 p-2 hover:bg-gray-100 rounded-lg transition-colors">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Quick Info */}
        <div className="flex flex-wrap gap-3 mb-3">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            {meal.preparationTime} min
          </div>
          <div className="flex items-center gap-1 text-sm">
            <ChefHat className="w-4 h-4" />
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${difficultyColors[meal.difficulty]}`}>
              {difficultyLabels[meal.difficulty]}
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm font-semibold text-primary-600">
            <TrendingUp className="w-4 h-4" />
            {Math.round(meal.nutrition.calories)} kcal
          </div>
        </div>

        {/* Macros Summary */}
        <div className="flex gap-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex-1 text-center">
            <p className="text-xs text-gray-600 mb-1">Protéines</p>
            <p className="font-bold text-primary-600">
              {Math.round(meal.nutrition.macros.protein)}g
            </p>
          </div>
          <div className="flex-1 text-center">
            <p className="text-xs text-gray-600 mb-1">Glucides</p>
            <p className="font-bold text-blue-600">
              {Math.round(meal.nutrition.macros.carbs)}g
            </p>
          </div>
          <div className="flex-1 text-center">
            <p className="text-xs text-gray-600 mb-1">Lipides</p>
            <p className="font-bold text-yellow-600">
              {Math.round(meal.nutrition.macros.fats)}g
            </p>
          </div>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-3">Ingrédients</h4>
                <div className="space-y-2">
                  {meal.ingredients.map((ingredient, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center text-sm bg-white p-2 rounded"
                    >
                      <span className="text-gray-700">{ingredient.name}</span>
                      <span className="font-medium text-gray-900">
                        {Math.round(ingredient.quantity * 10) / 10} {ingredient.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};
