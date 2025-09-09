<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/presentation/stores/authStore.js';

	// Types pour les données
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

	let creators: Creator[] = [];
	let isLoading = true;

	onMount(async () => {
		// Vérifier si l'utilisateur est connecté et est admin
		const response = await fetch('/api/auth/me');
		const data = await response.json();

		if (!data.success || data.user.email !== 'admin@kpsull.com') {
			goto('/auth');
			return;
		}

		// Charger les créateurs
		await loadCreators();
		isLoading = false;
	});

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
			pending: 'badge-warning'
		};
		return statusClasses[status] || 'badge-neutral';
	}
</script>

<svelte:head>
	<title>Gestion des Créateurs - Admin KPSULL</title>
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
				<h1 class="text-3xl font-bold text-base-content">Gestion des Créateurs</h1>
				<p class="text-base-content/70">Gérer les créateurs et leurs abonnements</p>
			</div>

			<!-- Statistiques rapides -->
			<div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
				<div class="stat bg-base-200 rounded-lg">
					<div class="stat-figure text-primary">
						<svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
							<path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
						</svg>
					</div>
					<div class="stat-title">Total</div>
					<div class="stat-value text-primary">{creators.length}</div>
					<div class="stat-desc">Créateurs inscrits</div>
				</div>

				<div class="stat bg-base-200 rounded-lg">
					<div class="stat-figure text-success">
						<svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
						</svg>
					</div>
					<div class="stat-title">Actifs</div>
					<div class="stat-value text-success">{creators.filter(c => c.status === 'active').length}</div>
					<div class="stat-desc">Créateurs actifs</div>
				</div>

				<div class="stat bg-base-200 rounded-lg">
					<div class="stat-figure text-warning">
						<svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path>
						</svg>
					</div>
					<div class="stat-title">Abonnés</div>
					<div class="stat-value text-warning">{creators.filter(c => c.subscriptionActive).length}</div>
					<div class="stat-desc">Avec abonnement</div>
				</div>

				<div class="stat bg-base-200 rounded-lg">
					<div class="stat-figure text-info">
						<svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
						</svg>
					</div>
					<div class="stat-title">Revenus</div>
					<div class="stat-value text-info">{formatCurrency(creators.reduce((sum, c) => sum + c.stats.totalRevenue, 0))}</div>
					<div class="stat-desc">Revenus totaux</div>
				</div>
			</div>

			<!-- Table des créateurs -->
			<div class="card bg-base-200">
				<div class="card-body">
					<h2 class="card-title">Liste des créateurs</h2>
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
		</main>
	{/if}
</div>
