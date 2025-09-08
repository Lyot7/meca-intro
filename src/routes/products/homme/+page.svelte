<script lang="ts">
	import CreationCard from '$lib/components/CreationCard.svelte';
	
	// État du filtre actuel
	let selectedFilter: string = 'tous';
	
	// Données mockées pour les produits homme et unisexes
	const products = [
		{
			id: 1,
			name: "T-shirt Oversized",
			creator: "Marie Dubois",
			price: 45,
			image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
			gender: "homme",
			category: "vêtements"
		},
		{
			id: 2,
			name: "Sweat à Capuche",
			creator: "Pierre Martin",
			price: 65,
			image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop",
			gender: "homme",
			category: "vêtements"
		},
		{
			id: 3,
			name: "Sac Tote Unisexe",
			creator: "Sophie Laurent",
			price: 35,
			image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
			gender: "unisexe",
			category: "accessoires"
		},
		{
			id: 4,
			name: "Casquette Vintage",
			creator: "Alexandre Moreau",
			price: 25,
			image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=400&fit=crop",
			gender: "homme",
			category: "accessoires"
		},
		{
			id: 5,
			name: "Bracelet Cuir",
			creator: "Emma Rousseau",
			price: 20,
			image: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&h=400&fit=crop",
			gender: "unisexe",
			category: "accessoires"
		},
		{
			id: 6,
			name: "Veste Denim",
			creator: "Thomas Bernard",
			price: 85,
			image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop",
			gender: "homme",
			category: "vêtements"
		}
	];

	// Filtrer les produits pour homme (homme + unisexe)
	const hommeProducts = products.filter(product => 
		product.gender === 'homme' || product.gender === 'unisexe'
	);

	// Produits filtrés selon la catégorie sélectionnée
	$: filteredProducts = selectedFilter === 'tous' 
		? hommeProducts 
		: hommeProducts.filter(product => product.category === selectedFilter);

	// Debug pour vérifier le filtrage
	$: console.log('Filtre sélectionné:', selectedFilter);
	$: console.log('Produits filtrés:', filteredProducts.length);
</script>

<svelte:head>
	<title>Créations Homme - KPSULL</title>
	<meta name="description" content="Découvrez nos créations pour homme et unisexes sur KPSULL" />
</svelte:head>

<!-- Header de la page -->
<div class="text-center mb-12">
	<h1 class="text-4xl font-bold mb-4" style="color: var(--color-text);">
		Créations Homme
	</h1>
	<p class="text-lg" style="color: var(--color-text-muted);">
		Découvrez nos créations pour homme et nos pièces unisexes
	</p>
	<p class="text-sm mt-2" style="color: var(--color-text-light);">
		{filteredProducts.length} création{filteredProducts.length > 1 ? 's' : ''} trouvée{filteredProducts.length > 1 ? 's' : ''}
	</p>
</div>

<!-- Filtres -->
<div class="flex flex-wrap gap-4 mb-8">
	<button 
		class="px-6 py-2 rounded-xl text-sm font-medium transition-all duration-200 {selectedFilter === 'tous' ? 'bg-primary-30 text-primary' : 'hover:bg-primary-30'}" 
		style="color: {selectedFilter === 'tous' ? 'var(--color-primary)' : 'var(--color-text-muted)'};"
		on:click={() => selectedFilter = 'tous'}
	>
		Tous
	</button>
	<button 
		class="px-6 py-2 rounded-xl text-sm font-medium transition-all duration-200 {selectedFilter === 'vêtements' ? 'bg-primary-30 text-primary' : 'hover:bg-primary-30'}" 
		style="color: {selectedFilter === 'vêtements' ? 'var(--color-primary)' : 'var(--color-text-muted)'};"
		on:click={() => selectedFilter = 'vêtements'}
	>
		Vêtements
	</button>
	<button 
		class="px-6 py-2 rounded-xl text-sm font-medium transition-all duration-200 {selectedFilter === 'accessoires' ? 'bg-primary-30 text-primary' : 'hover:bg-primary-30'}" 
		style="color: {selectedFilter === 'accessoires' ? 'var(--color-primary)' : 'var(--color-text-muted)'};"
		on:click={() => selectedFilter = 'accessoires'}
	>
		Accessoires
	</button>
</div>

<!-- Grille des produits -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
	{#each filteredProducts as product}
		<CreationCard 
			creation={{
				id: product.id.toString(),
				name: product.name,
				price: product.price,
				image: product.image,
				creator: { name: product.creator },
				creatorId: product.creator.toLowerCase().replace(/\s+/g, '-')
			}}
		/>
	{/each}
</div>

<!-- Message si aucun produit -->
{#if filteredProducts.length === 0}
	<div class="text-center py-12">
		<p class="text-lg" style="color: var(--color-text-muted);">
			Aucune création trouvée pour cette catégorie.
		</p>
	</div>
{/if}
