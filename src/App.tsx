import { AnimatePresence } from 'framer-motion';
import { useAppStore } from './store/useAppStore';
import { Welcome } from './components/Welcome';
import { Questionnaire } from './components/Questionnaire';
import { Results } from './components/Results';
import { PlanSelection } from './components/PlanSelection';
import { MealPlanDetails } from './components/MealPlanDetails';

function App() {
  const { currentStep } = useAppStore();

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {currentStep === 'welcome' && <Welcome key="welcome" />}
        {currentStep === 'questionnaire' && <Questionnaire key="questionnaire" />}
        {currentStep === 'results' && <Results key="results" />}
        {currentStep === 'plan' && <PlanSelection key="plan" />}
        {currentStep === 'details' && <MealPlanDetails key="details" />}
      </AnimatePresence>
    </div>
  );
}

export default App;
