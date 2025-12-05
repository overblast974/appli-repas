import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAppStore } from './store/useAppStore';
import { useAuthStore } from './store/useAuthStore';
import { Welcome } from './components/Welcome';
import { Questionnaire } from './components/Questionnaire';
import { Results } from './components/Results';
import { PlanSelection } from './components/PlanSelection';
import { MealPlanDetails } from './components/MealPlanDetails';
import { MealPlanHistory } from './components/MealPlanHistory';
import { Auth } from './components/Auth';

function App() {
  const { currentStep } = useAppStore();
  const { user, loading, initialized, initialize } = useAuthStore();
  const [showAuth, setShowAuth] = useState(false);

  // Initialiser l'authentification au démarrage
  useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialized, initialize]);

  // Afficher un loader pendant l'initialisation
  if (loading || !initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="text-center">
          <div className="spinner mb-4 mx-auto" style={{ width: '48px', height: '48px' }} />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté ET a choisi de se connecter, afficher la page de connexion
  if (!user && showAuth) {
    return <Auth onSuccess={() => setShowAuth(false)} onSkip={() => setShowAuth(false)} />;
  }

  // Afficher l'application (avec ou sans utilisateur connecté)
  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {currentStep === 'welcome' && <Welcome key="welcome" />}
        {currentStep === 'questionnaire' && <Questionnaire key="questionnaire" />}
        {currentStep === 'results' && <Results key="results" />}
        {currentStep === 'plan' && <PlanSelection key="plan" />}
        {currentStep === 'details' && <MealPlanDetails key="details" />}
        {currentStep === 'history' && <MealPlanHistory key="history" />}
      </AnimatePresence>
    </div>
  );
}

export default App;
