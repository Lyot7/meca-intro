<script lang="ts">
	import '../app.css';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import SvelteLogo from '$lib/components/SvelteLogo.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { authStore } from '$lib/presentation/stores/authStore.js';
	
	// État de connexion depuis le store
	let isLoggedIn: boolean = false;
	let user: any = null;
	let cartCount: number = 0;
	
	// Fonction pour vérifier l'état de connexion
	async function checkAuth(): Promise<void> {
		try {
			const response = await fetch('/api/auth/me');
			const data = await response.json();
			
			if (data.success) {
				isLoggedIn = true;
				user = data.user;
				authStore.setUser(data.user);
			} else {
				isLoggedIn = false;
				user = null;
				authStore.setUser(null);
			}
		} catch (error) {
			console.error('Erreur lors de la vérification de l\'auth:', error);
			isLoggedIn = false;
			user = null;
			authStore.setUser(null);
		}
	}
	
	// Vérifier l'auth au chargement
	onMount(() => {
		checkAuth();
		
		// Écouter les changements du store d'authentification
		const unsubscribe = authStore.subscribe((authState) => {
			isLoggedIn = authState.isAuthenticated;
			user = authState.user;
		});
		
		// Nettoyer l'abonnement
		return unsubscribe;
	});
	
	async function handleLogout(): Promise<void> {
		try {
			await fetch('/api/auth/logout', { method: 'POST' });
		} catch (error) {
			console.error('Erreur lors de la déconnexion:', error);
		}
		
		// Utiliser la méthode logout du store
		authStore.logout();
		goto('/');
	}
	
	// Fonction pour déterminer le type d'utilisateur
	function getUserType(): 'admin' | 'creator' | 'client' {
		if (!user) return 'client';
		if (user.email === 'admin@kpsull.com') return 'admin';
		if (user.email === 'createur@kpsull.com') return 'creator';
		return 'client';
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
						{#if !isLoggedIn || (getUserType() !== 'admin' && !$page.url.pathname.startsWith('/creator/dashboard'))}
							<a href="/" class="px-4 py-2 rounded-xl text-sm font-medium uppercase tracking-wide transition-all duration-200 {isActiveLink('/') ? 'bg-primary-30 text-primary' : 'hover:bg-primary-30'}" style="color: {isActiveLink('/') ? 'var(--color-primary)' : 'var(--color-text-muted)'};">
								Accueil
							</a>
							<a href="/products/homme" class="px-4 py-2 rounded-xl text-sm font-medium uppercase tracking-wide transition-all duration-200 {isActiveLink('/products/homme') ? 'bg-primary-30 text-primary' : 'hover:bg-primary-30'}" style="color: {isActiveLink('/products/homme') ? 'var(--color-primary)' : 'var(--color-text-muted)'};">
								Homme
							</a>
							<a href="/products/femme" class="px-4 py-2 rounded-xl text-sm font-medium uppercase tracking-wide transition-all duration-200 {isActiveLink('/products/femme') ? 'bg-primary-30 text-primary' : 'hover:bg-primary-30'}" style="color: {isActiveLink('/products/femme') ? 'var(--color-primary)' : 'var(--color-text-muted)'};">
								Femme
							</a>
						{/if}
						
						<!-- Lien Administration (uniquement pour les admins) -->
						{#if isLoggedIn && getUserType() === 'admin'}
							<a href="/admin" class="px-4 py-2 rounded-xl text-sm font-medium uppercase tracking-wide transition-all duration-200 {isActiveLink('/admin') ? 'bg-primary-30 text-primary' : 'hover:bg-primary-30'}" style="color: {isActiveLink('/admin') ? 'var(--color-primary)' : 'var(--color-text-muted)'};">
								Administration
							</a>
						{/if}
					</nav>
				
					<!-- Actions droite -->
					<div class="flex items-center space-x-3">
						{#if isLoggedIn}
							<!-- Bouton déconnexion -->
							<button on:click={handleLogout} class="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg whitespace-nowrap" style="background-color: var(--color-primary); color: white;">
								Déconnexion
							</button>
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
						
						<!-- Icône Mon profil (uniquement si connecté) -->
						{#if isLoggedIn}
							<a href="/profile" class="w-10 h-10 header-button rounded-xl flex items-center justify-center shadow-lg" aria-label="Mon profil">
								<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" style="color: var(--color-text);">
									<path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
								</svg>
							</a>
						{/if}
						
						<!-- Panier (seulement pour les clients non connectés ou clients connectés) -->
						{#if !isLoggedIn || getUserType() === 'client'}
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
						
						<!-- Menu mobile (masqué pour admin et dashboard créateur) -->
						{#if !isLoggedIn || (getUserType() !== 'admin' && !$page.url.pathname.startsWith('/creator/dashboard'))}
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
									{#if isLoggedIn && getUserType() === 'creator'}
										<li><a href="/creator/dashboard" class="rounded-xl {isActiveLink('/creator/dashboard') ? 'bg-primary-30 text-primary' : ''}">Espace créateur</a></li>
									{/if}
									{#if isLoggedIn && getUserType() === 'admin'}
										<li><a href="/admin" class="rounded-xl {isActiveLink('/admin') ? 'bg-primary-30 text-primary' : ''}">Administration</a></li>
									{/if}
								</ul>
							</div>
						{/if}
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