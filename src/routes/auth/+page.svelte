<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	
	let email = '';
	let password = '';
	let isLoading = false;
	let error = '';
	let showPassword = false;
	let mounted = false;

	onMount(() => {
		mounted = true;
	});

	async function handleLogin() {
		if (!email || !password) {
			error = 'Veuillez remplir tous les champs';
			return;
		}

		isLoading = true;
		error = '';

		try {
			// D'abord, on essaie de se connecter en tant que client
			let response = await fetch('/api/auth/client/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email, password })
			});

			if (response.ok) {
				// C'est un client, redirection vers l'accueil
				goto('/');
				return;
			}

			// Si ce n'est pas un client, on essaie en tant que créateur
			response = await fetch('/api/auth/creator/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email, password })
			});

			if (response.ok) {
				// C'est un créateur, redirection vers l'espace créateur
				goto('/creator/dashboard');
				return;
			}

			// Si aucun des deux ne fonctionne
			const data = await response.json();
			error = data.message || 'Email ou mot de passe incorrect';
		} catch (err) {
			error = 'Erreur de connexion';
		} finally {
			isLoading = false;
		}
	}

	function togglePassword() {
		showPassword = !showPassword;
	}
</script>

<svelte:head>
	<title>Connexion - KPSULL</title>
</svelte:head>

<!-- Background avec gradient animé -->
<div class="auth-background">
	<div class="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10"></div>
	
	<!-- Container principal -->
	<div class="relative flex items-center justify-center px-4 sm:px-6 lg:px-8 h-full">
		<div class="w-full max-w-md">
			
			<!-- Card de connexion -->
			<div class="auth-card mt-12" class:animate-slide-up={mounted}>
				<div class="p-8">
					{#if error}
						<div class="alert alert-error mb-6 animate-shake">
							<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
							</svg>
							<span>{error}</span>
						</div>
					{/if}

					<form on:submit|preventDefault={handleLogin} class="space-y-6">
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
								bind:value={email}
								class="form-input" 
								placeholder="votre@email.com"
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
									bind:value={password}
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
						</div>

						<!-- Bouton de connexion -->
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
								Connexion...
							{:else}
								<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clip-rule="evenodd"></path>
								</svg>
								Se connecter
							{/if}
						</button>
					</form>

					<!-- Séparateur -->
					<div class="flex items-center my-8">
						<div class="flex-1 border-t border-base-300"></div>
						<span class="px-4 text-sm text-base-content/50 bg-base-100">OU</span>
						<div class="flex-1 border-t border-base-300"></div>
					</div>

					<!-- Lien vers inscription -->
					<div class="text-center">
						<p class="text-sm text-base-content/70 mb-4">
							Pas encore de compte ?
						</p>
						<a href="/auth/register" class="btn-auth-secondary w-full">
							<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
								<path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"></path>
							</svg>
							Créer un compte
						</a>
					</div>
				</div>
			</div>

			<!-- Footer -->
			<div class="text-center mt-8" class:animate-fade-in={mounted}>
				<p class="text-xs text-base-content/50">
					En continuant, vous acceptez nos 
					<a href="/terms" class="link link-primary hover:underline">conditions d'utilisation</a>
				</p>
			</div>
		</div>
	</div>
</div>