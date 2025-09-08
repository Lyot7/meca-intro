/**
 * Me API Route - Infrastructure Layer
 * Retourne les informations de l'utilisateur connecté
 */

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { MockAuthService } from '$lib/infrastructure/auth/mockAuthService.js';

// Initialiser le service d'authentification mock
const authService = new MockAuthService();

export const GET: RequestHandler = async ({ cookies }) => {
	try {
		// Valider la session
		const result = await authService.validateSession({ cookies } as any);

		if (!result.success) {
			return json(
				{ success: false, error: result.error },
				{ status: 401 }
			);
		}

		return json({
			success: true,
			user: result.user
		});
	} catch (error) {
		console.error('Erreur lors de la validation de session:', error);
		return json(
			{ success: false, error: 'Erreur interne du serveur' },
			{ status: 500 }
		);
	}
};
