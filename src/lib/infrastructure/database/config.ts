/**
 * Database Configuration - Infrastructure Layer
 * Configuration de la base de données PostgreSQL avec Drizzle ORM
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js';

// Configuration de la connexion à la base de données
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
	throw new Error('DATABASE_URL environment variable is required');
}

// Créer la connexion PostgreSQL
const client = postgres(connectionString, {
	prepare: false,
	max: 20,
	idle_timeout: 20,
	connect_timeout: 10,
});

// Créer l'instance Drizzle
export const db = drizzle(client, { schema });

// Export du client pour les opérations directes si nécessaire
export { client };

// Fonction pour fermer la connexion
export async function closeDatabaseConnection() {
	await client.end();
}
