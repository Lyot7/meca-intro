/**
 * Lucia Auth Configuration - Infrastructure Layer
 * Configuration de l'authentification avec Lucia
 */

import { Lucia } from 'lucia';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { db } from '../database/config.js';
import { sessions, creators } from '../database/schema.js';

// Adapter pour Drizzle
const adapter = new DrizzlePostgreSQLAdapter(db, sessions, creators);

// Configuration de Lucia
export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: process.env.NODE_ENV === 'production'
		}
	},
	getUserAttributes: (attributes) => {
		return {
			id: attributes.id,
			name: attributes.name,
			email: attributes.email,
			status: attributes.status,
			subscription: {
				type: attributes.subscriptionType,
				expiresAt: attributes.subscriptionExpiresAt,
				isActive: attributes.subscriptionActive
			}
		};
	}
});

// Déclaration des types pour Lucia
declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: {
			id: string;
			name: string;
			email: string;
			status: string;
			subscriptionType: string;
			subscriptionExpiresAt: Date;
			subscriptionActive: boolean;
		};
	}
}
