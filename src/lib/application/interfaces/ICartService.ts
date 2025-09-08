/**
 * Cart Service Interface - Application Layer
 * Définit le contrat pour les services de panier
 */

import type { Cart } from '../../domain/entities/Cart.js';

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

export interface ICartService {
	getCart(userId?: string, sessionId?: string): Promise<GetCartResponse>;
	addToCart(request: AddToCartRequest): Promise<AddToCartResponse>;
	updateCartItem(request: UpdateCartItemRequest): Promise<UpdateCartItemResponse>;
	removeFromCart(request: RemoveFromCartRequest): Promise<RemoveFromCartResponse>;
	clearCart(userId?: string, sessionId?: string): Promise<GetCartResponse>;
}
