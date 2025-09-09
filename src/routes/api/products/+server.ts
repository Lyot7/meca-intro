/**
 * Products API Route - Infrastructure Layer
 * Gère la récupération des produits
 */

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { db } from '$lib/infrastructure/database/config.js';
import { products, productVariants, users } from '$lib/infrastructure/database/schema.js';
import { eq, and, ilike, or, desc } from 'drizzle-orm';

export const GET: RequestHandler = async ({ url }) => {
	try {
		// Récupérer les paramètres de requête
		const gender = url.searchParams.get('gender') as 'male' | 'female' | 'unisex' | null;
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
		const baseQuery = db
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
			.leftJoin(users, eq(products.creatorId, users.id));

		// Construire la requête finale avec conditions et tri
		const finalQuery = conditions.length > 0 
			? baseQuery.where(and(...conditions)).orderBy(desc(products.createdAt))
			: baseQuery.orderBy(desc(products.createdAt));

		// Pagination
		const offset = (page - 1) * limit;
		const productsList = await finalQuery.limit(limit).offset(offset);

		// Pour chaque produit, récupérer les variantes
		const productsWithVariants = await Promise.all(
			productsList.map(async (product) => {
				const variants = await db
					.select({
						id: productVariants.id,
						size: productVariants.size,
						color: productVariants.color,
						stock: productVariants.stock,
						images: productVariants.images
					})
					.from(productVariants)
					.where(eq(productVariants.productId, product.id));

				// Filtrer par prix si spécifié
				const productPrice = parseFloat(product.price);
				if (minPrice && productPrice < minPrice) return null;
				if (maxPrice && productPrice > maxPrice) return null;

				// Extraire les tailles et couleurs uniques
				const sizes = [...new Set(variants.map(v => v.size).filter(Boolean))];
				const colors = [...new Set(variants.map(v => v.color).filter(Boolean))];

				// Utiliser l'image featured ou la première image des variantes
				const images = product.featuredImage ? [product.featuredImage] : (variants.length > 0 ? variants[0].images || [] : []);

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
					price: productPrice,
					images: images,
					createdAt: product.createdAt,
					updatedAt: product.updatedAt
				};
			})
		);

		// Filtrer les produits null (qui ne correspondent pas aux critères de prix)
		const filteredProducts = productsWithVariants.filter(Boolean);

		// Compter le total pour la pagination
		const baseTotalQuery = db
			.select({ count: products.id })
			.from(products)
			.leftJoin(users, eq(products.creatorId, users.id));

		const finalTotalQuery = conditions.length > 0 
			? baseTotalQuery.where(and(...conditions))
			: baseTotalQuery;

		const totalResult = await finalTotalQuery;
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
