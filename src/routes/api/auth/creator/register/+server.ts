/**
 * Creator Register API Route - Infrastructure Layer
 * Gère l'enregistrement des créateurs
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
		const { name, email, password, description, website, socialMedia } = body;

		// Validation des données
		if (!name || !email || !password) {
			return json(
				{ success: false, error: 'Nom, email et mot de passe requis' },
				{ status: 400 }
			);
		}

		// Validation de l'email
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return json(
				{ success: false, error: 'Format d\'email invalide' },
				{ status: 400 }
			);
		}

		// Validation du mot de passe
		if (password.length < 8) {
			return json(
				{ success: false, error: 'Le mot de passe doit contenir au moins 8 caractères' },
				{ status: 400 }
			);
		}

		// Enregistrer le créateur
		const result = await authService.register({
			name,
			email,
			password,
			description,
			website,
			socialMedia
		});

		if (!result.success) {
			return json(
				{ success: false, error: result.error },
				{ status: 400 }
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
		}, { status: 201 });
	} catch (error) {
		console.error('Erreur lors de l\'enregistrement du créateur:', error);
		return json(
			{ success: false, error: 'Erreur interne du serveur' },
			{ status: 500 }
		);
	}
};
