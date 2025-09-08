/**
 * Cart Store - Presentation Layer
 * Store Svelte pour la gestion du panier
 */

import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { Cart } from '../../domain/entities/Cart.js';

export interface CartState {
	cart: Cart | null;
	isLoading: boolean;
	error: string | null;
}

const initialState: CartState = {
	cart: null,
	isLoading: false,
	error: null
};

function createCartStore() {
	const { subscribe, set, update } = writable<CartState>(initialState);

	// Générer un ID de session unique pour les utilisateurs non connectés
	const getSessionId = (): string => {
		if (browser) {
			let sessionId = localStorage.getItem('cart_session_id');
			if (!sessionId) {
				sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
				localStorage.setItem('cart_session_id', sessionId);
			}
			return sessionId;
		}
		return '';
	};

	return {
		subscribe,

		/**
		 * Charge le panier
		 */
		loadCart: async (userId?: string) => {
			update(state => ({
				...state,
				isLoading: true,
				error: null
			}));

			try {
				const sessionId = userId ? undefined : getSessionId();
				const response = await fetch('/api/cart', {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					}
				});

				if (response.ok) {
					const data = await response.json();
					update(state => ({
						...state,
						cart: data.cart,
						isLoading: false,
						error: null
					}));
				} else {
					update(state => ({
						...state,
						isLoading: false,
						error: 'Erreur lors du chargement du panier'
					}));
				}
			} catch (error) {
				update(state => ({
					...state,
					isLoading: false,
					error: 'Erreur de connexion'
				}));
			}
		},

		/**
		 * Ajoute un produit au panier
		 */
		addToCart: async (productId: string, variantId: string, quantity: number, userId?: string) => {
			update(state => ({
				...state,
				isLoading: true,
				error: null
			}));

			try {
				const sessionId = userId ? undefined : getSessionId();
				const response = await fetch('/api/cart/add', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						productId,
						variantId,
						quantity,
						userId,
						sessionId
					})
				});

				const data = await response.json();

				if (response.ok) {
					update(state => ({
						...state,
						cart: data.cart,
						isLoading: false,
						error: null
					}));
					return { success: true };
				} else {
					update(state => ({
						...state,
						isLoading: false,
						error: data.error || 'Erreur lors de l\'ajout au panier'
					}));
					return { success: false, error: data.error || 'Erreur lors de l\'ajout au panier' };
				}
			} catch (error) {
				update(state => ({
					...state,
					isLoading: false,
					error: 'Erreur de connexion'
				}));
				return { success: false, error: 'Erreur de connexion' };
			}
		},

		/**
		 * Met à jour la quantité d'un article
		 */
		updateQuantity: async (itemId: string, quantity: number, userId?: string) => {
			update(state => ({
				...state,
				isLoading: true,
				error: null
			}));

			try {
				const sessionId = userId ? undefined : getSessionId();
				const response = await fetch('/api/cart/update', {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						itemId,
						quantity,
						userId,
						sessionId
					})
				});

				const data = await response.json();

				if (response.ok) {
					update(state => ({
						...state,
						cart: data.cart,
						isLoading: false,
						error: null
					}));
					return { success: true };
				} else {
					update(state => ({
						...state,
						isLoading: false,
						error: data.error || 'Erreur lors de la mise à jour'
					}));
					return { success: false, error: data.error || 'Erreur lors de la mise à jour' };
				}
			} catch (error) {
				update(state => ({
					...state,
					isLoading: false,
					error: 'Erreur de connexion'
				}));
				return { success: false, error: 'Erreur de connexion' };
			}
		},

		/**
		 * Supprime un article du panier
		 */
		removeFromCart: async (itemId: string, userId?: string) => {
			update(state => ({
				...state,
				isLoading: true,
				error: null
			}));

			try {
				const sessionId = userId ? undefined : getSessionId();
				const response = await fetch('/api/cart/remove', {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						itemId,
						userId,
						sessionId
					})
				});

				const data = await response.json();

				if (response.ok) {
					update(state => ({
						...state,
						cart: data.cart,
						isLoading: false,
						error: null
					}));
					return { success: true };
				} else {
					update(state => ({
						...state,
						isLoading: false,
						error: data.error || 'Erreur lors de la suppression'
					}));
					return { success: false, error: data.error || 'Erreur lors de la suppression' };
				}
			} catch (error) {
				update(state => ({
					...state,
					isLoading: false,
					error: 'Erreur de connexion'
				}));
				return { success: false, error: 'Erreur de connexion' };
			}
		},

		/**
		 * Vide le panier
		 */
		clearCart: async (userId?: string) => {
			update(state => ({
				...state,
				isLoading: true,
				error: null
			}));

			try {
				const sessionId = userId ? undefined : getSessionId();
				const response = await fetch('/api/cart/clear', {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						userId,
						sessionId
					})
				});

				const data = await response.json();

				if (response.ok) {
					update(state => ({
						...state,
						cart: data.cart,
						isLoading: false,
						error: null
					}));
					return { success: true };
				} else {
					update(state => ({
						...state,
						isLoading: false,
						error: data.error || 'Erreur lors du vidage du panier'
					}));
					return { success: false, error: data.error || 'Erreur lors du vidage du panier' };
				}
			} catch (error) {
				update(state => ({
					...state,
					isLoading: false,
					error: 'Erreur de connexion'
				}));
				return { success: false, error: 'Erreur de connexion' };
			}
		},

		/**
		 * Définit l'erreur
		 */
		setError: (error: string | null) => {
			update(state => ({
				...state,
				error,
				isLoading: false
			}));
		},

		/**
		 * Réinitialise l'état
		 */
		reset: () => {
			set(initialState);
		}
	};
}

export const cartStore = createCartStore();
