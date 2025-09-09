<script lang="ts">
	import { page } from '$app/stores';
	
	// Détecter le type d'erreur
	$: errorType = ($page.error as any)?.status || 404;
	$: isServerError = errorType >= 500;
	
	// Fonction pour déterminer le message d'erreur selon le type d'erreur
	function getErrorMessage(): string {
		if (isServerError) {
			return "Une erreur s'est produite. Veuillez réessayer plus tard.";
		} else {
			return "Cette page n'existe pas ou n'est plus disponible.";
		}
	}
</script>

<svelte:head>
	<title>{isServerError ? 'Erreur serveur' : 'Page non trouvée'} - KPSULL</title>
	<meta name="description" content={isServerError ? "Une erreur s'est produite. Veuillez réessayer plus tard." : "La page que vous recherchez n'existe pas ou n'est plus disponible."} />
</svelte:head>

<!-- Contenu principal de la page d'erreur -->
<div class="container mx-auto px-6 py-16">
	<div class="text-center">
				<!-- Icône d'erreur -->
				<div class="mb-8">
					<div class="w-32 h-32 mx-auto bg-gradient-to-br {isServerError ? 'from-red-500/20 to-red-500/10' : 'from-primary/20 to-primary/10'} rounded-full flex items-center justify-center">
						{#if isServerError}
							<svg class="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
							</svg>
						{:else}
							<svg class="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 6.291A7.962 7.962 0 0012 5c-2.34 0-4.29 1.009-5.824 2.709"></path>
							</svg>
						{/if}
					</div>
				</div>

				<!-- Titre -->
				<h1 class="text-6xl font-bold mb-4" style="color: var(--color-text);">
					{errorType}
				</h1>
				
				<!-- Sous-titre -->
				<h2 class="text-2xl font-semibold mb-4" style="color: var(--color-text);">
					{isServerError ? 'Erreur serveur' : 'Page non trouvée'}
				</h2>
				
				<!-- Message d'erreur personnalisé selon le rôle -->
				<p class="text-lg mb-8 max-w-md mx-auto" style="color: var(--color-text-muted);">
					{getErrorMessage()}
				</p>
				
				<!-- Bouton d'action -->
				<div class="space-y-4">
					<a 
						href="/" 
						class="inline-block px-8 py-3 rounded-xl text-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1" 
						style="background-color: var(--color-primary); color: white;"
					>
						Retour à l'accueil
					</a>
					
					<!-- Bouton retour en arrière ou recharger -->
					{#if isServerError}
						<button 
							on:click={() => location.reload()} 
							class="block mx-auto px-6 py-2 rounded-xl text-sm font-medium transition-all duration-200 border-2 hover:bg-primary-30" 
							style="color: var(--color-text); border-color: var(--color-primary);"
						>
							🔄 Recharger la page
						</button>
					{:else}
						<button 
							on:click={() => history.back()} 
							class="block mx-auto px-6 py-2 rounded-xl text-sm font-medium transition-all duration-200 border-2 hover:bg-primary-30" 
							style="color: var(--color-text); border-color: var(--color-primary);"
						>
							← Retour en arrière
						</button>
					{/if}
				</div>
				
	</div>
</div>
