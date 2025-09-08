<script lang="ts">
	import { onMount } from 'svelte';
	import CreationCard from '$lib/components/CreationCard.svelte';
	
	let creations: any[] = [];
	let isLoading = true;
	let error = '';

	onMount(async () => {
		try {
			const response = await fetch('/api/products');
			const data = await response.json();
			
			if (data.success) {
				creations = data.products || [];
			} else {
				error = data.error || 'Erreur lors du chargement des produits';
			}
		} catch (err) {
			error = 'Erreur de connexion';
			console.error('Erreur lors du chargement des produits:', err);
		} finally {
			isLoading = false;
		}
	});
</script>

<svelte:head>
	<title>KPSULL - Boutique de Créateurs</title>
	<meta name="description" content="Découvrez des créations uniques de créateurs talentueux" />
</svelte:head>

<!-- Créations Section -->
<section class="py-12 bg-base-100">
	<div class="max-w-6xl mx-auto px-4">
		<div class="text-center mb-12">
			<h2 class="text-4xl font-bold mb-4">Nos Créations</h2>
			<p class="text-lg text-base-content/70 max-w-3xl mx-auto leading-relaxed">
				Chaque pièce est unique, créée avec passion par nos créateurs talentueux. 
				Découvrez des créations qui racontent une histoire.
			</p>
		</div>
		
		{#if isLoading}
			<div class="flex items-center justify-center py-12">
				<div class="loading loading-spinner loading-lg"></div>
			</div>
		{:else if error}
			<div class="alert alert-error">
				<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
				</svg>
				<span>{error}</span>
			</div>
		{:else if creations.length === 0}
			<div class="text-center py-12">
				<p class="text-lg text-base-content/70">Aucun produit disponible pour le moment.</p>
			</div>
		{:else}
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
				{#each creations as creation}
					<CreationCard {creation} />
				{/each}
			</div>
		{/if}
		
		<div class="text-center">
			<button class="btn btn-outline-modern btn-lg px-8">
				Voir toutes les créations
			</button>
		</div>
	</div>
</section>

<!-- À propos Section -->
<section class="py-12 bg-base-200">
	<div class="max-w-6xl mx-auto px-4">
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
			<div>
				<h2 class="text-4xl font-bold mb-4">À propos de KPSULL</h2>
				<p class="text-lg text-base-content/80 mb-6 leading-relaxed">
					KPSULL est une marketplace dédiée aux créateurs indépendants. 
					Nous mettons en avant des créations uniques et authentiques, 
					donnant une voix aux talents émergents.
				</p>
				<p class="text-lg text-base-content/80 mb-8 leading-relaxed">
					Chaque achat soutient directement les créateurs et leur permet 
					de continuer à créer des pièces exceptionnelles. Rejoignez notre communauté 
					de créateurs et découvrez des créations qui vous ressemblent.
				</p>
				<div class="flex flex-col sm:flex-row gap-4">
					<button class="btn btn-modern">
						En savoir plus
					</button>
					<a href="/creator/signup" class="btn btn-outline-modern">
						Devenir créateur
					</a>
				</div>
			</div>
			<div class="relative">
				<div class="relative rounded-2xl overflow-hidden shadow-2xl">
					<img 
						src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop" 
						alt="Créateur au travail"
						class="w-full h-auto"
					/>
					<div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
				</div>
			</div>
		</div>
	</div>
</section>