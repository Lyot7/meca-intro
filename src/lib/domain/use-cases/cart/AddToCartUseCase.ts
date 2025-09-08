/**
 * Add to Cart Use Case - Domain Layer
 * Gère l'ajout d'un produit au panier
 */

import type { CartEntity, Cart } from '../../entities/Cart.js';
import type { ICartRepository } from '../../repositories/ICartRepository.js';
import type { IProductRepository } from '../../repositories/IProductRepository.js';

export interface AddToCartRequest {
	productId: string;
	variantId: string;
	quantity: number;
	userId?: string;
	sessionId?: string;
}

export interface AddToCartResponse {
	success: boolean;
	cart?: Cart;
	error?: string;
}

export class AddToCartUseCase {
	constructor(
		private cartRepository: ICartRepository,
		private productRepository: IProductRepository
	) {}

	async execute(request: AddToCartRequest): Promise<AddToCartResponse> {
		try {
			// Validation des données
			if (!request.productId || !request.variantId || !request.quantity || request.quantity <= 0) {
				return {
					success: false,
					error: 'Données invalides pour l\'ajout au panier'
				};
			}

			// Vérifier que le produit et la variante existent
			const product = await this.productRepository.findById(request.productId);
			if (!product) {
				return {
					success: false,
					error: 'Produit non trouvé'
				};
			}

			const variant = product.variants.find(v => v.id === request.variantId);
			if (!variant) {
				return {
					success: false,
					error: 'Variante non trouvée'
				};
			}

			// Vérifier le stock disponible
			if (variant.stock < request.quantity) {
				return {
					success: false,
					error: 'Stock insuffisant'
				};
			}

			// Trouver ou créer le panier
			let cart: Cart | null = null;
			
			if (request.userId) {
				cart = await this.cartRepository.findByUserId(request.userId);
			} else if (request.sessionId) {
				cart = await this.cartRepository.findBySessionId(request.sessionId);
			}

			if (!cart) {
				// Créer un nouveau panier
				cart = await this.cartRepository.save(new CartEntity(
					this.generateCartId(),
					[],
					new Date(),
					new Date(),
					request.userId,
					request.sessionId
				));
			}

			// Ajouter l'article au panier
			const cartEntity = new CartEntity(
				cart.id,
				cart.items,
				cart.createdAt,
				cart.updatedAt,
				cart.userId,
				cart.sessionId
			);

			cartEntity.addItem(
				request.productId,
				request.variantId,
				request.quantity,
				variant.price
			);

			// Sauvegarder le panier mis à jour
			const updatedCart = await this.cartRepository.save(cartEntity);

			return {
				success: true,
				cart: updatedCart
			};
		} catch (error) {
			return {
				success: false,
				error: 'Erreur lors de l\'ajout au panier'
			};
		}
	}

	private generateCartId(): string {
		return `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	}
}
