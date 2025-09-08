<script lang="ts">
	import { goto } from '$app/navigation';
	
	// Données mockées pour l'exemple
	let stats = {
		totalSales: 1250,
		totalOrders: 23,
		totalProducts: 8,
		monthlyRevenue: 450
	};

	let recentOrders = [
		{ id: '#001', product: 'T-shirt Vintage', customer: 'Marie D.', amount: 35, status: 'En cours' },
		{ id: '#002', product: 'Sac en Cuir', customer: 'Pierre L.', amount: 89, status: 'Expédié' },
		{ id: '#003', product: 'Bijou Artisanal', customer: 'Sophie M.', amount: 25, status: 'Livré' }
	];

	let recentProducts = [
		{ id: 1, name: 'T-shirt Vintage', price: 35, stock: 12, views: 156 },
		{ id: 2, name: 'Sac en Cuir', price: 89, stock: 3, views: 89 },
		{ id: 3, name: 'Bijou Artisanal', price: 25, stock: 8, views: 234 }
	];
</script>

<svelte:head>
	<title>Espace Créateur - KPSULL</title>
</svelte:head>

<div class="min-h-screen bg-base-200">
	<!-- Header -->
	<div class="bg-base-100 shadow-sm border-b border-base-300">
		<div class="max-w-6xl mx-auto px-4 py-6">
			<div class="flex items-center justify-between">
				<div>
					<h1 class="text-4xl font-bold text-gradient">Espace Créateur</h1>
					<p class="text-base-content/70 mt-1">Bienvenue dans votre back office</p>
				</div>
				<div class="flex items-center space-x-4">
					<a href="/creator/products" class="btn btn-outline-modern">
						<svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
							<path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"></path>
						</svg>
						Mes créations
					</a>
					<a href="/creator/orders" class="btn btn-outline-modern">
						<svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
							<path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
						</svg>
						Commandes
					</a>
					<button class="btn btn-outline-modern" on:click={() => goto('/')}>
						<svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
							<path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
						</svg>
						Retour au site
					</button>
				</div>
			</div>
		</div>
	</div>

	<div class="max-w-6xl mx-auto px-4 py-8">
		<!-- Statistiques -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
			<div class="card bg-base-100 shadow-xl">
				<div class="card-body p-6">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm text-base-content/70">Chiffre d'affaires</p>
							<p class="text-2xl font-bold text-primary">{stats.totalSales}€</p>
						</div>
						<div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
							<svg class="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
								<path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"></path>
								<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd"></path>
							</svg>
						</div>
					</div>
				</div>
			</div>

			<div class="card bg-base-100 shadow-xl">
				<div class="card-body p-6">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm text-base-content/70">Commandes</p>
							<p class="text-2xl font-bold text-primary">{stats.totalOrders}</p>
						</div>
						<div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
							<svg class="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
								<path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
							</svg>
						</div>
					</div>
				</div>
			</div>

			<div class="card bg-base-100 shadow-xl">
				<div class="card-body p-6">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm text-base-content/70">Produits</p>
							<p class="text-2xl font-bold text-primary">{stats.totalProducts}</p>
						</div>
						<div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
							<svg class="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
								<path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"></path>
							</svg>
						</div>
					</div>
				</div>
			</div>

			<div class="card bg-base-100 shadow-xl">
				<div class="card-body p-6">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm text-base-content/70">Ce mois</p>
							<p class="text-2xl font-bold text-primary">{stats.monthlyRevenue}€</p>
						</div>
						<div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
							<svg class="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path>
							</svg>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
			<!-- Commandes récentes -->
			<div class="card bg-base-100 shadow-xl">
				<div class="card-body p-6">
					<div class="flex items-center justify-between mb-4">
						<h3 class="text-xl font-bold">Commandes récentes</h3>
						<a href="/creator/orders" class="link link-primary text-sm">Voir tout</a>
					</div>
					<div class="space-y-4">
						{#each recentOrders as order}
							<div class="flex items-center justify-between p-4 bg-base-200 rounded-lg">
								<div>
									<p class="font-medium">{order.product}</p>
									<p class="text-sm text-base-content/70">{order.customer} • {order.id}</p>
								</div>
								<div class="text-right">
									<p class="font-bold text-primary">{order.amount}€</p>
									<span class="badge badge-sm {order.status === 'Livré' ? 'badge-success' : order.status === 'Expédié' ? 'badge-warning' : 'badge-info'}">{order.status}</span>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>

			<!-- Produits récents -->
			<div class="card bg-base-100 shadow-xl">
				<div class="card-body p-6">
					<div class="flex items-center justify-between mb-4">
						<h3 class="text-xl font-bold">Mes créations</h3>
						<a href="/creator/products" class="link link-primary text-sm">Voir tout</a>
					</div>
					<div class="space-y-4">
						{#each recentProducts as product}
							<div class="flex items-center justify-between p-4 bg-base-200 rounded-lg">
								<div>
									<p class="font-medium">{product.name}</p>
									<p class="text-sm text-base-content/70">{product.views} vues • Stock: {product.stock}</p>
								</div>
								<div class="text-right">
									<p class="font-bold text-primary">{product.price}€</p>
									<span class="badge badge-sm {product.stock > 5 ? 'badge-success' : product.stock > 0 ? 'badge-warning' : 'badge-error'}">
										{product.stock > 5 ? 'En stock' : product.stock > 0 ? 'Stock faible' : 'Rupture'}
									</span>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>

		<!-- Actions rapides -->
		<div class="mt-8">
			<div class="card bg-base-100 shadow-xl">
				<div class="card-body p-6">
					<h3 class="text-xl font-bold mb-4">Actions rapides</h3>
					<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
						<a href="/creator/products/new" class="btn btn-modern">
							<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"></path>
							</svg>
							Nouvelle création
						</a>
						<a href="/creator/profile" class="btn btn-outline-modern">
							<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
							</svg>
							Mon profil
						</a>
						<a href="/creator/subscription" class="btn btn-outline-modern">
							<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
								<path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"></path>
							</svg>
							Mon abonnement
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
