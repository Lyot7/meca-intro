/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: '#ea580c', // orange-600
			},
		},
	},
	plugins: [import('daisyui')],
	daisyui: {
		themes: [
			{
				light: {
					primary: '#ea580c', // orange-600
					'primary-content': '#ffffff',
					secondary: '#f97316', // orange-500
					'secondary-content': '#ffffff',
					accent: '#fb923c', // orange-400
					'accent-content': '#ffffff',
					neutral: '#374151', // gray-700
					'neutral-content': '#ffffff',
					'base-100': '#ffffff',
					'base-200': '#f9fafb', // gray-50
					'base-300': '#f3f4f6', // gray-100
					'base-content': '#111827', // gray-900
					info: '#0ea5e9', // sky-500
					success: '#10b981', // emerald-500
					warning: '#f59e0b', // amber-500
					error: '#ef4444', // red-500
				},
				dark: {
					primary: '#ea580c', // orange-600
					'primary-content': '#ffffff',
					secondary: '#f97316', // orange-500
					'secondary-content': '#ffffff',
					accent: '#fb923c', // orange-400
					'accent-content': '#ffffff',
					neutral: '#374151', // gray-700
					'neutral-content': '#ffffff',
					'base-100': '#1f2937', // gray-800
					'base-200': '#374151', // gray-700
					'base-300': '#4b5563', // gray-600
					'base-content': '#f9fafb', // gray-50
					info: '#0ea5e9', // sky-500
					success: '#10b981', // emerald-500
					warning: '#f59e0b', // amber-500
					error: '#ef4444', // red-500
				},
			},
		],
		darkTheme: 'dark',
		base: true,
		styled: true,
		utils: true,
		prefix: '',
		logs: true,
		themeRoot: ':root',
	},
};
