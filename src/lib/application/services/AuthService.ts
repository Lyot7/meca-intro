/**
 * Auth Service - Application Layer
 * Gère l'authentification des utilisateurs
 */

import type { Creator } from '../../domain/entities/Creator.js';
import type { ICreatorRepository } from '../../domain/repositories/ICreatorRepository.js';

export interface LoginRequest {
	email: string;
	password: string;
}

export interface LoginResponse {
	success: boolean;
	user?: Creator;
	error?: string;
}

export interface RegisterRequest {
	name: string;
	email: string;
	password: string;
	description?: string;
	website?: string;
	socialMedia?: {
		instagram?: string;
		facebook?: string;
		twitter?: string;
	};
}

export interface RegisterResponse {
	success: boolean;
	user?: Creator;
	error?: string;
}

export class AuthService {
	constructor(private creatorRepository: ICreatorRepository) {}

	/**
	 * Authentifie un créateur
	 */
	async login(request: LoginRequest): Promise<LoginResponse> {
		try {
			// Validation des données
			if (!request.email || !request.password) {
				return {
					success: false,
					error: 'Email et mot de passe requis'
				};
			}

			// Trouver le créateur par email
			const creator = await this.creatorRepository.findByEmail(request.email);
			if (!creator) {
				return {
					success: false,
					error: 'Email ou mot de passe incorrect'
				};
			}

			// Vérifier le mot de passe (à implémenter avec le hash)
			// const isValidPassword = await this.verifyPassword(request.password, creator.passwordHash);
			// if (!isValidPassword) {
			//     return {
			//         success: false,
			//         error: 'Email ou mot de passe incorrect'
			//     };
			// }

			// Vérifier que le créateur est actif
			if (creator.status !== 'active') {
				return {
					success: false,
					error: 'Compte inactif ou suspendu'
				};
			}

			return {
				success: true,
				user: creator
			};
		} catch (error) {
			return {
				success: false,
				error: 'Erreur lors de l\'authentification'
			};
		}
	}

	/**
	 * Enregistre un nouveau créateur
	 */
	async register(request: RegisterRequest): Promise<RegisterResponse> {
		try {
			// Validation des données
			if (!request.name || !request.email || !request.password) {
				return {
					success: false,
					error: 'Nom, email et mot de passe requis'
				};
			}

			// Vérifier si l'email existe déjà
			const existingCreator = await this.creatorRepository.findByEmail(request.email);
			if (existingCreator) {
				return {
					success: false,
					error: 'Un compte avec cet email existe déjà'
				};
			}

			// Hasher le mot de passe (à implémenter)
			// const hashedPassword = await this.hashPassword(request.password);

			// Créer le créateur
			const creator = await this.creatorRepository.save({
				id: this.generateId(),
				name: request.name,
				email: request.email,
				description: request.description,
				website: request.website,
				socialMedia: request.socialMedia,
				status: 'active',
				createdAt: new Date(),
				subscription: {
					type: 'monthly',
					expiresAt: new Date(),
					isActive: false
				}
			});

			return {
				success: true,
				user: creator
			};
		} catch (error) {
			return {
				success: false,
				error: 'Erreur lors de l\'enregistrement'
			};
		}
	}

	/**
	 * Génère un ID unique
	 */
	private generateId(): string {
		return `creator_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	}

	/**
	 * Hash un mot de passe (à implémenter avec Argon2)
	 */
	private async hashPassword(password: string): Promise<string> {
		// TODO: Implémenter avec @node-rs/argon2
		return password;
	}

	/**
	 * Vérifie un mot de passe (à implémenter avec Argon2)
	 */
	private async verifyPassword(password: string, hash: string): Promise<boolean> {
		// TODO: Implémenter avec @node-rs/argon2
		return password === hash;
	}
}
