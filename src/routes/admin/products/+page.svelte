<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/presentation/stores/authStore.js';

	let products: any[] = [];
	let isLoading = true;

	onMount(async () => {
		// Vérifier si l'utilisateur est connecté et est admin
		const response = await fetch('/api/auth/me');
		const data = await response.json();

		if (!data.success || data.user.email !== 'admin@kpsull.com') {
			goto('/auth');
			return;
		}

		// Charger les produits
		await loadProducts();
		isLoading = false;
	});

	async function loadProducts() {
		try {
			const response = await fetch('/api/products');
			const data = await response.json();
			
			if (data.success) {
				products = data.products || [];
			}
		} catch (error) {
			console.error('Erreur lors du chargement des produits:', error);
		}
	}

	function getStatusBadgeClass(status: string) {
		const statusClasses: Record<string, string> = {
			available: 'badge-success',
			out_of_stock: 'badge-warning',
			archived: 'badge-error',
			draft: 'badge-neutral'
		};
		return statusClasses[status] || 'badge-neutral';
	}
</script>

<svelte:head>
	<title>Gestion des Produits - Admin KPSULL</title>
</svelte:head>

<div class="min-h-screen bg-base-100">
	{#if isLoading}
		<div class="flex items-center justify-center min-h-96">
			<div class="loading loading-spinner loading-lg"></div>
		</div>
	{:else}
		<main class="max-w-7xl mx-auto p-6">
			<!-- Titre de la page -->
			<div class="mb-8">
				<h1 class="text-3xl font-bold text-base-content">Gestion des Produits</h1>
				<p class="text-base-content/70">Gérer tous les produits de la plateforme</p>
			</div>

			<!-- Statistiques rapides -->
			<div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
				<div class="stat bg-base-200 rounded-lg">
					<div class="stat-figure text-primary">
						<svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM8 15v-4h4v4H8z" clip-rule="evenodd"></path>
						</svg>
					</div>
					<div class="stat-title">Total</div>
					<div class="stat-value text-primary">{products.length}</div>
					<div class="stat-desc">Produits</div>
				</div>

				<div class="stat bg-base-200 rounded-lg">
					<div class="stat-figure text-success">
						<svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
						</svg>
					</div>
					<div class="stat-title">Disponibles</div>
					<div class="stat-value text-success">{products.filter(p => p.status === 'available').length}</div>
					<div class="stat-desc">En vente</div>
				</div>

				<div class="stat bg-base-200 rounded-lg">
					<div class="stat-figure text-warning">
						<svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
						</svg>
					</div>
					<div class="stat-title">Épuisés</div>
					<div class="stat-value text-warning">{products.filter(p => p.status === 'out_of_stock').length}</div>
					<div class="stat-desc">Rupture de stock</div>
				</div>

				<div class="stat bg-base-200 rounded-lg">
					<div class="stat-figure text-info">
						<svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path>
						</svg>
					</div>
					<div class="stat-title">Genres</div>
					<div class="stat-value text-info">{new Set(products.map(p => p.gender)).size}</div>
					<div class="stat-desc">Catégories</div>
				</div>
			</div>

			<!-- Liste des produits -->
			<div class="card bg-base-200">
				<div class="card-body">
					<h2 class="card-title">Liste des produits</h2>
					<div class="space-y-4">
						{#each products as product}
							<div class="flex items-center gap-4 p-4 bg-base-100 rounded-lg">
								<div class="avatar">
									<div class="w-16 h-16 rounded">
										<img src={product.getFirstImage?.() || 'https://via.placeholder.com/64'} alt={product.name} />
									</div>
								</div>
								<div class="flex-1">
									<h3 class="font-bold text-lg">{product.name}</h3>
									<p class="text-sm text-base-content/70 mb-2">{product.description}</p>
									<div class="flex gap-4 text-sm">
										<span class="badge badge-outline">{product.gender}</span>
										<span class="badge {getStatusBadgeClass(product.status)}">{product.status}</span>
										<span class="text-primary font-medium">
											{product.getMinPrice?.()}€ - {product.getMaxPrice?.()}€
										</span>
									</div>
								</div>
								<div class="text-right">
									<div class="flex gap-2">
										<button class="btn btn-sm btn-outline">Voir</button>
										<button class="btn btn-sm btn-outline">Modifier</button>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</main>
	{/if}
</div>
