<script lang="ts">
	import { goto } from '$app/navigation';
	
	export let creation: any;

	// Fonctions pour gérer les prix et images
	function getMinPrice() {
		if (!creation.variants || creation.variants.length === 0) return 0;
		return Math.min(...creation.variants.map((v: any) => parseFloat(v.price)));
	}

	function getMaxPrice() {
		if (!creation.variants || creation.variants.length === 0) return 0;
		return Math.max(...creation.variants.map((v: any) => parseFloat(v.price)));
	}

	function getFirstImage() {
		if (!creation.variants || creation.variants.length === 0) return 'https://via.placeholder.com/400';
		const firstVariant = creation.variants[0];
		return firstVariant.images && firstVariant.images.length > 0 
			? firstVariant.images[0] 
			: 'https://via.placeholder.com/400';
	}

	function handleProductClick() {
		goto(`/products/${creation.id}`);
	}

	function handleCreatorClick(event: MouseEvent) {
		event.preventDefault();
		event.stopPropagation();
		goto(`/creators/${creation.creatorId}`);
	}

	function handleCreatorKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			event.stopPropagation();
			goto(`/creators/${creation.creatorId}`);
		}
	}
</script>

<div class="card-hover cursor-pointer group" on:click={handleProductClick} on:keydown={(e) => e.key === 'Enter' && handleProductClick()} role="button" tabindex="0">
	<div class="relative overflow-hidden rounded-2xl mb-4">
		<img 
			src={getFirstImage()} 
			alt={creation.name}
			class="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
		/>
		<div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
	</div>
	
	<div class="space-y-3 px-4 pb-4">
		<div>
			<h3 class="text-xl font-semibold text-base-content group-hover:text-primary transition-colors">
				{creation.name}
			</h3>
			<p class="text-base-content/60 text-sm">
				par <span class="hover:text-primary transition-colors cursor-pointer" role="button" tabindex="0" on:click={handleCreatorClick} on:keydown={handleCreatorKeydown}>créateur</span>
			</p>
		</div>
		
		<div class="flex justify-between items-center">
			<span class="text-2xl font-bold text-primary">
				{#if getMinPrice() === getMaxPrice()}
					{getMinPrice().toFixed(2)}€
				{:else}
					{getMinPrice().toFixed(2)}€ - {getMaxPrice().toFixed(2)}€
				{/if}
			</span>
		</div>
	</div>
</div>