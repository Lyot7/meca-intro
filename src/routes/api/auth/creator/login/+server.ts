/**
 * Creator Login API Route - Infrastructure Layer
 * Gère la connexion des créateurs
 */

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { AuthService } from '$lib/application/services/AuthService.js';
import { CreatorRepository } from '$lib/infrastructure/repositories/CreatorRepository.js';

// Initialiser les services
const creatorRepository = new CreatorRepository();
const authService = new AuthService(creatorRepository);

export const POST: RequestHandler = async ({ request }) => {
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

		// Authentifier le créateur
		const result = await authService.login({ email, password });

		if (!result.success) {
			return json(
				{ success: false, error: result.error },
				{ status: 401 }
			);
		}

		// TODO: Créer une session avec Lucia Auth
		// const session = await auth.createSession(result.user.id, {});

		return json({
			success: true,
			user: {
				id: result.user!.id,
				name: result.user!.name,
				email: result.user!.email,
				status: result.user!.status,
				subscription: result.user!.subscription
			}
		});
	} catch (error) {
		console.error('Erreur lors de la connexion du créateur:', error);
		return json(
			{ success: false, error: 'Erreur interne du serveur' },
			{ status: 500 }
		);
	}
};
