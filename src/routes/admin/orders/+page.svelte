<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/presentation/stores/authStore.js';

	// Types pour les données
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

	let orders: Order[] = [];
	let isLoading = true;

	onMount(async () => {
		// Vérifier si l'utilisateur est connecté et est admin
		const response = await fetch('/api/auth/me');
		const data = await response.json();

		if (!data.success || data.user.email !== 'admin@kpsull.com') {
			goto('/auth');
			return;
		}

		// Charger les commandes
		await loadOrders();
		isLoading = false;
	});

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
	<title>Gestion des Commandes - Admin KPSULL</title>
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
				<h1 class="text-3xl font-bold text-base-content">Gestion des Commandes</h1>
				<p class="text-base-content/70">Suivre et gérer toutes les commandes</p>
			</div>

			<!-- Statistiques rapides -->
			<div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
				<div class="stat bg-base-200 rounded-lg">
					<div class="stat-figure text-primary">
						<svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
						</svg>
					</div>
					<div class="stat-title">Total</div>
					<div class="stat-value text-primary">{orders.length}</div>
					<div class="stat-desc">Commandes</div>
				</div>

				<div class="stat bg-base-200 rounded-lg">
					<div class="stat-figure text-success">
						<svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
						</svg>
					</div>
					<div class="stat-title">Payées</div>
					<div class="stat-value text-success">{orders.filter(o => o.status === 'paid').length}</div>
					<div class="stat-desc">Commandes payées</div>
				</div>

				<div class="stat bg-base-200 rounded-lg">
					<div class="stat-figure text-warning">
						<svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
						</svg>
					</div>
					<div class="stat-title">En attente</div>
					<div class="stat-value text-warning">{orders.filter(o => o.status === 'pending').length}</div>
					<div class="stat-desc">En attente</div>
				</div>

				<div class="stat bg-base-200 rounded-lg">
					<div class="stat-figure text-info">
						<svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
						</svg>
					</div>
					<div class="stat-title">Revenus</div>
					<div class="stat-value text-info">{formatCurrency(orders.reduce((sum, o) => sum + parseFloat(o.total), 0))}</div>
					<div class="stat-desc">Chiffre d'affaires</div>
				</div>
			</div>

			<!-- Table des commandes -->
			<div class="card bg-base-200">
				<div class="card-body">
					<h2 class="card-title">Liste des commandes</h2>
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
		</main>
	{/if}
</div>
