/**
 * Order Repository Interface - Domain Layer
 * Définit le contrat pour la persistance des commandes
 */

import type { Order, OrderEntity, OrderStatus } from '../entities/Order.js';

export interface IOrderRepository {
	/**
	 * Trouve une commande par son ID
	 */
	findById(id: string): Promise<Order | null>;

	/**
	 * Trouve les commandes d'un client
	 */
	findByCustomerId(customerId: string): Promise<Order[]>;

	/**
	 * Trouve les commandes par statut
	 */
	findByStatus(status: OrderStatus): Promise<Order[]>;

	/**
	 * Trouve les commandes d'un créateur (via les produits)
	 */
	findByCreatorId(creatorId: string): Promise<Order[]>;

	/**
	 * Trouve les commandes avec pagination
	 */
	findPaginated(page: number, limit: number, filters?: {
		customerId?: string;
		creatorId?: string;
		status?: OrderStatus;
		dateFrom?: Date;
		dateTo?: Date;
	}): Promise<{
		orders: Order[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}>;

	/**
	 * Sauvegarde une commande
	 */
	save(order: OrderEntity): Promise<Order>;

	/**
	 * Met à jour une commande
	 */
	update(id: string, updates: Partial<Order>): Promise<Order>;

	/**
	 * Supprime une commande
	 */
	delete(id: string): Promise<void>;

	/**
	 * Trouve une commande par l'ID du paiement Stripe
	 */
	findByStripePaymentIntentId(paymentIntentId: string): Promise<Order | null>;

	/**
	 * Trouve les commandes récentes
	 */
	findRecent(limit: number): Promise<Order[]>;

	/**
	 * Calcule les statistiques de commandes
	 */
	getOrderStats(creatorId?: string, dateFrom?: Date, dateTo?: Date): Promise<{
		totalOrders: number;
		totalRevenue: number;
		averageOrderValue: number;
		ordersByStatus: Record<OrderStatus, number>;
	}>;
}
