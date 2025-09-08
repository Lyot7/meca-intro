<script lang="ts">
	export let creation: {
		id: string;
		name: string;
		price: number;
		image: string;
		creator: {
			name: string;
		};
	};
	export let href: string = '';
	export let creatorHref: string = '';

	function handleCreatorClick(event: MouseEvent) {
		if (creatorHref) {
			event.preventDefault();
			event.stopPropagation();
			window.location.href = creatorHref;
		}
	}

	function handleCreatorKeydown(event: KeyboardEvent) {
		if (creatorHref && (event.key === 'Enter' || event.key === ' ')) {
			event.preventDefault();
			event.stopPropagation();
			window.location.href = creatorHref;
		}
	}
</script>

{#if href}
	<a href={href} class="block">
		<div class="card-hover cursor-pointer group">
			<div class="relative overflow-hidden rounded-2xl mb-4">
				<img 
					src={creation.image} 
					alt={creation.name}
					class="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
				/>
				<div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
			</div>
			
			<div class="space-y-3 px-4 pb-4">
				<div>
					<h3 class="text-xl font-semibold text-base-content group-hover:text-primary transition-colors">
						{creation.name}
					</h3>
					<p class="text-base-content/60 text-sm">par <span class="hover:text-primary transition-colors cursor-pointer" role="button" tabindex="0" on:click={handleCreatorClick} on:keydown={handleCreatorKeydown}>{creation.creator.name}</span></p>
				</div>
				
				<div class="flex justify-between items-center">
					<span class="text-2xl font-bold text-primary">
						{creation.price.toFixed(2)}€
					</span>
				</div>
			</div>
		</div>
	</a>
{:else}
	<div class="card-hover cursor-pointer group">
		<div class="relative overflow-hidden rounded-2xl mb-4">
			<img 
				src={creation.image} 
				alt={creation.name}
				class="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
			/>
			<div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
		</div>
		
		<div class="space-y-3 px-4 pb-4">
			<div>
				<h3 class="text-xl font-semibold text-base-content group-hover:text-primary transition-colors">
					{creation.name}
				</h3>
				<p class="text-base-content/60 text-sm">par <span class="hover:text-primary transition-colors cursor-pointer" role="button" tabindex="0" on:click={handleCreatorClick} on:keydown={handleCreatorKeydown}>{creation.creator.name}</span></p>
			</div>
			
			<div class="flex justify-between items-center">
				<span class="text-2xl font-bold text-primary">
					{creation.price.toFixed(2)}€
				</span>
			</div>
		</div>
	</div>
{/if}