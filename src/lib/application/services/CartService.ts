/**
 * Cart Service - Application Layer
 * Gère les opérations sur le panier
 */

import type { Cart } from '../../domain/entities/Cart.js';
import type { ICartRepository } from '../../domain/repositories/ICartRepository.js';
import type { IProductRepository } from '../../domain/repositories/IProductRepository.js';

export interface GetCartResponse {
	success: boolean;
	cart?: Cart;
	error?: string;
}

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

export interface UpdateCartItemRequest {
	itemId: string;
	quantity: number;
	userId?: string;
	sessionId?: string;
}

export interface UpdateCartItemResponse {
	success: boolean;
	cart?: Cart;
	error?: string;
}

export interface RemoveFromCartRequest {
	itemId: string;
	userId?: string;
	sessionId?: string;
}

export interface RemoveFromCartResponse {
	success: boolean;
	cart?: Cart;
	error?: string;
}

export class CartService {
	constructor(
		private cartRepository: ICartRepository,
		private productRepository: IProductRepository
	) {}

	/**
	 * Récupère le panier d'un utilisateur ou d'une session
	 */
	async getCart(userId?: string, sessionId?: string): Promise<GetCartResponse> {
		try {
			let cart: Cart | null = null;

			if (userId) {
				cart = await this.cartRepository.findByUserId(userId);
			} else if (sessionId) {
				cart = await this.cartRepository.findBySessionId(sessionId);
			}

			if (!cart) {
				return {
					success: true,
					cart: {
						id: '',
						items: [],
						createdAt: new Date(),
						updatedAt: new Date(),
						userId,
						sessionId
					}
				};
			}

			return {
				success: true,
				cart
			};
		} catch (error) {
			return {
				success: false,
				error: 'Erreur lors de la récupération du panier'
			};
		}
	}

	/**
	 * Ajoute un produit au panier
	 */
	async addToCart(request: AddToCartRequest): Promise<AddToCartResponse> {
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
				cart = await this.cartRepository.save({
					id: this.generateCartId(),
					items: [],
					createdAt: new Date(),
					updatedAt: new Date(),
					userId: request.userId,
					sessionId: request.sessionId
				});
			}

			// Ajouter l'article au panier
			const existingItem = cart.items.find(
				item => item.productId === request.productId && item.variantId === request.variantId
			);

			if (existingItem) {
				existingItem.quantity += request.quantity;
			} else {
				cart.items.push({
					id: this.generateItemId(),
					productId: request.productId,
					variantId: request.variantId,
					quantity: request.quantity,
					unitPrice: variant.price,
					addedAt: new Date()
				});
			}

			// Sauvegarder le panier mis à jour
			const updatedCart = await this.cartRepository.save(cart);

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

	/**
	 * Met à jour la quantité d'un article dans le panier
	 */
	async updateCartItem(request: UpdateCartItemRequest): Promise<UpdateCartItemResponse> {
		try {
			// Trouver le panier
			let cart: Cart | null = null;
			
			if (request.userId) {
				cart = await this.cartRepository.findByUserId(request.userId);
			} else if (request.sessionId) {
				cart = await this.cartRepository.findBySessionId(request.sessionId);
			}

			if (!cart) {
				return {
					success: false,
					error: 'Panier non trouvé'
				};
			}

			// Trouver l'article
			const item = cart.items.find(i => i.id === request.itemId);
			if (!item) {
				return {
					success: false,
					error: 'Article non trouvé dans le panier'
				};
			}

			// Mettre à jour la quantité
			if (request.quantity <= 0) {
				cart.items = cart.items.filter(i => i.id !== request.itemId);
			} else {
				item.quantity = request.quantity;
			}

			// Sauvegarder le panier
			const updatedCart = await this.cartRepository.save(cart);

			return {
				success: true,
				cart: updatedCart
			};
		} catch (error) {
			return {
				success: false,
				error: 'Erreur lors de la mise à jour du panier'
			};
		}
	}

	/**
	 * Supprime un article du panier
	 */
	async removeFromCart(request: RemoveFromCartRequest): Promise<RemoveFromCartResponse> {
		try {
			// Trouver le panier
			let cart: Cart | null = null;
			
			if (request.userId) {
				cart = await this.cartRepository.findByUserId(request.userId);
			} else if (request.sessionId) {
				cart = await this.cartRepository.findBySessionId(request.sessionId);
			}

			if (!cart) {
				return {
					success: false,
					error: 'Panier non trouvé'
				};
			}

			// Supprimer l'article
			cart.items = cart.items.filter(item => item.id !== request.itemId);

			// Sauvegarder le panier
			const updatedCart = await this.cartRepository.save(cart);

			return {
				success: true,
				cart: updatedCart
			};
		} catch (error) {
			return {
				success: false,
				error: 'Erreur lors de la suppression du panier'
			};
		}
	}

	/**
	 * Vide le panier
	 */
	async clearCart(userId?: string, sessionId?: string): Promise<GetCartResponse> {
		try {
			let cart: Cart | null = null;
			
			if (userId) {
				cart = await this.cartRepository.findByUserId(userId);
			} else if (sessionId) {
				cart = await this.cartRepository.findBySessionId(sessionId);
			}

			if (cart) {
				await this.cartRepository.clear(cart.id);
			}

			return {
				success: true,
				cart: {
					id: cart?.id || '',
					items: [],
					createdAt: cart?.createdAt || new Date(),
					updatedAt: new Date(),
					userId,
					sessionId
				}
			};
		} catch (error) {
			return {
				success: false,
				error: 'Erreur lors du vidage du panier'
			};
		}
	}

	/**
	 * Génère un ID unique pour le panier
	 */
	private generateCartId(): string {
		return `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	}

	/**
	 * Génère un ID unique pour un article
	 */
	private generateItemId(): string {
		return `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	}
}
