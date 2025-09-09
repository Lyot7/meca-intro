/**
 * Database Seed - Infrastructure Layer
 * Script pour initialiser la base de données avec des données de test
 */

import { db } from './config.js';
import { users, products, productVariants } from './schema.js';
import { hash } from '@node-rs/argon2';
import { randomUUID } from 'crypto';

export async function seedDatabase() {
	try {
		console.log('🌱 Début du seed de la base de données...');

		// Vider les tables existantes
		console.log('🧹 Nettoyage des données existantes...');
		await db.delete(productVariants);
		await db.delete(products);
		await db.delete(users);

		// Hasher le mot de passe commun
		const hashedPassword = await hash('password');

		// Créer plusieurs créateurs
		const creators = await db.insert(users).values([
			{
				id: randomUUID(),
				name: 'Marie Dubois',
				email: 'marie@kpsull.com',
				passwordHash: hashedPassword,
				role: 'creator',
				status: 'active',
				description: 'Créatrice de mode indépendante spécialisée dans les vêtements uniques et éthiques. Passionnée par la mode durable et les pièces intemporelles.',
				profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face',
				website: 'https://mariedubois-mode.com',
				socialMedia: {
					instagram: '@marie_dubois_mode',
					facebook: 'marie.dubois.mode',
				},
				subscriptionType: 'monthly',
				subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
				subscriptionActive: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: randomUUID(),
				name: 'Thomas Martin',
				email: 'thomas@kpsull.com',
				passwordHash: hashedPassword,
				role: 'creator',
				status: 'active',
				description: 'Designer spécialisé dans les accessoires vintage et les pièces uniques. Expert en restauration et customisation.',
				profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
				website: 'https://thomasmartin-design.com',
				socialMedia: {
					instagram: '@thomas_martin_design',
					twitter: '@thomasmartin_design',
				},
				subscriptionType: 'yearly',
				subscriptionExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
				subscriptionActive: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: randomUUID(),
				name: 'Emma Rousseau',
				email: 'emma@kpsull.com',
				passwordHash: hashedPassword,
				role: 'creator',
				status: 'active',
				description: 'Artiste textile et créatrice de bijoux artisanaux. Spécialisée dans les techniques traditionnelles revisitées.',
				profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
				website: 'https://emmarousseau-art.com',
				socialMedia: {
					instagram: '@emma_rousseau_art',
					facebook: 'emma.rousseau.art',
				},
				subscriptionType: 'monthly',
				subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
				subscriptionActive: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: randomUUID(),
				name: 'Lucas Petit',
				email: 'lucas@kpsull.com',
				passwordHash: hashedPassword,
				role: 'creator',
				status: 'active',
				description: 'Couturier sur mesure spécialisé dans les costumes et les tenues de soirée. Maître dans l\'art de la coupe parfaite.',
				profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
				website: 'https://lucaspetit-couture.com',
				socialMedia: {
					instagram: '@lucas_petit_couture',
					twitter: '@lucaspetit_couture',
				},
				subscriptionType: 'yearly',
				subscriptionExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
				subscriptionActive: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: randomUUID(),
				name: 'Chloé Bernard',
				email: 'chloe@kpsull.com',
				passwordHash: hashedPassword,
				role: 'creator',
				status: 'active',
				description: 'Designer de chaussures artisanales. Créatrice de modèles uniques alliant confort et esthétique moderne.',
				profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face',
				website: 'https://chloebernard-shoes.com',
				socialMedia: {
					instagram: '@chloe_bernard_shoes',
					facebook: 'chloe.bernard.shoes',
				},
				subscriptionType: 'monthly',
				subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
				subscriptionActive: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			}
		]).returning();

		// Créer plusieurs clients
		const clients = await db.insert(users).values([
			{
				id: randomUUID(),
				name: 'Sophie Laurent',
				email: 'sophie@kpsull.com',
				passwordHash: hashedPassword,
				role: 'client',
				status: 'active',
				phone: '+33 6 12 34 56 78',
				dateOfBirth: new Date('1990-05-15'),
				preferences: {
					gender: 'female',
					sizes: ['S', 'M'],
					brands: ['Marie Dubois', 'Emma Rousseau'],
				},
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: randomUUID(),
				name: 'Pierre Moreau',
				email: 'pierre@kpsull.com',
				passwordHash: hashedPassword,
				role: 'client',
				status: 'active',
				phone: '+33 6 87 65 43 21',
				dateOfBirth: new Date('1985-12-03'),
				preferences: {
					gender: 'male',
					sizes: ['L', 'XL'],
					brands: ['Thomas Martin', 'Lucas Petit'],
				},
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: randomUUID(),
				name: 'Camille Durand',
				email: 'camille@kpsull.com',
				passwordHash: hashedPassword,
				role: 'client',
				status: 'active',
				phone: '+33 6 45 67 89 01',
				dateOfBirth: new Date('1992-08-22'),
				preferences: {
					gender: 'female',
					sizes: ['M', 'L'],
					brands: ['Marie Dubois', 'Chloé Bernard'],
				},
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: randomUUID(),
				name: 'Antoine Lefebvre',
				email: 'antoine@kpsull.com',
				passwordHash: hashedPassword,
				role: 'client',
				status: 'active',
				phone: '+33 6 23 45 67 89',
				dateOfBirth: new Date('1988-03-10'),
				preferences: {
					gender: 'male',
					sizes: ['M', 'L'],
					brands: ['Lucas Petit', 'Thomas Martin'],
				},
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: randomUUID(),
				name: 'Julie Martin',
				email: 'julie@kpsull.com',
				passwordHash: hashedPassword,
				role: 'client',
				status: 'active',
				phone: '+33 6 98 76 54 32',
				dateOfBirth: new Date('1995-11-07'),
				preferences: {
					gender: 'female',
					sizes: ['XS', 'S'],
					brands: ['Emma Rousseau', 'Marie Dubois'],
				},
				createdAt: new Date(),
				updatedAt: new Date(),
			}
		]).returning();

		console.log('✅ Utilisateurs créés:', { 
			creators: creators.length, 
			clients: clients.length 
		});

		// Créer de nombreux produits pour chaque créateur
		const allProducts = await db.insert(products).values([
			// Produits de Marie Dubois (mode féminine éthique)
			{
				id: randomUUID(),
				name: 'Robe Élégante Soie',
				description: 'Une robe élégante en soie naturelle, parfaite pour les occasions spéciales. Coupe ajustée et finitions soignées.',
				creatorId: creators[0].id,
				gender: 'female',
				status: 'available',
				tags: ['robe', 'élégant', 'soie', 'occasion'],
				featuredImage: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop',
				price: '89.99',
				totalStock: 16,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: randomUUID(),
				name: 'Blouse Coton Bio',
				description: 'Blouse en coton biologique, coupe fluide et confortable. Parfaite pour le bureau ou les sorties décontractées.',
				creatorId: creators[0].id,
				gender: 'female',
				status: 'available',
				tags: ['blouse', 'coton', 'bio', 'confortable'],
				featuredImage: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
				price: '65.00',
				totalStock: 12,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: randomUUID(),
				name: 'Jupe Midi Lin',
				description: 'Jupe midi en lin naturel, style intemporel et élégant. Idéale pour toutes les saisons.',
				creatorId: creators[0].id,
				gender: 'female',
				status: 'available',
				tags: ['jupe', 'lin', 'midi', 'intemporel'],
				featuredImage: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
				price: '55.00',
				totalStock: 8,
				createdAt: new Date(),
				updatedAt: new Date(),
			},

			// Produits de Thomas Martin (accessoires vintage)
			{
				id: randomUUID(),
				name: 'Veste Vintage Cuir',
				description: 'Veste vintage en cuir véritable, style rétro des années 80. Parfaite pour un look décontracté et stylé.',
				creatorId: creators[1].id,
				gender: 'unisex',
				status: 'available',
				tags: ['veste', 'vintage', 'cuir', 'rétro'],
				featuredImage: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop',
				price: '125.50',
				totalStock: 6,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: randomUUID(),
				name: 'Sac Vintage Cuir',
				description: 'Sac à main vintage en cuir véritable, parfait pour un style rétro et élégant.',
				creatorId: creators[1].id,
				gender: 'female',
				status: 'available',
				tags: ['sac', 'vintage', 'cuir', 'élégant'],
				featuredImage: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
				price: '95.00',
				totalStock: 8,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: randomUUID(),
				name: 'Ceinture Vintage',
				description: 'Ceinture en cuir vintage, parfaite pour compléter un look rétro et stylé.',
				creatorId: creators[1].id,
				gender: 'unisex',
				status: 'available',
				tags: ['ceinture', 'vintage', 'cuir', 'accessoire'],
				featuredImage: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop',
				price: '45.00',
				totalStock: 15,
				createdAt: new Date(),
				updatedAt: new Date(),
			},

			// Produits d'Emma Rousseau (bijoux artisanaux)
			{
				id: randomUUID(),
				name: 'Collier Perles Artisanal',
				description: 'Collier en perles naturelles, créé à la main avec des techniques traditionnelles.',
				creatorId: creators[2].id,
				gender: 'female',
				status: 'available',
				tags: ['collier', 'perles', 'artisanal', 'traditionnel'],
				featuredImage: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop',
				price: '35.00',
				totalStock: 20,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: randomUUID(),
				name: 'Boucles d\'Oreilles Éthiques',
				description: 'Boucles d\'oreilles en matériaux recyclés, design moderne et éthique.',
				creatorId: creators[2].id,
				gender: 'female',
				status: 'available',
				tags: ['boucles', 'éthique', 'recyclé', 'moderne'],
				featuredImage: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop',
				price: '25.00',
				totalStock: 25,
				createdAt: new Date(),
				updatedAt: new Date(),
			},

			// Produits de Lucas Petit (couture sur mesure)
			{
				id: randomUUID(),
				name: 'Costume Sur Mesure',
				description: 'Costume sur mesure en laine fine, parfait pour les occasions importantes.',
				creatorId: creators[3].id,
				gender: 'male',
				status: 'available',
				tags: ['costume', 'sur-mesure', 'laine', 'élégant'],
				featuredImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
				price: '450.00',
				totalStock: 3,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: randomUUID(),
				name: 'Chemise Coton Premium',
				description: 'Chemise en coton premium, coupe parfaite et finitions soignées.',
				creatorId: creators[3].id,
				gender: 'male',
				status: 'available',
				tags: ['chemise', 'coton', 'premium', 'coupe'],
				featuredImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
				price: '85.00',
				totalStock: 10,
				createdAt: new Date(),
				updatedAt: new Date(),
			},

			// Produits de Chloé Bernard (chaussures artisanales)
			{
				id: randomUUID(),
				name: 'Escarpins Artisanaux',
				description: 'Escarpins créés à la main, alliant confort et esthétique moderne.',
				creatorId: creators[4].id,
				gender: 'female',
				status: 'available',
				tags: ['escarpins', 'artisanal', 'confort', 'moderne'],
				featuredImage: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop',
				price: '120.00',
				totalStock: 12,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: randomUUID(),
				name: 'Bottines Cuir Véritable',
				description: 'Bottines en cuir véritable, parfaites pour l\'automne et l\'hiver.',
				creatorId: creators[4].id,
				gender: 'female',
				status: 'available',
				tags: ['bottines', 'cuir', 'automne', 'hiver'],
				featuredImage: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop',
				price: '110.00',
				totalStock: 8,
				createdAt: new Date(),
				updatedAt: new Date(),
			}
		]).returning();

		// Créer les variantes pour chaque produit
		const variants: Array<{
			id: string;
			productId: string;
			size: string;
			color: string;
			stock: number;
			images: string[];
			createdAt: Date;
			updatedAt: Date;
		}> = [];
		
		// Variantes pour chaque produit
		for (const product of allProducts) {
			// Variables pour s'assurer que les types sont corrects
			const featuredImage = product.featuredImage || '';
			
			// Générer des variantes selon le type de produit
			if (product.name.includes('Robe') || product.name.includes('Blouse') || product.name.includes('Jupe')) {
				// Vêtements féminins - tailles S, M, L
				variants.push(
					{
						id: randomUUID(),
						productId: product.id,
						size: 'S',
						color: 'Noir',
						stock: Math.floor(Math.random() * 5) + 3,
						images: [featuredImage],
						createdAt: new Date(),
						updatedAt: new Date(),
					},
					{
						id: randomUUID(),
						productId: product.id,
						size: 'M',
						color: 'Noir',
						stock: Math.floor(Math.random() * 8) + 5,
						images: [featuredImage],
						createdAt: new Date(),
						updatedAt: new Date(),
					},
					{
						id: randomUUID(),
						productId: product.id,
						size: 'L',
						color: 'Rouge',
						stock: Math.floor(Math.random() * 4) + 2,
						images: [featuredImage],
						createdAt: new Date(),
						updatedAt: new Date(),
					}
				);
			} else if (product.name.includes('Costume') || product.name.includes('Chemise')) {
				// Vêtements masculins - tailles 38, 40, 42, 44
				variants.push(
					{
						id: randomUUID(),
						productId: product.id,
						size: '38',
						color: 'Bleu',
						stock: Math.floor(Math.random() * 3) + 1,
						images: [featuredImage],
						createdAt: new Date(),
						updatedAt: new Date(),
					},
					{
						id: randomUUID(),
						productId: product.id,
						size: '40',
						color: 'Bleu',
						stock: Math.floor(Math.random() * 4) + 2,
						images: [featuredImage],
						createdAt: new Date(),
						updatedAt: new Date(),
					},
					{
						id: randomUUID(),
						productId: product.id,
						size: '42',
						color: 'Gris',
						stock: Math.floor(Math.random() * 3) + 1,
						images: [featuredImage],
						createdAt: new Date(),
						updatedAt: new Date(),
					}
				);
			} else if (product.name.includes('Veste') || product.name.includes('Ceinture')) {
				// Accessoires unisexes
				variants.push(
					{
						id: randomUUID(),
						productId: product.id,
						size: 'M',
						color: 'Brun',
						stock: Math.floor(Math.random() * 4) + 2,
						images: [featuredImage],
						createdAt: new Date(),
						updatedAt: new Date(),
					},
					{
						id: randomUUID(),
						productId: product.id,
						size: 'L',
						color: 'Noir',
						stock: Math.floor(Math.random() * 3) + 1,
						images: [featuredImage],
						createdAt: new Date(),
						updatedAt: new Date(),
					}
				);
			} else {
				// Bijoux et chaussures - une seule variante
				variants.push({
					id: randomUUID(),
					productId: product.id,
					size: 'Unique',
					color: 'Standard',
					stock: Math.floor(Math.random() * 10) + 5,
					images: [featuredImage],
					createdAt: new Date(),
					updatedAt: new Date(),
				});
			}
		}

		await db.insert(productVariants).values(variants);

		console.log('✅ Produits et variantes créés:', { 
			products: allProducts.length, 
			variants: variants.length 
		});

		console.log('🎉 Seed de la base de données terminé avec succès!');
		console.log('\n📋 Utilisateurs de test créés:');
		console.log('🎨 Créateurs:');
		creators.forEach(creator => {
			console.log(`   - ${creator.name}: ${creator.email} / password`);
		});
		console.log('🛒 Clients:');
		clients.forEach(client => {
			console.log(`   - ${client.name}: ${client.email} / password`);
		});

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
