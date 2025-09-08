/**
 * Creator Repository - Infrastructure Layer
 * Implémentation concrète du repository des créateurs avec Drizzle ORM
 */

import { eq, and, lt } from 'drizzle-orm';
import { db } from '../database/config.js';
import { creators } from '../database/schema.js';
import type { ICreatorRepository } from '../../domain/repositories/ICreatorRepository.js';
import type { Creator, CreatorEntity } from '../../domain/entities/Creator.js';

export class CreatorRepository implements ICreatorRepository {
	async findById(id: string): Promise<Creator | null> {
		const result = await db.select().from(creators).where(eq(creators.id, id)).limit(1);
		return result[0] ? this.mapToDomain(result[0]) : null;
	}

	async findByEmail(email: string): Promise<Creator | null> {
		const result = await db.select().from(creators).where(eq(creators.email, email)).limit(1);
		return result[0] ? this.mapToDomain(result[0]) : null;
	}

	async findActive(): Promise<Creator[]> {
		const result = await db.select().from(creators).where(eq(creators.status, 'active'));
		return result.map(this.mapToDomain);
	}

	async findByStatus(status: Creator['status']): Promise<Creator[]> {
		const result = await db.select().from(creators).where(eq(creators.status, status));
		return result.map(this.mapToDomain);
	}

	async save(creator: CreatorEntity): Promise<Creator> {
		const creatorData = {
			id: creator.id,
			name: creator.name,
			email: creator.email,
			passwordHash: '', // TODO: Hash du mot de passe
			description: creator.description,
			profileImage: creator.profileImage,
			website: creator.website,
			socialMedia: creator.socialMedia,
			status: creator.status,
			subscriptionType: creator.subscription.type,
			subscriptionExpiresAt: creator.subscription.expiresAt,
			subscriptionActive: creator.subscription.isActive,
			bankAccount: creator.bankAccount,
			createdAt: creator.createdAt,
			updatedAt: creator.updatedAt,
		};

		const result = await db.insert(creators).values(creatorData).returning();
		return this.mapToDomain(result[0]);
	}

	async update(id: string, updates: Partial<Creator>): Promise<Creator> {
		const updateData: any = {
			updatedAt: new Date(),
		};

		if (updates.name) updateData.name = updates.name;
		if (updates.email) updateData.email = updates.email;
		if (updates.description !== undefined) updateData.description = updates.description;
		if (updates.profileImage !== undefined) updateData.profileImage = updates.profileImage;
		if (updates.website !== undefined) updateData.website = updates.website;
		if (updates.socialMedia !== undefined) updateData.socialMedia = updates.socialMedia;
		if (updates.status) updateData.status = updates.status;
		if (updates.subscription) {
			updateData.subscriptionType = updates.subscription.type;
			updateData.subscriptionExpiresAt = updates.subscription.expiresAt;
			updateData.subscriptionActive = updates.subscription.isActive;
		}
		if (updates.bankAccount !== undefined) updateData.bankAccount = updates.bankAccount;

		const result = await db
			.update(creators)
			.set(updateData)
			.where(eq(creators.id, id))
			.returning();

		return this.mapToDomain(result[0]);
	}

	async delete(id: string): Promise<void> {
		await db.delete(creators).where(eq(creators.id, id));
	}

	async emailExists(email: string, excludeId?: string): Promise<boolean> {
		const conditions = [eq(creators.email, email)];
		if (excludeId) {
			conditions.push(eq(creators.id, excludeId));
		}

		const result = await db
			.select({ id: creators.id })
			.from(creators)
			.where(excludeId ? and(...conditions) : conditions[0])
			.limit(1);

		return result.length > 0;
	}

	async findWithExpiredSubscription(): Promise<Creator[]> {
		const now = new Date();
		const result = await db
			.select()
			.from(creators)
			.where(and(
				eq(creators.subscriptionActive, true),
				lt(creators.subscriptionExpiresAt, now)
			));

		return result.map(this.mapToDomain);
	}

	async findBySubscriptionType(type: Creator['subscription']['type']): Promise<Creator[]> {
		const result = await db
			.select()
			.from(creators)
			.where(eq(creators.subscriptionType, type));

		return result.map(this.mapToDomain);
	}

	/**
	 * Mappe les données de la base vers le domaine
	 */
	private mapToDomain(dbCreator: any): Creator {
		return {
			id: dbCreator.id,
			name: dbCreator.name,
			email: dbCreator.email,
			description: dbCreator.description,
			profileImage: dbCreator.profileImage,
			website: dbCreator.website,
			socialMedia: dbCreator.socialMedia,
			status: dbCreator.status,
			createdAt: dbCreator.createdAt,
			subscription: {
				type: dbCreator.subscriptionType,
				expiresAt: dbCreator.subscriptionExpiresAt,
				isActive: dbCreator.subscriptionActive,
			},
			bankAccount: dbCreator.bankAccount,
		};
	}
}
