/**
 * Product Service Interface - Application Layer
 * Définit le contrat pour les services de produits
 */

import type { Product, ProductGender } from '../../domain/entities/Product.js';

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

export interface IProductService {
	getProducts(request: GetProductsRequest): Promise<GetProductsResponse>;
	getProduct(productId: string): Promise<GetProductResponse>;
	getProductsByCreator(creatorId: string): Promise<GetProductsResponse>;
	getRecentProducts(limit?: number): Promise<GetProductsResponse>;
	getBestSellingProducts(limit?: number): Promise<GetProductsResponse>;
}
