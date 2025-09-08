<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	
	let mounted = false;
	let isLoading = false;
	let error = '';
	let showPassword = false;
	let showConfirmPassword = false;
	let selectedPlan = 'monthly'; // 'monthly' ou 'yearly'
	
	// Données du formulaire
	let formData = {
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		confirmPassword: '',
		businessName: '',
		description: '',
		website: '',
		acceptTerms: false,
		acceptPricing: false
	};

	onMount(() => {
		mounted = true;
	});

	function togglePassword() {
		showPassword = !showPassword;
	}

	function toggleConfirmPassword() {
		showConfirmPassword = !showConfirmPassword;
	}

	async function handleSubmit() {
		// Validation
		if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.businessName) {
			error = 'Veuillez remplir tous les champs obligatoires';
			return;
		}

		if (formData.password !== formData.confirmPassword) {
			error = 'Les mots de passe ne correspondent pas';
			return;
		}

		if (formData.password.length < 8) {
			error = 'Le mot de passe doit contenir au moins 8 caractères';
			return;
		}

		if (!formData.acceptTerms) {
			error = 'Vous devez accepter les conditions d\'utilisation';
			return;
		}

		if (!formData.acceptPricing) {
			error = 'Vous devez accepter les conditions tarifaires';
			return;
		}

		isLoading = true;
		error = '';

		try {
			const response = await fetch('/api/auth/creator/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					firstName: formData.firstName,
					lastName: formData.lastName,
					email: formData.email,
					password: formData.password,
					businessName: formData.businessName,
					description: formData.description,
					website: formData.website,
					plan: selectedPlan
				})
			});

			if (response.ok) {
				// Redirection vers la page de connexion avec un message de succès
				goto('/auth?message=Compte créateur créé avec succès');
			} else {
				const data = await response.json();
				error = data.message || 'Erreur lors de la création du compte';
			}
		} catch (err) {
			error = 'Erreur de connexion';
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Inscription Créateur - KPSULL</title>
</svelte:head>

<!-- Background avec gradient animé -->
<div class="auth-background">
	<div class="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10"></div>
	
	<!-- Container principal -->
	<div class="relative flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 h-full">
		<div class="w-full max-w-2xl">
			<!-- Header avec animation -->
			

			<!-- Card d'inscription -->
			<div class="auth-card" class:animate-slide-up={mounted}>
				<div class="p-8">
					{#if error}
						<div class="alert alert-error mb-6 animate-shake">
							<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
							</svg>
							<span>{error}</span>
						</div>
					{/if}

					<form on:submit|preventDefault={handleSubmit} class="space-y-6">
						<!-- Informations personnelles -->
						<div class="space-y-4">
							<h3 class="text-lg font-semibold text-base-content mb-4 flex items-center gap-2">
								<svg class="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
									<path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path>
								</svg>
								Informations personnelles
							</h3>
							
							<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div class="form-group">
									<label for="firstName" class="form-label">
										<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
											<path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path>
										</svg>
										Prénom
									</label>
									<input 
										type="text" 
										id="firstName"
										bind:value={formData.firstName}
										class="form-input" 
										placeholder="Jean"
										required
									/>
								</div>

								<div class="form-group">
									<label for="lastName" class="form-label">
										<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
											<path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path>
										</svg>
										Nom
									</label>
									<input 
										type="text" 
										id="lastName"
										bind:value={formData.lastName}
										class="form-input" 
										placeholder="Dupont"
										required
									/>
								</div>
							</div>

							<div class="form-group">
								<label for="email" class="form-label">
									<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
										<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
										<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
									</svg>
									Email
								</label>
								<input 
									type="email" 
									id="email"
									bind:value={formData.email}
									class="form-input" 
									placeholder="jean.dupont@email.com"
									required
								/>
							</div>
						</div>

						<!-- Informations business -->
						<div class="space-y-4">
							<h3 class="text-lg font-semibold text-base-content mb-4 flex items-center gap-2">
								<svg class="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
									<path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"></path>
									<path fill-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clip-rule="evenodd"></path>
								</svg>
								Informations business
							</h3>

							<div class="form-group">
								<label for="businessName" class="form-label">
									<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
										<path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"></path>
										<path fill-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clip-rule="evenodd"></path>
									</svg>
									Nom de votre marque/entreprise
								</label>
								<input 
									type="text" 
									id="businessName"
									bind:value={formData.businessName}
									class="form-input" 
									placeholder="Ma Création Unique"
									required
								/>
							</div>

							<div class="form-group">
								<label for="description" class="form-label">
									<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd"></path>
									</svg>
									Description de votre activité
								</label>
								<textarea 
									id="description"
									bind:value={formData.description}
									class="form-input min-h-[100px] resize-none" 
									placeholder="Décrivez brièvement votre activité, vos créations, votre style..."
								></textarea>
							</div>

							<div class="form-group">
								<label for="website" class="form-label">
									<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clip-rule="evenodd"></path>
									</svg>
									Site web (optionnel)
								</label>
								<input 
									type="url" 
									id="website"
									bind:value={formData.website}
									class="form-input" 
									placeholder="https://monsite.com"
								/>
							</div>
						</div>

						<!-- Mot de passe -->
						<div class="space-y-4">
							<h3 class="text-lg font-semibold text-base-content mb-4 flex items-center gap-2">
								<svg class="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path>
								</svg>
								Sécurité
							</h3>

							<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div class="form-group">
									<label for="password" class="form-label">
										<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
											<path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path>
										</svg>
										Mot de passe
									</label>
									<div class="relative">
										<input 
											type={showPassword ? 'text' : 'password'}
											id="password"
											bind:value={formData.password}
											class="form-input pr-12" 
											placeholder="••••••••"
											required
										/>
										<button 
											type="button"
											on:click={togglePassword}
											class="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content transition-colors"
										>
											{#if showPassword}
												<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
													<path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd"></path>
													<path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"></path>
												</svg>
											{:else}
												<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
													<path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
													<path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path>
												</svg>
											{/if}
										</button>
									</div>
									<p class="text-xs text-base-content/60 mt-1">Minimum 8 caractères</p>
								</div>

								<div class="form-group">
									<label for="confirmPassword" class="form-label">
										<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
											<path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path>
										</svg>
										Confirmer
									</label>
									<div class="relative">
										<input 
											type={showConfirmPassword ? 'text' : 'password'}
											id="confirmPassword"
											bind:value={formData.confirmPassword}
											class="form-input pr-12" 
											placeholder="••••••••"
											required
										/>
										<button 
											type="button"
											on:click={toggleConfirmPassword}
											class="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content transition-colors"
										>
											{#if showConfirmPassword}
												<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
													<path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd"></path>
													<path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"></path>
												</svg>
											{:else}
												<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
													<path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
													<path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path>
												</svg>
											{/if}
										</button>
									</div>
								</div>
							</div>
						</div>

						<!-- Plan d'abonnement -->
						<div class="space-y-4">
							<h3 class="text-lg font-semibold text-base-content mb-4 flex items-center gap-2">
								<svg class="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
									<path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"></path>
								</svg>
								Plan d'abonnement
							</h3>

							<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<label class="cursor-pointer">
									<input 
										type="radio" 
										bind:group={selectedPlan}
										value="monthly"
										class="radio radio-primary" 
									/>
									<div class="ml-3">
										<div class="font-medium">Mensuel</div>
										<div class="text-sm text-base-content/70">100€/mois</div>
									</div>
								</label>

								<label class="cursor-pointer">
									<input 
										type="radio" 
										bind:group={selectedPlan}
										value="yearly"
										class="radio radio-primary" 
									/>
									<div class="ml-3">
										<div class="font-medium">Annuel</div>
										<div class="text-sm text-base-content/70">1000€/an <span class="text-green-600 font-medium">(-200€)</span></div>
									</div>
								</label>
							</div>
						</div>

						<!-- Acceptation des conditions -->
						<div class="space-y-4">
							<label class="flex items-start gap-3 cursor-pointer">
								<input 
									type="checkbox" 
									bind:checked={formData.acceptTerms}
									class="checkbox checkbox-primary mt-1"
									required
								/>
								<span class="text-sm text-base-content/70">
									J'accepte les 
									<a href="/terms" class="link link-primary hover:underline">conditions d'utilisation</a>
									et la 
									<a href="/privacy" class="link link-primary hover:underline">politique de confidentialité</a>
								</span>
							</label>

							<label class="flex items-start gap-3 cursor-pointer">
								<input 
									type="checkbox" 
									bind:checked={formData.acceptPricing}
									class="checkbox checkbox-primary mt-1"
									required
								/>
								<span class="text-sm text-base-content/70">
									J'accepte les 
									<a href="/pricing" class="link link-primary hover:underline">conditions tarifaires</a>
									et comprends que l'abonnement sera facturé automatiquement
								</span>
							</label>
						</div>

						<!-- Bouton d'inscription -->
						<button 
							type="submit" 
							class="btn-auth-primary w-full"
							class:loading={isLoading}
							disabled={isLoading}
						>
							{#if isLoading}
								<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
									<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
									<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								Créeation du compte...
							{:else}
								<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
									<path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path>
								</svg>
								Créer mon compte créateur
							{/if}
						</button>
					</form>

					<!-- Séparateur -->
					<div class="flex items-center my-8">
						<div class="flex-1 border-t border-base-300"></div>
						<span class="px-4 text-sm text-base-content/50 bg-base-100">OU</span>
						<div class="flex-1 border-t border-base-300"></div>
					</div>

					<!-- Lien vers connexion -->
					<div class="text-center">
						<p class="text-sm text-base-content/70 mb-4">
							Déjà un compte ?
						</p>
						<a href="/auth" class="btn-auth-secondary w-full">
							<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clip-rule="evenodd"></path>
							</svg>
							Se connecter
						</a>
					</div>
				</div>
			</div>

			<!-- Footer -->
			<div class="text-center mt-8" class:animate-fade-in={mounted}>
				<a href="/auth/register" class="link link-primary text-sm">
					← Retour au choix du profil
				</a>
			</div>
		</div>
	</div>
</div>
