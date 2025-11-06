import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Check, Sparkles } from 'lucide-react';
import { Button } from './UI/Button';
import { Card } from './UI/Card';
import { useAppStore } from '../store/useAppStore';

export const PlanSelection: React.FC = () => {
  const { selectedPlanDuration, selectPlanDuration, generatePlan, setStep } = useAppStore();

  const plans = [
    {
      duration: 1 as const,
      name: 'Découverte',
      price: 'Gratuit',
      description: 'Planning pour 1 journée',
      features: [
        '1 journée complète',
        'Repas équilibrés',
        'Calcul des macros',
        'Liste de courses',
      ],
      popular: false,
      gradient: 'from-gray-400 to-gray-500',
    },
    {
      duration: 7 as const,
      name: 'Semaine',
      price: '9.99€',
      description: 'Planning pour 7 jours',
      features: [
        '7 jours variés',
        'Rotation des repas',
        'Calcul des macros',
        'Liste de courses',
        'Suivi hebdomadaire',
      ],
      popular: true,
      gradient: 'from-primary-500 to-primary-600',
    },
    {
      duration: 31 as const,
      name: 'Mensuel',
      price: '29.99€',
      description: 'Planning pour 1 mois complet',
      features: [
        '31 jours complets',
        'Maximum de variété',
        'Calcul des macros',
        'Liste de courses',
        'Suivi hebdomadaire',
        'Ajustements personnalisés',
      ],
      popular: false,
      gradient: 'from-secondary-500 to-secondary-600',
    },
  ];

  const handleGenerate = () => {
    generatePlan();
    setStep('details');
  };

  return (
    <div className="min-h-screen p-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-block mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Calendar className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">
            <span className="text-gradient">Choisissez votre planning</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Sélectionnez la durée qui vous convient pour démarrer votre transformation
          </p>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.duration}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
            >
              <Card
                glass
                hover
                className={`h-full relative ${
                  selectedPlanDuration === plan.duration
                    ? 'ring-4 ring-primary-500 shadow-2xl'
                    : ''
                } ${plan.popular ? 'md:-mt-4 md:mb-4' : ''}`}
                onClick={() => selectPlanDuration(plan.duration)}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg">
                      <Sparkles className="w-4 h-4" />
                      Le plus populaire
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className={`inline-block w-16 h-16 bg-gradient-to-br ${plan.gradient} rounded-2xl flex items-center justify-center text-white text-2xl font-bold mb-4`}>
                    {plan.duration}
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-gray-800">{plan.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                  <div className="text-4xl font-bold">
                    <span className="text-gradient">{plan.price}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 bg-primary-100 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary-600" />
                      </div>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  variant={selectedPlanDuration === plan.duration ? 'primary' : 'outline'}
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    selectPlanDuration(plan.duration);
                  }}
                >
                  {selectedPlanDuration === plan.duration ? 'Sélectionné' : 'Sélectionner'}
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card glass className="bg-gradient-to-r from-primary-50 to-secondary-50">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md">
                <span className="text-2xl">✨</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Qu'est-ce qui est inclus dans votre planning ?
                </h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Repas équilibrés adaptés à vos besoins caloriques (marge ±5%)</li>
                  <li>• Détails nutritionnels complets (macros et micros)</li>
                  <li>• Ingrédients avec quantités ajustées</li>
                  <li>• Temps de préparation et niveau de difficulté</li>
                  <li>• Rotation automatique pour éviter la monotonie</li>
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* CTA */}
        {selectedPlanDuration && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-8"
          >
            <Button
              variant="primary"
              size="lg"
              onClick={handleGenerate}
              className="w-full md:w-auto min-w-[300px]"
            >
              Générer mon planning de {selectedPlanDuration} jour{selectedPlanDuration > 1 ? 's' : ''}
              <Sparkles className="w-5 h-5" />
            </Button>
            <p className="text-sm text-gray-500 mt-4">
              {selectedPlanDuration === 1
                ? 'Gratuit • Généré instantanément'
                : 'Paiement sécurisé • Génération instantanée'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};
