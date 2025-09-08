/**
 * Product Service - Application Layer
 * Gère les opérations sur les produits
 */

import type { Product, ProductGender } from '../../domain/entities/Product.js';
import type { IProductRepository } from '../../domain/repositories/IProductRepository.js';
import type { ICreatorRepository } from '../../domain/repositories/ICreatorRepository.js';

export interface GetProductsRequest {
	gender?: ProductGender;
	page?: number;
	limit?: number;
	search?: string;
	minPrice?: number;
	maxPrice?: number;
}

export interface GetProductsResponse {
	success: boolean;
	products?: Product[];
	total?: number;
	page?: number;
	limit?: number;
	totalPages?: number;
	error?: string;
}

export interface GetProductResponse {
	success: boolean;
	product?: Product;
	error?: string;
}

export class ProductService {
	constructor(
		private productRepository: IProductRepository,
		private creatorRepository: ICreatorRepository
	) {}

	/**
	 * Récupère les produits avec filtres et pagination
	 */
	async getProducts(request: GetProductsRequest): Promise<GetProductsResponse> {
		try {
			const page = request.page || 1;
			const limit = request.limit || 12;

			const result = await this.productRepository.findPaginated(page, limit, {
				gender: request.gender,
				minPrice: request.minPrice,
				maxPrice: request.maxPrice
			});

			// Si une recherche est demandée, filtrer les résultats
			let products = result.products;
			if (request.search) {
				const searchResults = await this.productRepository.search(request.search);
				products = searchResults.filter(product => {
					// Appliquer les filtres de genre si spécifiés
					if (request.gender && product.gender !== request.gender && !product.isUnisex()) {
						return false;
					}
					return true;
				});
			}

			return {
				success: true,
				products,
				total: result.total,
				page: result.page,
				limit: result.limit,
				totalPages: result.totalPages
			};
		} catch (error) {
			return {
				success: false,
				error: 'Erreur lors de la récupération des produits'
			};
		}
	}

	/**
	 * Récupère un produit par son ID
	 */
	async getProduct(productId: string): Promise<GetProductResponse> {
		try {
			if (!productId) {
				return {
					success: false,
					error: 'ID du produit requis'
				};
			}

			const product = await this.productRepository.findById(productId);
			if (!product) {
				return {
					success: false,
					error: 'Produit non trouvé'
				};
			}

			return {
				success: true,
				product
			};
		} catch (error) {
			return {
				success: false,
				error: 'Erreur lors de la récupération du produit'
			};
		}
	}

	/**
	 * Récupère les produits d'un créateur
	 */
	async getProductsByCreator(creatorId: string): Promise<GetProductsResponse> {
		try {
			if (!creatorId) {
				return {
					success: false,
					error: 'ID du créateur requis'
				};
			}

			// Vérifier que le créateur existe
			const creator = await this.creatorRepository.findById(creatorId);
			if (!creator) {
				return {
					success: false,
					error: 'Créateur non trouvé'
				};
			}

			const products = await this.productRepository.findByCreatorId(creatorId);

			return {
				success: true,
				products
			};
		} catch (error) {
			return {
				success: false,
				error: 'Erreur lors de la récupération des produits du créateur'
			};
		}
	}

	/**
	 * Récupère les produits récents
	 */
	async getRecentProducts(limit: number = 8): Promise<GetProductsResponse> {
		try {
			const products = await this.productRepository.findRecent(limit);

			return {
				success: true,
				products
			};
		} catch (error) {
			return {
				success: false,
				error: 'Erreur lors de la récupération des produits récents'
			};
		}
	}

	/**
	 * Récupère les produits les plus vendus
	 */
	async getBestSellingProducts(limit: number = 8): Promise<GetProductsResponse> {
		try {
			const products = await this.productRepository.findBestSelling(limit);

			return {
				success: true,
				products
			};
		} catch (error) {
			return {
				success: false,
				error: 'Erreur lors de la récupération des produits les plus vendus'
			};
		}
	}
}
