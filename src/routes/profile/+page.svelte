<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/presentation/stores/authStore.js';

	let user: any = null;
	let isLoading = true;
	let isSaving = false;
	let notification = { show: false, message: '', type: 'success' };

	// Données du profil
	let profileData = {
		name: '',
		description: '',
		profileImage: '',
		email: '',
		website: '',
		socialMedia: {
			instagram: '',
			twitter: '',
			facebook: ''
		}
	};

	onMount(async () => {
		// Vérifier si l'utilisateur est connecté
		const response = await fetch('/api/auth/me');
		const data = await response.json();

		if (!data.success) {
			goto('/auth');
			return;
		}

		user = data.user;
		loadProfileData();
		isLoading = false;
	});

	function loadProfileData() {
		profileData = {
			name: user?.name || '',
			description: user?.description || '',
			profileImage: user?.profileImage || '',
			email: user?.email || '',
			website: user?.website || '',
			socialMedia: {
				instagram: user?.socialMedia?.instagram || '',
				twitter: user?.socialMedia?.twitter || '',
				facebook: user?.socialMedia?.facebook || ''
			}
		};
	}

	// Fonction pour afficher une notification
	function showNotification(message: string, type: 'success' | 'error' = 'success') {
		notification = { show: true, message, type };
		setTimeout(() => {
			notification.show = false;
		}, 3000);
	}

	async function saveField(field: string, value: any) {
		isSaving = true;
		try {
			let updateData: any = {};
			
			if (field.startsWith('socialMedia.')) {
				const socialField = field.split('.')[1];
				updateData = {
					socialMedia: {
						...profileData.socialMedia,
						[socialField]: value
					}
				};
			} else {
				updateData = { [field]: value };
			}
			
			const response = await fetch('/api/profile', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(updateData)
			});

			const data = await response.json();
			
			if (data.success) {
				// Mettre à jour les données locales
				if (field.startsWith('socialMedia.')) {
					const socialField = field.split('.')[1];
					(profileData.socialMedia as any)[socialField] = value;
				} else {
					(profileData as any)[field] = value;
				}
				
				// Mettre à jour le store auth
				authStore.updateUser(profileData);
				
				// Afficher une notification de succès
				showNotification('Champ sauvegardé avec succès', 'success');
			} else {
				showNotification('Erreur: ' + data.message, 'error');
			}
		} catch (error) {
			console.error('Erreur lors de la sauvegarde:', error);
			showNotification('Erreur lors de la sauvegarde du profil', 'error');
		} finally {
			isSaving = false;
		}
	}

	function handleFieldBlur(field: string, value: any) {
		saveField(field, value);
	}

	function handleFieldKeydown(event: KeyboardEvent, field: string, value: any) {
		if (event.key === 'Enter') {
			event.preventDefault();
			saveField(field, value);
		}
	}

	function handleImageUpload(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const imageData = e.target?.result as string;
				profileData.profileImage = imageData;
				saveField('profileImage', imageData);
			};
			reader.readAsDataURL(file);
		}
	}

	function getUserType() {
		if (!user) return 'client';
		if (user.email === 'admin@kpsull.com') return 'admin';
		if (user.email === 'createur@kpsull.com') return 'creator';
		return 'client';
	}

	function getUserTypeLabel() {
		const type = getUserType();
		switch (type) {
			case 'admin': return 'Administrateur';
			case 'creator': return 'Créateur';
			default: return 'Client';
		}
	}
</script>

<svelte:head>
	<title>Mon Profil - KPSULL</title>
</svelte:head>

