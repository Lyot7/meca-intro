<script lang="ts">
	// Données de test pour le panier
	let cartItems = [
		{
			id: '1',
			name: 'Robe Élégante',
			price: 89.99,
			image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&h=200&fit=crop',
			quantity: 1,
			creator: { name: 'Marie Dubois' }
		},
		{
			id: '2',
			name: 'Veste Vintage',
			price: 125.50,
			image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=200&h=200&fit=crop',
			quantity: 2,
			creator: { name: 'Pierre Martin' }
		}
	];

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
</script>

<svelte:head>
	<title>Panier - KPSULL</title>
</svelte:head>

<div class="max-w-6xl mx-auto px-4">
	<div class="text-center mb-12">
		<h1 class="text-4xl font-bold mb-4">Mon Panier</h1>
		{#if cartItems.length > 0}
			<button class="btn btn-outline btn-error" on:click={clearCart}>
				Vider le panier
			</button>
		{/if}
	</div>

	{#if cartItems.length === 0}
		<div class="text-center py-16">
			<svg class="w-24 h-24 mx-auto text-base-content/30 mb-4" fill="currentColor" viewBox="0 0 20 20">
				<path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
			</svg>
			<h2 class="text-2xl font-bold mb-4">Votre panier est vide</h2>
			<p class="text-base-content/70 mb-6">Découvrez nos créations et ajoutez vos favoris</p>
			<a href="/" class="btn btn-primary">Continuer mes achats</a>
		</div>
	{:else}
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<!-- Liste des articles -->
			<div class="lg:col-span-2 space-y-4">
				{#each cartItems as item}
					<div class="card bg-base-100 shadow-sm border">
						<div class="card-body">
							<div class="flex items-center gap-4">
								<img 
									src={item.image} 
									alt={item.name}
									class="w-20 h-20 object-cover rounded-lg"
								/>
								
								<div class="flex-1">
									<h3 class="font-semibold text-lg">{item.name}</h3>
									<p class="text-sm text-base-content/70">par {item.creator.name}</p>
									<p class="text-lg font-bold text-primary">
										{item.price.toFixed(2)}€
									</p>
								</div>

								<div class="flex items-center gap-2">
								<button 
									class="btn btn-sm btn-circle btn-outline"
									on:click={() => updateQuantity(item.id, item.quantity - 1)}
									aria-label="Diminuer la quantité"
								>
									-
								</button>
									<span class="w-8 text-center">{item.quantity}</span>
									<button 
										class="btn btn-sm btn-circle btn-outline"
										on:click={() => updateQuantity(item.id, item.quantity + 1)}
										aria-label="Augmenter la quantité"
									>
										+
									</button>
								</div>

								<button 
									class="btn btn-sm btn-circle btn-error btn-outline"
									on:click={() => removeItem(item.id)}
									aria-label="Supprimer l'article"
								>
									<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
									</svg>
								</button>
							</div>
						</div>
					</div>
				{/each}
			</div>

			<!-- Résumé de commande -->
			<div class="lg:col-span-1">
				<div class="card bg-base-100 shadow-xl sticky top-4">
					<div class="card-body">
						<h2 class="card-title">Résumé de commande</h2>
						
						<div class="space-y-2">
							<div class="flex justify-between">
								<span>Sous-total</span>
								<span>{total.toFixed(2)}€</span>
							</div>
							<div class="flex justify-between">
								<span>Livraison</span>
								<span>Gratuite</span>
							</div>
							<div class="divider"></div>
							<div class="flex justify-between text-lg font-bold">
								<span>Total</span>
								<span>{total.toFixed(2)}€</span>
							</div>
						</div>

						<div class="card-actions mt-6">
							<button class="btn btn-primary w-full">
								Passer la commande
							</button>
						</div>

						<div class="text-center mt-4">
							<a href="/" class="link link-primary">
								Continuer mes achats
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
