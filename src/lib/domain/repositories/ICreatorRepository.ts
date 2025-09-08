/**
 * Creator Repository Interface - Domain Layer
 * Définit le contrat pour la persistance des créateurs
 */

import type { Creator, CreatorEntity } from '../entities/Creator.js';

export interface ICreatorRepository {
	/**
	 * Trouve un créateur par son ID
	 */
	findById(id: string): Promise<Creator | null>;

	/**
	 * Trouve un créateur par son email
	 */
	findByEmail(email: string): Promise<Creator | null>;

	/**
	 * Trouve tous les créateurs actifs
	 */
	findActive(): Promise<Creator[]>;

	/**
	 * Trouve les créateurs par statut
	 */
	findByStatus(status: Creator['status']): Promise<Creator[]>;

	/**
	 * Sauvegarde un créateur
	 */
	save(creator: CreatorEntity): Promise<Creator>;

	/**
	 * Met à jour un créateur
	 */
	update(id: string, updates: Partial<Creator>): Promise<Creator>;

	/**
	 * Supprime un créateur
	 */
	delete(id: string): Promise<void>;

	/**
	 * Vérifie si un email existe déjà
	 */
	emailExists(email: string, excludeId?: string): Promise<boolean>;

	/**
	 * Trouve les créateurs avec un abonnement expiré
	 */
	findWithExpiredSubscription(): Promise<Creator[]>;

	/**
	 * Trouve les créateurs par type d'abonnement
	 */
	findBySubscriptionType(type: Creator['subscription']['type']): Promise<Creator[]>;
}
