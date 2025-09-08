/**
 * Product Detail API Route - Infrastructure Layer
 * Gère la récupération d'un produit spécifique
 */

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { mockProducts } from '$lib/infrastructure/mockData.js';

export const GET: RequestHandler = async ({ params }) => {
	try {
		const productId = params.id;

		if (!productId) {
			return json(
				{ success: false, error: 'ID du produit requis' },
				{ status: 400 }
			);
		}

		// Trouver le produit
		const product = mockProducts.find(p => p.id === productId);

		if (!product) {
			return json(
				{ success: false, error: 'Produit non trouvé' },
				{ status: 404 }
			);
		}

		return json({
			success: true,
			product
		});
	} catch (error) {
		console.error('Erreur lors de la récupération du produit:', error);
		return json(
			{ success: false, error: 'Erreur interne du serveur' },
			{ status: 500 }
		);
	}
};
