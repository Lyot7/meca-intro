/**
 * Admin Stats API Route - Infrastructure Layer
 * Gère la récupération des statistiques pour le dashboard admin
 */

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { db } from '$lib/infrastructure/database/config.js';
import { creators, products, orders, productVariants } from '$lib/infrastructure/database/schema.js';
import { count, sum, eq, and, gte } from 'drizzle-orm';

export const GET: RequestHandler = async () => {
	try {
		// Compter les créateurs actifs
		const [activeCreators] = await db
			.select({ count: count() })
			.from(creators)
			.where(eq(creators.status, 'active'));

		// Compter les créateurs avec abonnement actif
		const [subscribedCreators] = await db
			.select({ count: count() })
			.from(creators)
			.where(and(
				eq(creators.subscriptionActive, true),
				gte(creators.subscriptionExpiresAt, new Date())
			));

		// Compter les produits disponibles
		const [availableProducts] = await db
			.select({ count: count() })
			.from(products)
			.where(eq(products.status, 'available'));

		// Compter les commandes payées
		const [paidOrders] = await db
			.select({ count: count() })
			.from(orders)
			.where(eq(orders.status, 'paid'));

		// Calculer le revenu total
		const [totalRevenue] = await db
			.select({ total: sum(orders.total) })
			.from(orders)
			.where(eq(orders.status, 'paid'));

		// Compter les commandes par statut
		const ordersByStatus = await db
			.select({ 
				status: orders.status,
				count: count()
			})
			.from(orders)
			.groupBy(orders.status);

		// Compter les produits par genre
		const productsByGender = await db
			.select({ 
				gender: products.gender,
				count: count()
			})
			.from(products)
			.groupBy(products.gender);

		// Compter les créateurs par type d'abonnement
		const creatorsBySubscription = await db
			.select({ 
				subscriptionType: creators.subscriptionType,
				count: count()
			})
			.from(creators)
			.where(eq(creators.subscriptionActive, true))
			.groupBy(creators.subscriptionType);

		// Revenus des 30 derniers jours
		const thirtyDaysAgo = new Date();
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

		const [recentRevenue] = await db
			.select({ total: sum(orders.total) })
			.from(orders)
			.where(and(
				eq(orders.status, 'paid'),
				gte(orders.paidAt, thirtyDaysAgo)
			));

		return json({
			success: true,
			stats: {
				totalCreators: activeCreators.count,
				subscribedCreators: subscribedCreators.count,
				totalProducts: availableProducts.count,
				totalOrders: paidOrders.count,
				totalRevenue: parseFloat(totalRevenue.total || '0'),
				recentRevenue: parseFloat(recentRevenue.total || '0'),
				ordersByStatus,
				productsByGender,
				creatorsBySubscription
			}
		});
	} catch (error) {
		console.error('Erreur lors de la récupération des statistiques:', error);
		return json(
			{ success: false, error: 'Erreur interne du serveur' },
			{ status: 500 }
		);
	}
};
