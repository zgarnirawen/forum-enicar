# 🚀 Forum ENICarthage - Quick Start Guide

## ✅ Configuration Complète!

Votre environnement est maintenant sécurisé. Les fichiers sensibles sont protégés par `.gitignore`.

---

## 🔐 Fichiers Sensibles Configurés

✅ **`.env`** - Fichier local avec tous les secrets (JAMAIS commiter)
✅ **`application.properties`** - Utilise les variables d'environnement
✅ **`environment.ts/prod.ts`** - Configurés avec Google Client ID
✅ **`.gitignore`** - Protège tous les fichiers sensibles

---

## 🎯 Démarrer l'Application

### Option 1: Windows PowerShell (Recommandé)

```powershell
# Terminal 1 - Charger les variables d'env et démarrer Backend
. .\load-env.ps1  # Charge les variables du .env
cd backend/forum-enicarthage
mvn clean install
mvn spring-boot:run

# Terminal 2 - Frontend
cd frontend/forum-enicarthage-app
npm install      # Si première fois
ng serve
```

### Option 2: Windows Command Prompt

```cmd
# Terminal 1 - Backend
cd backend\forum-enicarthage
set /p GOOGLE_CLIENT_ID= < .env
set /p GOOGLE_CLIENT_SECRET= < .env
mvn spring-boot:run

# Terminal 2 - Frontend
cd frontend\forum-enicarthage-app
ng serve
```

### Option 3: Linux / macOS

```bash
# Terminal 1 - Backend
source load-env.sh  # Charge les variables du .env
cd backend/forum-enicarthage
mvn spring-boot:run

# Terminal 2 - Frontend
cd frontend/forum-enicarthage-app
ng serve
```

---

## 📍 Accéder à l'Application

- **Frontend**: http://localhost:4200
- **Backend**: http://localhost:8080
- **API**: http://localhost:8080/api

---

## 🧪 Tester Google OAuth2

### 1. Login Page
1. Allez à http://localhost:4200/auth/login
2. Cliquez sur le bouton "Sign in with Google"
3. Authentifiez-vous avec votre compte Google
4. Vous devriez être redirigé au dashboard

### 2. Register Page
1. Allez à http://localhost:4200/auth/register
2. Cliquez sur "Sign up with Google"  
3. Authentifiez-vous avec votre compte Google
4. Choisissez votre rôle à l'étape 2
5. Compte créé automatiquement!

---

## 🔧 Configuration des Variables d'Environnement

Si vous préférez configurer manuellement (sans script):

### Windows PowerShell
```powershell
$env:GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID"
$env:GOOGLE_CLIENT_SECRET = "YOUR_GOOGLE_CLIENT_SECRET"
$env:APP_JWT_SECRET = "your-jwt-secret-here"
```

### Linux / macOS
```bash
export GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID"
export GOOGLE_CLIENT_SECRET="YOUR_GOOGLE_CLIENT_SECRET"
export APP_JWT_SECRET="your-jwt-secret-here"
```

---

## 📋 Fichiers Créés

| Fichier | Type | Purpose |
|---------|------|---------|
| `.env` | Local Secret | Contient vos identifiants (git-ignored) |
| `.env.example` | Template | Template pour nouveaux devs |
| `load-env.ps1` | PowerShell Script | Charge variables d'env (Windows) |
| `load-env.sh` | Bash Script | Charge variables d'env (Linux/Mac) |
| `.gitignore` (root) | Config | Protège les fichiers sensibles |
| `SETUP_CREDENTIALS.md` | Documentation | Guide détaillé configuration |
| `application.properties.example` | Backend Template | Template pour backend |
| `environment.example.ts` | Frontend Template | Template pour frontend |

---

## 🚨 Avant de Committer

```bash
# Vérifier que les secrets ne sont pas commitées
git status
# Vous NE devriez pas voir:
# - .env
# - application.properties
# - environment.ts (s'il contient des secrets réels)

# Committer les fichiers sûrs
git add .
git commit -m "⬆️ chore: secure credentials configuration"
git push origin main
```

---

## 🐛 Troubleshooting

### Backend ne démarre pas
```
Error: GOOGLE_CLIENT_SECRET is null
```
**Solution**: Assurez-vous que vous avez chargé le `.env`:
```powershell
. .\load-env.ps1
```

### Google Sign-In ne fonctionne pas
```
Error: Client ID mismatch
```
**Solution**: Vérifiez que le Client ID dans `environment.ts` correspond au `.env`:
```typescript
googleClientId: '846324392586-jhn85ile5r300a4okook5ab2sgd4b9kq.apps.googleusercontent.com'
```

### Erreur: "Redirect URI mismatch"
**Solution**: Confirmez dans Google Cloud Console:
1. Allez à https://console.cloud.google.com/
2. APIs & Services > Credentials
3. Cliquez sur votre OAuth2 Client
4. Vérifiez "Authorized redirect URIs":
   - `http://localhost:8080/login/oauth2/code/google`

---

## 📚 Documentation Complète

- [Détails Configuration](./SETUP_CREDENTIALS.md)
- [Google OAuth2 Setup](./backend/forum-enicarthage/GOOGLE_OAUTH2_SETUP.md)

---

## ✨ Prêt à Développer!

Votre application est maintenant:
- ✅ Sécurisée (secrets protégés)
- ✅ Configurée (Google OAuth2)
- ✅ Prête au déploiement
- ✅ Suivant les meilleures pratiques

Commencez à développer! 🎉

```bash
# Quick start command
. .\load-env.ps1
cd backend/forum-enicarthage
mvn spring-boot:run
```

```bash
# In another terminal
cd frontend/forum-enicarthage-app
ng serve
```

Puis ouvrez http://localhost:4200 👉
