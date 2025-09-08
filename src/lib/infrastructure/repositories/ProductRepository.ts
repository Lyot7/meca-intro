/**
 * Product Repository - Infrastructure Layer
 * Implémentation concrète du repository des produits avec Drizzle ORM
 */

import { eq, and, or, like, gte, lte, desc, asc, count } from 'drizzle-orm';
import { db } from '../database/config.js';
import { products, productVariants } from '../database/schema.js';
import type { IProductRepository } from '../../domain/repositories/IProductRepository.js';
import type { Product, ProductEntity, ProductGender, ProductStatus } from '../../domain/entities/Product.js';

export class ProductRepository implements IProductRepository {
	async findById(id: string): Promise<Product | null> {
		const result = await db
			.select()
			.from(products)
			.leftJoin(productVariants, eq(products.id, productVariants.productId))
			.where(eq(products.id, id))
			.limit(1);

		if (result.length === 0) return null;

		return this.mapToDomain(result);
	}

	async findByCreatorId(creatorId: string): Promise<Product[]> {
		const result = await db
			.select()
			.from(products)
			.leftJoin(productVariants, eq(products.id, productVariants.productId))
			.where(eq(products.creatorId, creatorId))
			.orderBy(desc(products.createdAt));

		return this.groupAndMapToDomain(result);
	}

	async findByGender(gender: ProductGender): Promise<Product[]> {
		const result = await db
			.select()
			.from(products)
			.leftJoin(productVariants, eq(products.id, productVariants.productId))
			.where(
				or(
					eq(products.gender, gender),
					eq(products.gender, 'unisex')
				)
			)
			.orderBy(desc(products.createdAt));

		return this.groupAndMapToDomain(result);
	}

	async findByStatus(status: ProductStatus): Promise<Product[]> {
		const result = await db
			.select()
			.from(products)
			.leftJoin(productVariants, eq(products.id, productVariants.productId))
			.where(eq(products.status, status))
			.orderBy(desc(products.createdAt));

		return this.groupAndMapToDomain(result);
	}

	async findAvailable(): Promise<Product[]> {
		const result = await db
			.select()
			.from(products)
			.leftJoin(productVariants, eq(products.id, productVariants.productId))
			.where(eq(products.status, 'available'))
			.orderBy(desc(products.createdAt));

		return this.groupAndMapToDomain(result);
	}

	async search(query: string): Promise<Product[]> {
		const searchTerm = `%${query}%`;
		const result = await db
			.select()
			.from(products)
			.leftJoin(productVariants, eq(products.id, productVariants.productId))
			.where(
				or(
					like(products.name, searchTerm),
					like(products.description, searchTerm)
				)
			)
			.orderBy(desc(products.createdAt));

		return this.groupAndMapToDomain(result);
	}

