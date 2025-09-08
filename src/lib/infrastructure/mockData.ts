/**
 * Mock Data - Infrastructure Layer
 * Données de test pour les produits
 */

export const mockProducts = [
	{
		id: 'product_001',
		name: 'Robe Élégante',
		description: 'Une robe élégante en soie naturelle, parfaite pour les occasions spéciales. Coupe ajustée et finitions soignées.',
		creatorId: 'creator_001',
		gender: 'female',
		status: 'available',
		variants: [
			{
				id: 'variant_001',
				size: 'S',
				color: 'Noir',
				stock: 5,
				price: '89.99',
				images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop']
			},
			{
				id: 'variant_002',
				size: 'M',
				color: 'Noir',
				stock: 8,
				price: '89.99',
				images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop']
			},
			{
				id: 'variant_003',
				size: 'L',
				color: 'Rouge',
				stock: 3,
				price: '95.99',
				images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop']
			}
		],
		createdAt: new Date(),
		updatedAt: new Date(),
		tags: ['robe', 'élégant', 'soie', 'occasion'],
		getFirstImage() {
			return this.variants[0]?.images[0] || 'https://via.placeholder.com/400';
		},
		getMinPrice() {
			return Math.min(...this.variants.map(v => parseFloat(v.price)));
		},
		getMaxPrice() {
			return Math.max(...this.variants.map(v => parseFloat(v.price)));
		}
	},
	{
		id: 'product_002',
		name: 'Veste Vintage',
		description: 'Veste vintage en cuir véritable, style rétro des années 80. Parfaite pour un look décontracté et stylé.',
		creatorId: 'creator_001',
		gender: 'unisex',
		status: 'available',
		variants: [
			{
				id: 'variant_004',
				size: 'M',
				color: 'Brun',
				stock: 4,
				price: '125.50',
				images: ['https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop']
			},
			{
				id: 'variant_005',
				size: 'L',
				color: 'Noir',
				stock: 2,
				price: '125.50',
				images: ['https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop']
			}
		],
		createdAt: new Date(),
		updatedAt: new Date(),
		tags: ['veste', 'vintage', 'cuir', 'rétro'],
		getFirstImage() {
			return this.variants[0]?.images[0] || 'https://via.placeholder.com/400';
		},
		getMinPrice() {
			return Math.min(...this.variants.map(v => parseFloat(v.price)));
		},
		getMaxPrice() {
			return Math.max(...this.variants.map(v => parseFloat(v.price)));
		}
	},
	{
		id: 'product_003',
		name: 'Pantalon Moderne',
		description: 'Pantalon moderne en coton bio, coupe droite et confortable. Idéal pour le quotidien et le bureau.',
		creatorId: 'creator_001',
		gender: 'male',
		status: 'available',
		variants: [
			{
				id: 'variant_006',
				size: '32',
				color: 'Bleu',
				stock: 6,
				price: '75.00',
				images: ['https://images.unsplash.com/photo-1506629905607-1b2b2b2b2b2b?w=400&h=400&fit=crop']
			},
			{
				id: 'variant_007',
				size: '34',
				color: 'Gris',
				stock: 4,
				price: '75.00',
				images: ['https://images.unsplash.com/photo-1506629905607-1b2b2b2b2b2b?w=400&h=400&fit=crop']
			}
		],
		createdAt: new Date(),
		updatedAt: new Date(),
		tags: ['pantalon', 'moderne', 'coton', 'bio'],
		getFirstImage() {
			return this.variants[0]?.images[0] || 'https://via.placeholder.com/400';
		},
		getMinPrice() {
			return Math.min(...this.variants.map(v => parseFloat(v.price)));
		},
		getMaxPrice() {
			return Math.max(...this.variants.map(v => parseFloat(v.price)));
		}
	}
];
