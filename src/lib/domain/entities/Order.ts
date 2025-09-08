/**
 * Order Entity - Domain Layer
 * Représente une commande dans le système KPSULL
 */

export enum OrderStatus {
	PENDING = 'pending',
	PAID = 'paid',
	PROCESSING = 'processing',
	SHIPPED = 'shipped',
	DELIVERED = 'delivered',
	CANCELLED = 'cancelled',
	REFUNDED = 'refunded'
}

export interface OrderItem {
	id: string;
	productId: string;
	variantId: string;
	quantity: number;
	unitPrice: number;
	totalPrice: number;
}

export interface ShippingAddress {
	firstName: string;
	lastName: string;
	address: string;
	city: string;
	postalCode: string;
	country: string;
	phone?: string;
}

export interface Order {
	id: string;
	customerId: string;
	items: OrderItem[];
	status: OrderStatus;
	subtotal: number;
	shippingCost: number;
	total: number;
	shippingAddress: ShippingAddress;
	createdAt: Date;
	updatedAt: Date;
	paidAt?: Date;
	shippedAt?: Date;
	deliveredAt?: Date;
	stripePaymentIntentId?: string;
}

export class OrderEntity implements Order {
	constructor(
		public id: string,
		public customerId: string,
		public items: OrderItem[],
		public status: OrderStatus,
		public subtotal: number,
		public shippingCost: number,
		public total: number,
		public shippingAddress: ShippingAddress,
		public createdAt: Date = new Date(),
		public updatedAt: Date = new Date(),
		public paidAt?: Date,
		public shippedAt?: Date,
		public deliveredAt?: Date,
		public stripePaymentIntentId?: string
	) {}

	/**
	 * Calcule le total de la commande
	 */
	calculateTotal(): number {
		const itemsTotal = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
		return itemsTotal + this.shippingCost;
	}

	/**
	 * Vérifie si la commande peut être annulée
	 */
	canBeCancelled(): boolean {
		return [OrderStatus.PENDING, OrderStatus.PAID].includes(this.status);
	}

	/**
	 * Vérifie si la commande peut être expédiée
	 */
	canBeShipped(): boolean {
		return this.status === OrderStatus.PAID;
	}

	/**
	 * Marque la commande comme payée
	 */
	markAsPaid(paymentIntentId: string): void {
		this.status = OrderStatus.PAID;
		this.paidAt = new Date();
		this.stripePaymentIntentId = paymentIntentId;
		this.updatedAt = new Date();
	}

	/**
	 * Marque la commande comme expédiée
	 */
	markAsShipped(): void {
		if (this.canBeShipped()) {
			this.status = OrderStatus.SHIPPED;
			this.shippedAt = new Date();
			this.updatedAt = new Date();
		}
	}

	/**
	 * Marque la commande comme livrée
	 */
	markAsDelivered(): void {
		if (this.status === OrderStatus.SHIPPED) {
			this.status = OrderStatus.DELIVERED;
			this.deliveredAt = new Date();
			this.updatedAt = new Date();
		}
	}

	/**
	 * Annule la commande
	 */
	cancel(): void {
		if (this.canBeCancelled()) {
			this.status = OrderStatus.CANCELLED;
			this.updatedAt = new Date();
		}
	}

	/**
	 * Obtient le nombre total d'articles
	 */
	getTotalItems(): number {
		return this.items.reduce((sum, item) => sum + item.quantity, 0);
	}
}
