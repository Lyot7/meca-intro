import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/infrastructure/database/config.js';
import { creators } from '$lib/infrastructure/database/schema.js';
import { eq } from 'drizzle-orm';
import { lucia } from '$lib/infrastructure/auth/lucia.js';

export const GET: RequestHandler = async ({ request, cookies }) => {
	try {
		// Vérifier l'authentification
		const sessionId = cookies.get('auth_session');
		if (!sessionId) {
			return json({ success: false, message: 'Non authentifié' }, { status: 401 });
		}

		// Valider la session avec Lucia
		const { session, user } = await lucia.validateSession(sessionId);
		if (!session || !user) {
			return json({ success: false, message: 'Session invalide' }, { status: 401 });
		}

		// Récupérer les données du profil depuis la base de données
		const [creator] = await db
			.select({
				id: creators.id,
				name: creators.name,
				email: creators.email,
				description: creators.description,
				profileImage: creators.profileImage,
				website: creators.website,
				socialMedia: creators.socialMedia
			})
			.from(creators)
			.where(eq(creators.id, user.id));

		if (!creator) {
			return json({ success: false, message: 'Utilisateur non trouvé' }, { status: 404 });
		}

		return json({ 
			success: true, 
			user: {
				id: creator.id,
				name: creator.name,
				email: creator.email,
				description: creator.description || '',
				profileImage: creator.profileImage || '',
				website: creator.website || '',
				socialMedia: creator.socialMedia || {
					instagram: '',
					twitter: '',
					facebook: ''
				}
			}
		});
	} catch (error) {
		console.error('Erreur lors de la récupération du profil:', error);
		return json({ success: false, message: 'Erreur serveur' }, { status: 500 });
	}
};

export const PUT: RequestHandler = async ({ request, cookies }) => {
	try {
		// Vérifier l'authentification
		const sessionId = cookies.get('auth_session');
		if (!sessionId) {
			return json({ success: false, message: 'Non authentifié' }, { status: 401 });
		}

		// Valider la session avec Lucia
		const { session, user } = await lucia.validateSession(sessionId);
		if (!session || !user) {
			return json({ success: false, message: 'Session invalide' }, { status: 401 });
		}

		const data = await request.json();
		const { field, value, name, description, profileImage, website, socialMedia } = data;

		// Si c'est une mise à jour de champ individuel
		if (field && value !== undefined) {
			// Validation spécifique selon le champ
			switch (field) {
				case 'name':
					if (!value || value.trim().length === 0) {
						return json({ success: false, message: 'Le nom est requis' }, { status: 400 });
					}
					if (value.length > 100) {
						return json({ success: false, message: 'Le nom ne peut pas dépasser 100 caractères' }, { status: 400 });
					}
					break;
				case 'description':
					if (value && value.length > 500) {
						return json({ success: false, message: 'La description ne peut pas dépasser 500 caractères' }, { status: 400 });
					}
					break;
				case 'website':
					if (value && !value.match(/^https?:\/\/.+/)) {
						return json({ success: false, message: 'L\'URL doit commencer par http:// ou https://' }, { status: 400 });
					}
					break;
				case 'socialMedia.instagram':
				case 'socialMedia.twitter':
				case 'socialMedia.facebook':
					// Validation basique pour les réseaux sociaux
					if (value && value.length > 50) {
						return json({ success: false, message: 'Le nom d\'utilisateur ne peut pas dépasser 50 caractères' }, { status: 400 });
					}
					break;
			}

			// Préparer les données de mise à jour
			let updateData: any = { updatedAt: new Date() };
			
			if (field.startsWith('socialMedia.')) {
				// Récupérer les données sociales actuelles
				const [currentCreator] = await db
					.select({ socialMedia: creators.socialMedia })
					.from(creators)
					.where(eq(creators.id, user.id));
				
				const currentSocialMedia = currentCreator?.socialMedia || {};
				const socialField = field.split('.')[1];
				
				updateData.socialMedia = {
					...currentSocialMedia,
					[socialField]: value?.trim() || ''
				};
			} else {
				updateData[field] = value?.trim() || '';
			}

			// Mettre à jour en base de données
			await db
				.update(creators)
				.set(updateData)
				.where(eq(creators.id, user.id));

			// Récupérer les données mises à jour
			const [updatedCreator] = await db
				.select({
					id: creators.id,
					name: creators.name,
					email: creators.email,
					description: creators.description,
					profileImage: creators.profileImage,
					website: creators.website,
					socialMedia: creators.socialMedia
				})
				.from(creators)
				.where(eq(creators.id, user.id));

			return json({ 
				success: true, 
				user: {
					id: updatedCreator.id,
					name: updatedCreator.name,
					email: updatedCreator.email,
					description: updatedCreator.description || '',
					profileImage: updatedCreator.profileImage || '',
					website: updatedCreator.website || '',
					socialMedia: updatedCreator.socialMedia || {
						instagram: '',
						twitter: '',
						facebook: ''
					}
				}
			});
		}

		// Mise à jour complète (fallback)
		const { name: fullName, description: fullDescription, profileImage: fullProfileImage, website: fullWebsite, socialMedia: fullSocialMedia } = data;

		// Validation des données pour mise à jour complète
		if (fullName !== undefined && (!fullName || fullName.trim().length === 0)) {
			return json({ success: false, message: 'Le nom est requis' }, { status: 400 });
		}

		if (fullName && fullName.length > 100) {
			return json({ success: false, message: 'Le nom ne peut pas dépasser 100 caractères' }, { status: 400 });
		}

		if (fullDescription && fullDescription.length > 500) {
			return json({ success: false, message: 'La description ne peut pas dépasser 500 caractères' }, { status: 400 });
		}

		// Préparer les données de mise à jour complète
		const updateData = {
			...(fullName !== undefined && { name: fullName.trim() }),
			...(fullDescription !== undefined && { description: fullDescription.trim() }),
			...(fullProfileImage !== undefined && { profileImage: fullProfileImage }),
			...(fullWebsite !== undefined && { website: fullWebsite.trim() }),
			...(fullSocialMedia !== undefined && { socialMedia: fullSocialMedia }),
			updatedAt: new Date()
		};

		// Mettre à jour en base de données
		await db
			.update(creators)
			.set(updateData)
			.where(eq(creators.id, user.id));

		// Récupérer les données mises à jour
		const [updatedCreator] = await db
			.select({
				id: creators.id,
				name: creators.name,
				email: creators.email,
				description: creators.description,
				profileImage: creators.profileImage,
				website: creators.website,
				socialMedia: creators.socialMedia
			})
			.from(creators)
			.where(eq(creators.id, user.id));

		return json({ 
			success: true, 
			user: {
				id: updatedCreator.id,
				name: updatedCreator.name,
				email: updatedCreator.email,
				description: updatedCreator.description || '',
				profileImage: updatedCreator.profileImage || '',
				website: updatedCreator.website || '',
				socialMedia: updatedCreator.socialMedia || {
					instagram: '',
					twitter: '',
					facebook: ''
				}
			}
		});
	} catch (error) {
		console.error('Erreur lors de la mise à jour du profil:', error);
		return json({ success: false, message: 'Erreur serveur' }, { status: 500 });
	}
};
