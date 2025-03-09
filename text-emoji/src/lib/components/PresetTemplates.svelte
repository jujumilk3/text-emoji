<script lang="ts">
	// Preset templates for quick emoji creation
	import { createEventDispatcher } from 'svelte';
	import type { EmojiTemplate } from '$lib/types/emoji';

	// Define preset templates
	const templates: EmojiTemplate[] = [
		{
			id: 'template-1',
			name: 'Basic Black',
			text: 'Hi!',
			font: 'sans-serif',
			textColor: '#000000',
			backgroundColor: '#ffffff',
			fontSize: 32,
			padding: 10,
			horizontalAlign: 'center',
			verticalAlign: 'middle',
			showGradient: false
		},
		{
			id: 'template-2',
			name: 'Red Alert',
			text: 'ALERT',
			font: 'sans-serif',
			textColor: '#ffffff',
			backgroundColor: '#ff0000',
			fontSize: 28,
			padding: 10,
			horizontalAlign: 'center',
			verticalAlign: 'middle',
			showGradient: false,
			textBorder: true,
			textBorderColor: '#000000',
			textBorderWidth: 2
		},
		{
			id: 'template-3',
			name: 'Blue Gradient',
			text: 'Cool',
			font: 'serif',
			textColor: '#ffffff',
			backgroundColor: '#0066cc',
			fontSize: 32,
			padding: 10,
			horizontalAlign: 'center',
			verticalAlign: 'middle',
			showGradient: true,
			gradientColor: '#00ccff',
			gradientDirection: 'to-right'
		},
		{
			id: 'template-4',
			name: 'Glow Effect',
			text: 'Glow',
			font: 'sans-serif',
			textColor: '#ffffff',
			backgroundColor: '#333333',
			fontSize: 32,
			padding: 10,
			horizontalAlign: 'center',
			verticalAlign: 'middle',
			showGradient: false,
			textGlow: true,
			textGlowColor: '#ffcc00',
			textGlowBlur: 10
		},
		{
			id: 'template-5',
			name: 'Shadow Text',
			text: 'Shadow',
			font: 'serif',
			textColor: '#ffffff',
			backgroundColor: '#666666',
			fontSize: 32,
			padding: 10,
			horizontalAlign: 'center',
			verticalAlign: 'middle',
			showGradient: false,
			textShadow: true,
			textShadowColor: '#000000',
			textShadowBlur: 4,
			textShadowOffsetX: 3,
			textShadowOffsetY: 3
		},
		{
			id: 'template-6',
			name: 'Bouncing Text',
			text: 'Bounce',
			font: 'sans-serif',
			textColor: '#ff6600',
			backgroundColor: '#ffffff',
			fontSize: 32,
			padding: 10,
			horizontalAlign: 'center',
			verticalAlign: 'middle',
			showGradient: false,
			animationEnabled: true,
			animationType: 'bounce',
			animationSpeed: 1000,
			animationDelay: 0,
			animationLoop: true,
			animationDirection: 'normal'
		},
		{
			id: 'template-7',
			name: 'Slide In',
			text: 'Slide',
			font: 'sans-serif',
			textColor: '#3366ff',
			backgroundColor: '#f0f0f0',
			fontSize: 32,
			padding: 10,
			horizontalAlign: 'center',
			verticalAlign: 'middle',
			showGradient: false,
			animationEnabled: true,
			animationType: 'slide-left-to-right',
			animationSpeed: 2000,
			animationDelay: 0,
			animationLoop: true,
			animationDirection: 'alternate'
		},
		{
			id: 'template-8',
			name: 'Fade In/Out',
			text: 'Fade',
			font: 'serif',
			textColor: '#9900cc',
			backgroundColor: '#ffffff',
			fontSize: 32,
			padding: 10,
			horizontalAlign: 'center',
			verticalAlign: 'middle',
			showGradient: false,
			animationEnabled: true,
			animationType: 'fade-in-out',
			animationSpeed: 2000,
			animationDelay: 0,
			animationLoop: true,
			animationDirection: 'normal'
		},
		{
			id: 'template-9',
			name: 'Rotating Text',
			text: 'Spin',
			font: 'sans-serif',
			textColor: '#ff3366',
			backgroundColor: '#ffffff',
			fontSize: 28,
			padding: 10,
			horizontalAlign: 'center',
			verticalAlign: 'middle',
			showGradient: false,
			animationEnabled: true,
			animationType: 'rotate',
			animationSpeed: 3000,
			animationDelay: 0,
			animationLoop: true,
			animationDirection: 'normal'
		}
	];

	// Event dispatcher for template selection
	const dispatch = createEventDispatcher<{ select: EmojiTemplate }>();

	function selectTemplate(template: EmojiTemplate) {
		dispatch('select', template);
	}
</script>

<div class="space-y-4">
	<h3 class="text-lg font-medium text-gray-900">Preset Templates</h3>
	<p class="text-sm text-gray-500">Click on a template to quickly create an emoji</p>

	<div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
		{#each templates as template (template.id)}
			<button
				class="flex flex-col items-center rounded-md border border-gray-300 p-3 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
				on:click={() => selectTemplate(template)}
			>
				<div
					class="mb-2 flex h-16 w-16 items-center justify-center rounded-md"
					style="background-color: {template.backgroundColor}; color: {template.textColor}; font-family: {template.font}; font-size: {template.fontSize /
						3}px;"
				>
					{template.text}
				</div>
				<span class="text-xs font-medium text-gray-900">{template.name}</span>
			</button>
		{/each}
	</div>
</div>
