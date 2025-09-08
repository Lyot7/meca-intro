/**
 * Seed Script
 * Script pour initialiser la base de données avec des données de test
 */

import { seedDatabase } from '../src/lib/infrastructure/database/seed.js';

async function main() {
	try {
		await seedDatabase();
		console.log('✅ Seed terminé avec succès');
	} catch (error) {
		console.error('❌ Erreur lors du seed:', error);
		process.exit(1);
	}
}

main();