	async findPaginated(
		page: number,
		limit: number,
		filters?: {
			gender?: ProductGender;
			status?: ProductStatus;
			creatorId?: string;
			minPrice?: number;
			maxPrice?: number;
		}
	): Promise<{
		products: Product[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}> {
		// Construire les conditions de filtrage
		const conditions = [];
		
		if (filters?.gender) {
			conditions.push(
				or(
					eq(products.gender, filters.gender),
					eq(products.gender, 'unisex')
				)
			);
		}
		
		if (filters?.status) {
			conditions.push(eq(products.status, filters.status));
		}
		
		if (filters?.creatorId) {
			conditions.push(eq(products.creatorId, filters.creatorId));
		}

		// Compter le total
		const totalResult = await db
			.select({ count: count() })
			.from(products)
			.where(conditions.length > 0 ? and(...conditions) : undefined);

		const total = totalResult[0]?.count || 0;
		const totalPages = Math.ceil(total / limit);
		const offset = (page - 1) * limit;

		// Récupérer les produits avec pagination
		const result = await db
			.select()
			.from(products)
			.leftJoin(productVariants, eq(products.id, productVariants.productId))
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(desc(products.createdAt))
			.limit(limit)
			.offset(offset);

		const productsList = this.groupAndMapToDomain(result);

		// Filtrer par prix si nécessaire
		let filteredProducts = productsList;
		if (filters?.minPrice || filters?.maxPrice) {
			filteredProducts = productsList.filter(product => {
				const minPrice = product.getMinPrice();
				const maxPrice = product.getMaxPrice();
				
				if (filters.minPrice && maxPrice < filters.minPrice) return false;
				if (filters.maxPrice && minPrice > filters.maxPrice) return false;
				
				return true;
			});
		}

		return {
			products: filteredProducts,
			total,
			page,
			limit,
			totalPages,
		};
	}

	async save(product: ProductEntity): Promise<Product> {
		const productData = {
			id: product.id,
			name: product.name,
			description: product.description,
			creatorId: product.creatorId,
			gender: product.gender,
			status: product.status,
			tags: product.tags,
			createdAt: product.createdAt,
			updatedAt: product.updatedAt,
		};

		// Insérer le produit
		const [savedProduct] = await db.insert(products).values(productData).returning();

		// Insérer les variantes
		if (product.variants.length > 0) {
			const variantsData = product.variants.map(variant => ({
				id: variant.id,
				productId: product.id,
				size: variant.size,
				color: variant.color,
				stock: variant.stock,
				price: variant.price.toString(),
				images: variant.images,
				createdAt: new Date(),
				updatedAt: new Date(),
			}));

			await db.insert(productVariants).values(variantsData);
		}

		// Récupérer le produit complet avec ses variantes
		return this.findById(product.id) as Promise<Product>;
	}

	async update(id: string, updates: Partial<Product>): Promise<Product> {
		const updateData: any = {
			updatedAt: new Date(),
		};

		if (updates.name) updateData.name = updates.name;
		if (updates.description) updateData.description = updates.description;
		if (updates.gender) updateData.gender = updates.gender;
		if (updates.status) updateData.status = updates.status;
		if (updates.tags !== undefined) updateData.tags = updates.tags;

		await db.update(products).set(updateData).where(eq(products.id, id));

		return this.findById(id) as Promise<Product>;
	}

	async delete(id: string): Promise<void> {
		await db.delete(products).where(eq(products.id, id));
	}

	async findRecent(limit: number): Promise<Product[]> {
		const result = await db
			.select()
			.from(products)
			.leftJoin(productVariants, eq(products.id, productVariants.productId))
			.where(eq(products.status, 'available'))
			.orderBy(desc(products.createdAt))
			.limit(limit);

		return this.groupAndMapToDomain(result);
	}

	async findBestSelling(limit: number): Promise<Product[]> {
		// TODO: Implémenter la logique des meilleures ventes
		// Pour l'instant, retourner les produits récents
		return this.findRecent(limit);
	}

	async updateVariantStock(productId: string, variantId: string, newStock: number): Promise<void> {
		await db
			.update(productVariants)
			.set({ 
				stock: newStock,
				updatedAt: new Date()
			})
			.where(
				and(
					eq(productVariants.productId, productId),
					eq(productVariants.id, variantId)
				)
			);
	}

	/**
	 * Groupe les résultats par produit et mappe vers le domaine
	 */
	private groupAndMapToDomain(results: any[]): Product[] {
		const productMap = new Map<string, any>();

		results.forEach(row => {
			const productId = row.products.id;
			
			if (!productMap.has(productId)) {
				productMap.set(productId, {
					...row.products,
					variants: []
				});
			}

			if (row.product_variants) {
				productMap.get(productId).variants.push(row.product_variants);
			}
		});

		return Array.from(productMap.values()).map(this.mapToDomain);
	}

	/**
	 * Mappe les données de la base vers le domaine
	 */
	private mapToDomain(dbProduct: any): Product {
		return {
			id: dbProduct.id,
			name: dbProduct.name,
			description: dbProduct.description,
			creatorId: dbProduct.creatorId,
			gender: dbProduct.gender,
			status: dbProduct.status,
			variants: dbProduct.variants || [],
			createdAt: dbProduct.createdAt,
			updatedAt: dbProduct.updatedAt,
			tags: dbProduct.tags,
		};
	}
}
