# 🔐 Configuration Google OAuth2 - Forum ENICarthage

## 📋 Architecture

Le système supporte maintenant deux méthodes de connexion:
1. **Email/Mot de passe** - Authentification classique
2. **Google Sign-In** - OAuth2 avec auto-création d'utilisateur par email

## 🚀 Étapes de Configuration

### 1. Créer un Google Cloud Project

1. Accédez à [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet nommé "Forum ENICarthage"
3. Allez à **APIs & Services** > **Credentials**
4. Cliquez sur **Create Credentials** > **OAuth 2.0 Client ID**
5. Sélectionnez **Web application**
6. Sous **Authorized redirect URIs**, ajoutez:
   - `http://localhost:8080/login/oauth2/code/google` (développement)
   - `https://votre-domaine.com/login/oauth2/code/google` (production)

### 2. Obtenir les identifiants

Après création, vous recevrez:
- **Client ID** (ex: `1234567890-abcdefg.apps.googleusercontent.com`)
- **Client Secret** (ex: `GOCSPX-...`)

### 3. Configuration Backend (Spring Boot)

#### Variables d'environnement

Définissez les variables d'environnement système:

```bash
# Linux/Mac
export GOOGLE_CLIENT_ID=YOUR_CLIENT_ID
export GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET

# Windows PowerShell
$env:GOOGLE_CLIENT_ID="YOUR_CLIENT_ID"
$env:GOOGLE_CLIENT_SECRET="YOUR_CLIENT_SECRET"

# Windows CMD
set GOOGLE_CLIENT_ID=YOUR_CLIENT_ID
set GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET
```

Ou modifiez `application.properties`:

```properties
spring.security.oauth2.client.registration.google.client-id=YOUR_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=YOUR_CLIENT_SECRET
```

### 4. Configuration Frontend (Angular)

Modifiez les fichiers d'environnement:

**`src/environments/environment.ts`** (développement):
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  googleClientId: 'YOUR_GOOGLE_CLIENT_ID'
};
```

**`src/environments/environment.prod.ts`** (production):
```typescript
export const environment = {
  production: true,
  apiUrl: '/api',
  googleClientId: 'YOUR_GOOGLE_CLIENT_ID'
};
```

## 🔗 Flux d'Authentification Google

### Frontend (Angular)

```
1. Utilisateur clique sur "Se connecter avec Google"
   ↓
2. Google Sign-In ouvre la page d'authentification Google
   ↓
3. Utilisateur se connecte avec son compte Google
   ↓
4. Google retourne un ID Token signé
   ↓
5. Frontend envoie le token au backend: POST /api/auth/google/login
```

### Backend (Spring Boot)

```
1. Reçoit le Google ID Token du frontend
   ↓
2. Valide le token avec les clés publiques de Google
   ↓
3. Extrait les informations utilisateur (email, nom, photo)
   ↓
4. Recherche l'utilisateur dans la BD par email
   ↓
5. Si n'existe pas:
      - Crée automatiquement un nouvel utilisateur
      - Rôle par défaut: "MEMBRE"
      - Mot de passe: vide (OAuth user)
   ↓
6. Génère un JWT token Forum
   ↓
7. Retourne le token + infos utilisateur au frontend
```

## 📦 Dépendances Ajoutées

### Maven (Backend)
```xml
<!-- Google OAuth2 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-oauth2-client</artifactId>
</dependency>
<dependency>
    <groupId>com.google.api-client</groupId>
    <artifactId>google-api-client</artifactId>
    <version>1.35.2</version>
</dependency>
```

### Frontend
- **Google Sign-In SDK**: Chargé via `https://accounts.google.com/gsi/client`
- Intégré dans `index.html`

## 🧪 Test Local

### 1. Démarrer le backend
```bash
cd backend/forum-enicarthage
mvn clean install
mvn spring-boot:run
```

### 2. Démarrer le frontend
```bash
cd frontend/forum-enicarthage-app
npm install
ng serve
```

### 3. Accéder à l'app
```
http://localhost:4200
```

### 4. Tester la connexion Google
1. Cliquez sur "Se connecter avec Google"
2. Authentifiez-vous avec votre compte Google
3. Vérifiez que vous êtes redirigé vers le dashboard

## 🔐 Sécurité

✅ **Points forts**:
- Token ID Google validé côté backend
- Pas de stockage du mot de passe Google
- JWT interne pour sessions Forum
- Token stocké dans sessionStorage (XSS mitigation)

⚠️ **À considérer**:
- Vérifiez l'HTTPS en production
- Limitez les requêtes avec rate limiting
- Auditez les permissions Google demandées

## 🐛 Troubleshooting

### Erreur: "Invalid ID token"
- Vérifiez que `googleClientId` est correct
- Confirmez que le token n'a pas expiré (validité: ~1 heure)

### Erreur: "Cross-Origin Request Blocked"
- Configurez CORS dans le backend
- Ajoutez `http://localhost:4200` aux origines autorisées

### Utilisateur créé sans rôle
- Le rôle par défaut est "MEMBRE"
- Un admin doit modifier le rôle dans l'interface admin si nécessaire

## 📚 Fichiers Modifiés

### Backend
- ✅ `pom.xml` - Dépendances OAuth2
- ✅ `application.properties` - Config Google OAuth2
- ✅ `AuthController.java` - Nouvel endpoint `/api/auth/google/login`
- ✅ `AuthService.java` - Méthode `loginWithGoogle()`
- ✨ `GoogleOAuth2Service.java` - Service de validation des tokens
- ✨ `GoogleLoginRequest.java` - DTO pour la requête

### Frontend
- ✅ `index.html` - SDK Google chargé
- ✅ `environment.ts` - Config Client ID
- ✅ `environment.prod.ts` - Config Client ID
- ✅ `login.component.ts` - Intégration Google Sign-In
- ✅ `login.component.html` - Bouton Google
- ✨ `google-auth.service.ts` - Service Google Auth
- ✅ `auth.service.ts` - Méthodes saveToken() et setCurrentUser()

## 🎯 Prochaines étapes

1. **Configurer les identifiants Google** (voir étapes 1-2)
2. **Tester en local** (voir section Test Local)
3. **Déployer en production** avec HTTPS
4. **Monitorer les connexions** dans Google Cloud Console

---

**Questions?** Consultez la [documentation Google Sign-In](https://developers.google.com/identity/gsi/web)
