/**
 * Creator Login API Route - Infrastructure Layer
 * Gère la connexion des créateurs
 */

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { MockAuthService } from '$lib/infrastructure/auth/mockAuthService.js';

// Initialiser le service d'authentification mock
const authService = new MockAuthService();

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const body = await request.json();
		const { email, password } = body;

		// Validation des données
		if (!email || !password) {
			return json(
				{ success: false, error: 'Email et mot de passe requis' },
				{ status: 400 }
			);
		}

		// Authentifier l'utilisateur
		const authResult = await authService.authenticateUser(email, password);

		if (!authResult.success) {
			return json(
				{ success: false, error: authResult.error },
				{ status: 401 }
			);
		}

		// Créer une session
		const sessionId = `session_${authResult.user.id}_${Date.now()}`;
		
		// Définir le cookie de session
		cookies.set('auth_session', sessionId, {
			path: '/',
			maxAge: 60 * 60 * 24 * 7, // 7 jours
			httpOnly: true,
			secure: false, // true en production
			sameSite: 'lax'
		});

		return json({
			success: true,
			user: authResult.user
		});
	} catch (error) {
		console.error('Erreur lors de la connexion:', error);
		return json(
			{ success: false, error: 'Erreur interne du serveur' },
			{ status: 500 }
		);
	}
};