<div class="min-h-screen bg-base-100">
	{#if isLoading}
		<div class="flex items-center justify-center min-h-96">
			<div class="loading loading-spinner loading-lg text-primary"></div>
		</div>
	{:else}
		<!-- Notification toast -->
		{#if notification.show}
			<div class="toast toast-top toast-end z-50">
				<div class="alert {notification.type === 'success' ? 'alert-success' : 'alert-error'}">
					{#if notification.type === 'success'}
						<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					{:else}
						<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					{/if}
					<span>{notification.message}</span>
				</div>
			</div>
		{/if}

		<main class="max-w-6xl mx-auto p-4">
			<!-- Header -->
			<div class="mb-8">
				<h1 class="text-4xl font-bold text-base-content mb-2">Mon Profil</h1>
				<p class="text-base-content/70">Gérez vos informations personnelles</p>
			</div>

			<div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
				<!-- Sidebar profil -->
				<div class="lg:col-span-1">
					<div class="card bg-base-200 shadow-xl sticky top-4">
						<div class="card-body text-center">
							<!-- Avatar -->
							<div class="flex justify-center mb-4">
								<div class="relative w-24 h-24 group">
									<div class="w-full h-full rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
										<img 
											src={profileData.profileImage || 'https://via.placeholder.com/96?text=👤'} 
											alt={profileData.name || 'Photo de profil'} 
											class="w-full h-full object-cover"
										/>
									</div>
									<!-- Icône modifier au hover -->
									<label for="profile-image" class="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer backdrop-blur-sm">
										<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
										</svg>
									</label>
								</div>
							</div>

							<!-- Nom et type -->
							<h2 class="card-title justify-center text-xl font-bold">
								{profileData.name || 'Nom d\'utilisateur'}
							</h2>
							<div class="badge badge-primary badge-lg mb-4">
								{getUserTypeLabel()}
							</div>

							<!-- Email -->
							<div class="alert alert-info">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-4 h-4">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
								</svg>
								<span class="text-xs">{profileData.email}</span>
							</div>

							<!-- Upload photo (masqué) -->
							<input 
								id="profile-image"
								type="file" 
								accept="image/*" 
								on:change={handleImageUpload}
								class="hidden"
							/>

							<!-- Indicateur de sauvegarde -->
							{#if isSaving}
								<div class="alert alert-success alert-sm">
									<span class="loading loading-spinner loading-xs"></span>
									<span>Sauvegarde...</span>
								</div>
							{/if}
						</div>
					</div>
				</div>

				<!-- Formulaire principal -->
				<div class="lg:col-span-3">
					<div class="space-y-6">
						<!-- Informations de base -->
						<div class="card bg-base-200 shadow-xl">
							<div class="card-body">
								<h3 class="card-title text-2xl mb-6">Informations de base</h3>
								
								<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
								<!-- Nom d'utilisateur -->
								<div class="form-control">
									<label class="label" for="username">
										<span class="label-text font-semibold">Nom d'utilisateur</span>
									</label>
									<input
										id="username"
										type="text"
										class="input input-bordered"
										bind:value={profileData.name}
										placeholder="Votre nom d'utilisateur"
										on:blur={() => handleFieldBlur('name', profileData.name)}
										on:keydown={(e) => handleFieldKeydown(e, 'name', profileData.name)}
									/>
								<div class="label">
									<span class="label-text-alt">Visible par tous les utilisateurs</span>
								</div>
								</div>

								<!-- Site web -->
								<div class="form-control">
									<label class="label" for="website">
										<span class="label-text font-semibold">Site web</span>
									</label>
									<input
										id="website"
										type="url"
										class="input input-bordered"
										bind:value={profileData.website}
										placeholder="https://votre-site.com"
										on:blur={() => handleFieldBlur('website', profileData.website)}
										on:keydown={(e) => handleFieldKeydown(e, 'website', profileData.website)}
									/>
								<div class="label">
									<span class="label-text-alt">Votre site personnel ou professionnel</span>
								</div>
								</div>
								</div>

							<!-- Description -->
							<div class="form-control">
								<label class="label" for="description">
									<span class="label-text font-semibold">Description</span>
								</label>
								<textarea
									id="description"
									class="textarea textarea-bordered h-24"
									bind:value={profileData.description}
									placeholder="Décrivez-vous en quelques mots..."
									on:blur={() => handleFieldBlur('description', profileData.description)}
									on:keydown={(e) => handleFieldKeydown(e, 'description', profileData.description)}
								></textarea>
							<div class="label">
								<span class="label-text-alt">Présentez-vous en quelques mots (max 500 caractères)</span>
							</div>
							</div>
							</div>
						</div>

						<!-- Réseaux sociaux -->
						<div class="card bg-base-200 shadow-xl">
							<div class="card-body">
								<h3 class="card-title text-2xl mb-6">Réseaux sociaux</h3>
								
								<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
								<!-- Instagram -->
								<div class="form-control">
									<label class="label" for="instagram">
										<span class="label-text font-semibold">Instagram</span>
									</label>
									<div class="join w-full">
										<span class="join-item btn btn-outline">@</span>
										<input
											id="instagram"
											type="text"
											class="input input-bordered join-item flex-1"
											bind:value={profileData.socialMedia.instagram}
											placeholder="votre_instagram"
											on:blur={() => handleFieldBlur('socialMedia.instagram', profileData.socialMedia.instagram)}
											on:keydown={(e) => handleFieldKeydown(e, 'socialMedia.instagram', profileData.socialMedia.instagram)}
										/>
									</div>
								</div>

								<!-- Twitter -->
								<div class="form-control">
									<label class="label" for="twitter">
										<span class="label-text font-semibold">Twitter</span>
									</label>
									<div class="join w-full">
										<span class="join-item btn btn-outline">@</span>
										<input
											id="twitter"
											type="text"
											class="input input-bordered join-item flex-1"
											bind:value={profileData.socialMedia.twitter}
											placeholder="votre_twitter"
											on:blur={() => handleFieldBlur('socialMedia.twitter', profileData.socialMedia.twitter)}
											on:keydown={(e) => handleFieldKeydown(e, 'socialMedia.twitter', profileData.socialMedia.twitter)}
										/>
									</div>
								</div>

								<!-- Facebook -->
								<div class="form-control">
									<label class="label" for="facebook">
										<span class="label-text font-semibold">Facebook</span>
									</label>
									<input
										id="facebook"
										type="text"
										class="input input-bordered"
										bind:value={profileData.socialMedia.facebook}
										placeholder="Votre page Facebook"
										on:blur={() => handleFieldBlur('socialMedia.facebook', profileData.socialMedia.facebook)}
										on:keydown={(e) => handleFieldKeydown(e, 'socialMedia.facebook', profileData.socialMedia.facebook)}
									/>
								</div>
								</div>
							</div>
						</div>

						<!-- Conseils -->
						<div class="card bg-base-200 shadow-xl">
							<div class="card-body">
								<h3 class="card-title text-2xl mb-6">💡 Conseils</h3>
								
								<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div class="alert alert-info">
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
										</svg>
										<span class="text-sm">Vos modifications sont sauvegardées automatiquement</span>
									</div>
									<div class="alert alert-success">
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
										</svg>
										<span class="text-sm">Appuyez sur Entrée ou sortez du champ pour sauvegarder</span>
									</div>
									<div class="alert alert-warning">
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
										</svg>
										<span class="text-sm">Votre email ne peut pas être modifié</span>
									</div>
									<div class="alert alert-info">
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
										</svg>
										<span class="text-sm">Connectez vos réseaux sociaux pour plus de visibilité</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	{/if}
</div>
