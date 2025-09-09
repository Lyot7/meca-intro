-- Script d'initialisation de la base de données KPSULL
-- Ce script s'exécute automatiquement au premier démarrage du conteneur PostgreSQL

-- Créer la base de données si elle n'existe pas déjà
-- (PostgreSQL crée automatiquement la base spécifiée dans POSTGRES_DB)

-- Activer les extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Le schéma sera créé par les migrations Drizzle
