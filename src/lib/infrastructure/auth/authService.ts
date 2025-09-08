/**
 * Auth Service - Infrastructure Layer
 * Service d'authentification avec Lucia et Argon2
 */

import { lucia } from './lucia.js';
import { db } from '../database/config.js';
import { creators } from '../database/schema.js';
import { eq } from 'drizzle-orm';
import pkg from '@node-rs/argon2';
const { argon2id } = pkg;
import type { RequestEvent } from '@sveltejs/kit';

export class AuthService {
	/**
	 * Authentifie un utilisateur
	 */
	async authenticateUser(email: string, password: string): Promise<{
		success: boolean;
		user?: any;
		error?: string;
	}> {
		try {
			// Trouver l'utilisateur par email
			const [user] = await db
				.select()
				.from(creators)
				.where(eq(creators.email, email))
				.limit(1);

			if (!user) {
				return {
					success: false,
					error: 'Email ou mot de passe incorrect'
				};
			}

			// Vérifier le mot de passe
			const isValidPassword = await argon2id.verify(user.passwordHash, password);
			if (!isValidPassword) {
				return {
					success: false,
					error: 'Email ou mot de passe incorrect'
				};
			}

			// Vérifier que l'utilisateur est actif
			if (user.status !== 'active') {
				return {
					success: false,
					error: 'Compte inactif ou suspendu'
				};
			}

			return {
				success: true,
				user: {
					id: user.id,
					name: user.name,
					email: user.email,
					status: user.status,
					subscription: {
						type: user.subscriptionType,
						expiresAt: user.subscriptionExpiresAt,
						isActive: user.subscriptionActive
					}
				}
			};
		} catch (error) {
			console.error('Erreur lors de l\'authentification:', error);
			return {
				success: false,
				error: 'Erreur interne du serveur'
			};
		}
	}

	/**
	 * Crée une session pour un utilisateur
	 */
	async createSession(userId: string, event: RequestEvent): Promise<{
		success: boolean;
		sessionId?: string;
		error?: string;
	}> {
		try {
			const session = await lucia.createSession(userId, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});

			return {
				success: true,
				sessionId: session.id
			};
		} catch (error) {
			console.error('Erreur lors de la création de session:', error);
			return {
				success: false,
				error: 'Erreur lors de la création de session'
			};
		}
	}

	/**
	 * Valide une session
	 */
	async validateSession(event: RequestEvent): Promise<{
		success: boolean;
		user?: any;
		sessionId?: string;
		error?: string;
	}> {
		try {
			const sessionId = event.cookies.get(lucia.sessionCookieName);
			if (!sessionId) {
				return {
					success: false,
					error: 'Session non trouvée'
				};
			}

			const { session, user } = await lucia.validateSession(sessionId);
			if (!session) {
				return {
					success: false,
					error: 'Session invalide'
				};
			}

			return {
				success: true,
				user: {
					id: user.id,
					name: user.name,
					email: user.email,
					status: user.status,
					subscription: {
						type: user.subscriptionType,
						expiresAt: user.subscriptionExpiresAt,
						isActive: user.subscriptionActive
					}
				},
				sessionId: session.id
			};
		} catch (error) {
			console.error('Erreur lors de la validation de session:', error);
			return {
				success: false,
				error: 'Erreur lors de la validation de session'
			};
		}
	}

	/**
	 * Déconnecte un utilisateur
	 */
	async logout(event: RequestEvent): Promise<{
		success: boolean;
		error?: string;
	}> {
		try {
			const sessionId = event.cookies.get(lucia.sessionCookieName);
			if (!sessionId) {
				return {
					success: false,
					error: 'Session non trouvée'
				};
			}

			await lucia.invalidateSession(sessionId);
			const sessionCookie = lucia.createBlankSessionCookie();
			
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});

			return {
				success: true
			};
		} catch (error) {
			console.error('Erreur lors de la déconnexion:', error);
			return {
				success: false,
				error: 'Erreur lors de la déconnexion'
			};
		}
	}

	/**
	 * Hash un mot de passe
	 */
	async hashPassword(password: string): Promise<string> {
		return await argon2id.hash(password);
	}

	/**
	 * Vérifie un mot de passe
	 */
	async verifyPassword(password: string, hash: string): Promise<boolean> {
		return await argon2id.verify(hash, password);
	}
}
