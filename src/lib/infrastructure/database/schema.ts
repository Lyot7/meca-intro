/**
 * Database Schema - Infrastructure Layer
 * Schémas de base de données avec Drizzle ORM optimisés pour le frontend
 */

import { pgTable, text, timestamp, uuid, integer, boolean, json, decimal, pgEnum } from 'drizzle-orm/pg-core';

// Enums
export const userRoleEnum = pgEnum('user_role', ['creator', 'client']);
export const creatorStatusEnum = pgEnum('creator_status', ['active', 'inactive', 'suspended']); // Garder pour compatibilité
export const subscriptionTypeEnum = pgEnum('subscription_type', ['monthly', 'yearly']);
export const productGenderEnum = pgEnum('product_gender', ['male', 'female', 'unisex']);
export const productStatusEnum = pgEnum('product_status', ['available', 'out_of_stock', 'archived']);
export const orderStatusEnum = pgEnum('order_status', ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']);

// Table des utilisateurs (créateurs et clients)
export const users = pgTable('users', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	role: userRoleEnum('role').notNull(),
	status: creatorStatusEnum('status').notNull().default('active'),
	
	// Champs spécifiques aux créateurs
	description: text('description'),
	profileImage: text('profile_image'),
	website: text('website'),
	socialMedia: json('social_media').$type<{
		instagram?: string;
		facebook?: string;
		twitter?: string;
	}>(),
	subscriptionType: subscriptionTypeEnum('subscription_type'),
	subscriptionExpiresAt: timestamp('subscription_expires_at', { withTimezone: true }),
	subscriptionActive: boolean('subscription_active').default(false),
	bankAccount: json('bank_account').$type<{
		iban: string;
		bic: string;
		accountHolder: string;
	}>(),
	
	// Champs spécifiques aux clients
	phone: text('phone'),
	dateOfBirth: timestamp('date_of_birth', { withTimezone: true }),
	preferences: json('preferences').$type<{
		gender?: string;
		sizes?: string[];
		brands?: string[];
	}>(),
	
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// Table des produits
export const products = pgTable('products', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull(),
	description: text('description').notNull(),
	creatorId: uuid('creator_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
	gender: productGenderEnum('gender').notNull(),
	status: productStatusEnum('status').notNull().default('available'),
	tags: json('tags').$type<string[]>(),
	// Champs optimisés pour l'affichage frontend
	featuredImage: text('featured_image'), // Image principale pour les cards
	price: decimal('price', { precision: 10, scale: 2 }).notNull(), // Prix fixe du produit
	totalStock: integer('total_stock').default(0), // Stock total pour affichage rapide
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// Table des variantes de produits
export const productVariants = pgTable('product_variants', {
	id: uuid('id').primaryKey().defaultRandom(),
	productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
	size: text('size'),
	color: text('color'),
	stock: integer('stock').notNull().default(0),
	images: json('images').$type<string[]>().notNull().default([]),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// Table des paniers
export const carts = pgTable('carts', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
	sessionId: text('session_id'),
	items: json('items').$type<Array<{
		id: string;
		productId: string;
		variantId: string;
		quantity: number;
		unitPrice: number;
		addedAt: string;
	}>>().notNull().default([]),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// Table des commandes
export const orders = pgTable('orders', {
	id: uuid('id').primaryKey().defaultRandom(),
	customerId: uuid('customer_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
	items: json('items').$type<Array<{
		id: string;
		productId: string;
		variantId: string;
		quantity: number;
		unitPrice: number;
		totalPrice: number;
	}>>().notNull(),
	status: orderStatusEnum('status').notNull().default('pending'),
	subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
	shippingCost: decimal('shipping_cost', { precision: 10, scale: 2 }).notNull().default('0'),
	total: decimal('total', { precision: 10, scale: 2 }).notNull(),
	shippingAddress: json('shipping_address').$type<{
		firstName: string;
		lastName: string;
		address: string;
		city: string;
		postalCode: string;
		country: string;
		phone?: string;
	}>().notNull(),
	stripePaymentIntentId: text('stripe_payment_intent_id'),
	paidAt: timestamp('paid_at', { withTimezone: true }),
	shippedAt: timestamp('shipped_at', { withTimezone: true }),
	deliveredAt: timestamp('delivered_at', { withTimezone: true }),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// Table des sessions (pour Lucia Auth)
export const sessions = pgTable('sessions', {
	id: text('id').primaryKey(),
	userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
	expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// Relations optimisées pour le frontend
export const usersRelations = {
	// Relations pour les créateurs
	products: {
		relation: 'one-to-many',
		fields: [users.id],
		references: [products.creatorId],
	},
	// Relations pour les clients
	orders: {
		relation: 'one-to-many',
		fields: [users.id],
		references: [orders.customerId],
	},
	sessions: {
		relation: 'one-to-many',
		fields: [users.id],
		references: [sessions.userId],
	},
};

export const productsRelations = {
	creator: {
		relation: 'many-to-one',
		fields: [products.creatorId],
		references: [users.id],
	},
	variants: {
		relation: 'one-to-many',
		fields: [products.id],
		references: [productVariants.productId],
	},
};

export const productVariantsRelations = {
	product: {
		relation: 'many-to-one',
		fields: [productVariants.productId],
		references: [products.id],
	},
};

export const ordersRelations = {
	customer: {
		relation: 'many-to-one',
		fields: [orders.customerId],
		references: [users.id],
	},
};

export const sessionsRelations = {
	user: {
		relation: 'many-to-one',
		fields: [sessions.userId],
		references: [users.id],
	},
};

// Alias pour la compatibilité (à supprimer progressivement)
export const creators = users;
export const creatorsRelations = usersRelations;
