<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	
	let product: any = null;
	let isLoading = true;
	let error = '';
	
	let selectedSize = '';
	let selectedColor = '';
	let quantity = 1;
	let selectedImage = 0;

	onMount(async () => {
		const productId = $page.params.id;
		if (!productId) {
			error = 'ID du produit manquant';
			isLoading = false;
			return;
		}

		try {
			const response = await fetch(`/api/products/${productId}`);
			const data = await response.json();

			if (data.success) {
				product = data.product;
			} else {
				error = data.error || 'Erreur lors du chargement du produit';
			}
		} catch (err) {
			console.error('Erreur:', err);
			error = 'Erreur de connexion';
		} finally {
			isLoading = false;
		}
	});

	function addToCart() {
		if (!selectedSize || !selectedColor) {
			alert('Veuillez sélectionner une taille et une couleur');
			return;
		}
		
		// Trouver la variante correspondante
		const variant = product.variants.find((v: any) => 
			v.size === selectedSize && v.color === selectedColor
		);
		
		if (!variant) {
			alert('Cette combinaison taille/couleur n\'est pas disponible');
			return;
		}
		
		if (variant.stock < quantity) {
			alert(`Stock insuffisant. Disponible: ${variant.stock}`);
			return;
		}
		
		// Ici on ajouterait au panier
		alert(`Ajouté au panier: ${product.name} - Taille: ${selectedSize} - Couleur: ${selectedColor} - Quantité: ${quantity} - Prix: ${variant.price}€`);
		goto('/cart');
	}

	function getCurrentPrice() {
		if (!product || !selectedSize || !selectedColor) {
			return product?.priceRange?.min || 0;
		}
		
		const variant = product.variants.find((v: any) => 
			v.size === selectedSize && v.color === selectedColor
		);
		
		return variant ? parseFloat(variant.price) : product.priceRange?.min || 0;
	}

	function getCurrentStock() {
		if (!product || !selectedSize || !selectedColor) {
			return 0;
		}
		
		const variant = product.variants.find((v: any) => 
			v.size === selectedSize && v.color === selectedColor
		);
		
		return variant ? variant.stock : 0;
	}
</script>

<svelte:head>
	<title>{product?.name || 'Produit'} - KPSULL</title>
	<meta name="description" content={product?.description || ''} />
</svelte:head>

<div class="max-w-6xl mx-auto px-4">
	{#if isLoading}
		<div class="flex items-center justify-center min-h-96">
			<div class="loading loading-spinner loading-lg text-primary"></div>
		</div>
	{:else if error}
		<div class="alert alert-error">
			<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			<span>{error}</span>
		</div>
	{:else if product}
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<!-- Images -->
			<div class="space-y-4">
				<div class="aspect-square overflow-hidden rounded-lg">
					{#if product.images && product.images.length > 0}
						<img 
							src={product.images[selectedImage]} 
							alt={product.name}
							class="w-full h-full object-cover"
						/>
					{:else}
						<div class="w-full h-full bg-base-200 flex items-center justify-center">
							<span class="text-base-content/50">Aucune image</span>
						</div>
					{/if}
				</div>
				
				{#if product.images && product.images.length > 1}
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
				{/if}
			</div>

		<!-- Informations produit -->
		<div class="space-y-6">
			<div>
				<h1 class="text-3xl font-bold mb-2">{product.name}</h1>
				<p class="text-2xl font-bold text-primary mb-4">
					{#if product.priceRange.min === product.priceRange.max}
						{product.priceRange.min.toFixed(2)}€
					{:else}
						{product.priceRange.min.toFixed(2)}€ - {product.priceRange.max.toFixed(2)}€
					{/if}
				</p>
				<p class="text-base-content/80">{product.description}</p>
				
				<!-- Tags -->
				{#if product.tags && product.tags.length > 0}
					<div class="flex gap-2 mt-4">
						{#each product.tags as tag}
							<span class="badge badge-outline">{tag}</span>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Créateur -->
			{#if product.creator}
				<div class="card bg-base-200 p-4">
					<div class="flex items-center gap-3">
						<img 
							src={product.creator.profileImage || 'https://via.placeholder.com/48?text=👤'} 
							alt={product.creator.name}
							class="w-12 h-12 rounded-full object-cover"
						/>
						<div>
							<h3 class="font-semibold">Créé par {product.creator.name}</h3>
							<p class="text-sm text-base-content/70">{product.creator.description || 'Créateur talentueux'}</p>
						</div>
					</div>
				</div>
			{/if}

			<!-- Options -->
			<div class="space-y-4">
				<!-- Taille -->
				{#if product.sizes && product.sizes.length > 0}
					<div>
						<div class="label">
							<span class="label-text font-semibold">Taille</span>
						</div>
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
				{/if}

				<!-- Couleur -->
				{#if product.colors && product.colors.length > 0}
					<div>
						<div class="label">
							<span class="label-text font-semibold">Couleur</span>
						</div>
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
				{/if}

				<!-- Quantité -->
				<div>
					<div class="label">
						<span class="label-text font-semibold">Quantité</span>
					</div>
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
							on:click={() => quantity = Math.min(getCurrentStock(), quantity + 1)}
						>
							+
						</button>
					</div>
					<p class="text-sm text-base-content/70 mt-1">
						{getCurrentStock()} en stock
					</p>
				</div>
			</div>

			<!-- Actions -->
			<div class="space-y-3">
				<button 
					class="btn btn-primary btn-lg w-full"
					on:click={addToCart}
					disabled={!selectedSize || !selectedColor || getCurrentStock() === 0}
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
	{/if}
</div>
