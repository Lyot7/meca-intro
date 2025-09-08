<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	
	// Données de test pour le produit
	const product = {
		id: '1',
		name: 'Robe Élégante',
		price: 89.99,
		description: 'Une robe élégante et moderne, parfaite pour toutes les occasions. Créée avec des matériaux de qualité supérieure et un savoir-faire artisanal exceptionnel.',
		images: [
			'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=600&fit=crop',
			'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=600&fit=crop',
			'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=600&fit=crop'
		],
		creator: {
			name: 'Marie Dubois',
			description: 'Créatrice de mode depuis 10 ans, Marie se spécialise dans les pièces élégantes et intemporelles.',
			avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop'
		},
		sizes: ['XS', 'S', 'M', 'L', 'XL'],
		colors: ['Noir', 'Blanc', 'Rouge', 'Bleu'],
		stock: 15
	};

	let selectedSize = '';
	let selectedColor = '';
	let quantity = 1;
	let selectedImage = 0;

	function addToCart() {
		if (!selectedSize || !selectedColor) {
			alert('Veuillez sélectionner une taille et une couleur');
			return;
		}
		
		// Ici on ajouterait au panier
		alert(`Ajouté au panier: ${product.name} - Taille: ${selectedSize} - Couleur: ${selectedColor} - Quantité: ${quantity}`);
		goto('/cart');
	}
</script>

<svelte:head>
	<title>{product.name} - KPSULL</title>
	<meta name="description" content={product.description} />
</svelte:head>

<div class="max-w-6xl mx-auto px-4">
	<!-- Breadcrumb -->
	<div class="breadcrumbs text-sm mb-8">
		<ul>
			<li><a href="/" class="link link-hover">Accueil</a></li>
			<li><a href="/products" class="link link-hover">Produits</a></li>
			<li>{product.name}</li>
		</ul>
	</div>

	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		<!-- Images -->
		<div class="space-y-4">
			<div class="aspect-square overflow-hidden rounded-lg">
				<img 
					src={product.images[selectedImage]} 
					alt={product.name}
					class="w-full h-full object-cover"
				/>
			</div>
			
			<div class="grid grid-cols-3 gap-2">
				{#each product.images as image, index}
					<button 
						class="aspect-square overflow-hidden rounded-lg border-2 {selectedImage === index ? 'border-primary' : 'border-base-300'}"
						on:click={() => selectedImage = index}
					>
						<img 
							src={image} 
							alt={`${product.name} ${index + 1}`}
							class="w-full h-full object-cover"
						/>
					</button>
				{/each}
			</div>
		</div>

		<!-- Informations produit -->
		<div class="space-y-6">
			<div>
				<h1 class="text-3xl font-bold mb-2">{product.name}</h1>
				<p class="text-2xl font-bold text-primary mb-4">
					{product.price.toFixed(2)}€
				</p>
				<p class="text-base-content/80">{product.description}</p>
			</div>

			<!-- Créateur -->
			<div class="card bg-base-200 p-4">
				<div class="flex items-center gap-3">
					<img 
						src={product.creator.avatar} 
						alt={product.creator.name}
						class="w-12 h-12 rounded-full object-cover"
					/>
					<div>
						<h3 class="font-semibold">Créé par {product.creator.name}</h3>
						<p class="text-sm text-base-content/70">{product.creator.description}</p>
					</div>
				</div>
			</div>

			<!-- Options -->
			<div class="space-y-4">
				<!-- Taille -->
				<div>
					<label class="label">
						<span class="label-text font-semibold">Taille</span>
					</label>
					<div class="flex gap-2 flex-wrap">
						{#each product.sizes as size}
							<button 
								class="btn btn-sm {selectedSize === size ? 'btn-primary' : 'btn-outline'}"
								on:click={() => selectedSize = size}
							>
								{size}
							</button>
						{/each}
					</div>
				</div>

				<!-- Couleur -->
				<div>
					<label class="label">
						<span class="label-text font-semibold">Couleur</span>
					</label>
					<div class="flex gap-2 flex-wrap">
						{#each product.colors as color}
							<button 
								class="btn btn-sm {selectedColor === color ? 'btn-primary' : 'btn-outline'}"
								on:click={() => selectedColor = color}
							>
								{color}
							</button>
						{/each}
					</div>
				</div>

				<!-- Quantité -->
				<div>
					<label class="label">
						<span class="label-text font-semibold">Quantité</span>
					</label>
					<div class="flex items-center gap-2">
						<button 
							class="btn btn-sm btn-circle btn-outline"
							on:click={() => quantity = Math.max(1, quantity - 1)}
						>
							-
						</button>
						<span class="w-8 text-center">{quantity}</span>
						<button 
							class="btn btn-sm btn-circle btn-outline"
							on:click={() => quantity = Math.min(product.stock, quantity + 1)}
						>
							+
						</button>
					</div>
					<p class="text-sm text-base-content/70 mt-1">
						{product.stock} en stock
					</p>
				</div>
			</div>

			<!-- Actions -->
			<div class="space-y-3">
				<button 
					class="btn btn-primary btn-lg w-full"
					on:click={addToCart}
					disabled={!selectedSize || !selectedColor}
				>
					<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
						<path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
					</svg>
					Ajouter au panier
				</button>
				
				<button class="btn btn-outline btn-lg w-full">
					<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path>
					</svg>
					Ajouter aux favoris
				</button>
			</div>
		</div>
	</div>
</div>
