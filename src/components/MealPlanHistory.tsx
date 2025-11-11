import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, Clock, Trash2, ArrowLeft, Download } from 'lucide-react';
import { Button } from './UI/Button';
import { Card } from './UI/Card';
import { useAppStore } from '../store/useAppStore';
import { useAuthStore } from '../store/useAuthStore';
import { exportService } from '../services/exportService';

export const MealPlanHistory: React.FC = () => {
  const { setStep } = useAppStore();
  const { userMealPlans, loadingPlans, loadUserMealPlans, deleteMealPlan } = useAuthStore();

  useEffect(() => {
    loadUserMealPlans();
  }, [loadUserMealPlans]);

  const handleViewPlan = (planData: any) => {
    // Charger le plan dans l'état de l'application
    useAppStore.setState({
      currentMealPlan: planData.plan_data,
      currentStep: 'details',
    });
  };

  const handleDownloadPlan = (planData: any) => {
    try {
      exportService.generatePDF(planData.plan_data);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      alert('Erreur lors de la génération du PDF');
    }
  };

  const handleDeletePlan = async (planId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce plan ?')) {
      try {
        await deleteMealPlan(planId);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression du plan');
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loadingPlans) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="spinner mb-4 mx-auto" style={{ width: '48px', height: '48px' }} />
          <p className="text-gray-600">Chargement de vos plannings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 py-12 pb-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" onClick={() => setStep('welcome')}>
              <ArrowLeft className="w-5 h-5" />
              Retour
            </Button>
          </div>

          <h1 className="text-4xl font-bold mb-2">
            <span className="text-gradient">Mes Plannings</span>
          </h1>
          <p className="text-gray-600">
            Retrouvez tous vos plannings alimentaires sauvegardés
          </p>
        </motion.div>

        {/* Plans List */}
        {userMealPlans.length === 0 ? (
          <Card glass className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Aucun planning pour le moment
              </h3>
              <p className="text-gray-600 mb-6">
                Créez votre premier planning alimentaire personnalisé pour commencer
              </p>
              <Button variant="primary" onClick={() => setStep('welcome')}>
                Créer un planning
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userMealPlans.map((plan, index) => {
              const planData = plan.plan_data;
              const duration = plan.duration;
              const createdAt = plan.created_at;
              const expiresAt = plan.expires_at;

              // Vérifier si le plan est expiré
              const isExpired = expiresAt && new Date(expiresAt) < new Date();

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    glass
                    hover
                    className={`cursor-pointer ${isExpired ? 'opacity-60' : ''}`}
                    onClick={() => !isExpired && handleViewPlan(plan)}
                  >
                    {/* Badge durée */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="px-3 py-1 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-full text-sm font-medium">
                        {duration} jour{duration > 1 ? 's' : ''}
                      </div>
                      {isExpired && (
                        <span className="text-xs text-red-600 font-medium">Expiré</span>
                      )}
                    </div>

                    {/* Infos nutritionnelles */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-2xl font-bold text-gray-800">
                          {planData.metabolicResults.adjustedCalories}
                        </span>
                        <span className="text-sm">kcal/jour</span>
                      </div>

                      <div className="flex gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">P: </span>
                          <span className="font-medium text-primary-600">
                            {Math.round(planData.metabolicResults.macros.protein)}g
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">G: </span>
                          <span className="font-medium text-blue-600">
                            {Math.round(planData.metabolicResults.macros.carbs)}g
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">L: </span>
                          <span className="font-medium text-yellow-600">
                            {Math.round(planData.metabolicResults.macros.fats)}g
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 pb-4 border-b border-gray-200">
                      <Clock className="w-4 h-4" />
                      <span>Créé le {formatDate(createdAt)}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadPlan(plan);
                        }}
                        disabled={isExpired}
                      >
                        <Download className="w-4 h-4" />
                        PDF
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePlan(plan.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Info expiration */}
        {userMealPlans.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <Card glass className="bg-blue-50">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">
                    Conservation des plannings
                  </h4>
                  <p className="text-sm text-gray-700">
                    Vos plannings sont conservés pendant 90 jours après leur création.
                    Pensez à télécharger le PDF pour une conservation permanente.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};
