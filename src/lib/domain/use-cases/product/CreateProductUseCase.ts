/**
 * Create Product Use Case - Domain Layer
 * Gère la création d'un nouveau produit
 */

import type { ProductEntity, Product, ProductGender } from '../../entities/Product.js';
import type { IProductRepository } from '../../repositories/IProductRepository.js';
import type { ICreatorRepository } from '../../repositories/ICreatorRepository.js';

export interface CreateProductRequest {
	name: string;
	description: string;
	creatorId: string;
	gender: ProductGender;
	variants: Array<{
		size?: string;
		color?: string;
		stock: number;
		price: number;
		images: string[];
	}>;
	tags?: string[];
}

export interface CreateProductResponse {
	success: boolean;
	product?: Product;
	error?: string;
}

export class CreateProductUseCase {
	constructor(
		private productRepository: IProductRepository,
		private creatorRepository: ICreatorRepository
	) {}

	async execute(request: CreateProductRequest): Promise<CreateProductResponse> {
		try {
			// Validation des données
			if (!request.name || !request.description || !request.creatorId || !request.variants.length) {
				return {
					success: false,
					error: 'Tous les champs requis doivent être remplis'
				};
			}

			// Vérifier que le créateur existe et peut publier
			const creator = await this.creatorRepository.findById(request.creatorId);
			if (!creator) {
				return {
					success: false,
					error: 'Créateur non trouvé'
				};
			}

			if (!creator.canPublishProducts()) {
				return {
					success: false,
					error: 'Le créateur ne peut pas publier de produits (abonnement inactif ou expiré)'
				};
			}

			// Créer les variantes avec des IDs uniques
			const variants = request.variants.map(variant => ({
				id: this.generateVariantId(),
				size: variant.size,
				color: variant.color,
				stock: variant.stock,
				price: variant.price,
				images: variant.images
			}));

			// Créer le produit
			const product = new ProductEntity(
				this.generateId(),
				request.name,
				request.description,
				request.creatorId,
				request.gender,
				'available', // status
				variants,
				new Date(),
				new Date(),
				request.tags
			);

			// Sauvegarder le produit
			const savedProduct = await this.productRepository.save(product);

			return {
				success: true,
				product: savedProduct
			};
		} catch (error) {
			return {
				success: false,
				error: 'Erreur lors de la création du produit'
			};
		}
	}

	private generateId(): string {
		return `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	}

	private generateVariantId(): string {
		return `variant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	}
}
