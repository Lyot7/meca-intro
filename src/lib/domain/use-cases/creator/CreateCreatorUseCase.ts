/**
 * Create Creator Use Case - Domain Layer
 * Gère la création d'un nouveau créateur
 */

import type { CreatorEntity, Creator, CreatorStatus, SubscriptionType } from '../../entities/Creator.js';
import type { ICreatorRepository } from '../../repositories/ICreatorRepository.js';

export interface CreateCreatorRequest {
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

export interface CreateCreatorResponse {
	success: boolean;
	creator?: Creator;
	error?: string;
}

export class CreateCreatorUseCase {
	constructor(private creatorRepository: ICreatorRepository) {}

	async execute(request: CreateCreatorRequest): Promise<CreateCreatorResponse> {
		try {
			// Validation des données
			if (!request.name || !request.email || !request.password) {
				return {
					success: false,
					error: 'Nom, email et mot de passe sont requis'
				};
			}

			// Vérifier si l'email existe déjà
			const existingCreator = await this.creatorRepository.findByEmail(request.email);
			if (existingCreator) {
				return {
					success: false,
					error: 'Un créateur avec cet email existe déjà'
				};
			}

			// Créer le créateur
			const creator = new CreatorEntity(
				this.generateId(),
				request.name,
				request.email,
				CreatorStatus.ACTIVE,
				{
					type: SubscriptionType.MONTHLY,
					expiresAt: new Date(),
					isActive: false // L'abonnement sera activé après paiement
				},
				new Date(),
				request.description,
				undefined, // profileImage
				request.website,
				request.socialMedia
			);

			// Sauvegarder le créateur
			const savedCreator = await this.creatorRepository.save(creator);

			return {
				success: true,
				creator: savedCreator
			};
		} catch (error) {
			return {
				success: false,
				error: 'Erreur lors de la création du créateur'
			};
		}
	}

	private generateId(): string {
		return `creator_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	}
}
