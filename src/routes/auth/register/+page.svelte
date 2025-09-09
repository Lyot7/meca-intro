<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	
	let mounted = false;

	onMount(() => {
		mounted = true;
	});
</script>

<svelte:head>
	<title>Inscription - KPSULL</title>
</svelte:head>

<!-- Container principal -->
<div class="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
		<div class="w-full max-w-6xl">
			<!-- Header avec animation -->
			<div class="text-center mb-12" class:animate-fade-in={mounted}>
				
				<h1 class="text-4xl font-bold text-gradient mb-4">
					Rejoignez KPSULL
				</h1>
				
			</div>

			<!-- Choix du type d'utilisateur -->
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
				<!-- Client -->
				<div class="register-card" class:animate-slide-up={mounted}>
					<div class="p-8 text-center">
						<!-- Icône client -->
						<div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6 shadow-lg">
							<svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
								<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
							</svg>
						</div>
						
						<h2 class="text-2xl font-bold mb-4">Je suis un client</h2>
						<p class="text-base-content/70 mb-6 leading-relaxed">
							Je veux découvrir et acheter des créations uniques de créateurs talentueux du monde entier
						</p>
						
						<!-- Avantages -->
						<div class="space-y-3 mb-8">
							<div class="flex items-center justify-center gap-3 text-sm text-base-content/70">
								<svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
								</svg>
								<span>Accès gratuit et immédiat</span>
							</div>
							<div class="flex items-center justify-center gap-3 text-sm text-base-content/70">
								<svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
								</svg>
								<span>Créations uniques et authentiques</span>
							</div>
							<div class="flex items-center justify-center gap-3 text-sm text-base-content/70">
								<svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
								</svg>
								<span>Support client dédié</span>
							</div>
						</div>
						
						<a href="/auth/client/register" class="btn-auth-primary w-full">
							<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
								<path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"></path>
							</svg>
							Créer un compte client
						</a>
						
						<div class="mt-4">
							<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
								<svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
								</svg>
								Gratuit
							</span>
						</div>
					</div>
				</div>

				<!-- Créateur -->
				<div class="register-card register-card-creator" class:animate-slide-up={mounted}>
					<div class="p-8 text-center">
						<!-- Icône créateur -->
						<div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-primary-light rounded-2xl mb-6 shadow-lg">
							<svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
								<path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path>
							</svg>
						</div>
						
						<h2 class="text-2xl font-bold mb-4">Je suis un créateur</h2>
						<p class="text-base-content/70 mb-6 leading-relaxed">
							Je veux vendre mes créations et gérer mon activité sur une marketplace professionnelle
						</p>
						
						<!-- Avantages -->
						<div class="space-y-3 mb-8">
							<div class="flex items-center justify-center gap-3 text-sm text-base-content/70">
								<svg class="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
								</svg>
								<span>Back office complet et intuitif</span>
							</div>
							<div class="flex items-center justify-center gap-3 text-sm text-base-content/70">
								<svg class="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
								</svg>
								<span>Gestion des commandes et paiements</span>
							</div>
							<div class="flex items-center justify-center gap-3 text-sm text-base-content/70">
								<svg class="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
								</svg>
								<span>Statistiques et analytics</span>
							</div>
						</div>
						
						<a href="/auth/creator/register" class="btn-auth-primary w-full">
							<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
								<path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path>
							</svg>
							Créer un compte créateur
						</a>
						
						<div class="mt-4 space-y-2">
							<div class="flex items-center justify-center gap-2 text-sm text-base-content/60">
								<span class="font-medium">100€/mois</span>
								<span>ou</span>
								<span class="font-medium text-primary">1000€/an</span>
								<span class="text-green-600 font-medium">(-200€)</span>
							</div>
							<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
								<svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"></path>
								</svg>
								Abonnement requis
							</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Retour et footer -->
			<div class="text-center space-y-6" class:animate-fade-in={mounted}>
				<a href="/auth" class="btn-auth-secondary inline-flex items-center">
					<svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd"></path>
					</svg>
					Retour à la connexion
				</a>
				
				<p class="text-xs text-base-content/50">
					En continuant, vous acceptez nos 
					<a href="/terms" class="link link-primary hover:underline">conditions d'utilisation</a>
					et notre 
					<a href="/privacy" class="link link-primary hover:underline">politique de confidentialité</a>
				</p>
			</div>
	</div>
</div>
