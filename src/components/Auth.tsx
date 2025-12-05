import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { Button } from './UI/Button';
import { Card } from './UI/Card';
import { Input } from './UI/Input';
import { authService } from '../services/authService';

interface AuthProps {
  onSuccess: () => void;
  onSkip?: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onSuccess, onSkip }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        await authService.signUp(email, password, fullName);
        setSuccessMessage('Compte créé avec succès ! Vérifiez votre email pour confirmer votre compte.');
        // Basculer vers login après inscription
        setTimeout(() => {
          setMode('login');
          setSuccessMessage(null);
        }, 3000);
      } else {
        await authService.signIn(email, password);
        setSuccessMessage('Connexion réussie !');
        setTimeout(() => {
          onSuccess();
        }, 1000);
      }
    } catch (err: any) {
      console.error('Erreur d\'authentification:', err);

      // Messages d'erreur en français
      if (err.message.includes('Email not confirmed')) {
        setError('⚠️ Veuillez confirmer votre email avant de vous connecter. Vérifiez votre boîte de réception et vos spams.');
      } else if (err.message.includes('Invalid login credentials')) {
        // L'erreur peut être due à un email non confirmé ou des identifiants incorrects
        setError('Email ou mot de passe incorrect. Si vous venez de créer votre compte, pensez à confirmer votre email.');
      } else if (err.message.includes('User already registered')) {
        setError('Cet email est déjà utilisé');
      } else if (err.message.includes('Password should be at least')) {
        setError('Le mot de passe doit contenir au moins 6 caractères');
      } else {
        setError(err.message || 'Une erreur est survenue');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-gradient">NutriPlan</span>
          </h1>
          <p className="text-gray-600">
            {mode === 'login'
              ? 'Connectez-vous à votre compte'
              : 'Créez votre compte gratuit'}
          </p>
        </div>

        <Card glass>
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                mode === 'login'
                  ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <LogIn className="w-4 h-4 inline mr-2" />
              Connexion
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                mode === 'signup'
                  ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <UserPlus className="w-4 h-4 inline mr-2" />
              Inscription
            </button>
          </div>

          {/* Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2"
            >
              <AlertCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-700">{successMessage}</p>
            </motion.div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <Input
                icon={<User className="w-5 h-5" />}
                label="Nom complet"
                type="text"
                placeholder="Jean Dupont"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required={mode === 'signup'}
              />
            )}

            <Input
              icon={<Mail className="w-5 h-5" />}
              label="Email"
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              icon={<Lock className="w-5 h-5" />}
              label="Mot de passe"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {mode === 'signup' && (
              <p className="text-xs text-gray-500">
                Le mot de passe doit contenir au moins 6 caractères
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={loading}
              disabled={loading}
            >
              {mode === 'login' ? (
                <>
                  <LogIn className="w-5 h-5" />
                  Se connecter
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Créer mon compte
                </>
              )}
            </Button>
          </form>

          {/* Lien de récupération */}
          {mode === 'login' && (
            <div className="mt-4 text-center">
              <button
                type="button"
                className="text-sm text-primary-600 hover:text-primary-700 hover:underline"
                onClick={() => {
                  // TODO: Implémenter la récupération de mot de passe
                  alert('Fonctionnalité de récupération de mot de passe à venir');
                }}
              >
                Mot de passe oublié ?
              </button>
            </div>
          )}
        </Card>

        {/* Bouton continuer sans compte */}
        {onSkip && (
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={onSkip}
              className="text-sm text-gray-600 hover:text-gray-800 hover:underline"
            >
              Continuer sans compte
            </button>
          </div>
        )}

        {/* Note de confidentialité */}
        <p className="text-center text-xs text-gray-500 mt-6">
          En vous inscrivant, vous acceptez nos conditions d'utilisation
          et notre politique de confidentialité
        </p>
      </motion.div>
    </div>
  );
};
