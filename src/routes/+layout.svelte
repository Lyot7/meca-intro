<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import Header from '$lib/components/Header.svelte';
	
	// Fonction pour vérifier si on est sur une page d'authentification
	function isAuthPage(): boolean {
		return $page.url.pathname.startsWith('/auth');
	}
</script>

<div class="page-background min-h-screen flex flex-col">
	<!-- Header -->
	<Header />

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