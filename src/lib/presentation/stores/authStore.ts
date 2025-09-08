/**
 * Auth Store - Presentation Layer
 * Store Svelte pour la gestion de l'authentification
 */

import { writable } from 'svelte/store';
import type { Creator } from '../../domain/entities/Creator.js';

export interface AuthState {
	user: Creator | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
}

const initialState: AuthState = {
	user: null,
	isAuthenticated: false,
	isLoading: false,
	error: null
};

function createAuthStore() {
	const { subscribe, set, update } = writable<AuthState>(initialState);

	return {
		subscribe,
		
		/**
		 * Définit l'utilisateur connecté
		 */
		setUser: (user: Creator | null) => {
			update(state => ({
				...state,
				user,
				isAuthenticated: !!user,
				error: null
			}));
		},

		/**
		 * Définit l'état de chargement
		 */
		setLoading: (isLoading: boolean) => {
			update(state => ({
				...state,
				isLoading
			}));
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
		 * Connecte un utilisateur
		 */
		login: async (email: string, password: string) => {
			update(state => ({
				...state,
				isLoading: true,
				error: null
			}));

			try {
				// Essayer d'abord en tant que créateur
				let response = await fetch('/api/auth/creator/login', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ email, password })
				});

				if (response.ok) {
					const data = await response.json();
					update(state => ({
						...state,
						user: data.user,
						isAuthenticated: true,
						isLoading: false,
						error: null
					}));
					return { success: true, userType: 'creator' };
				}

				// Si ce n'est pas un créateur, essayer en tant que client
				response = await fetch('/api/auth/client/login', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ email, password })
				});

				if (response.ok) {
					const data = await response.json();
					update(state => ({
						...state,
						user: data.user,
						isAuthenticated: true,
						isLoading: false,
						error: null
					}));
					return { success: true, userType: 'client' };
				}

				// Si aucun des deux ne fonctionne
				const errorData = await response.json();
				update(state => ({
					...state,
					isLoading: false,
					error: errorData.error || 'Email ou mot de passe incorrect'
				}));
				return { success: false, error: errorData.error || 'Email ou mot de passe incorrect' };
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
		 * Enregistre un nouveau créateur
		 */
		register: async (userData: {
			name: string;
			email: string;
			password: string;
			description?: string;
			website?: string;
			socialMedia?: {
				instagram?: string;
				facebook?: string;
				twitter?: string;
			};
		}) => {
			update(state => ({
				...state,
				isLoading: true,
				error: null
			}));

			try {
				const response = await fetch('/api/auth/creator/register', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(userData)
				});

				const data = await response.json();

				if (response.ok) {
					update(state => ({
						...state,
						user: data.user,
						isAuthenticated: true,
						isLoading: false,
						error: null
					}));
					return { success: true };
				} else {
					update(state => ({
						...state,
						isLoading: false,
						error: data.error || 'Erreur lors de l\'enregistrement'
					}));
					return { success: false, error: data.error || 'Erreur lors de l\'enregistrement' };
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
		 * Déconnecte l'utilisateur
		 */
		logout: () => {
			set(initialState);
		},

		/**
		 * Réinitialise l'état
		 */
		reset: () => {
			set(initialState);
		}
	};
}

export const authStore = createAuthStore();
