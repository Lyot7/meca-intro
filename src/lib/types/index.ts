/**
 * Types - Presentation Layer
 * Types TypeScript pour l'application
 */

// Réexport des types du domaine
export type { Creator, CreatorStatus, SubscriptionType } from '../domain/entities/Creator.js';
export type { Product, ProductGender, ProductStatus, ProductVariant } from '../domain/entities/Product.js';
export type { Order, OrderStatus, OrderItem, ShippingAddress } from '../domain/entities/Order.js';
export type { Cart, CartItem } from '../domain/entities/Cart.js';

// Types pour les réponses API
export interface ApiResponse<T = any> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
}

export interface PaginatedResponse<T> {
	success: boolean;
	data: T[];
	pagination: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	};
	error?: string;
}

// Types pour les formulaires
export interface LoginForm {
	email: string;
	password: string;
}

export interface RegisterForm {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
	description?: string;
	website?: string;
	socialMedia?: {
		instagram?: string;
		facebook?: string;
		twitter?: string;
	};
}

export interface ProductForm {
	name: string;
	description: string;
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

// Types pour les filtres
export interface ProductFilters {
	gender?: ProductGender;
	status?: ProductStatus;
	creatorId?: string;
	minPrice?: number;
	maxPrice?: number;
	search?: string;
}

// Types pour les composants
export interface ComponentProps {
	[key: string]: any;
}

// Types pour les stores
export interface StoreState {
	isLoading: boolean;
	error: string | null;
}

// Types pour les erreurs
export interface AppError {
	code: string;
	message: string;
	details?: any;
}

// Types pour les notifications
export interface Notification {
	id: string;
	type: 'success' | 'error' | 'warning' | 'info';
	title: string;
	message: string;
	duration?: number;
}

// Types pour les modales
export interface ModalState {
	isOpen: boolean;
	title?: string;
	content?: any;
	onClose?: () => void;
}

// Types pour la navigation
export interface NavigationItem {
	label: string;
	href: string;
	icon?: string;
	children?: NavigationItem[];
}

// Types pour les métadonnées
export interface PageMetadata {
	title: string;
	description: string;
	keywords?: string[];
	ogImage?: string;
}

// Types pour les paramètres d'URL
export interface UrlParams {
	[key: string]: string | string[] | undefined;
}

// Types pour les requêtes
export interface RequestOptions {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	headers?: Record<string, string>;
	body?: any;
	timeout?: number;
}

// Types pour les réponses HTTP
export interface HttpResponse<T = any> {
	status: number;
	statusText: string;
	data: T;
	headers: Record<string, string>;
}

// Types pour les événements
export interface CustomEvent<T = any> {
	type: string;
	detail: T;
	target?: EventTarget;
}

// Types pour les utilitaires
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type Required<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
