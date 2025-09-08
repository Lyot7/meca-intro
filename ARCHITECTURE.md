# Architecture KPSULL - Clean Architecture

## Vue d'ensemble

Le projet KPSULL suit les principes de **Clean Architecture** pour assurer une séparation claire des responsabilités et une maintenabilité optimale du code.

## Structure des Couches

```
src/lib/
├── domain/                 # Couche Domaine (Business Logic)
│   ├── entities/          # Entités métier
│   ├── repositories/      # Interfaces des repositories
│   └── use-cases/         # Cas d'usage métier
├── application/           # Couche Application
│   ├── services/          # Services applicatifs
│   └── interfaces/        # Interfaces des services
├── infrastructure/        # Couche Infrastructure
│   ├── database/          # Configuration et schémas DB
│   ├── repositories/      # Implémentations des repositories
│   └── external/          # Services externes (Stripe, etc.)
└── presentation/          # Couche Présentation
    ├── components/        # Composants Svelte
    ├── stores/           # Stores Svelte
    └── utils/            # Utilitaires UI
```

## Principes de Clean Architecture

### 1. Dépendances vers l'intérieur
- Les couches externes dépendent des couches internes
- Le domaine ne dépend de rien d'autre
- L'infrastructure implémente les interfaces du domaine

### 2. Séparation des responsabilités
- **Domain** : Logique métier pure, entités, règles business
- **Application** : Orchestration des cas d'usage, services applicatifs
- **Infrastructure** : Persistance, services externes, configuration
- **Presentation** : Interface utilisateur, stores, composants

### 3. Inversion de dépendance
- Les repositories sont des interfaces dans le domaine
- Les implémentations concrètes sont dans l'infrastructure
- Les services applicatifs dépendent des interfaces, pas des implémentations

## Couche Domaine

### Entités
- `Creator` : Représente un créateur avec ses abonnements
- `Product` : Représente un produit avec ses variantes
- `Order` : Représente une commande
- `Cart` : Représente un panier d'achat

### Repositories (Interfaces)
- `ICreatorRepository` : Gestion des créateurs
- `IProductRepository` : Gestion des produits
- `IOrderRepository` : Gestion des commandes
- `ICartRepository` : Gestion des paniers

### Use Cases
- `CreateCreatorUseCase` : Création d'un créateur
- `CreateProductUseCase` : Création d'un produit
- `AddToCartUseCase` : Ajout au panier

## Couche Application

### Services
- `AuthService` : Authentification et autorisation
- `ProductService` : Gestion des produits
- `CartService` : Gestion du panier

### Interfaces
- Définissent les contrats des services
- Permettent l'injection de dépendances
- Facilitent les tests unitaires

## Couche Infrastructure

### Base de données
- Configuration PostgreSQL avec Drizzle ORM
- Schémas typés avec migrations
- Repositories concrets implémentant les interfaces du domaine

### Services externes
- Stripe pour les paiements
- Lucia Auth pour l'authentification
- Services d'upload d'images

## Couche Présentation

### Stores Svelte
- `authStore` : Gestion de l'authentification
- `cartStore` : Gestion du panier
- État réactif et persistant

### Composants
- Composants réutilisables
- Logique UI séparée de la logique métier
- Props typées avec TypeScript

## Avantages de cette Architecture

### 1. Testabilité
- Chaque couche peut être testée indépendamment
- Mocks faciles grâce aux interfaces
- Tests unitaires et d'intégration séparés

### 2. Maintenabilité
- Code organisé et prévisible
- Modifications isolées par couche
- Évolution facilitée

### 3. Flexibilité
- Changement de base de données sans impact sur le domaine
- Ajout de nouvelles fonctionnalités sans casser l'existant
- Support de multiples interfaces (web, mobile, API)

### 4. Sécurité
- Validation des données à chaque couche
- Séparation des responsabilités sécuritaires
- Contrôle d'accès centralisé

## Règles de Développement

### 1. Respect des dépendances
- Jamais d'import depuis l'infrastructure vers le domaine
- Les services applicatifs n'importent que les interfaces
- La présentation utilise les stores et services

### 2. Naming Convention
- Entités : `CreatorEntity`, `ProductEntity`
- Repositories : `ICreatorRepository`, `CreatorRepository`
- Services : `AuthService`, `ProductService`
- Use Cases : `CreateCreatorUseCase`

### 3. Gestion des erreurs
- Erreurs métier dans le domaine
- Erreurs applicatives dans l'application
- Erreurs techniques dans l'infrastructure

### 4. Types TypeScript
- Interfaces strictes pour tous les contrats
- Types générés automatiquement par Drizzle
- Validation des données d'entrée

## Migration et Évolution

### Ajout d'une nouvelle fonctionnalité
1. Définir l'entité dans le domaine
2. Créer l'interface du repository
3. Implémenter le repository dans l'infrastructure
4. Créer le service applicatif
5. Ajouter les routes API
6. Créer les composants UI

### Modification d'une entité
1. Modifier l'entité dans le domaine
2. Mettre à jour l'interface du repository
3. Créer une migration de base de données
4. Mettre à jour l'implémentation du repository
5. Adapter les services applicatifs
6. Mettre à jour l'interface utilisateur

## Outils et Technologies

- **SvelteKit** : Framework frontend
- **TypeScript** : Typage statique
- **Drizzle ORM** : ORM type-safe
- **PostgreSQL** : Base de données
- **Tailwind CSS + DaisyUI** : Styling
- **Lucia Auth** : Authentification
- **Stripe** : Paiements

Cette architecture garantit un code maintenable, testable et évolutif pour le projet KPSULL.
