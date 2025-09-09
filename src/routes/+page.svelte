<script lang="ts">
	import { onMount } from 'svelte';
	import CreationCard from '$lib/components/CreationCard.svelte';
	
	let creations: any[] = [];
	let filteredCreations: any[] = [];
	let isLoading = true;
	let error = '';
	let selectedFilter: 'all' | 'homme' | 'femme' = 'all';

	async function loadCreations() {
		try {
			const response = await fetch('/api/products');
			const data = await response.json();
			
			if (data.success) {
				creations = data.products || [];
				applyFilter();
			} else {
				error = data.error || 'Erreur lors du chargement des produits';
			}
		} catch (err) {
			error = 'Erreur de connexion';
			console.error('Erreur lors du chargement des produits:', err);
		} finally {
			isLoading = false;
		}
	}

	function applyFilter() {
		if (selectedFilter === 'all') {
			filteredCreations = creations;
		} else if (selectedFilter === 'homme') {
			filteredCreations = creations.filter(creation => 
				creation.gender === 'male' || creation.gender === 'unisex'
			);
		} else if (selectedFilter === 'femme') {
			filteredCreations = creations.filter(creation => 
				creation.gender === 'female' || creation.gender === 'unisex'
			);
		}
	}

	function setFilter(filter: 'all' | 'homme' | 'femme') {
		selectedFilter = filter;
		applyFilter();
	}

	onMount(() => {
		loadCreations();
	});
</script>

<svelte:head>
	<title>Créations - KPSULL</title>
	<meta name="description" content="Découvrez des créations uniques de créateurs talentueux" />
</svelte:head>


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
						Découvrir
					</button>
					<a href="/auth/creator/register" class="btn btn-outline-modern">
						Publier mes créations
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

<!-- Créations Section -->
<section class="py-12 bg-base-100">
	<div class="max-w-7xl mx-auto px-4">
		<div class="text-center mb-8">
			<h2 class="text-4xl font-bold mb-4">Nos Créations</h2>
			<p class="text-lg text-base-content/70 max-w-3xl mx-auto leading-relaxed mb-8">
				Chaque pièce est unique, créée avec passion par nos créateurs talentueux. 
				Découvrez des créations qui racontent une histoire.
			</p>
			
			<!-- Filtres mobiles -->
			<div class="lg:hidden flex flex-wrap justify-center gap-3 mb-8">
				<button 
					on:click={() => setFilter('all')}
					class="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 {selectedFilter === 'all' ? 'bg-primary text-white shadow-lg' : 'bg-base-200 text-base-content hover:bg-base-300'}"
				>
					Toutes
				</button>
				<button 
					on:click={() => setFilter('homme')}
					class="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 {selectedFilter === 'homme' ? 'bg-primary text-white shadow-lg' : 'bg-base-200 text-base-content hover:bg-base-300'}"
				>
					Homme
				</button>
				<button 
					on:click={() => setFilter('femme')}
					class="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 {selectedFilter === 'femme' ? 'bg-primary text-white shadow-lg' : 'bg-base-200 text-base-content hover:bg-base-300'}"
				>
					Femme
				</button>
			</div>
		</div>
		
		<!-- Layout avec sidebar et contenu -->
		<div class="flex gap-8">
			<!-- Sidebar des filtres -->
			<div class="hidden lg:block w-64 flex-shrink-0">
				<div class="bg-base-200 rounded-2xl p-6 sticky top-24">
					<h3 class="text-lg font-semibold mb-4 text-base-content">Filtres</h3>
					<div class="space-y-3">
						<button 
							on:click={() => setFilter('all')}
							class="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 {selectedFilter === 'all' ? 'bg-primary text-white shadow-lg' : 'bg-base-100 text-base-content hover:bg-base-300'}"
						>
							<svg class="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
								<path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"></path>
								<path fill-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clip-rule="evenodd"></path>
							</svg>
							Toutes les créations
						</button>
						<button 
							on:click={() => setFilter('homme')}
							class="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 {selectedFilter === 'homme' ? 'bg-primary text-white shadow-lg' : 'bg-base-100 text-base-content hover:bg-base-300'}"
						>
							<svg class="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
								<path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path>
							</svg>
							Homme
						</button>
						<button 
							on:click={() => setFilter('femme')}
							class="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 {selectedFilter === 'femme' ? 'bg-primary text-white shadow-lg' : 'bg-base-100 text-base-content hover:bg-base-300'}"
						>
							<svg class="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
								<path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path>
							</svg>
							Femme
						</button>
					</div>
				</div>
			</div>
			
			<!-- Contenu principal -->
			<div class="flex-1">
		
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
		{:else if filteredCreations.length === 0}
			<div class="text-center py-12">
				<p class="text-lg text-base-content/70">
					{#if selectedFilter === 'all'}
						Aucun produit disponible pour le moment.
					{:else if selectedFilter === 'homme'}
						Aucune création pour homme disponible.
					{:else if selectedFilter === 'femme'}
						Aucune création pour femme disponible.
					{/if}
				</p>
			</div>
		{:else}
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
				{#each filteredCreations as creation}
					<CreationCard {creation} />
				{/each}
			</div>
		{/if}
		
			</div>
		</div>
	</div>
</section>
