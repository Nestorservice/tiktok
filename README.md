# TikTok Clone — React Native CLI

Clone de TikTok de haute qualité produit avec React Native CLI et un backend Firebase complet.

## 🚀 Fonctionnalités

- **Authentification Complète :** Inscription, connexion et déconnexion avec Firebase Auth.
- **Flux Vidéo (Feed) :** Défilement fluide en plein écran avec lecture automatique (autoplay), pause/lecture au toucher.
- **Interactions Sociales :**
  - Système de "Like" (J'aime) avec animation Lottie (double-tap).
  - Commentaires en temps réel avec Bottom Sheet.
  - Système d'abonnement (Follow/Unfollow) entre utilisateurs.
- **Découverte :** Recherche de vidéos et hashtags tendances.
- **Profils Utilisateurs :**
  - Profil personnel avec édition (bio, nom d'affichage).
  - Consultation des profils d'autres utilisateurs depuis le flux ou les commentaires.
  - Grille de vidéos publiées.
- **Création de Contenu :**
  - Caméra intégrée (Vision Camera) avec gestion du flash et switch caméra.
  - Enregistrement vidéo et écran de pré-publication (hashtags, description).
  - Upload avec compression vidéo et barre de progression.
- **Boîte de Réception :** Notifications d'activité (Likes, Commentaires, Abonnés).

## 🛠 Tech Stack

- **Framework :** React Native CLI (Architecture 0.85+)
- **Langage :** TypeScript
- **Backend :** Firebase (Auth, Firestore, Storage, Cloud Messaging)
- **Gestion d'état :** Redux Toolkit (Slices pour auth, feed, player, ui)
- **Navigation :** React Navigation 6 (Bottom Tabs + Stack)
- **Vidéo :** react-native-video & react-native-vision-camera
- **Animations :** React Native Reanimated 3 & Lottie
- **UI :** FastImage (optimisation images), Bottom Sheet (Gorhom), Linear Gradient, Vector Icons (Ionicons).

## 📦 Installation

### Prérequis
- Node.js >= 22.11.0
- Android Studio & SDK (pour Android)
- Xcode & CocoaPods (pour iOS)
- Un compte Firebase

### Étapes

1. **Cloner le projet :**
   ```bash
   git clone <votre-lien-depot>
   cd tiktok
   ```

2. **Installer les dépendances :**
   ```bash
   npm install --legacy-peer-deps
   ```

4. **Configuration Firebase :**
   - Créez un projet sur la [Console Firebase](https://console.firebase.google.com/).
   - Activez **Authentication** (Email/Mot de passe), **Firestore**, **Storage**, et **Cloud Messaging**.
   - **Important :** Utilisez le nom de package `com.captcut` lors de la création de l'application Android dans Firebase.
   - Téléchargez `google-services.json` (Android) et placez-le dans `android/app/`.

   - Téléchargez `GoogleService-Info.plist` (iOS) et placez-le dans `ios/tiktok/`.

4. **Installer les Pods (iOS uniquement) :**
   ```bash
   cd ios && pod install && cd ..
   ```

5. **Lancer l'application :**
   ```bash
   # Android
   npm run android

   # iOS
   npm run ios
   ```

## 🧪 Tests

Pour tester les fonctionnalités principales :
- **Flux :** Swiper verticalement pour changer de vidéo.
- **Like :** Double-taper sur la vidéo ou cliquer sur le cœur.
- **Commentaires :** Cliquer sur l'icône de commentaire, en ajouter un, et cliquer sur le profil du commentateur.
- **Profil :** Cliquer sur l'avatar dans le flux pour voir le profil de l'auteur.
- **Upload :** Cliquer sur le bouton "+" central, enregistrer une vidéo, ajouter une description et publier.

## 🌱 Données de Démo (Seed)

Pour remplir votre base de données avec 5 utilisateurs et 20 vidéos de test :
1. Récupérez votre clé privée de compte de service Firebase (JSON).
2. Nommez-la `firebase-service-account.json` à la racine.
3. Lancez le script :
   ```bash
   npx ts-node scripts/seedFirestore.ts
   ```

## 📈 Améliorations Futures (Roadmap Pro)

- [ ] **Messagerie Directe :** Chat en temps réel entre utilisateurs.
- [ ] **Édition Vidéo :** Ajout de filtres, musique de fond et découpage.
- [ ] **Pagination Infinie :** Optimisation avancée du cache pour le flux.
- [ ] **Live Streaming :** Support des diffusions en direct.
- [ ] **Partage Externe :** Intégration profonde avec les réseaux sociaux.

---
Développé avec ❤️ par le groupe 6.
