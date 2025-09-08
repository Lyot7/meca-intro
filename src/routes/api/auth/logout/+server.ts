/**
 * Logout API Route - Infrastructure Layer
 * Gère la déconnexion des utilisateurs
 */

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { MockAuthService } from '$lib/infrastructure/auth/mockAuthService.js';

// Initialiser le service d'authentification mock
const authService = new MockAuthService();

export const POST: RequestHandler = async ({ cookies }) => {
	try {
		// Déconnecter l'utilisateur
		const result = await authService.logout({ cookies });

		if (!result.success) {
			return json(
				{ success: false, error: result.error },
				{ status: 500 }
			);
		}

		return json({
			success: true,
			message: 'Déconnexion réussie'
		});
	} catch (error) {
		console.error('Erreur lors de la déconnexion:', error);
		return json(
			{ success: false, error: 'Erreur interne du serveur' },
			{ status: 500 }
		);
	}
};
