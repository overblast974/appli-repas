# Configuration Supabase pour NutriPlan

Ce guide explique comment configurer Supabase pour l'application NutriPlan.

## 1. Créer les tables dans Supabase

1. Connectez-vous à votre [Dashboard Supabase](https://app.supabase.com/)
2. Sélectionnez votre projet
3. Dans le menu de gauche, cliquez sur **"SQL Editor"**
4. Cliquez sur **"New Query"**
5. Copiez-collez le contenu du fichier `supabase-schema.sql`
6. Cliquez sur **"Run"**

Cela va créer :
- La table `profiles` pour les profils utilisateurs
- La table `meal_plans` pour stocker les plannings alimentaires
- Les politiques de sécurité (Row Level Security)
- Les index pour optimiser les performances
- Les triggers pour mettre à jour automatiquement les timestamps

## 2. Configurer l'authentification par email

1. Dans le Dashboard Supabase, allez dans **"Authentication"** > **"Providers"**
2. Assurez-vous que **"Email"** est activé
3. Configurez les paramètres d'email :
   - **Confirm email** : Activé (recommandé)
   - **Email templates** : Vous pouvez personnaliser les templates d'emails

## 3. Configurer les URL de redirection (optionnel)

1. Allez dans **"Authentication"** > **"URL Configuration"**
2. Ajoutez les URLs autorisées :
   - Pour le développement local : `http://localhost:5173`
   - Pour la production : `https://overblast974.github.io/appli-repas/`

## 4. Vérifier les clés API

Les clés API sont déjà configurées dans `src/lib/supabase.ts`:
- **URL**: `https://djztoaxkhrufygdjbrbx.supabase.co`
- **Anon Key**: Déjà configurée (visible dans le code)

⚠️ **Important** : La clé `anon` est sûre à exposer dans le code client car elle est protégée par les politiques RLS (Row Level Security). Seuls les utilisateurs authentifiés peuvent accéder à leurs propres données.

## 5. Fonctionnalités disponibles

### Authentification
- ✅ Inscription avec email et mot de passe
- ✅ Connexion
- ✅ Déconnexion
- ✅ Vérification d'email (configurable)
- ✅ Réinitialisation de mot de passe (à implémenter dans l'UI)

### Stockage des données
- ✅ Sauvegarde automatique des plans de repas
- ✅ Récupération des plans d'un utilisateur
- ✅ Suppression des plans
- ✅ Expiration automatique après 90 jours

### Sécurité
- ✅ Row Level Security (RLS) activé
- ✅ Les utilisateurs ne peuvent accéder qu'à leurs propres données
- ✅ Protection contre les injections SQL
- ✅ Authentification sécurisée par JWT

## 6. Tester la configuration

1. Lancez l'application en développement : `npm run dev`
2. Créez un nouveau compte
3. Vérifiez dans le Dashboard Supabase que :
   - Un nouveau profil a été créé dans la table `profiles`
   - Vous pouvez voir l'utilisateur dans **"Authentication"** > **"Users"**

4. Générez un plan de repas
5. Vérifiez dans le Dashboard Supabase que :
   - Un nouveau plan a été créé dans la table `meal_plans`
   - Le `user_id` correspond bien à votre utilisateur

## 7. Maintenance

### Nettoyer les plans expirés
Vous pouvez exécuter cette fonction périodiquement (par exemple, avec un cron job) :

```sql
SELECT delete_expired_meal_plans();
```

### Voir les statistiques
```sql
-- Nombre total d'utilisateurs
SELECT COUNT(*) FROM profiles;

-- Nombre total de plans
SELECT COUNT(*) FROM meal_plans;

-- Plans par utilisateur
SELECT
  p.email,
  COUNT(mp.id) as plan_count
FROM profiles p
LEFT JOIN meal_plans mp ON p.id = mp.user_id
GROUP BY p.email;
```

## 8. Dépannage

### Erreur "row level security"
- Vérifiez que les politiques RLS sont bien créées
- Vérifiez que l'utilisateur est bien authentifié
- Consultez les logs dans **"Database"** > **"Logs"**

### Problème d'authentification
- Vérifiez que l'URL et la clé anon sont correctes
- Vérifiez les CORS dans **"Settings"** > **"API"**
- Consultez les logs dans la console du navigateur

### Plan non sauvegardé
- Vérifiez que l'utilisateur est connecté
- Vérifiez les permissions RLS
- Consultez la console pour les erreurs

## Support

Pour plus d'informations, consultez la [documentation officielle Supabase](https://supabase.com/docs).
