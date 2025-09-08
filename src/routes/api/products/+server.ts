/**
 * Products API Route - Infrastructure Layer
 * Gère la récupération des produits
 */

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { mockProducts } from '$lib/infrastructure/mockData.js';

export const GET: RequestHandler = async ({ url }) => {
	try {
		// Récupérer les paramètres de requête
		const gender = url.searchParams.get('gender') as any;
		const page = parseInt(url.searchParams.get('page') || '1');
		const limit = parseInt(url.searchParams.get('limit') || '12');
		const search = url.searchParams.get('search') || undefined;
		const minPrice = url.searchParams.get('minPrice') ? parseFloat(url.searchParams.get('minPrice')!) : undefined;
		const maxPrice = url.searchParams.get('maxPrice') ? parseFloat(url.searchParams.get('maxPrice')!) : undefined;

		// Filtrer les produits selon les paramètres
		let filteredProducts = [...mockProducts];

		// Filtrer par genre
		if (gender) {
			filteredProducts = filteredProducts.filter(product => 
				product.gender === gender || product.gender === 'unisex'
			);
		}

		// Filtrer par prix
		if (minPrice) {
			filteredProducts = filteredProducts.filter(product => 
				product.getMinPrice() >= minPrice
			);
		}

		if (maxPrice) {
			filteredProducts = filteredProducts.filter(product => 
				product.getMaxPrice() <= maxPrice
			);
		}

		// Filtrer par recherche
		if (search) {
			const searchLower = search.toLowerCase();
			filteredProducts = filteredProducts.filter(product => 
				product.name.toLowerCase().includes(searchLower) ||
				product.description.toLowerCase().includes(searchLower)
			);
		}

		// Pagination
		const total = filteredProducts.length;
		const totalPages = Math.ceil(total / limit);
		const startIndex = (page - 1) * limit;
		const endIndex = startIndex + limit;
		const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

		return json({
			success: true,
			products: paginatedProducts,
			pagination: {
				total,
				page,
				limit,
				totalPages
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
