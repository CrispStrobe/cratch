
# CodePM

**CodePM** est une version améliorée de Scratch spécialement conçue pour iPad. Elle intègre des extensions utilisant l'intelligence artificielle pour offrir une expérience de programmation plus riche et interactive.

## Fonctionnalités

- Programmation visuelle inspirée de Scratch.
- Optimisée pour les iPads.
- Extensions utilisant des fonctionnalités d'IA pour enrichir les possibilités des utilisateurs.
- Interface simple et adaptée aux écrans tactiles.

## Installation

Pour installer et lancer CodePM sur un iPad, suivez les étapes ci-dessous.

### 1. Cloner le projet

Clonez le dépôt Git en utilisant la commande suivante :

```bash
git clone https://forge.apps.education.fr/codepm/app.git
```

### 2. Exécuter le script d'installation

Une fois le projet cloné, rendez-vous dans le répertoire du projet et exécutez le script d'installation `install.sh` pour installer les dépendances et configurer l'application :

```bash
cd app
chmod +x install.sh
./install.sh
```

### 3. Ouvrir le projet dans Xcode

Ensuite, ouvrez le fichier **CodePM.xcodeproj** du dossier CodePM dans Xcode :

```bash
open CodePM/CodePM.xcodeproj
```

### 4. Exécuter sur un iPad

Dans Xcode, sélectionnez un **iPad physique** comme cible de déploiement, puis exécutez le projet. Vous aurez besoin d'un **compte développeur Apple** pour déployer l'application sur un appareil physique.

## Licence

Ce projet est distribué sous la licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus d'informations.

---

**CodePM** est une initiative éducative visant à fournir un environnement de programmation intuitif et enrichi pour les jeunes apprenants, leur permettant de découvrir les concepts de la programmation et de l'intelligence artificielle de manière ludique.