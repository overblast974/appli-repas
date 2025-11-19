import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Scale, Ruler, Calendar, Activity, Target, Utensils, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from './UI/Button';
import { Card } from './UI/Card';
import { Input } from './UI/Input';
import { ProgressBar } from './UI/ProgressBar';
import { useAppStore } from '../store/useAppStore';
import type { Gender, ActivityLevel, Goal } from '../types';

interface QuestionStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const STEPS: QuestionStep[] = [
  {
    id: 'personal',
    title: 'Informations personnelles',
    description: 'Dites-nous en plus sur vous',
    icon: <User className="w-6 h-6" />,
  },
  {
    id: 'body',
    title: 'Données anthropométriques',
    description: 'Vos mensurations pour des calculs précis',
    icon: <Scale className="w-6 h-6" />,
  },
  {
    id: 'lifestyle',
    title: 'Mode de vie',
    description: 'Votre activité quotidienne',
    icon: <Activity className="w-6 h-6" />,
  },
  {
    id: 'goals',
    title: 'Objectifs',
    description: 'Ce que vous souhaitez atteindre',
    icon: <Target className="w-6 h-6" />,
  },
  {
    id: 'preferences',
    title: 'Préférences alimentaires',
    description: 'Personnalisez votre planning',
    icon: <Utensils className="w-6 h-6" />,
  },
];

