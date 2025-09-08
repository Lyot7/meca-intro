<script lang="ts">
	import CreationCard from '$lib/components/CreationCard.svelte';
	import { page } from '$app/stores';
	
	// Données mockées pour les créateurs
	const creators = [
		{
			slug: 'marie-dubois',
			name: 'Marie Dubois',
			description: 'Créatrice passionnée de mode éthique et durable. Marie crée des pièces uniques inspirées de la nature et des cultures du monde.',
			avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop',
			website: 'https://mariedubois.com',
			social: {
				instagram: '@marie_dubois_creations',
				twitter: '@marie_dubois'
			},
			joinedDate: '2023-01-15',
			totalSales: 127,
			rating: 4.8
		},
		{
			slug: 'pierre-martin',
			name: 'Pierre Martin',
			description: 'Artisan du cuir depuis 15 ans, Pierre crée des accessoires en cuir véritable avec des techniques traditionnelles.',
			avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
			website: 'https://pierremartin-cuir.com',
			social: {
				instagram: '@pierre_martin_cuir',
				facebook: 'Pierre Martin Cuir'
			},
			joinedDate: '2022-08-20',
			totalSales: 89,
			rating: 4.9
		},
		{
			slug: 'sophie-laurent',
			name: 'Sophie Laurent',
			description: 'Designer textile spécialisée dans les sacs et accessoires unisexes. Sophie privilégie les matières naturelles et les couleurs apaisantes.',
			avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
			website: 'https://sophielaurent-design.com',
			social: {
				instagram: '@sophie_laurent_design',
				pinterest: 'Sophie Laurent Design'
			},
			joinedDate: '2023-03-10',
			totalSales: 156,
			rating: 4.7
		}
	];

	// Données mockées pour les créations
	const allCreations = [
		{
			id: 1,
			name: "T-shirt Oversized",
			creator: "Marie Dubois",
			creatorSlug: "marie-dubois",
			price: 45,
			image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
			gender: "homme",
			category: "vêtements"
		},
		{
			id: 2,
			name: "Sweat à Capuche",
			creator: "Pierre Martin",
			creatorSlug: "pierre-martin",
			price: 65,
			image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop",
			gender: "homme",
			category: "vêtements"
		},
		{
			id: 3,
			name: "Sac Tote Unisexe",
			creator: "Sophie Laurent",
			creatorSlug: "sophie-laurent",
			price: 35,
			image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
			gender: "unisexe",
			category: "accessoires"
		},
		{
			id: 4,
			name: "Casquette Vintage",
			creator: "Pierre Martin",
			creatorSlug: "pierre-martin",
			price: 25,
			image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=400&fit=crop",
			gender: "homme",
			category: "accessoires"
		},
		{
			id: 5,
			name: "Bracelet Cuir",
			creator: "Sophie Laurent",
			creatorSlug: "sophie-laurent",
			price: 20,
			image: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&h=400&fit=crop",
			gender: "unisexe",
			category: "accessoires"
		},
		{
			id: 6,
			name: "Veste Denim",
			creator: "Pierre Martin",
			creatorSlug: "pierre-martin",
			price: 85,
			image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop",
			gender: "homme",
			category: "vêtements"
		},
		{
			id: 7,
			name: "Robe Midi Élégante",
			creator: "Marie Dubois",
			creatorSlug: "marie-dubois",
			price: 75,
			image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop",
			gender: "femme",
			category: "vêtements"
		},
		{
			id: 8,
			name: "Blouse Vintage",
			creator: "Marie Dubois",
			creatorSlug: "marie-dubois",
			price: 55,
			image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop",
			gender: "femme",
			category: "vêtements"
		}
	];

	// Récupérer le slug depuis l'URL
	$: creatorSlug = $page.params.slug;
	
	// Trouver le créateur correspondant
	$: currentCreator = creators.find(creator => creator.slug === creatorSlug);
	
	// Filtrer les créations du créateur
	$: creatorCreations = allCreations.filter(creation => creation.creatorSlug === creatorSlug);
	
	// État du filtre actuel
	let selectedFilter: string = 'tous';
	
	// Produits filtrés selon la catégorie sélectionnée
	$: filteredCreations = selectedFilter === 'tous' 
		? creatorCreations 
		: creatorCreations.filter(creation => creation.category === selectedFilter);
