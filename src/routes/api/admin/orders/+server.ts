/**
 * Admin Orders API Route - Infrastructure Layer
 * Gère la récupération des commandes pour le dashboard admin
 */

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { db } from '$lib/infrastructure/database/config.js';
import { orders, creators, products, productVariants } from '$lib/infrastructure/database/schema.js';
import { eq, desc, and } from 'drizzle-orm';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const page = parseInt(url.searchParams.get('page') || '1');
		const limit = parseInt(url.searchParams.get('limit') || '10');
		const status = url.searchParams.get('status') as any;

		// Construire la requête de base avec jointures
		let query = db
			.select({
				id: orders.id,
				status: orders.status,
				subtotal: orders.subtotal,
				shippingCost: orders.shippingCost,
				total: orders.total,
				shippingAddress: orders.shippingAddress,
				paidAt: orders.paidAt,
				shippedAt: orders.shippedAt,
				deliveredAt: orders.deliveredAt,
				createdAt: orders.createdAt,
				updatedAt: orders.updatedAt,
				customer: {
					id: creators.id,
					name: creators.name,
					email: creators.email
				}
			})
			.from(orders)
			.leftJoin(creators, eq(orders.customerId, creators.id));

		// Filtrer par statut si spécifié
		if (status) {
			query = query.where(eq(orders.status, status));
		}

		// Trier par date de création (plus récents en premier)
		query = query.orderBy(desc(orders.createdAt));

		// Pagination
		const offset = (page - 1) * limit;
		const ordersList = await query.limit(limit).offset(offset);

		// Pour chaque commande, récupérer les détails des produits
		const ordersWithDetails = await Promise.all(
			ordersList.map(async (order) => {
				// Récupérer les détails des produits de la commande
				const orderItems = await Promise.all(
					order.items.map(async (item: any) => {
						// Récupérer les informations du produit
						const [product] = await db
							.select({
								id: products.id,
								name: products.name,
								description: products.description,
								gender: products.gender
							})
							.from(products)
							.where(eq(products.id, item.productId));

						// Récupérer les informations de la variante
						const [variant] = await db
							.select({
								id: productVariants.id,
								size: productVariants.size,
								color: productVariants.color,
								images: productVariants.images
							})
							.from(productVariants)
							.where(eq(productVariants.id, item.variantId));

						return {
							...item,
							product: product || null,
							variant: variant || null
						};
					})
				);

				return {
					...order,
					items: orderItems
				};
			})
		);

		return json({
			success: true,
			orders: ordersWithDetails,
			pagination: {
				page,
				limit
			}
		});
	} catch (error) {
		console.error('Erreur lors de la récupération des commandes:', error);
		return json(
			{ success: false, error: 'Erreur interne du serveur' },
			{ status: 500 }
		);
	}
};
