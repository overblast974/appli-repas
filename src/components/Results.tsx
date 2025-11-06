import React from 'react';
import { motion } from 'framer-motion';
import { Flame, TrendingUp, PieChart, Award, ArrowRight } from 'lucide-react';
import { Button } from './UI/Button';
import { Card } from './UI/Card';
import { ProgressBar } from './UI/ProgressBar';
import { useAppStore } from '../store/useAppStore';

export const Results: React.FC = () => {
  const { metabolicResults, userProfile, nextStep } = useAppStore();

  if (!metabolicResults) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Aucun résultat disponible</p>
      </div>
    );
  }

  const { bmr, tdee, adjustedCalories, macros, method } = metabolicResults;

  const macroPercentages = {
    protein: (macros.protein * 4) / adjustedCalories * 100,
    carbs: (macros.carbs * 4) / adjustedCalories * 100,
    fats: (macros.fats * 9) / adjustedCalories * 100,
  };

  const methodLabels = {
    'mifflin-st-jeor': 'Mifflin-St Jeor (Standard moderne)',
    'harris-benedict': 'Harris-Benedict (Alternative)',
    'katch-mcardle': 'Katch-McArdle (Avec masse grasse)',
  };

  const goalLabels = {
    maintain: 'Maintien du poids',
    lose_weight: 'Perte de poids',
    gain_muscle: 'Prise de muscle',
    lose_fat_gain_muscle: 'Recomposition corporelle',
    rebalance: 'Rééquilibrage alimentaire',
  };

  return (
    <div className="min-h-screen p-4 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-block mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Award className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">
            <span className="text-gradient">Vos Résultats Personnalisés</span>
          </h1>
          <p className="text-xl text-gray-600">
            Basés sur la méthode scientifique {methodLabels[method]}
          </p>
        </motion.div>

        {/* Objectif */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card glass>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Votre objectif</p>
              <p className="text-2xl font-bold text-primary-600">
                {goalLabels[userProfile.goal as keyof typeof goalLabels]}
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Principales métriques */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card glass className="text-center">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Flame className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">Métabolisme de base (BMR)</p>
              <p className="text-3xl font-bold text-gray-800">{bmr}</p>
              <p className="text-sm text-gray-500">kcal/jour</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card glass className="text-center">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">Dépense totale (TDEE)</p>
              <p className="text-3xl font-bold text-gray-800">{tdee}</p>
              <p className="text-sm text-gray-500">kcal/jour</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card glass className="text-center ring-2 ring-primary-500">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                  <PieChart className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">Objectif calorique</p>
              <p className="text-3xl font-bold text-gradient">{adjustedCalories}</p>
              <p className="text-sm text-gray-500">kcal/jour</p>
            </Card>
          </motion.div>
        </div>

        {/* Macronutriments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card glass>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Répartition des Macronutriments
            </h2>

            <div className="space-y-6">
              {/* Protéines */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="font-semibold text-lg text-gray-800">Protéines</span>
                    <span className="text-sm text-gray-600 ml-2">
                      ({macroPercentages.protein.toFixed(0)}% de vos calories)
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary-600">{macros.protein}g</p>
                    <p className="text-sm text-gray-500">{(macros.protein * 4).toFixed(0)} kcal</p>
                  </div>
                </div>
                <ProgressBar progress={macroPercentages.protein} color="primary" showPercentage={false} />
              </div>

              {/* Glucides */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="font-semibold text-lg text-gray-800">Glucides</span>
                    <span className="text-sm text-gray-600 ml-2">
                      ({macroPercentages.carbs.toFixed(0)}% de vos calories)
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">{macros.carbs}g</p>
                    <p className="text-sm text-gray-500">{(macros.carbs * 4).toFixed(0)} kcal</p>
                  </div>
                </div>
                <ProgressBar progress={macroPercentages.carbs} color="secondary" showPercentage={false} />
              </div>

              {/* Lipides */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="font-semibold text-lg text-gray-800">Lipides</span>
                    <span className="text-sm text-gray-600 ml-2">
                      ({macroPercentages.fats.toFixed(0)}% de vos calories)
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-yellow-600">{macros.fats}g</p>
                    <p className="text-sm text-gray-500">{(macros.fats * 9).toFixed(0)} kcal</p>
                  </div>
                </div>
                <ProgressBar progress={macroPercentages.fats} color="warning" showPercentage={false} />
              </div>

              {/* Fibres */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800">Fibres (recommandées)</span>
                  <span className="text-xl font-bold text-green-600">{macros.fiber}g</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Explications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6"
        >
          <Card glass className="bg-gradient-to-r from-primary-50 to-secondary-50">
            <h3 className="font-semibold text-gray-800 mb-3">
              📊 Comment lire ces résultats ?
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                <strong>BMR :</strong> Calories brûlées au repos (fonctions vitales)
              </li>
              <li>
                <strong>TDEE :</strong> Calories totales brûlées incluant votre activité
              </li>
              <li>
                <strong>Objectif calorique :</strong> Ajusté selon votre objectif pour des résultats optimaux
              </li>
              <li>
                <strong>Macros :</strong> Répartition optimale pour atteindre votre objectif
              </li>
            </ul>
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center mt-8"
        >
          <Button
            variant="primary"
            size="lg"
            onClick={nextStep}
            className="w-full md:w-auto"
          >
            Générer mon planning alimentaire
            <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};
