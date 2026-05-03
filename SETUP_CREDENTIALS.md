# 🔐 Configuration des Identifiants et Fichiers Sensibles

Ce guide explique comment configurer les fichiers sensibles sans les committer à git.

## ⚠️ IMPORTANT - Sécurité

**JAMAIS committer à git:**
- `application.properties` (contient les secrets Backend)
- `environment.ts` (contient les secrets Frontend)
- `.env` (contient tous les secrets)
- Fichiers d'authentification Google
- Clés API

**TOUJOURS utiliser:**
- Variables d'environnement
- Fichiers `.example` pour la documentation

---

## 📋 Setup Initial (Pour Nouveaux Développeurs)

### 1. Backend - Application Properties

#### Étape 1: Copier le fichier exemple
```bash
cd backend/forum-enicarthage/src/main/resources/
cp application.properties.example application.properties
```

#### Étape 2: Configurer les variables
```properties
# Remplacez ces valeurs par vos identifiants
spring.security.oauth2.client.registration.google.client-id=YOUR_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=YOUR_CLIENT_SECRET
```

Ou mieux, utilisez les variables d'environnement:
```bash
export GOOGLE_CLIENT_ID="your-client-id"
export GOOGLE_CLIENT_SECRET="your-client-secret"
export APP_JWT_SECRET="your-jwt-secret"
```

### 2. Frontend - Environment Files

#### Étape 1: Configurer `environment.ts`
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  googleClientId: '846324392586-jhn85ile5r300a4okook5ab2sgd4b9kq.apps.googleusercontent.com'
};
```

#### Étape 2: Configurer `environment.prod.ts`
```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: '/api',
  googleClientId: '846324392586-jhn85ile5r300a4okook5ab2sgd4b9kq.apps.googleusercontent.com'
};
```

### 3. Fichier `.env` (Optionnel - Local Seulement)

```bash
cp .env.example .env
```

Puis éditez `.env` avec vos valeurs. Ce fichier est ignoré par git.

---

## 🔑 Obtenir les Identifiants Google

### Google OAuth2 Credentials

1. Allez à [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet
3. Allez à **APIs & Services** > **Credentials**
4. Cliquez sur **Create Credentials** > **OAuth 2.0 Client ID**
5. Sélectionnez **Web application**
6. Sous **Authorized redirect URIs**, ajoutez:
   ```
   http://localhost:8080/login/oauth2/code/google
   http://localhost:4200/auth/login
   ```
7. Copiez:
   - **Client ID**: `846324392586-...apps.googleusercontent.com`
   - **Client Secret**: `GOCSPX-...`

---

## 🚀 Démarrer l'Application

### Development

```bash
# Terminal 1 - Backend avec variables d'environnement
cd backend/forum-enicarthage
export GOOGLE_CLIENT_ID="your-id"
export GOOGLE_CLIENT_SECRET="your-secret"
mvn spring-boot:run

# Terminal 2 - Frontend
cd frontend/forum-enicarthage-app
ng serve
```

### Production

Sur votre serveur de production (Heroku, AWS, etc.):

```bash
# Variables d'environnement sur la plateforme
GOOGLE_CLIENT_ID = xxx
GOOGLE_CLIENT_SECRET = xxx
APP_JWT_SECRET = xxx
```

---

## 📚 Fichiers de Configuration

| Fichier | Type | Contient | Git |
|---------|------|----------|-----|
| `application.properties` | Backend | Secrets, BD | ❌ Ignoré |
| `application.properties.example` | Backend | Template | ✅ Inclus |
| `environment.ts` | Frontend | Client ID | ✅ Inclus (exemple) |
| `environment.prod.ts` | Frontend | Client ID | ✅ Inclus (exemple) |
| `.env` | Root | Tous les secrets | ❌ Ignoré |
| `.env.example` | Root | Template | ✅ Inclus |

---

## ✅ Checklist avant de Committer

- [ ] `application.properties` **N'EST PAS** dans le commit
- [ ] `environment.ts` et `environment.prod.ts` contiennent vos vraies valeurs **LOCALES SEULEMENT**
- [ ] `.env` n'existe pas sur le serveur (utilisez variables d'environnement)
- [ ] Tous les secrets sont dans `.gitignore`
- [ ] Les fichiers `.example` sont à jour

---

## 🐛 Troubleshooting

### Erreur: "Client ID not configured"
**Solution:** Vérifiez que `googleClientId` est défini dans `environment.ts`

### Erreur: "Google ID token verification failed"
**Solution:** 
- Vérifiez que le Client Secret est correct dans `application.properties`
- Confirmez que le Redirect URI est ajouté dans Google Console

### Erreur: "application.properties already exists"
**Solution:** Vous avez déjà ce fichier. Ne le suprimez pas (il contient vos secrets locaux).

---

## 📖 Documentation Supplémentaire

- [Google OAuth2 Setup](./GOOGLE_OAUTH2_SETUP.md)
- [Spring Security Docs](https://spring.io/guides/gs/securing-web/)
- [Angular Environment Guide](https://angular.io/guide/build#configuring-application-environments)

---

**Questions?** Consultez les fichiers `.example` pour voir le template exact.