export const Questionnaire: React.FC = () => {
  const { userProfile, updateUserProfile, calculateMetabolicResults, nextStep } = useAppStore();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currentStep = STEPS[currentStepIndex];
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100;

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    switch (currentStep.id) {
      case 'personal':
        if (!userProfile.age || userProfile.age < 16 || userProfile.age > 100) {
          newErrors.age = 'Âge invalide (16-100 ans)';
        }
        if (!userProfile.gender) {
          newErrors.gender = 'Veuillez sélectionner votre genre';
        }
        break;

      case 'body':
        if (!userProfile.weight || userProfile.weight < 30 || userProfile.weight > 300) {
          newErrors.weight = 'Poids invalide (30-300 kg)';
        }
        if (!userProfile.height || userProfile.height < 120 || userProfile.height > 250) {
          newErrors.height = 'Taille invalide (120-250 cm)';
        }
        if (userProfile.bodyFat && (userProfile.bodyFat < 3 || userProfile.bodyFat > 60)) {
          newErrors.bodyFat = 'Pourcentage invalide (3-60%)';
        }
        break;

      case 'lifestyle':
        if (!userProfile.activityLevel) {
          newErrors.activityLevel = 'Veuillez sélectionner votre niveau d\'activité';
        }
        if (!userProfile.exerciseFrequency && userProfile.exerciseFrequency !== 0) {
          newErrors.exerciseFrequency = 'Requis';
        }
        if (!userProfile.sleepHours || userProfile.sleepHours < 4 || userProfile.sleepHours > 12) {
          newErrors.sleepHours = 'Heures de sommeil invalides (4-12h)';
        }
        break;

      case 'goals':
        if (!userProfile.goal) {
          newErrors.goal = 'Veuillez sélectionner un objectif';
        }
        break;

      case 'preferences':
        if (!userProfile.mealsPerDay) {
          newErrors.mealsPerDay = 'Veuillez sélectionner le nombre de repas';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStepIndex < STEPS.length - 1) {
        setCurrentStepIndex(currentStepIndex + 1);
      } else {
        // Dernière étape : calculer les résultats
        calculateMetabolicResults();
        nextStep();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      setErrors({});
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12">
      <div className="max-w-3xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <ProgressBar progress={progress} label="Progression" />
        </div>

        {/* Main Card */}
        <Card glass>
          {/* Header */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center text-white">
              {currentStep.icon}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{currentStep.title}</h2>
              <p className="text-gray-600">{currentStep.description}</p>
            </div>
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep.id === 'personal' && (
                <PersonalInfoStep
                  userProfile={userProfile}
                  updateUserProfile={updateUserProfile}
                  errors={errors}
                />
              )}

              {currentStep.id === 'body' && (
                <BodyMeasurementsStep
                  userProfile={userProfile}
                  updateUserProfile={updateUserProfile}
                  errors={errors}
                />
              )}

              {currentStep.id === 'lifestyle' && (
                <LifestyleStep
                  userProfile={userProfile}
                  updateUserProfile={updateUserProfile}
                  errors={errors}
                />
              )}

              {currentStep.id === 'goals' && (
                <GoalsStep
                  userProfile={userProfile}
                  updateUserProfile={updateUserProfile}
                  errors={errors}
                />
              )}

              {currentStep.id === 'preferences' && (
                <PreferencesStep
                  userProfile={userProfile}
                  updateUserProfile={updateUserProfile}
                  errors={errors}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStepIndex === 0}
              className="flex-1"
            >
              <ArrowLeft className="w-5 h-5" />
              Précédent
            </Button>
            <Button
              variant="primary"
              onClick={handleNext}
              className="flex-1"
            >
              {currentStepIndex === STEPS.length - 1 ? 'Calculer mes besoins' : 'Suivant'}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </Card>

        {/* Steps Indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {STEPS.map((step, index) => (
            <div
              key={step.id}
              className={`h-2 rounded-full transition-all duration-300 ${
                index <= currentStepIndex
                  ? 'bg-gradient-to-r from-primary-500 to-secondary-500 w-12'
                  : 'bg-gray-300 w-8'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Composants pour chaque étape
const PersonalInfoStep: React.FC<{
  userProfile: any;
  updateUserProfile: any;
  errors: Record<string, string>;
}> = ({ userProfile, updateUserProfile, errors }) => (
  <div className="space-y-6">
    <Input
      label="Âge"
      type="number"
      placeholder="25"
      value={userProfile.age || ''}
      onChange={(e) => updateUserProfile({ age: parseInt(e.target.value) })}
      error={errors.age}
      icon={<Calendar className="w-5 h-5" />}
    />

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">Genre</label>
      <div className="grid grid-cols-2 gap-4">
        {[
          { value: 'male' as Gender, label: 'Homme' },
          { value: 'female' as Gender, label: 'Femme' },
        ].map((option) => {
          const isSelected = userProfile.gender === option.value;
          return (
            <div
              key={option.value}
              className={`selection-card ${isSelected ? 'selection-card-active' : ''}`}
              onClick={() => updateUserProfile({ gender: option.value })}
            >
              <p className="font-medium">{option.label}</p>
              {isSelected && <div className="selection-card-check absolute top-2 right-2">✓</div>}
            </div>
          );
        })}
      </div>
      {errors.gender && <p className="text-sm text-red-600 mt-2">{errors.gender}</p>}
    </div>
  </div>
);

const BodyMeasurementsStep: React.FC<{
  userProfile: any;
  updateUserProfile: any;
  errors: Record<string, string>;
}> = ({ userProfile, updateUserProfile, errors }) => (
  <div className="space-y-6">
    <div className="grid md:grid-cols-2 gap-6">
      <Input
        label="Poids (kg)"
        type="number"
        placeholder="70"
        value={userProfile.weight || ''}
        onChange={(e) => updateUserProfile({ weight: parseFloat(e.target.value) })}
        error={errors.weight}
        icon={<Scale className="w-5 h-5" />}
      />

      <Input
        label="Taille (cm)"
        type="number"
        placeholder="175"
        value={userProfile.height || ''}
        onChange={(e) => updateUserProfile({ height: parseFloat(e.target.value) })}
        error={errors.height}
        icon={<Ruler className="w-5 h-5" />}
      />
    </div>

    <div>
      <Input
        label="Pourcentage de masse grasse (optionnel)"
        type="number"
        placeholder="20"
        value={userProfile.bodyFat || ''}
        onChange={(e) => updateUserProfile({ bodyFat: parseFloat(e.target.value) })}
        error={errors.bodyFat}
      />
      <p className="text-xs text-gray-500 mt-2">
        Si vous connaissez votre % de masse grasse, les calculs seront plus précis
      </p>
    </div>
  </div>
);

const LifestyleStep: React.FC<{
  userProfile: any;
  updateUserProfile: any;
  errors: Record<string, string>;
}> = ({ userProfile, updateUserProfile, errors }) => {
  const activityLevels: { value: ActivityLevel; label: string; description: string }[] = [
    { value: 'sedentary', label: 'Sédentaire', description: 'Peu ou pas d\'exercice' },
    { value: 'light', label: 'Léger', description: '1-3 jours/semaine' },
    { value: 'moderate', label: 'Modéré', description: '3-5 jours/semaine' },
    { value: 'active', label: 'Actif', description: '6-7 jours/semaine' },
    { value: 'very_active', label: 'Très actif', description: 'Exercice intense quotidien' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Niveau d'activité physique
        </label>
        <div className="space-y-3">
          {activityLevels.map((level) => {
            const isSelected = userProfile.activityLevel === level.value;
            return (
              <div
                key={level.value}
                className={`selection-card ${isSelected ? 'selection-card-active' : ''}`}
                onClick={() => updateUserProfile({ activityLevel: level.value })}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{level.label}</p>
                    <p className="text-sm text-gray-600 mt-1">{level.description}</p>
                  </div>
                  {isSelected && <div className="selection-card-check">✓</div>}
                </div>
              </div>
            );
          })}
        </div>
        {errors.activityLevel && (
          <p className="text-sm text-red-600 mt-2">{errors.activityLevel}</p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Input
          label="Fréquence d'exercice (jours/semaine)"
          type="number"
          min="0"
          max="7"
          placeholder="3"
          value={userProfile.exerciseFrequency ?? ''}
          onChange={(e) => updateUserProfile({ exerciseFrequency: parseInt(e.target.value) })}
          error={errors.exerciseFrequency}
        />

        <Input
          label="Durée par séance (minutes)"
          type="number"
          min="0"
          max="300"
          placeholder="60"
          value={userProfile.exerciseDuration ?? ''}
          onChange={(e) => updateUserProfile({ exerciseDuration: parseInt(e.target.value) })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Intensité de vos entraînements
        </label>
        <div className="grid grid-cols-3 gap-4">
          {[
            { value: 'light', label: 'Légère', description: 'Marche, yoga' },
            { value: 'moderate', label: 'Modérée', description: 'Jogging, natation' },
            { value: 'intense', label: 'Intense', description: 'HIIT, musculation' },
          ].map((intensity) => {
            const isSelected = userProfile.exerciseIntensity === intensity.value;
            return (
              <div
                key={intensity.value}
                className={`selection-card ${isSelected ? 'selection-card-active' : ''}`}
                onClick={() => updateUserProfile({ exerciseIntensity: intensity.value })}
              >
                <p className="font-medium text-sm">{intensity.label}</p>
                <p className="text-xs text-gray-600 mt-1">{intensity.description}</p>
                {isSelected && <div className="selection-card-check absolute top-2 right-2">✓</div>}
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <Input
          label="Heures de sommeil par nuit"
          type="number"
          min="4"
          max="12"
          step="0.5"
          placeholder="8"
          value={userProfile.sleepHours || ''}
          onChange={(e) => updateUserProfile({ sleepHours: parseFloat(e.target.value) })}
          error={errors.sleepHours}
        />
      </div>
    </div>
  );
};

const GoalsStep: React.FC<{
  userProfile: any;
  updateUserProfile: any;
  errors: Record<string, string>;
}> = ({ userProfile, updateUserProfile, errors }) => {
  const goals: { value: Goal; label: string; description: string; emoji: string }[] = [
    {
      value: 'maintain',
      label: 'Maintenir mon poids',
      description: 'Équilibrer mes apports caloriques',
      emoji: '⚖️',
    },
    {
      value: 'lose_weight',
      label: 'Perdre du poids',
      description: 'Déficit calorique contrôlé (-15%)',
      emoji: '📉',
    },
    {
      value: 'gain_muscle',
      label: 'Prendre du muscle',
      description: 'Surplus calorique avec protéines élevées (+10%)',
      emoji: '💪',
    },
    {
      value: 'lose_fat_gain_muscle',
      label: 'Recomposition corporelle',
      description: 'Perdre du gras et gagner du muscle',
      emoji: '🔥',
    },
    {
      value: 'rebalance',
      label: 'Rééquilibrer mon alimentation',
      description: 'Améliorer la qualité nutritionnelle',
      emoji: '🥗',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Quel est votre objectif principal ?
        </label>
        <div className="space-y-3">
          {goals.map((goal) => {
            const isSelected = userProfile.goal === goal.value;
            return (
              <div
                key={goal.value}
                className={`selection-card ${isSelected ? 'selection-card-active' : ''}`}
                onClick={() => updateUserProfile({ goal: goal.value })}
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{goal.emoji}</div>
                  <div className="flex-1">
                    <p className="font-medium">{goal.label}</p>
                    <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                  </div>
                  {isSelected && <div className="selection-card-check">✓</div>}
                </div>
              </div>
            );
          })}
        </div>
        {errors.goal && <p className="text-sm text-red-600 mt-2">{errors.goal}</p>}
      </div>
    </div>
  );
};

const PreferencesStep: React.FC<{
  userProfile: any;
  updateUserProfile: any;
  errors: Record<string, string>;
}> = ({ userProfile, updateUserProfile, errors }) => {
  const commonAllergens = [
    'Lactose',
    'Gluten',
    'Fruits à coque',
    'Arachides',
    'Œufs',
    'Poisson',
    'Crustacés',
    'Soja',
    'Sésame',
  ];

  const toggleAllergy = (allergen: string) => {
    const currentAllergies = userProfile.allergies || [];
    const newAllergies = currentAllergies.includes(allergen)
      ? currentAllergies.filter((a: string) => a !== allergen)
      : [...currentAllergies, allergen];
    updateUserProfile({ allergies: newAllergies });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Nombre de repas par jour
        </label>
        <div className="grid grid-cols-2 gap-4">
          {[3, 4].map((num) => {
            const isSelected = userProfile.mealsPerDay === num;
            return (
              <div
                key={num}
                className={`selection-card ${isSelected ? 'selection-card-active' : ''}`}
                onClick={() => updateUserProfile({ mealsPerDay: num })}
              >
                <p className="text-2xl font-bold text-primary-600">{num}</p>
                <p className="text-sm text-gray-600">repas</p>
                {isSelected && <div className="selection-card-check absolute top-2 right-2">✓</div>}
              </div>
            );
          })}
        </div>
        {errors.mealsPerDay && <p className="text-sm text-red-600 mt-2">{errors.mealsPerDay}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Inclure des collations ?
        </label>
        <div className="grid grid-cols-2 gap-4">
          {[
            { value: true, label: 'Oui' },
            { value: false, label: 'Non' },
          ].map((option) => {
            const isSelected = userProfile.includeSnacks === option.value;
            return (
              <div
                key={option.value.toString()}
                className={`selection-card ${isSelected ? 'selection-card-active' : ''}`}
                onClick={() => updateUserProfile({ includeSnacks: option.value })}
              >
                <p className="font-medium">{option.label}</p>
                {isSelected && <div className="selection-card-check absolute top-2 right-2">✓</div>}
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Utilisez-vous ou acceptez-vous les protéines whey ?
        </label>
        <div className="grid grid-cols-2 gap-4">
          {[
            { value: true, label: 'Oui' },
            { value: false, label: 'Non' },
          ].map((option) => {
            const isSelected = userProfile.usesWhey === option.value;
            return (
              <div
                key={option.value.toString()}
                className={`selection-card ${isSelected ? 'selection-card-active' : ''}`}
                onClick={() => updateUserProfile({ usesWhey: option.value })}
              >
                <p className="font-medium">{option.label}</p>
                {isSelected && <div className="selection-card-check absolute top-2 right-2">✓</div>}
              </div>
            );
          })}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Certains petits-déjeuners contiennent des protéines whey pour augmenter l'apport protéique
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Préférez-vous des repas végétariens ?
        </label>
        <div className="grid grid-cols-2 gap-4">
          {[
            { value: true, label: 'Oui, végétarien' },
            { value: false, label: 'Non, tout' },
          ].map((option) => {
            const isSelected = userProfile.isVegetarian === option.value;
            return (
              <div
                key={option.value.toString()}
                className={`selection-card ${isSelected ? 'selection-card-active' : ''}`}
                onClick={() => updateUserProfile({ isVegetarian: option.value })}
              >
                <p className="font-medium">{option.label}</p>
                {isSelected && <div className="selection-card-check absolute top-2 right-2">✓</div>}
              </div>
            );
          })}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Les repas végétariens excluent la viande et le poisson mais incluent œufs et produits laitiers
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Avez-vous des allergies ou intolérances alimentaires ?
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {commonAllergens.map((allergen) => {
            const isSelected = (userProfile.allergies || []).includes(allergen);
            return (
              <div
                key={allergen}
                onClick={() => toggleAllergy(allergen)}
                className={`selection-card ${isSelected ? 'selection-card-active' : ''}`}
              >
                <p className="text-sm font-medium">{allergen}</p>
                {isSelected && (
                  <div className="selection-card-check absolute top-2 right-2">
                    ✓
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Sélectionnez tous les allergènes que vous devez éviter. Les repas seront filtrés en conséquence.
        </p>
      </div>
    </div>
  );
};
