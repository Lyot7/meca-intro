/**
 * Creator by Slug API Route - Infrastructure Layer
 * Gère la récupération d'un créateur par son slug
 */

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { db } from '$lib/infrastructure/database/config.js';
import { creators } from '$lib/infrastructure/database/schema.js';
import { eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({ params }) => {
	try {
		const slug = params.slug;

		if (!slug) {
			return json(
				{ success: false, error: 'Slug du créateur requis' },
				{ status: 400 }
			);
		}

		// Récupérer le créateur par slug (pour l'instant on utilise l'ID comme slug)
		// TODO: Ajouter un champ slug dans la base de données
		const [creator] = await db
			.select({
				id: creators.id,
				name: creators.name,
				description: creators.description,
				profileImage: creators.profileImage,
				website: creators.website,
				socialMedia: creators.socialMedia,
				status: creators.status,
				subscriptionType: creators.subscriptionType,
				subscriptionExpiresAt: creators.subscriptionExpiresAt,
				createdAt: creators.createdAt,
				updatedAt: creators.updatedAt
			})
			.from(creators)
			.where(eq(creators.id, slug));

		if (!creator) {
			return json(
				{ success: false, error: 'Créateur non trouvé' },
				{ status: 404 }
			);
		}

		return json({
			success: true,
			creator
		});
	} catch (error) {
		console.error('Erreur lors de la récupération du créateur:', error);
		return json(
			{ success: false, error: 'Erreur interne du serveur' },
			{ status: 500 }
		);
	}
};
