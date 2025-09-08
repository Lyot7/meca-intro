/**
 * Mock Auth Service - Infrastructure Layer
 * Service d'authentification simplifié pour les tests sans base de données
 */

export class MockAuthService {
	// Utilisateurs de test en mémoire
	private users = [
		{
			id: 'admin_001',
			name: 'admin',
			email: 'admin@kpsull.com',
			password: 'password',
			status: 'active',
			subscription: {
				type: 'yearly',
				expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
				isActive: true
			}
		},
		{
			id: 'creator_001',
			name: 'créateur',
			email: 'createur@kpsull.com',
			password: 'password',
			status: 'active',
			subscription: {
				type: 'monthly',
				expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
				isActive: true
			}
		},
		{
			id: 'client_001',
			name: 'client',
			email: 'client@kpsull.com',
			password: 'password',
			status: 'active',
			subscription: {
				type: 'monthly',
				expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
				isActive: false
			}
		}
	];

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
			const user = this.users.find(u => u.email === email);

			if (!user) {
				return {
					success: false,
					error: 'Email ou mot de passe incorrect'
				};
			}

			// Vérifier le mot de passe (simplifié pour les tests)
			if (user.password !== password) {
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
					subscription: user.subscription
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
	 * Crée une session pour un utilisateur (mock)
	 */
	async createSession(userId: string, event: any): Promise<{
		success: boolean;
		sessionId?: string;
		error?: string;
	}> {
		try {
			// Simuler la création d'une session
			const sessionId = `session_${userId}_${Date.now()}`;
			
			// Stocker la session dans un cookie (simplifié)
			if (event.cookies) {
				event.cookies.set('auth_session', sessionId, {
					path: '/',
					maxAge: 60 * 60 * 24 * 7, // 7 jours
					httpOnly: true,
					secure: false, // true en production
					sameSite: 'lax'
				});
			}

			return {
				success: true,
				sessionId
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
	 * Valide une session (mock)
	 */
	async validateSession(event: any): Promise<{
		success: boolean;
		user?: any;
		sessionId?: string;
		error?: string;
	}> {
		try {
			const sessionId = event.cookies?.get('auth_session');
			
			if (!sessionId) {
				return {
					success: false,
					error: 'Session non trouvée'
				};
			}

			// Extraire l'ID utilisateur de la session
			// Format: session_admin_001_timestamp -> admin_001
			const parts = sessionId.split('_');
			const userId = parts.slice(1, -1).join('_'); // Prendre tout sauf 'session' et le timestamp
			const user = this.users.find(u => u.id === userId);

			if (!user) {
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
					subscription: user.subscription
				},
				sessionId
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
	 * Déconnecte un utilisateur (mock)
	 */
	async logout(event: any): Promise<{
		success: boolean;
		error?: string;
	}> {
		try {
			if (event.cookies) {
				event.cookies.delete('auth_session', { path: '/' });
			}

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
}
