/**
 * Product Detail API Route - Infrastructure Layer
 * Gère la récupération d'un produit spécifique
 */

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { db } from '$lib/infrastructure/database/config.js';
import { products, productVariants, creators } from '$lib/infrastructure/database/schema.js';
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
				createdAt: products.createdAt,
				updatedAt: products.updatedAt,
				creator: {
					id: creators.id,
					name: creators.name,
					description: creators.description,
					profileImage: creators.profileImage,
					website: creators.website,
					socialMedia: creators.socialMedia
				}
			})
			.from(products)
			.leftJoin(creators, eq(products.creatorId, creators.id))
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
				price: productVariants.price,
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
			creator: product.creator,
			variants: variants,
			// Extraire les tailles et couleurs uniques
			sizes: [...new Set(variants.map(v => v.size).filter(Boolean))],
			colors: [...new Set(variants.map(v => v.color).filter(Boolean))],
			// Prix minimum et maximum
			priceRange: variants.length > 0 ? {
				min: Math.min(...variants.map(v => parseFloat(v.price))),
				max: Math.max(...variants.map(v => parseFloat(v.price)))
			} : { min: 0, max: 0 },
			// Images (prendre la première image de chaque variante)
			images: variants.length > 0 ? variants[0].images || [] : []
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
