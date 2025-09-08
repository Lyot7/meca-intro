<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/presentation/stores/authStore.js';

	let user: any = null;
	let products: any[] = [];
	let stats = {
		totalProducts: 0,
		totalSales: 0,
		totalRevenue: 0
	};
	let isLoading = true;

	onMount(async () => {
		// Vérifier si l'utilisateur est connecté
		const response = await fetch('/api/auth/me');
		const data = await response.json();

		if (!data.success) {
			goto('/auth');
			return;
		}

		user = data.user;
		
		// Vérifier que c'est un créateur
		if (user.email !== 'createur@kpsull.com') {
			goto('/');
			return;
		}

		// Charger les données du créateur
		await loadCreatorData();
		
		isLoading = false;
	});

	async function loadCreatorData() {
		try {
			// Charger les produits du créateur
			const response = await fetch('/api/products');
			const data = await response.json();
			
			if (data.success) {
				products = data.products || [];
				stats.totalProducts = products.length;
			}
		} catch (error) {
			console.error('Erreur lors du chargement des données:', error);
		}
	}

	async function logout() {
		try {
			await fetch('/api/auth/logout', { method: 'POST' });
			authStore.logout();
			goto('/');
		} catch (error) {
			console.error('Erreur lors de la déconnexion:', error);
		}
	}

	function formatDate(date: string) {
		return new Date(date).toLocaleDateString('fr-FR');
	}
</script>

<svelte:head>
	<title>Tableau de bord Créateur - KPSULL</title>
</svelte:head>

<div class="min-h-screen bg-base-100">


	{#if isLoading}
		<div class="flex items-center justify-center min-h-96">
			<div class="loading loading-spinner loading-lg"></div>
		</div>
	{:else}
		<main class="max-w-7xl mx-auto p-6">
			<!-- Navigation -->
			<div class="tabs tabs-boxed mb-8">
				<a href="/creator/dashboard" class="tab tab-active">Tableau de bord</a>
				<a href="/creator/products" class="tab">Mes produits</a>
				<a href="/creator/orders" class="tab">Commandes</a>
				<a href="/creator/profile" class="tab">Mon profil</a>
			</div>

			<!-- Statistiques -->
			<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
				<div class="stat bg-base-200 rounded-lg">
					<div class="stat-figure text-primary">
						<svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM8 15v-4h4v4H8z" clip-rule="evenodd"></path>
						</svg>
					</div>
					<div class="stat-title">Produits</div>
					<div class="stat-value text-primary">{stats.totalProducts}</div>
					<div class="stat-desc">Produits publiés</div>
				</div>

				<div class="stat bg-base-200 rounded-lg">
					<div class="stat-figure text-secondary">
						<svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
						</svg>
					</div>
					<div class="stat-title">Ventes</div>
					<div class="stat-value text-secondary">{stats.totalSales}</div>
					<div class="stat-desc">Commandes reçues</div>
				</div>

				<div class="stat bg-base-200 rounded-lg">
					<div class="stat-figure text-accent">
						<svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
						</svg>
					</div>
					<div class="stat-title">Revenus</div>
					<div class="stat-value text-accent">{stats.totalRevenue}€</div>
					<div class="stat-desc">Revenus totaux</div>
				</div>
			</div>

			<!-- Informations de l'abonnement -->
			<div class="card bg-base-200 mb-8">
				<div class="card-body">
					<h2 class="card-title">Informations d'abonnement</h2>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<p class="text-sm text-base-content/70">Type d'abonnement</p>
							<p class="font-semibold capitalize">{user?.subscription?.type}</p>
						</div>
						<div>
							<p class="text-sm text-base-content/70">Statut</p>
							<span class="badge badge-{user?.subscription?.isActive ? 'success' : 'error'}">
								{user?.subscription?.isActive ? 'Actif' : 'Inactif'}
							</span>
						</div>
						<div>
							<p class="text-sm text-base-content/70">Expire le</p>
							<p class="font-semibold">{formatDate(user?.subscription?.expiresAt)}</p>
						</div>
						<div>
							<p class="text-sm text-base-content/70">Prix</p>
							<p class="font-semibold">{user?.subscription?.type === 'monthly' ? '100€/mois' : '1000€/an'}</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Actions rapides -->
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
				<div class="card bg-base-200">
					<div class="card-body">
						<h2 class="card-title">Actions rapides</h2>
						<div class="card-actions">
							<button class="btn btn-primary">
								<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"></path>
								</svg>
								Ajouter un produit
							</button>
							<button class="btn btn-outline">
								<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
								</svg>
								Voir les commandes
							</button>
						</div>
					</div>
				</div>

				<div class="card bg-base-200">
					<div class="card-body">
						<h2 class="card-title">Mes produits récents</h2>
						<div class="space-y-3">
							{#each products.slice(0, 3) as product}
								<div class="flex items-center gap-3 p-2 bg-base-100 rounded">
									<div class="avatar">
										<div class="w-10 h-10 rounded">
											<img src={product.getFirstImage?.() || 'https://via.placeholder.com/40'} alt={product.name} />
										</div>
									</div>
									<div class="flex-1">
										<h3 class="font-semibold text-sm">{product.name}</h3>
										<p class="text-xs text-base-content/70">{product.getMinPrice?.()}€ - {product.getMaxPrice?.()}€</p>
									</div>
									<span class="badge badge-{product.status === 'available' ? 'success' : 'error'} badge-sm">
										{product.status}
									</span>
								</div>
							{/each}
						</div>
					</div>
				</div>
			</div>
		</main>
	{/if}
</div>