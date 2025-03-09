<script lang="ts">
	// Preset templates for quick emoji creation
	import { createEventDispatcher } from 'svelte';
	import type { EmojiTemplate } from '$lib/types/emoji';

	// Define preset templates
	const templates: EmojiTemplate[] = [
		{
			id: 'happy',
			name: 'Happy',
			text: ':)',
			font: 'Arial',
			textColor: '#000000',
			backgroundColor: '#FFEB3B',
			fontSize: 48,
			padding: 15,
			horizontalAlign: 'center',
			verticalAlign: 'middle',
			showGradient: false
		},
		{
			id: 'sad',
			name: 'Sad',
			text: ':(',
			font: 'Arial',
			textColor: '#000000',
			backgroundColor: '#90CAF9',
			fontSize: 48,
			padding: 15,
			horizontalAlign: 'center',
			verticalAlign: 'middle',
			showGradient: false
		},
		{
			id: 'cool',
			name: 'Cool',
			text: 'B)',
			font: 'Arial',
			textColor: '#FFFFFF',
			backgroundColor: '#000000',
			fontSize: 48,
			padding: 15,
			horizontalAlign: 'center',
			verticalAlign: 'middle',
			showGradient: false
		},
		{
			id: 'love',
			name: 'Love',
			text: '<3',
			font: 'Arial',
			textColor: '#FFFFFF',
			backgroundColor: '#F44336',
			fontSize: 48,
			padding: 15,
			horizontalAlign: 'center',
			verticalAlign: 'middle',
			showGradient: false
		},
		{
			id: 'neon',
			name: 'Neon',
			text: 'WOW',
			font: 'Impact',
			textColor: '#00FF00',
			backgroundColor: '#000000',
			fontSize: 36,
			padding: 10,
			horizontalAlign: 'center',
			verticalAlign: 'middle',
			showGradient: false,
			textGlow: true,
			textGlowColor: '#00FF00',
			textGlowBlur: 10
		},
		{
			id: 'shadow',
			name: 'Shadow',
			text: 'BOO',
			font: 'Times New Roman',
			textColor: '#FFFFFF',
			backgroundColor: '#333333',
			fontSize: 42,
			padding: 10,
			horizontalAlign: 'center',
			verticalAlign: 'middle',
			showGradient: false,
			textShadow: true,
			textShadowColor: '#000000',
			textShadowBlur: 5,
			textShadowOffsetX: 3,
			textShadowOffsetY: 3
		},
		{
			id: 'gradient',
			name: 'Gradient',
			text: 'HI',
			font: 'Arial',
			textColor: '#FFFFFF',
			backgroundColor: '#4A148C',
			fontSize: 48,
			padding: 10,
			horizontalAlign: 'center',
			verticalAlign: 'middle',
			showGradient: true,
			gradientColor: '#7B1FA2',
			gradientDirection: 'to-right'
		},
		{
			id: 'outlined',
			name: 'Outlined',
			text: 'OK',
			font: 'Arial Black',
			textColor: '#FFFFFF',
			backgroundColor: '#2196F3',
			fontSize: 48,
			padding: 10,
			horizontalAlign: 'center',
			verticalAlign: 'middle',
			showGradient: false,
			textBorder: true,
			textBorderColor: '#000000',
			textBorderWidth: 3
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
