/**
 * Products API Route - Infrastructure Layer
 * Gère la récupération des produits
 */

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { ProductService } from '$lib/application/services/ProductService.js';
import { ProductRepository } from '$lib/infrastructure/repositories/ProductRepository.js';
import { CreatorRepository } from '$lib/infrastructure/repositories/CreatorRepository.js';

// Initialiser les services
const productRepository = new ProductRepository();
const creatorRepository = new CreatorRepository();
const productService = new ProductService(productRepository, creatorRepository);

export const GET: RequestHandler = async ({ url }) => {
	try {
		// Récupérer les paramètres de requête
		const gender = url.searchParams.get('gender') as any;
		const page = parseInt(url.searchParams.get('page') || '1');
		const limit = parseInt(url.searchParams.get('limit') || '12');
		const search = url.searchParams.get('search') || undefined;
		const minPrice = url.searchParams.get('minPrice') ? parseFloat(url.searchParams.get('minPrice')!) : undefined;
		const maxPrice = url.searchParams.get('maxPrice') ? parseFloat(url.searchParams.get('maxPrice')!) : undefined;

		// Récupérer les produits
		const result = await productService.getProducts({
			gender,
			page,
			limit,
			search,
			minPrice,
			maxPrice
		});

		if (!result.success) {
			return json(
				{ success: false, error: result.error },
				{ status: 400 }
			);
		}

		return json({
			success: true,
			products: result.products,
			pagination: {
				total: result.total,
				page: result.page,
				limit: result.limit,
				totalPages: result.totalPages
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
