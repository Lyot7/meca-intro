/**
 * Admin Creators API Route - Infrastructure Layer
 * Gère la récupération des créateurs pour le dashboard admin
 */

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { db } from '$lib/infrastructure/database/config.js';
import { creators, products, orders } from '$lib/infrastructure/database/schema.js';
import { count, sum, eq, desc } from 'drizzle-orm';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const page = parseInt(url.searchParams.get('page') || '1');
		const limit = parseInt(url.searchParams.get('limit') || '10');
		const status = url.searchParams.get('status') as any;

		// Construire la requête de base
		let query = db
			.select({
				id: creators.id,
				name: creators.name,
				email: creators.email,
				description: creators.description,
				profileImage: creators.profileImage,
				website: creators.website,
				socialMedia: creators.socialMedia,
				status: creators.status,
				subscriptionType: creators.subscriptionType,
				subscriptionExpiresAt: creators.subscriptionExpiresAt,
				subscriptionActive: creators.subscriptionActive,
				createdAt: creators.createdAt,
				updatedAt: creators.updatedAt
			})
			.from(creators);

		// Filtrer par statut si spécifié
		if (status) {
			query = query.where(eq(creators.status, status));
		}

		// Trier par date de création (plus récents en premier)
		query = query.orderBy(desc(creators.createdAt));

		// Pagination
		const offset = (page - 1) * limit;
		const creatorsList = await query.limit(limit).offset(offset);

		// Pour chaque créateur, récupérer les statistiques
		const creatorsWithStats = await Promise.all(
			creatorsList.map(async (creator) => {
				// Compter les produits
				const [productCount] = await db
					.select({ count: count() })
					.from(products)
					.where(eq(products.creatorId, creator.id));

				// Compter les commandes
				const [orderCount] = await db
					.select({ count: count() })
					.from(orders)
					.where(eq(orders.customerId, creator.id));

				// Calculer le revenu total
				const [totalRevenue] = await db
					.select({ total: sum(orders.total) })
					.from(orders)
					.where(and(
						eq(orders.customerId, creator.id),
						eq(orders.status, 'paid')
					));

				return {
					...creator,
					stats: {
						productCount: productCount.count,
						orderCount: orderCount.count,
						totalRevenue: parseFloat(totalRevenue.total || '0')
					}
				};
			})
		);

		// Compter le total pour la pagination
		const [totalCount] = await db
			.select({ count: count() })
			.from(creators)
			.where(status ? eq(creators.status, status) : undefined);

		return json({
			success: true,
			creators: creatorsWithStats,
			pagination: {
				total: totalCount.count,
				page,
				limit,
				totalPages: Math.ceil(totalCount.count / limit)
			}
		});
	} catch (error) {
		console.error('Erreur lors de la récupération des créateurs:', error);
		return json(
			{ success: false, error: 'Erreur interne du serveur' },
			{ status: 500 }
		);
	}
};
