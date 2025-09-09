<script lang="ts">
	import { onMount } from 'svelte';
	import { cartStore } from '$lib/presentation/stores/cartStore.js';
	
	let cartItems: any[] = [];
	let isLoading = true;
	let error = '';

	onMount(async () => {
		try {
			// Pour l'instant, on utilise des données mockées
			// TODO: Implémenter un vrai store de panier avec persistance
			cartItems = [
				{
					id: '8146efca-ac96-49e7-a143-20af4477619b',
					name: 'Robe Élégante',
					price: 89.99,
					image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&h=200&fit=crop',
					quantity: 1,
					creator: { name: 'créateur' }
				},
				{
					id: 'e5deb883-e16d-4423-b6f8-e7a303fcc4b4',
					name: 'Veste Vintage',
					price: 125.50,
					image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=200&h=200&fit=crop',
					quantity: 2,
					creator: { name: 'créateur' }
				}
			];
		} catch (err) {
			error = 'Erreur lors du chargement du panier';
			console.error('Erreur:', err);
		} finally {
			isLoading = false;
		}
	});

	$: total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

	function updateQuantity(id: string, newQuantity: number) {
		if (newQuantity <= 0) {
			removeItem(id);
			return;
		}
		cartItems = cartItems.map(item => 
			item.id === id ? { ...item, quantity: newQuantity } : item
		);
	}

	function removeItem(id: string) {
		cartItems = cartItems.filter(item => item.id !== id);
	}

	function clearCart() {
		cartItems = [];
	}

	function proceedToCheckout() {
		if (cartItems.length === 0) {
			alert('Votre panier est vide');
			return;
		}
		// TODO: Rediriger vers la page de checkout
		alert('Redirection vers le checkout...');
	}
</script>

<svelte:head>
	<title>Panier - KPSULL</title>
	<meta name="description" content="Votre panier d'achat" />
</svelte:head>

<div class="max-w-6xl mx-auto px-4 py-8">
	<h1 class="text-3xl font-bold mb-8">Mon Panier</h1>

	{#if isLoading}
		<div class="flex items-center justify-center py-12">
			<div class="loading loading-spinner loading-lg"></div>
		</div>
	{:else if error}
		<div class="alert alert-error">
			<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
				<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
			</svg>
			<span>{error}</span>
		</div>
	{:else if cartItems.length === 0}
		<div class="text-center py-12">
			<div class="text-6xl mb-4">🛒</div>
			<h2 class="text-2xl font-bold mb-4">Votre panier est vide</h2>
			<p class="text-base-content/70 mb-6">Découvrez nos créations et ajoutez-les à votre panier</p>
			<a href="/" class="btn btn-primary">Découvrir nos créations</a>
		</div>
	{:else}
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
			<!-- Articles du panier -->
			<div class="lg:col-span-2 space-y-4">
				{#each cartItems as item}
					<div class="card bg-base-100 shadow-md">
						<div class="card-body">
							<div class="flex items-center gap-4">
								<!-- Image -->
								<div class="avatar">
									<div class="w-20 rounded-lg">
										<img src={item.image} alt={item.name} />
									</div>
								</div>

								<!-- Informations produit -->
								<div class="flex-1">
									<h3 class="font-semibold text-lg">{item.name}</h3>
									<p class="text-sm text-base-content/70">Par {item.creator.name}</p>
									<p class="text-lg font-bold text-primary">{item.price.toFixed(2)}€</p>
								</div>

								<!-- Quantité -->
								<div class="flex items-center gap-2">
									<button 
										class="btn btn-sm btn-circle btn-outline"
										on:click={() => updateQuantity(item.id, item.quantity - 1)}
									>
										-
									</button>
									<span class="w-8 text-center">{item.quantity}</span>
									<button 
										class="btn btn-sm btn-circle btn-outline"
										on:click={() => updateQuantity(item.id, item.quantity + 1)}
									>
										+
									</button>
								</div>

								<!-- Actions -->
								<div class="flex flex-col gap-2">
									<button 
										class="btn btn-sm btn-error btn-outline"
										on:click={() => removeItem(item.id)}
									>
										<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
											<path fill-rule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clip-rule="evenodd"></path>
											<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
										</svg>
									</button>
								</div>
							</div>
						</div>
					</div>
				{/each}

				<!-- Actions du panier -->
				<div class="flex justify-between items-center pt-4">
					<button 
						class="btn btn-outline btn-error"
						on:click={clearCart}
					>
						<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
											<path fill-rule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clip-rule="evenodd"></path>
											<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
										</svg>
						Vider le panier
					</button>
					<a href="/" class="btn btn-outline">Continuer mes achats</a>
				</div>
			</div>

			<!-- Résumé de commande -->
			<div class="lg:col-span-1">
				<div class="card bg-base-100 shadow-md sticky top-4">
					<div class="card-body">
						<h2 class="card-title">Résumé de commande</h2>
						
						<div class="space-y-3">
							<div class="flex justify-between">
								<span>Sous-total ({cartItems.length} article{cartItems.length > 1 ? 's' : ''})</span>
								<span class="font-semibold">{total.toFixed(2)}€</span>
							</div>
							<div class="flex justify-between">
								<span>Livraison</span>
								<span class="font-semibold">Gratuite</span>
							</div>
							<div class="divider"></div>
							<div class="flex justify-between text-lg font-bold">
								<span>Total</span>
								<span class="text-primary">{total.toFixed(2)}€</span>
							</div>
						</div>

						<div class="card-actions justify-stretch mt-6">
							<button 
								class="btn btn-primary btn-lg w-full"
								on:click={proceedToCheckout}
							>
								<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
								</svg>
								Commander
							</button>
						</div>

						<div class="text-center mt-4">
							<p class="text-sm text-base-content/70">
								<i class="fas fa-shield-alt mr-1"></i>
								Paiement sécurisé
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>