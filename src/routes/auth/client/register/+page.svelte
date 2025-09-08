<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	
	let mounted = false;
	let isLoading = false;
	let error = '';
	let showPassword = false;
	let showConfirmPassword = false;
	
	// Données du formulaire
	let formData = {
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		confirmPassword: '',
		acceptTerms: false
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
		if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
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

		isLoading = true;
		error = '';

		try {
			const response = await fetch('/api/auth/client/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					firstName: formData.firstName,
					lastName: formData.lastName,
					email: formData.email,
					password: formData.password
				})
			});

			if (response.ok) {
				// Redirection vers la page de connexion avec un message de succès
				goto('/auth?message=Compte créé avec succès');
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
	<title>Inscription Client - KPSULL</title>
</svelte:head>

<!-- Background avec gradient animé -->
<div class="auth-background">
	<div class="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10"></div>
	
	<!-- Container principal -->
	<div class="relative flex items-center justify-center px-4 sm:px-6 lg:px-8 h-full">
		<div class="w-full max-w-md">
			<!-- Header avec animation -->
			<div class="text-center mb-12" class:animate-fade-in={mounted}>
				
				<h1 class="text-4xl font-bold text-gradient mb-4">Créer un compte client</h1>
				<p class="text-base-content/70 text-sm">
					Rejoignez notre communauté et découvrez des créations uniques
				</p>
			</div>

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
						<!-- Prénom et Nom -->
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

						<!-- Email -->
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

						<!-- Mot de passe -->
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

						<!-- Confirmation mot de passe -->
						<div class="form-group">
							<label for="confirmPassword" class="form-label">
								<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path>
								</svg>
								Confirmer le mot de passe
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

						<!-- Acceptation des conditions -->
						<div class="form-group">
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
								Création du compte...
							{:else}
								<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
									<path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"></path>
								</svg>
								Créer mon compte client
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
