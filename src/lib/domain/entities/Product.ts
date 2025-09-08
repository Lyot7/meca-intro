/**
 * Product Entity - Domain Layer
 * Représente un produit dans le système KPSULL
 */

export enum ProductGender {
	MALE = 'male',
	FEMALE = 'female',
	UNISEX = 'unisex'
}

export enum ProductStatus {
	AVAILABLE = 'available',
	OUT_OF_STOCK = 'out_of_stock',
	ARCHIVED = 'archived'
}

export interface ProductVariant {
	id: string;
	size?: string;
	color?: string;
	stock: number;
	price: number;
	images: string[];
}

export interface Product {
	id: string;
	name: string;
	description: string;
	creatorId: string;
	gender: ProductGender;
	status: ProductStatus;
	variants: ProductVariant[];
	createdAt: Date;
	updatedAt: Date;
	tags?: string[];
}

export class ProductEntity implements Product {
	constructor(
		public id: string,
		public name: string,
		public description: string,
		public creatorId: string,
		public gender: ProductGender,
		public status: ProductStatus,
		public variants: ProductVariant[],
		public createdAt: Date = new Date(),
		public updatedAt: Date = new Date(),
		public tags?: string[]
	) {}

	/**
	 * Vérifie si le produit est disponible
	 */
	isAvailable(): boolean {
		return this.status === ProductStatus.AVAILABLE && this.hasStock();
	}

	/**
	 * Vérifie s'il y a du stock disponible
	 */
	hasStock(): boolean {
		return this.variants.some(variant => variant.stock > 0);
	}

	/**
	 * Obtient le prix minimum du produit
	 */
	getMinPrice(): number {
		return Math.min(...this.variants.map(v => v.price));
	}

	/**
	 * Obtient le prix maximum du produit
	 */
	getMaxPrice(): number {
		return Math.max(...this.variants.map(v => v.price));
	}

	/**
	 * Obtient toutes les images du produit
	 */
	getAllImages(): string[] {
		return this.variants.flatMap(variant => variant.images);
	}

	/**
	 * Obtient la première image du produit
	 */
	getFirstImage(): string | undefined {
		const images = this.getAllImages();
		return images.length > 0 ? images[0] : undefined;
	}

	/**
	 * Vérifie si le produit est unisexe
	 */
	isUnisex(): boolean {
		return this.gender === ProductGender.UNISEX;
	}

	/**
	 * Archive le produit
	 */
	archive(): void {
		this.status = ProductStatus.ARCHIVED;
		this.updatedAt = new Date();
	}

	/**
	 * Restaure le produit
	 */
	restore(): void {
		this.status = this.hasStock() ? ProductStatus.AVAILABLE : ProductStatus.OUT_OF_STOCK;
		this.updatedAt = new Date();
	}
}
