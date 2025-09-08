/**
 * Cart Repository Interface - Domain Layer
 * Définit le contrat pour la persistance des paniers
 */

import type { Cart, CartEntity } from '../entities/Cart.js';

export interface ICartRepository {
	/**
	 * Trouve un panier par son ID
	 */
	findById(id: string): Promise<Cart | null>;

	/**
	 * Trouve un panier par l'ID utilisateur
	 */
	findByUserId(userId: string): Promise<Cart | null>;

	/**
	 * Trouve un panier par l'ID de session
	 */
	findBySessionId(sessionId: string): Promise<Cart | null>;

	/**
	 * Sauvegarde un panier
	 */
	save(cart: CartEntity): Promise<Cart>;

	/**
	 * Met à jour un panier
	 */
	update(id: string, updates: Partial<Cart>): Promise<Cart>;

	/**
	 * Supprime un panier
	 */
	delete(id: string): Promise<void>;

	/**
	 * Vide un panier
	 */
	clear(id: string): Promise<void>;

	/**
	 * Trouve les paniers abandonnés (plus de 7 jours)
	 */
	findAbandonedCarts(): Promise<Cart[]>;

	/**
	 * Supprime les paniers expirés
	 */
	deleteExpiredCarts(): Promise<number>;
}
