<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import CreationCard from '$lib/components/CreationCard.svelte';
	
	let creator: any = null;
	let products: any[] = [];
	let isLoading = true;
	let error = '';

	onMount(async () => {
		const slug = $page.params.slug;
		if (!slug) {
			error = 'Slug du créateur manquant';
			isLoading = false;
			return;
		}

		try {
			// Récupérer les informations du créateur
			const creatorResponse = await fetch(`/api/creators/${slug}`);
			const creatorData = await creatorResponse.json();

			if (creatorData.success) {
				creator = creatorData.creator;
				
				// Récupérer les produits du créateur
				const productsResponse = await fetch(`/api/products?creatorId=${creator.id}`);
				const productsData = await productsResponse.json();
				
				if (productsData.success) {
					products = productsData.products || [];
				}
			} else {
				error = creatorData.error || 'Créateur non trouvé';
			}
		} catch (err) {
			console.error('Erreur:', err);
			error = 'Erreur de connexion';
		} finally {
			isLoading = false;
		}
	});
</script>

<svelte:head>
	<title>{creator?.name || 'Créateur'} - KPSULL</title>
	<meta name="description" content={creator?.description || ''} />
</svelte:head>

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
{:else if creator}
	<!-- Hero Section -->
	<section class="hero bg-gradient-to-r from-primary to-secondary text-primary-content">
		<div class="hero-content text-center">
			<div class="max-w-4xl">
				<div class="avatar mb-6">
					<div class="w-32 rounded-full ring ring-primary-content ring-offset-base-100 ring-offset-2">
						<img 
							src={creator.profileImage || 'https://via.placeholder.com/128?text=👤'} 
							alt={creator.name}
						/>
					</div>
				</div>
				<h1 class="text-5xl font-bold mb-4">{creator.name}</h1>
				<p class="text-xl mb-6">{creator.description}</p>
				
				{#if creator.website}
					<div class="flex justify-center gap-4">
						<a href={creator.website.startsWith('http') ? creator.website : `https://${creator.website}`} target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-primary-content">
							<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clip-rule="evenodd"></path>
							</svg>
							Site Web
						</a>
					</div>
				{/if}
			</div>
		</div>
	</section>

	<!-- Informations du créateur -->
	<section class="py-12 bg-base-100">
		<div class="max-w-6xl mx-auto px-4">
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<!-- Informations principales -->
				<div class="lg:col-span-2">
					<div class="card bg-base-200 p-6">
						<h2 class="text-2xl font-bold mb-4">À propos</h2>
						<p class="text-base-content/80 leading-relaxed">{creator.description}</p>
						
						{#if creator.socialMedia}
							<div class="mt-6">
								<h3 class="text-lg font-semibold mb-3">Réseaux sociaux</h3>
								<div class="flex gap-4">
									{#if creator.socialMedia.instagram}
										<a href="https://instagram.com/{creator.socialMedia.instagram.replace('@', '')}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-outline">
											<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
												<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
											</svg>
											{creator.socialMedia.instagram}
										</a>
									{/if}
									{#if creator.socialMedia.facebook}
										<a href="https://facebook.com/{creator.socialMedia.facebook}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-outline">
											<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
												<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
											</svg>
											{creator.socialMedia.facebook}
										</a>
									{/if}
								</div>
							</div>
						{/if}
					</div>
				</div>

				<!-- Statistiques -->
				<div class="space-y-6">
					<div class="card bg-base-200 p-6">
						<h3 class="text-lg font-semibold mb-4">Statistiques</h3>
						<div class="space-y-3">
							<div class="flex justify-between">
								<span>Produits</span>
								<span class="font-semibold">{products.length}</span>
							</div>
							<div class="flex justify-between">
								<span>Membre depuis</span>
								<span class="font-semibold">{new Date(creator.createdAt).toLocaleDateString('fr-FR')}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Créations -->
	<section class="py-12 bg-base-200">
		<div class="max-w-6xl mx-auto px-4">
			<h2 class="text-3xl font-bold text-center mb-8">Créations de {creator.name}</h2>
			
			{#if products.length === 0}
				<div class="text-center py-12">
					<h3 class="text-xl font-semibold mb-2">Aucune création disponible</h3>
					<p class="text-base-content/70">Ce créateur n'a pas encore publié de créations.</p>
				</div>
			{:else}
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{#each products as product}
						<CreationCard 
							creation={product}
						/>
					{/each}
				</div>
			{/if}
		</div>
	</section>
{/if}