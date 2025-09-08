/**
 * Creator Entity - Domain Layer
 * Représente un créateur dans le système KPSULL
 */

export enum CreatorStatus {
	ACTIVE = 'active',
	INACTIVE = 'inactive',
	SUSPENDED = 'suspended'
}

export enum SubscriptionType {
	MONTHLY = 'monthly',
	YEARLY = 'yearly'
}

export interface Creator {
	id: string;
	name: string;
	email: string;
	description?: string;
	profileImage?: string;
	website?: string;
	socialMedia?: {
		instagram?: string;
		facebook?: string;
		twitter?: string;
	};
	status: CreatorStatus;
	createdAt: Date;
	subscription: {
		type: SubscriptionType;
		expiresAt: Date;
		isActive: boolean;
	};
	bankAccount?: {
		iban: string;
		bic: string;
		accountHolder: string;
	};
}

export class CreatorEntity implements Creator {
	constructor(
		public id: string,
		public name: string,
		public email: string,
		public status: CreatorStatus,
		public subscription: {
			type: SubscriptionType;
			expiresAt: Date;
			isActive: boolean;
		},
		public createdAt: Date = new Date(),
		public description?: string,
		public profileImage?: string,
		public website?: string,
		public socialMedia?: {
			instagram?: string;
			facebook?: string;
			twitter?: string;
		},
		public bankAccount?: {
			iban: string;
			bic: string;
			accountHolder: string;
		}
	) {}

	/**
	 * Vérifie si le créateur peut publier des produits
	 */
	canPublishProducts(): boolean {
		return this.status === CreatorStatus.ACTIVE && this.subscription.isActive;
	}

	/**
	 * Vérifie si l'abonnement est expiré
	 */
	isSubscriptionExpired(): boolean {
		return new Date() > this.subscription.expiresAt;
	}

	/**
	 * Active l'abonnement
	 */
	activateSubscription(type: SubscriptionType, durationInMonths: number): void {
		this.subscription.type = type;
		this.subscription.isActive = true;
		this.subscription.expiresAt = new Date();
		this.subscription.expiresAt.setMonth(this.subscription.expiresAt.getMonth() + durationInMonths);
	}

	/**
	 * Désactive l'abonnement
	 */
	deactivateSubscription(): void {
		this.subscription.isActive = false;
	}
}
