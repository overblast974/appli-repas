import React from 'react';
import { motion } from 'framer-motion';
import { Utensils, Target, TrendingUp, Heart, History } from 'lucide-react';
import { Button } from './UI/Button';
import { Card } from './UI/Card';
import { useAppStore } from '../store/useAppStore';

export const Welcome: React.FC = () => {
  const { nextStep, setStep } = useAppStore();

  const features = [
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Objectifs Personnalisés',
      description: 'Définissez vos objectifs et recevez un plan adapté à vos besoins',
    },
    {
      icon: <Utensils className="w-8 h-8" />,
      title: 'Repas Équilibrés',
      description: 'Des recettes nutritives et délicieuses pour chaque repas',
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Calculs Scientifiques',
      description: 'Basé sur les formules métaboliques les plus fiables',
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Santé & Bien-être',
      description: 'Prenez soin de votre corps avec une alimentation optimale',
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="inline-block mb-6"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-3xl flex items-center justify-center shadow-2xl">
              <Utensils className="w-12 h-12 text-white" />
            </div>
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-gradient">NutriPlan</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-4 max-w-2xl mx-auto">
            Votre planning alimentaire personnalisé basé sur la science
          </p>

          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Atteignez vos objectifs nutritionnels avec des repas équilibrés et adaptés à votre métabolisme
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card glass hover className="h-full text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl flex items-center justify-center text-primary-600">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <Card glass className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Prêt à transformer votre alimentation ?
            </h2>
            <p className="text-gray-600 mb-6">
              Commencez par un questionnaire rapide pour calculer vos besoins nutritionnels précis
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                onClick={nextStep}
                className="w-full md:w-auto"
              >
                Créer un nouveau planning
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setStep('history')}
                className="w-full md:w-auto"
              >
                <History className="w-5 h-5" />
                Mes plannings sauvegardés
              </Button>
            </div>
          </Card>

          <p className="text-sm text-gray-500 mt-6">
            Aucune inscription requise • 100% gratuit pour 1 jour
          </p>
        </motion.div>
      </div>
    </div>
  );
};
