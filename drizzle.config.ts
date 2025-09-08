/**
 * Drizzle Configuration
 * Configuration pour les migrations et la génération de types
 */

import type { Config } from 'drizzle-kit';

export default {
	schema: './src/lib/infrastructure/database/schema.ts',
	out: './drizzle',
	dialect: 'postgresql',
	dbCredentials: {
		url: process.env.DATABASE_URL!,
	},
} satisfies Config;
