/**
 * Database Seed - Infrastructure Layer
 * Script pour initialiser la base de données avec des données de test
 */

import { db } from './config.js';
import { creators, products, productVariants } from './schema.js';
import { argon2id } from '@node-rs/argon2';

export async function seedDatabase() {
	try {
		console.log('🌱 Début du seed de la base de données...');

		// Hasher le mot de passe commun
		const hashedPassword = await argon2id.hash('password');

		// Créer l'utilisateur admin
		const [admin] = await db.insert(creators).values({
			id: 'admin_001',
			name: 'admin',
			email: 'admin@kpsull.com',
			passwordHash: hashedPassword,
			description: 'Administrateur de la plateforme KPSULL',
			status: 'active',
			subscriptionType: 'yearly',
			subscriptionExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 an
			subscriptionActive: true,
			createdAt: new Date(),
			updatedAt: new Date(),
		}).returning();

		// Créer l'utilisateur créateur
		const [creator] = await db.insert(creators).values({
			id: 'creator_001',
			name: 'créateur',
			email: 'createur@kpsull.com',
			passwordHash: hashedPassword,
			description: 'Créateur de mode indépendant spécialisé dans les vêtements uniques',
			website: 'https://createur-mode.com',
			socialMedia: {
				instagram: '@createur_mode',
				facebook: 'createur.mode',
			},
			status: 'active',
			subscriptionType: 'monthly',
			subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 1 mois
			subscriptionActive: true,
			createdAt: new Date(),
			updatedAt: new Date(),
		}).returning();

		// Créer l'utilisateur client
		const [client] = await db.insert(creators).values({
			id: 'client_001',
			name: 'client',
			email: 'client@kpsull.com',
			passwordHash: hashedPassword,
			description: 'Client passionné de mode et de créations uniques',
			status: 'active',
			subscriptionType: 'monthly',
			subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
			subscriptionActive: false, // Les clients n'ont pas d'abonnement
			createdAt: new Date(),
			updatedAt: new Date(),
		}).returning();

		console.log('✅ Utilisateurs créés:', { admin: admin.name, creator: creator.name, client: client.name });

		// Créer des produits pour le créateur
		const product1 = await db.insert(products).values({
			id: 'product_001',
			name: 'Robe Élégante',
			description: 'Une robe élégante en soie naturelle, parfaite pour les occasions spéciales. Coupe ajustée et finitions soignées.',
			creatorId: creator.id,
			gender: 'female',
			status: 'available',
			tags: ['robe', 'élégant', 'soie', 'occasion'],
			createdAt: new Date(),
			updatedAt: new Date(),
		}).returning();

		const product2 = await db.insert(products).values({
			id: 'product_002',
			name: 'Veste Vintage',
			description: 'Veste vintage en cuir véritable, style rétro des années 80. Parfaite pour un look décontracté et stylé.',
			creatorId: creator.id,
			gender: 'unisex',
			status: 'available',
			tags: ['veste', 'vintage', 'cuir', 'rétro'],
			createdAt: new Date(),
			updatedAt: new Date(),
		}).returning();

		const product3 = await db.insert(products).values({
			id: 'product_003',
			name: 'Pantalon Moderne',
			description: 'Pantalon moderne en coton bio, coupe droite et confortable. Idéal pour le quotidien et le bureau.',
			creatorId: creator.id,
			gender: 'male',
			status: 'available',
			tags: ['pantalon', 'moderne', 'coton', 'bio'],
			createdAt: new Date(),
			updatedAt: new Date(),
		}).returning();

		// Créer les variantes pour chaque produit
		await db.insert(productVariants).values([
			// Variantes pour la robe
			{
				id: 'variant_001',
				productId: product1[0].id,
				size: 'S',
				color: 'Noir',
				stock: 5,
				price: '89.99',
				images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop'],
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: 'variant_002',
				productId: product1[0].id,
				size: 'M',
				color: 'Noir',
				stock: 8,
				price: '89.99',
				images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop'],
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: 'variant_003',
				productId: product1[0].id,
				size: 'L',
				color: 'Rouge',
				stock: 3,
				price: '95.99',
				images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop'],
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			// Variantes pour la veste
			{
				id: 'variant_004',
				productId: product2[0].id,
				size: 'M',
				color: 'Brun',
				stock: 4,
				price: '125.50',
				images: ['https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop'],
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: 'variant_005',
				productId: product2[0].id,
				size: 'L',
				color: 'Noir',
				stock: 2,
				price: '125.50',
				images: ['https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop'],
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			// Variantes pour le pantalon
			{
				id: 'variant_006',
				productId: product3[0].id,
				size: '32',
				color: 'Bleu',
				stock: 6,
				price: '75.00',
				images: ['https://images.unsplash.com/photo-1506629905607-1b2b2b2b2b2b?w=400&h=400&fit=crop'],
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: 'variant_007',
				productId: product3[0].id,
				size: '34',
				color: 'Gris',
				stock: 4,
				price: '75.00',
				images: ['https://images.unsplash.com/photo-1506629905607-1b2b2b2b2b2b?w=400&h=400&fit=crop'],
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		]);

		console.log('✅ Produits et variantes créés');

		console.log('🎉 Seed de la base de données terminé avec succès!');
		console.log('\n📋 Utilisateurs de test créés:');
		console.log('👑 Admin: admin / password');
		console.log('🎨 Créateur: créateur / password');
		console.log('🛒 Client: client / password');

	} catch (error) {
		console.error('❌ Erreur lors du seed de la base de données:', error);
		throw error;
	}
}

// Exécuter le seed si ce fichier est appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
	seedDatabase()
		.then(() => {
			console.log('✅ Seed terminé');
			process.exit(0);
		})
		.catch((error) => {
			console.error('❌ Erreur:', error);
			process.exit(1);
		});
}
