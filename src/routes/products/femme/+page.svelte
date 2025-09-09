<script lang="ts">
	import { onMount } from 'svelte';
	import CreationCard from '$lib/components/CreationCard.svelte';
	
	// État du filtre actuel
	let selectedFilter: string = 'tous';
	let products: any[] = [];
	let isLoading = true;
	let error = '';

	onMount(async () => {
		try {
			const response = await fetch('/api/products?gender=female');
			const data = await response.json();
			
			if (data.success) {
				products = data.products || [];
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

	// Produits filtrés selon la catégorie sélectionnée
	$: filteredProducts = selectedFilter === 'tous' 
		? products 
		: products.filter(product => 
			product.tags && product.tags.some((tag: string) => 
				tag.toLowerCase().includes(selectedFilter.toLowerCase())
			)
		);

	// Fonction pour changer le filtre
	function setFilter(filter: string) {
		selectedFilter = filter;
		console.log('Filtre sélectionné:', selectedFilter);
		console.log('Produits filtrés:', filteredProducts.length);
	}
</script>

<svelte:head>
	<title>Produits Femme - KPSULL</title>
	<meta name="description" content="Découvrez nos créations pour femme" />
</svelte:head>

<!-- Hero Section -->
<section class="hero bg-gradient-to-r from-primary to-secondary text-primary-content">
	<div class="hero-content text-center">
		<div class="max-w-4xl">
			<h1 class="text-5xl font-bold mb-4">Femme</h1>
			<p class="text-xl">
				Découvrez notre sélection de créations uniques pour femme, 
				alliant élégance et originalité pour toutes les occasions.
			</p>
		</div>
	</div>
</section>

<!-- Filtres -->
<section class="py-8 bg-base-200">
	<div class="max-w-6xl mx-auto px-4">
		<div class="flex flex-wrap gap-2">
			<button 
				class="badge badge-lg {selectedFilter === 'tous' ? 'badge-primary' : 'badge-outline'}"
				on:click={() => setFilter('tous')}
			>
				Tous
			</button>
			<button 
				class="badge badge-lg {selectedFilter === 'vêtements' ? 'badge-primary' : 'badge-outline'}"
				on:click={() => setFilter('vêtements')}
			>
				Vêtements
			</button>
			<button 
				class="badge badge-lg {selectedFilter === 'accessoires' ? 'badge-primary' : 'badge-outline'}"
				on:click={() => setFilter('accessoires')}
			>
				Accessoires
			</button>
		</div>
	</div>
</section>

<!-- Produits -->
<section class="py-12 bg-base-100">
	<div class="max-w-6xl mx-auto px-4">
		{#if isLoading}
			<div class="flex items-center justify-center py-12">
				<div class="loading loading-spinner loading-lg"></div>
			</div>
		{:else if error}
			<div class="alert alert-error">
				<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
				</svg>
				<span>{error}</span>
			</div>
		{:else if filteredProducts.length === 0}
			<div class="text-center py-12">
				<h3 class="text-xl font-semibold mb-2">Aucun produit trouvé</h3>
				<p class="text-base-content/70">Essayez de modifier vos filtres de recherche.</p>
			</div>
		{:else}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{#each filteredProducts as product}
					<CreationCard 
						creation={product}
					/>
				{/each}
			</div>
		{/if}
	</div>
</section>