</script>

<svelte:head>
	<title>{currentCreator?.name || 'Créateur'} - KPSULL</title>
	<meta name="description" content="Découvrez les créations de {currentCreator?.name || 'ce créateur'} sur KPSULL" />
</svelte:head>

{#if currentCreator}
	<div class="max-w-6xl mx-auto px-4">
		<!-- Header du créateur -->
		<div class="text-center mb-12">
			<div class="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4" style="border-color: var(--color-primary);">
				<img 
					src={currentCreator.avatar} 
					alt={currentCreator.name}
					class="w-full h-full object-cover"
				/>
			</div>
			<h1 class="text-4xl font-bold mb-4" style="color: var(--color-text);">
				{currentCreator.name}
			</h1>
			<p class="text-lg max-w-2xl mx-auto mb-6" style="color: var(--color-text-muted);">
				{currentCreator.description}
			</p>
			
			<!-- Informations du créateur -->
			<div class="flex flex-wrap justify-center gap-6 mb-8">
				<div class="text-center">
					<div class="text-2xl font-bold" style="color: var(--color-primary);">{currentCreator.totalSales}</div>
					<div class="text-sm" style="color: var(--color-text-muted);">Ventes</div>
				</div>
				<div class="text-center">
					<div class="text-2xl font-bold" style="color: var(--color-primary);">{currentCreator.rating}</div>
					<div class="text-sm" style="color: var(--color-text-muted);">Note</div>
				</div>
				<div class="text-center">
					<div class="text-2xl font-bold" style="color: var(--color-primary);">{creatorCreations.length}</div>
					<div class="text-sm" style="color: var(--color-text-muted);">Créations</div>
				</div>
			</div>

			<!-- Liens sociaux et site web -->
			<div class="flex flex-wrap justify-center gap-4">
				{#if currentCreator.website}
					<a href={currentCreator.website} target="_blank" rel="noopener noreferrer" class="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-primary-30" style="color: var(--color-text-muted);">
						🌐 Site web
					</a>
				{/if}
				{#if currentCreator.social.instagram}
					<a href="https://instagram.com/{currentCreator.social.instagram.replace('@', '')}" target="_blank" rel="noopener noreferrer" class="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-primary-30" style="color: var(--color-text-muted);">
						📷 {currentCreator.social.instagram}
					</a>
				{/if}
				{#if currentCreator.social.twitter}
					<a href="https://twitter.com/{currentCreator.social.twitter.replace('@', '')}" target="_blank" rel="noopener noreferrer" class="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-primary-30" style="color: var(--color-text-muted);">
						🐦 {currentCreator.social.twitter}
					</a>
				{/if}
			</div>
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

		<!-- Grille des créations -->
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
			{#each filteredCreations as creation}
				<CreationCard 
					creation={{
						id: creation.id.toString(),
						name: creation.name,
						price: creation.price,
						image: creation.image,
						creator: { name: creation.creator },
						creatorId: creation.creatorSlug
					}}
				/>
			{/each}
		</div>

		<!-- Message si aucune création -->
		{#if filteredCreations.length === 0}
			<div class="text-center py-12">
				<p class="text-lg" style="color: var(--color-text-muted);">
					Aucune création trouvée pour cette catégorie.
				</p>
			</div>
		{/if}
	</div>
{:else}
	<!-- Page 404 pour créateur non trouvé -->
	<div class="max-w-6xl mx-auto px-4">
		<div class="text-center">
			<h1 class="text-4xl font-bold mb-4" style="color: var(--color-text);">
				Créateur non trouvé
			</h1>
			<p class="text-lg mb-8" style="color: var(--color-text-muted);">
				Le créateur que vous recherchez n'existe pas ou a été supprimé.
			</p>
			<a href="/" class="px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200" style="background-color: var(--color-primary); color: white;">
				Retour à l'accueil
			</a>
		</div>
	</div>
{/if}
