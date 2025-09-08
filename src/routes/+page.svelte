<script lang="ts">
	import CreationCard from '$lib/components/CreationCard.svelte';
	
	// Données de test pour les créations
	const creations = [
		{
			id: '1',
			name: 'Robe Élégante',
			price: 89.99,
			image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop',
			creator: { name: 'Marie Dubois' }
		},
		{
			id: '2',
			name: 'Veste Vintage',
			price: 125.50,
			image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop',
			creator: { name: 'Pierre Martin' }
		},
		{
			id: '3',
			name: 'Pantalon Moderne',
			price: 75.00,
			image: 'https://images.unsplash.com/photo-1506629905607-1b2b2b2b2b2b?w=400&h=400&fit=crop',
			creator: { name: 'Sophie Laurent' }
		},
		{
			id: '4',
			name: 'Chemise Artisanale',
			price: 95.00,
			image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
			creator: { name: 'Thomas Moreau' }
		},
		{
			id: '5',
			name: 'Jupe Bohème',
			price: 65.99,
			image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
			creator: { name: 'Emma Rousseau' }
		},
		{
			id: '6',
			name: 'Blazer Sophistiqué',
			price: 145.00,
			image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop',
			creator: { name: 'Lucas Bernard' }
		}
	];
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
		
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
			{#each creations as creation}
				<CreationCard {creation} />
			{/each}
		</div>
		
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