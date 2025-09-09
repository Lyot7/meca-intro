/**
 * Environment Configuration - Infrastructure Layer
 * Configuration des variables d'environnement
 */

export const env = {
	// Base de données
	DATABASE_URL: process.env.DATABASE_URL || 'postgresql://kpsull_user:kpsull_password@localhost:5432/kpsull',
	
	// Authentification
	AUTH_SECRET: process.env.AUTH_SECRET || 'your-secret-key-here-change-in-production',
	
	// Application
	PUBLIC_APP_URL: process.env.PUBLIC_APP_URL || 'http://localhost:5173',
	
	// Stripe (pour plus tard)
	STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
	STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY || '',
	STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',
	
	// Commission KPSULL
	KPSULL_COMMISSION_RATE: parseFloat(process.env.KPSULL_COMMISSION_RATE || '0.05'),
	CREATOR_MONTHLY_PRICE: parseInt(process.env.CREATOR_MONTHLY_PRICE || '10000'),
	CREATOR_YEARLY_PRICE: parseInt(process.env.CREATOR_YEARLY_PRICE || '100000'),
} as const;
