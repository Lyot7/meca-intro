/**
 * Products API Route - Infrastructure Layer
 * Gère la récupération des produits
 */

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { db } from '$lib/infrastructure/database/config.js';
import { products, productVariants, creators } from '$lib/infrastructure/database/schema.js';
import { eq, and, gte, lte, ilike, or, desc } from 'drizzle-orm';

export const GET: RequestHandler = async ({ url }) => {
	try {
		// Récupérer les paramètres de requête
		const gender = url.searchParams.get('gender') as any;
		const creatorId = url.searchParams.get('creatorId') || undefined;
		const page = parseInt(url.searchParams.get('page') || '1');
		const limit = parseInt(url.searchParams.get('limit') || '12');
		const search = url.searchParams.get('search') || undefined;
		const minPrice = url.searchParams.get('minPrice') ? parseFloat(url.searchParams.get('minPrice')!) : undefined;
		const maxPrice = url.searchParams.get('maxPrice') ? parseFloat(url.searchParams.get('maxPrice')!) : undefined;

		// Construire les conditions de filtrage
		const conditions = [];
		
		// Filtrer par genre
		if (gender) {
			conditions.push(
				or(
					eq(products.gender, gender),
					eq(products.gender, 'unisex')
				)
			);
		}

		// Filtrer par créateur
		if (creatorId) {
			conditions.push(eq(products.creatorId, creatorId));
		}

		// Filtrer par recherche
		if (search) {
			conditions.push(
				or(
					ilike(products.name, `%${search}%`),
					ilike(products.description, `%${search}%`)
				)
			);
		}

		// Filtrer par statut (seulement les produits disponibles)
		conditions.push(eq(products.status, 'available'));

		// Récupérer les produits avec les créateurs
		let query = db
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
			.leftJoin(creators, eq(products.creatorId, creators.id));

		// Appliquer les conditions
		if (conditions.length > 0) {
			query = query.where(and(...conditions));
		}

		// Trier par date de création (plus récents en premier)
		query = query.orderBy(desc(products.createdAt));

		// Pagination
		const offset = (page - 1) * limit;
		const productsList = await query.limit(limit).offset(offset);

		// Pour chaque produit, récupérer les variantes et calculer les prix
		const productsWithVariants = await Promise.all(
			productsList.map(async (product) => {
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
					.where(eq(productVariants.productId, product.id));

				// Calculer les prix min/max
				const prices = variants.map(v => parseFloat(v.price));
				const priceRange = prices.length > 0 ? {
					min: Math.min(...prices),
					max: Math.max(...prices)
				} : { min: 0, max: 0 };

				// Filtrer par prix si spécifié
				if (minPrice && priceRange.max < minPrice) return null;
				if (maxPrice && priceRange.min > maxPrice) return null;

				// Extraire les tailles et couleurs uniques
				const sizes = [...new Set(variants.map(v => v.size).filter(Boolean))];
				const colors = [...new Set(variants.map(v => v.color).filter(Boolean))];

				// Prendre la première image disponible
				const images = variants.length > 0 ? variants[0].images || [] : [];

				return {
					id: product.id,
					name: product.name,
					description: product.description,
					gender: product.gender,
					status: product.status,
					tags: product.tags || [],
					creator: product.creator,
					variants: variants,
					sizes: sizes,
					colors: colors,
					priceRange: priceRange,
					images: images,
					createdAt: product.createdAt,
					updatedAt: product.updatedAt
				};
			})
		);

		// Filtrer les produits null (qui ne correspondent pas aux critères de prix)
		const filteredProducts = productsWithVariants.filter(Boolean);

		// Compter le total pour la pagination
		const totalQuery = db
			.select({ count: products.id })
			.from(products)
			.leftJoin(creators, eq(products.creatorId, creators.id));

		if (conditions.length > 0) {
			totalQuery.where(and(...conditions));
		}

		const totalResult = await totalQuery;
		const total = totalResult.length;

		return json({
			success: true,
			products: filteredProducts,
			pagination: {
				total,
				page,
				limit,
				totalPages: Math.ceil(total / limit)
			}
		});
	} catch (error) {
		console.error('Erreur lors de la récupération des produits:', error);
		return json(
			{ success: false, error: 'Erreur interne du serveur' },
			{ status: 500 }
		);
	}
};
