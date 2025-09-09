/**
 * Product Detail API Route - Infrastructure Layer
 * Gère la récupération d'un produit spécifique
 */

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { db } from '$lib/infrastructure/database/config.js';
import { products, productVariants, users } from '$lib/infrastructure/database/schema.js';
import { eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({ params }) => {
	try {
		const productId = params.id;

		if (!productId) {
			return json(
				{ success: false, error: 'ID du produit requis' },
				{ status: 400 }
			);
		}

		// Récupérer le produit avec le créateur
		const [product] = await db
			.select({
				id: products.id,
				name: products.name,
				description: products.description,
				gender: products.gender,
				status: products.status,
				tags: products.tags,
				price: products.price,
				featuredImage: products.featuredImage,
				createdAt: products.createdAt,
				updatedAt: products.updatedAt,
				creator: {
					id: users.id,
					name: users.name,
					description: users.description,
					profileImage: users.profileImage,
					website: users.website,
					socialMedia: users.socialMedia
				}
			})
			.from(products)
			.leftJoin(users, eq(products.creatorId, users.id))
			.where(eq(products.id, productId));

		if (!product) {
			return json(
				{ success: false, error: 'Produit non trouvé' },
				{ status: 404 }
			);
		}

		// Récupérer les variantes du produit
		const variants = await db
			.select({
				id: productVariants.id,
				size: productVariants.size,
				color: productVariants.color,
				stock: productVariants.stock,
				images: productVariants.images
			})
			.from(productVariants)
			.where(eq(productVariants.productId, productId));

		// Organiser les données pour le frontend
		const productData = {
			id: product.id,
			name: product.name,
			description: product.description,
			gender: product.gender,
			status: product.status,
			tags: product.tags || [],
			price: parseFloat(product.price),
			creator: product.creator,
			variants: variants,
			// Extraire les tailles et couleurs uniques
			sizes: [...new Set(variants.map(v => v.size).filter(Boolean))],
			colors: [...new Set(variants.map(v => v.color).filter(Boolean))],
			// Images (utiliser featuredImage en priorité, sinon première variante)
			images: product.featuredImage ? [product.featuredImage] : (variants.length > 0 ? variants[0].images || [] : [])
		};

		return json({
			success: true,
			product: productData
		});
	} catch (error) {
		console.error('Erreur lors de la récupération du produit:', error);
		return json(
			{ success: false, error: 'Erreur interne du serveur' },
			{ status: 500 }
		);
	}
};
