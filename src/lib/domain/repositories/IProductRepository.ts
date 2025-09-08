/**
 * Product Repository Interface - Domain Layer
 * Définit le contrat pour la persistance des produits
 */

import type { Product, ProductEntity, ProductGender, ProductStatus } from '../entities/Product.js';

export interface IProductRepository {
	/**
	 * Trouve un produit par son ID
	 */
	findById(id: string): Promise<Product | null>;

	/**
	 * Trouve tous les produits d'un créateur
	 */
	findByCreatorId(creatorId: string): Promise<Product[]>;

	/**
	 * Trouve les produits par genre
	 */
	findByGender(gender: ProductGender): Promise<Product[]>;

	/**
	 * Trouve les produits par statut
	 */
	findByStatus(status: ProductStatus): Promise<Product[]>;

	/**
	 * Trouve les produits disponibles
	 */
	findAvailable(): Promise<Product[]>;

	/**
	 * Recherche des produits par nom ou description
	 */
	search(query: string): Promise<Product[]>;

	/**
	 * Trouve les produits avec pagination
	 */
	findPaginated(page: number, limit: number, filters?: {
		gender?: ProductGender;
		status?: ProductStatus;
		creatorId?: string;
		minPrice?: number;
		maxPrice?: number;
	}): Promise<{
		products: Product[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}>;

	/**
	 * Sauvegarde un produit
	 */
	save(product: ProductEntity): Promise<Product>;

	/**
	 * Met à jour un produit
	 */
	update(id: string, updates: Partial<Product>): Promise<Product>;

	/**
	 * Supprime un produit
	 */
	delete(id: string): Promise<void>;

	/**
	 * Trouve les produits les plus récents
	 */
	findRecent(limit: number): Promise<Product[]>;

	/**
	 * Trouve les produits les plus vendus
	 */
	findBestSelling(limit: number): Promise<Product[]>;

	/**
	 * Met à jour le stock d'une variante
	 */
	updateVariantStock(productId: string, variantId: string, newStock: number): Promise<void>;
}
