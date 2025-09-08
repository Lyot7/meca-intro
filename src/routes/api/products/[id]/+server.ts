/**
 * Product Detail API Route - Infrastructure Layer
 * Gère la récupération d'un produit spécifique
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

export const GET: RequestHandler = async ({ params }) => {
	try {
		const productId = params.id;

		if (!productId) {
			return json(
				{ success: false, error: 'ID du produit requis' },
				{ status: 400 }
			);
		}

		// Récupérer le produit
		const result = await productService.getProduct(productId);

		if (!result.success) {
			return json(
				{ success: false, error: result.error },
				{ status: result.error === 'Produit non trouvé' ? 404 : 400 }
			);
		}

		return json({
			success: true,
			product: result.product
		});
	} catch (error) {
		console.error('Erreur lors de la récupération du produit:', error);
		return json(
			{ success: false, error: 'Erreur interne du serveur' },
			{ status: 500 }
		);
	}
};
