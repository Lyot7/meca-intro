<script lang="ts">
	import '../app.css';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import SvelteLogo from '$lib/components/SvelteLogo.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	
	// État de connexion (mocké pour l'exemple)
	let isLoggedIn: boolean = false;
	let userType: 'client' | 'creator' = 'client';
	let user: { name: string; email: string; type: string } | null = null;
	let cartCount: number = 0;
	
	// Fonction pour simuler la connexion (à remplacer par la vraie logique)
	function checkAuth(): void {
		// Ici on vérifierait le token/session
		// Pour l'exemple, on simule un créateur connecté
		const mockCreator: { name: string; email: string; type: string } = {
			name: 'Marie Dubois',
			email: 'marie@example.com',
			type: 'creator'
		};
		
		// Décommentez la ligne suivante pour simuler un créateur connecté
		// isLoggedIn = true; userType = 'creator'; user = mockCreator;
	}
	
	// Vérifier l'auth au chargement
	checkAuth();
	
	function handleLogout(): void {
		isLoggedIn = false;
		userType = 'client';
		user = null;
		goto('/');
	}

	// Fonction pour déterminer si un lien est actif
	function isActiveLink(path: string): boolean {
		return $page.url.pathname === path;
	}
	
	// Fonction pour vérifier si on est sur une page d'authentification
	function isAuthPage(): boolean {
		return $page.url.pathname.startsWith('/auth');
	}
</script>

<div class="page-background min-h-screen flex flex-col">
	<!-- Header -->
	<header class="w-full sticky top-0 z-50">
		<div class="container mx-auto px-6 py-4">
			<div class="header-glass rounded-2xl px-8 py-4">
				<div class="flex items-center justify-between">
				<!-- Logo -->
					<div class="flex items-center space-x-3">
						<div class="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
							<SvelteLogo size="w-6 h-6" />
						</div>
							<a href="/" class="text-2xl font-bold font-asimovian" style="color: var(--color-text);">
								KPSULL
							</a>
					</div>

					<!-- Navigation centrale -->
					<nav class="hidden md:flex items-center space-x-1">
						<a href="/" class="px-4 py-2 rounded-xl text-sm font-medium uppercase tracking-wide transition-all duration-200 {isActiveLink('/') ? 'bg-primary-30 text-primary' : 'hover:bg-primary-30'}" style="color: {isActiveLink('/') ? 'var(--color-primary)' : 'var(--color-text-muted)'};">
							Accueil
						</a>
						<a href="/products/homme" class="px-4 py-2 rounded-xl text-sm font-medium uppercase tracking-wide transition-all duration-200 {isActiveLink('/products/homme') ? 'bg-primary-30 text-primary' : 'hover:bg-primary-30'}" style="color: {isActiveLink('/products/homme') ? 'var(--color-primary)' : 'var(--color-text-muted)'};">
							Homme
						</a>
						<a href="/products/femme" class="px-4 py-2 rounded-xl text-sm font-medium uppercase tracking-wide transition-all duration-200 {isActiveLink('/products/femme') ? 'bg-primary-30 text-primary' : 'hover:bg-primary-30'}" style="color: {isActiveLink('/products/femme') ? 'var(--color-primary)' : 'var(--color-text-muted)'};">
							Femme
						</a>
					</nav>
				
					<!-- Actions droite -->
					<div class="flex items-center space-x-3">
						{#if isLoggedIn && userType === 'creator'}
							<!-- Espace créateur connecté -->
							<a href="/creator/dashboard" class="hidden sm:inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg whitespace-nowrap" style="background-color: var(--color-primary); color: white;">
								<svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
									<path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path>
								</svg>
								Espace créateur
							</a>
						{/if}
						
						
						{#if isLoggedIn}
							<!-- Menu utilisateur connecté -->
							<div class="dropdown dropdown-end">
								<div tabindex="0" role="button" class="w-10 h-10 header-button rounded-xl flex items-center justify-center shadow-lg" aria-label="Menu utilisateur">
									<div class="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-medium">
										{user?.name?.charAt(0) || 'U'}
									</div>
								</div>
								<ul class="menu menu-sm dropdown-content header-dropdown rounded-2xl z-[1] mt-3 w-52 p-2">
									<li class="menu-title">
										<span class="text-xs uppercase tracking-wide" style="color: var(--color-text-muted);">{user?.name || 'Utilisateur'}</span>
									</li>
									<li><a href="/profile" class="rounded-xl">Mon profil</a></li>
									{#if userType === 'creator'}
										<li><a href="/creator/dashboard" class="rounded-xl">Espace créateur</a></li>
										<li><a href="/creator/products" class="rounded-xl">Mes créations</a></li>
										<li><a href="/creator/orders" class="rounded-xl">Commandes</a></li>
									{:else}
										<li><a href="/orders" class="rounded-xl">Mes commandes</a></li>
									{/if}
									<li><hr class="my-2 border-base-content/10"></li>
									<li><button on:click={handleLogout} class="rounded-xl text-error">Se déconnecter</button></li>
								</ul>
							</div>
						{:else}
							<!-- Se connecter (bouton principal orange) -->
							<a href="/auth" class="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg whitespace-nowrap" style="background-color: var(--color-primary); color: white;">
								Se connecter
							</a>
						{/if}
						
						<!-- Toggle thème -->
						<div class="w-10 h-10 header-button rounded-xl flex items-center justify-center shadow-lg">
							<ThemeToggle />
						</div>
						
						<!-- Panier (seulement pour les clients) -->
						{#if !isLoggedIn || userType === 'client'}
							<div class="dropdown dropdown-end">
								<div tabindex="0" role="button" class="w-10 h-10 header-button rounded-xl flex items-center justify-center shadow-lg" aria-label="Panier">
									<div class="relative">
										<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" style="color: var(--color-text);">
											<path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
										</svg>
										{#if cartCount > 0}
											<span class="absolute -top-2 -right-2 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center font-medium">{cartCount}</span>
										{/if}
									</div>
								</div>
							</div>
						{/if}
						
						<!-- Menu mobile -->
						<div class="dropdown dropdown-end md:hidden">
							<div tabindex="0" role="button" class="w-10 h-10 header-button rounded-xl flex items-center justify-center shadow-lg" aria-label="Menu mobile">
								<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" style="color: var(--color-text);">
									<path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path>
								</svg>
							</div>
							<ul class="menu menu-sm dropdown-content header-dropdown rounded-2xl z-[1] mt-3 w-52 p-2">
								<li><a href="/" class="rounded-xl {isActiveLink('/') ? 'bg-primary-30 text-primary' : ''}">Accueil</a></li>
								<li><a href="/products/homme" class="rounded-xl {isActiveLink('/products/homme') ? 'bg-primary-30 text-primary' : ''}">Homme</a></li>
								<li><a href="/products/femme" class="rounded-xl {isActiveLink('/products/femme') ? 'bg-primary-30 text-primary' : ''}">Femme</a></li>
								{#if isLoggedIn && userType === 'creator'}
									<li><a href="/creator/dashboard" class="rounded-xl {isActiveLink('/creator/dashboard') ? 'bg-primary-30 text-primary' : ''}">Espace créateur</a></li>
								{/if}
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	</header>

	<!-- Main content -->
	<main class="flex-1 {isAuthPage() ? 'auth-main' : 'main-content'}">
		<slot />
	</main>

	<!-- Footer -->
	<footer class="footer footer-center p-4 bg-base-200 text-base-content">
		<aside>
			<p>© 2024 KPSULL - Boutique de créateurs</p>
		</aside>
	</footer>
</div>