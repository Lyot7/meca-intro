/**
 * Cart Entity - Domain Layer
 * Représente un panier d'achat dans le système KPSULL
 */

export interface CartItem {
	id: string;
	productId: string;
	variantId: string;
	quantity: number;
	unitPrice: number;
	addedAt: Date;
}

export interface Cart {
	id: string;
	userId?: string;
	sessionId?: string;
	items: CartItem[];
	createdAt: Date;
	updatedAt: Date;
}

export class CartEntity implements Cart {
	constructor(
		public id: string,
		public items: CartItem[] = [],
		public createdAt: Date = new Date(),
		public updatedAt: Date = new Date(),
		public userId?: string,
		public sessionId?: string
	) {}

	/**
	 * Ajoute un article au panier
	 */
	addItem(productId: string, variantId: string, quantity: number, unitPrice: number): void {
		const existingItem = this.items.find(
			item => item.productId === productId && item.variantId === variantId
		);

		if (existingItem) {
			existingItem.quantity += quantity;
		} else {
			this.items.push({
				id: this.generateItemId(),
				productId,
				variantId,
				quantity,
				unitPrice,
				addedAt: new Date()
			});
		}

		this.updatedAt = new Date();
	}

	/**
	 * Met à jour la quantité d'un article
	 */
	updateItemQuantity(itemId: string, quantity: number): void {
		const item = this.items.find(i => i.id === itemId);
		if (item) {
			if (quantity <= 0) {
				this.removeItem(itemId);
			} else {
				item.quantity = quantity;
				this.updatedAt = new Date();
			}
		}
	}

	/**
	 * Supprime un article du panier
	 */
	removeItem(itemId: string): void {
		this.items = this.items.filter(item => item.id !== itemId);
		this.updatedAt = new Date();
	}

	/**
	 * Vide le panier
	 */
	clear(): void {
		this.items = [];
		this.updatedAt = new Date();
	}

	/**
	 * Calcule le sous-total du panier
	 */
	getSubtotal(): number {
		return this.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
	}

	/**
	 * Calcule le nombre total d'articles
	 */
	getTotalItems(): number {
		return this.items.reduce((sum, item) => sum + item.quantity, 0);
	}

	/**
	 * Vérifie si le panier est vide
	 */
	isEmpty(): boolean {
		return this.items.length === 0;
	}

	/**
	 * Obtient un article par son ID
	 */
	getItem(itemId: string): CartItem | undefined {
		return this.items.find(item => item.id === itemId);
	}

	/**
	 * Génère un ID unique pour un article
	 */
	private generateItemId(): string {
		return `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	}
}
