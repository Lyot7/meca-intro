<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { authStore } from '$lib/presentation/stores/authStore.js';
	import { goto } from '$app/navigation';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import SvelteLogo from '$lib/components/SvelteLogo.svelte';
	
	// État de connexion depuis le store
	let isLoggedIn: boolean = false;
	let user: any = null;
	let cartCount: number = 0;
	
	// État du header pour le scroll
	let isHeaderVisible: boolean = true;
	let lastScrollY: number = 0;
	
	// État des menus
	let isProfileMenuOpen: boolean = false;
	
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
	
	// Fonction pour déterminer le type d'utilisateur
	function getUserType(): 'creator' | 'client' {
		if (!user) return 'client';
		return user.role || 'client';
	}
	
	// Vérifier l'auth au chargement
	onMount(() => {
		checkAuth();
		
		// Écouter les changements du store d'authentification
		const unsubscribe = authStore.subscribe((authState) => {
			isLoggedIn = authState.isAuthenticated;
			user = authState.user;
		});
		
		// Ajouter l'écouteur de scroll
		window.addEventListener('scroll', handleScroll, { passive: true });
		
		// Nettoyer les abonnements
		return () => {
			unsubscribe();
			window.removeEventListener('scroll', handleScroll);
		};
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
	
	// Fonction pour gérer le scroll
	function handleScroll(): void {
		const currentScrollY = window.scrollY;
		const scrollThreshold = 100; // Seuil pour déclencher l'animation
		
		// Si on scroll vers le bas et qu'on dépasse le seuil
		if (currentScrollY > lastScrollY && currentScrollY > scrollThreshold) {
			isHeaderVisible = false;
		}
		// Si on scroll vers le haut
		else if (currentScrollY < lastScrollY) {
			isHeaderVisible = true;
		}
		
		lastScrollY = currentScrollY;
	}
	
	// Fonctions pour gérer les menus
	function toggleProfileMenu(): void {
		isProfileMenuOpen = !isProfileMenuOpen;
	}
	
	function closeMenus(): void {
		isProfileMenuOpen = false;
	}
</script>

<header class="w-full sticky top-0 z-50 transition-transform duration-300 ease-in-out" class:translate-y-[-100%]={!isHeaderVisible}>
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

				<!-- Actions droite -->
				<div class="flex items-center space-x-3">
					{#if !isLoggedIn}
						<!-- Se connecter (bouton principal orange) -->
						<a href="/auth" class="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg whitespace-nowrap" style="background-color: var(--color-primary); color: white;">
							Se connecter
						</a>
					{/if}
					
					<!-- Toggle thème -->
					<div class="w-10 h-10 header-button rounded-xl flex items-center justify-center shadow-lg">
						<ThemeToggle />
					</div>
					
					<!-- Menu profil (uniquement si connecté) -->
					{#if isLoggedIn}
						<div class="relative">
							<button on:click={toggleProfileMenu} class="w-10 h-10 header-button rounded-xl flex items-center justify-center shadow-lg" aria-label="Menu profil">
								<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" style="color: var(--color-text);">
									<path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
								</svg>
							</button>
							
							<!-- Menu profil en position absolue -->
							{#if isProfileMenuOpen}
								<div class="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-200 py-2 z-50">
									<a href="/profile" class="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
										<svg class="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
											<path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
										</svg>
										Modifier le compte
									</a>
									<button on:click={handleLogout} class="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
										<svg class="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
											<path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd"></path>
										</svg>
										Se déconnecter
									</button>
								</div>
							{/if}
						</div>
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
				</div>
			</div>
		</div>
	</div>
</header>

<!-- Overlay pour fermer les menus -->
{#if isProfileMenuOpen}
	<div 
		class="fixed inset-0 z-40" 
		role="button" 
		tabindex="0"
		on:click={closeMenus}
		on:keydown={(e) => e.key === 'Escape' && closeMenus()}
		aria-label="Fermer les menus"
	></div>
{/if}

<style>
	.header-glass {
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.2);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
	}
	
	.header-button {
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.2);
		transition: all 0.3s ease;
	}
	
	.header-button:hover {
		background: rgba(255, 255, 255, 0.2);
		transform: translateY(-2px);
	}
</style>