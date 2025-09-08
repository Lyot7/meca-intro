<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/presentation/stores/authStore.js';

	// Types pour les données
	interface AdminStats {
		totalCreators: number;
		subscribedCreators: number;
		totalProducts: number;
		totalOrders: number;
		totalRevenue: number;
		recentRevenue: number;
		ordersByStatus: Array<{ status: string; count: number }>;
		productsByGender: Array<{ gender: string; count: number }>;
		creatorsBySubscription: Array<{ subscriptionType: string; count: number }>;
	}

	interface Creator {
		id: string;
		name: string;
		email: string;
		description: string;
		profileImage?: string;
		website?: string;
		socialMedia?: any;
		status: string;
		subscriptionType: string;
		subscriptionExpiresAt: string;
		subscriptionActive: boolean;
		createdAt: string;
		updatedAt: string;
		stats: {
			productCount: number;
			orderCount: number;
			totalRevenue: number;
		};
	}

	interface Order {
		id: string;
		status: string;
		subtotal: string;
		shippingCost: string;
		total: string;
		shippingAddress: any;
		paidAt?: string;
		shippedAt?: string;
		deliveredAt?: string;
		createdAt: string;
		updatedAt: string;
		customer: {
			id: string;
			name: string;
			email: string;
		};
		items: any[];
	}

	let stats: AdminStats = {
		totalCreators: 0,
		subscribedCreators: 0,
		totalProducts: 0,
		totalOrders: 0,
		totalRevenue: 0,
		recentRevenue: 0,
		ordersByStatus: [],
		productsByGender: [],
		creatorsBySubscription: []
	};

	let creators: Creator[] = [];
	let orders: Order[] = [];
	let products: any[] = [];
	let isLoading = true;
	let activeTab = 'overview';

	onMount(async () => {
		// Vérifier si l'utilisateur est connecté et est admin
		const response = await fetch('/api/auth/me');
		const data = await response.json();

		if (!data.success || data.user.email !== 'admin@kpsull.com') {
			goto('/auth');
			return;
		}

		// Charger toutes les données
		await Promise.all([
			loadStats(),
			loadCreators(),
			loadOrders(),
			loadProducts()
		]);
		
		isLoading = false;
	});

	async function loadStats() {
		try {
			const response = await fetch('/api/admin/stats');
			const data = await response.json();
			
			if (data.success) {
				stats = data.stats;
			}
		} catch (error) {
			console.error('Erreur lors du chargement des statistiques:', error);
		}
	}

	async function loadCreators() {
		try {
			const response = await fetch('/api/admin/creators');
			const data = await response.json();
			
			if (data.success) {
				creators = data.creators;
			}
		} catch (error) {
			console.error('Erreur lors du chargement des créateurs:', error);
		}
	}

	async function loadOrders() {
		try {
			const response = await fetch('/api/admin/orders');
			const data = await response.json();
			
			if (data.success) {
				orders = data.orders;
			}
		} catch (error) {
			console.error('Erreur lors du chargement des commandes:', error);
		}
	}

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

	async function logout() {
		try {
			await fetch('/api/auth/logout', { method: 'POST' });
			authStore.logout();
			goto('/');
		} catch (error) {
			console.error('Erreur lors de la déconnexion:', error);
		}
	}

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('fr-FR', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	function formatCurrency(amount: number) {
		return new Intl.NumberFormat('fr-FR', {
			style: 'currency',
			currency: 'EUR'
		}).format(amount);
	}

	function getStatusBadgeClass(status: string) {
		const statusClasses: Record<string, string> = {
			active: 'badge-success',
			inactive: 'badge-warning',
			suspended: 'badge-error',
			pending: 'badge-warning',
			paid: 'badge-success',
			processing: 'badge-info',
			shipped: 'badge-primary',
			delivered: 'badge-success',
			cancelled: 'badge-error',
			refunded: 'badge-warning'
		};
		return statusClasses[status] || 'badge-neutral';
	}
</script>

<svelte:head>
	<title>Tableau de bord Admin - KPSULL</title>
</svelte:head>

<div class="min-h-screen bg-base-100">
	{#if isLoading}
		<div class="flex items-center justify-center min-h-96">
			<div class="loading loading-spinner loading-lg"></div>
		</div>
	{:else}
		<!-- Header Admin -->
		<header class="bg-base-200 border-b border-base-300">
			<div class="max-w-7xl mx-auto px-6 py-4">
				<div class="flex items-center justify-between">
					<div>
						<h1 class="text-2xl font-bold text-base-content">Tableau de bord Admin</h1>
						<p class="text-base-content/70">Gestion de la plateforme KPSULL</p>
					</div>
					<button class="btn btn-outline btn-error" on:click={logout}>
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
						</svg>
						Déconnexion
					</button>
				</div>
			</div>
		</header>

		<main class="max-w-7xl mx-auto p-6">
			<!-- Navigation par onglets -->
			<div class="tabs tabs-boxed mb-8">
				<button 
					class="tab {activeTab === 'overview' ? 'tab-active' : ''}" 
					on:click={() => activeTab = 'overview'}
				>
					Vue d'ensemble
				</button>
				<button 
					class="tab {activeTab === 'creators' ? 'tab-active' : ''}" 
					on:click={() => activeTab = 'creators'}
				>
					Créateurs
				</button>
				<button 
					class="tab {activeTab === 'orders' ? 'tab-active' : ''}" 
					on:click={() => activeTab = 'orders'}
				>
					Commandes
				</button>
				<button 
					class="tab {activeTab === 'products' ? 'tab-active' : ''}" 
					on:click={() => activeTab = 'products'}
				>
					Produits
				</button>
			</div>

			<!-- Vue d'ensemble -->
			{#if activeTab === 'overview'}
				<!-- Statistiques principales -->
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					<div class="stat bg-base-200 rounded-lg">
						<div class="stat-figure text-primary">
							<svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
								<path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
							</svg>
						</div>
						<div class="stat-title">Créateurs</div>
						<div class="stat-value text-primary">{stats.totalCreators}</div>
						<div class="stat-desc">{stats.subscribedCreators} avec abonnement actif</div>
					</div>

					<div class="stat bg-base-200 rounded-lg">
						<div class="stat-figure text-secondary">
							<svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM8 15v-4h4v4H8z" clip-rule="evenodd"></path>
							</svg>
						</div>
						<div class="stat-title">Produits</div>
						<div class="stat-value text-secondary">{stats.totalProducts}</div>
						<div class="stat-desc">Produits disponibles</div>
					</div>

					<div class="stat bg-base-200 rounded-lg">
						<div class="stat-figure text-accent">
							<svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
							</svg>
						</div>
						<div class="stat-title">Commandes</div>
						<div class="stat-value text-accent">{stats.totalOrders}</div>
						<div class="stat-desc">Commandes payées</div>
					</div>

					<div class="stat bg-base-200 rounded-lg">
						<div class="stat-figure text-success">
							<svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
							</svg>
						</div>
						<div class="stat-title">Revenus</div>
						<div class="stat-value text-success">{formatCurrency(stats.totalRevenue)}</div>
						<div class="stat-desc">{formatCurrency(stats.recentRevenue)} ce mois</div>
					</div>
				</div>

				<!-- Graphiques et analyses -->
				<div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
					<!-- Commandes par statut -->
					<div class="card bg-base-200">
						<div class="card-body">
							<h2 class="card-title">Commandes par statut</h2>
							<div class="space-y-2">
								{#each stats.ordersByStatus as orderStat}
									<div class="flex justify-between items-center">
										<span class="capitalize">{orderStat.status}</span>
										<span class="badge badge-outline">{orderStat.count}</span>
									</div>
								{/each}
							</div>
						</div>
					</div>

					<!-- Produits par genre -->
					<div class="card bg-base-200">
						<div class="card-body">
							<h2 class="card-title">Produits par genre</h2>
							<div class="space-y-2">
								{#each stats.productsByGender as genderStat}
									<div class="flex justify-between items-center">
										<span class="capitalize">{genderStat.gender}</span>
										<span class="badge badge-outline">{genderStat.count}</span>
									</div>
								{/each}
							</div>
						</div>
					</div>

					<!-- Abonnements -->
					<div class="card bg-base-200">
						<div class="card-body">
							<h2 class="card-title">Abonnements</h2>
							<div class="space-y-2">
								{#each stats.creatorsBySubscription as subStat}
									<div class="flex justify-between items-center">
										<span class="capitalize">{subStat.subscriptionType}</span>
										<span class="badge badge-outline">{subStat.count}</span>
									</div>
								{/each}
							</div>
						</div>
					</div>
				</div>

				<!-- Créateurs récents -->
				<div class="card bg-base-200">
					<div class="card-body">
						<h2 class="card-title">Créateurs récents</h2>
						<div class="overflow-x-auto">
							<table class="table table-sm">
								<thead>
									<tr>
										<th>Nom</th>
										<th>Email</th>
										<th>Abonnement</th>
										<th>Statut</th>
										<th>Produits</th>
										<th>Revenus</th>
									</tr>
								</thead>
								<tbody>
									{#each creators.slice(0, 5) as creator}
										<tr>
											<td>
												<div class="flex items-center gap-3">
													<div class="avatar">
														<div class="w-8 h-8 rounded-full">
															<img src={creator.profileImage || 'https://via.placeholder.com/32'} alt={creator.name} />
														</div>
													</div>
													<span class="font-medium">{creator.name}</span>
												</div>
											</td>
											<td>{creator.email}</td>
											<td>
												<span class="badge badge-{creator.subscriptionType === 'yearly' ? 'success' : 'warning'}">
													{creator.subscriptionType}
												</span>
											</td>
											<td>
												<span class="badge {getStatusBadgeClass(creator.status)}">
													{creator.status}
												</span>
											</td>
											<td>{creator.stats.productCount}</td>
											<td>{formatCurrency(creator.stats.totalRevenue)}</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			{/if}

			<!-- Créateurs -->
			{#if activeTab === 'creators'}
				<div class="card bg-base-200">
					<div class="card-body">
						<h2 class="card-title">Gestion des créateurs</h2>
						<div class="overflow-x-auto">
							<table class="table">
								<thead>
									<tr>
										<th>Créateur</th>
										<th>Contact</th>
										<th>Abonnement</th>
										<th>Statut</th>
										<th>Statistiques</th>
										<th>Actions</th>
									</tr>
								</thead>
								<tbody>
									{#each creators as creator}
										<tr>
											<td>
												<div class="flex items-center gap-3">
													<div class="avatar">
														<div class="w-12 h-12 rounded-full">
															<img src={creator.profileImage || 'https://via.placeholder.com/48'} alt={creator.name} />
														</div>
													</div>
													<div>
														<div class="font-bold">{creator.name}</div>
														<div class="text-sm opacity-50">{creator.description}</div>
													</div>
												</div>
											</td>
											<td>
												<div class="text-sm">
													<div>{creator.email}</div>
													{#if creator.website}
														<div class="text-primary">{creator.website}</div>
													{/if}
												</div>
											</td>
											<td>
												<div class="text-sm">
													<span class="badge badge-{creator.subscriptionType === 'yearly' ? 'success' : 'warning'}">
														{creator.subscriptionType}
													</span>
													<div class="text-xs opacity-70">
														Expire: {formatDate(creator.subscriptionExpiresAt)}
													</div>
												</div>
											</td>
											<td>
												<span class="badge {getStatusBadgeClass(creator.status)}">
													{creator.status}
												</span>
											</td>
											<td>
												<div class="text-sm">
													<div>Produits: {creator.stats.productCount}</div>
													<div>Commandes: {creator.stats.orderCount}</div>
													<div>Revenus: {formatCurrency(creator.stats.totalRevenue)}</div>
												</div>
											</td>
											<td>
												<div class="flex gap-2">
													<button class="btn btn-sm btn-outline">Voir</button>
													<button class="btn btn-sm btn-outline">Modifier</button>
												</div>
											</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			{/if}

			<!-- Commandes -->
			{#if activeTab === 'orders'}
				<div class="card bg-base-200">
					<div class="card-body">
						<h2 class="card-title">Gestion des commandes</h2>
						<div class="overflow-x-auto">
							<table class="table">
								<thead>
									<tr>
										<th>Commande</th>
										<th>Client</th>
										<th>Montant</th>
										<th>Statut</th>
										<th>Date</th>
										<th>Actions</th>
									</tr>
								</thead>
								<tbody>
									{#each orders as order}
										<tr>
											<td>
												<div class="text-sm">
													<div class="font-bold">#{order.id.slice(-8)}</div>
													<div class="opacity-70">{order.items.length} article(s)</div>
												</div>
											</td>
											<td>
												<div class="text-sm">
													<div class="font-medium">{order.customer.name}</div>
													<div class="opacity-70">{order.customer.email}</div>
												</div>
											</td>
											<td>
												<div class="text-sm">
													<div class="font-bold">{formatCurrency(parseFloat(order.total))}</div>
													<div class="opacity-70">+ {formatCurrency(parseFloat(order.shippingCost))} frais</div>
												</div>
											</td>
											<td>
												<span class="badge {getStatusBadgeClass(order.status)}">
													{order.status}
												</span>
											</td>
											<td>
												<div class="text-sm">
													<div>{formatDate(order.createdAt)}</div>
													{#if order.paidAt}
														<div class="opacity-70">Payé: {formatDate(order.paidAt)}</div>
													{/if}
												</div>
											</td>
											<td>
												<div class="flex gap-2">
													<button class="btn btn-sm btn-outline">Voir</button>
													<button class="btn btn-sm btn-outline">Modifier</button>
												</div>
											</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			{/if}

			<!-- Produits -->
			{#if activeTab === 'products'}
				<div class="card bg-base-200">
					<div class="card-body">
						<h2 class="card-title">Gestion des produits</h2>
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
			{/if}
		</main>
	{/if}
</div>
