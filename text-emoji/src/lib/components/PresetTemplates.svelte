<script lang="ts">
	// Preset templates for quick emoji creation
	import { createEventDispatcher } from 'svelte';
	import type { EmojiTemplate } from '$lib/types/emoji';
	import { templates } from '$lib/data/templates';

	// Event dispatcher for template selection
	const dispatch = createEventDispatcher<{ select: EmojiTemplate }>();

	function selectTemplate(template: EmojiTemplate) {
		dispatch('select', template);
	}

	// Helper function to create gradient background style
	function getBackgroundStyle(template: EmojiTemplate): string {
		if (template.showGradient && template.gradientColor) {
			const direction = template.gradientDirection || 'to-right';
			return `background: linear-gradient(${
				direction === 'to-right'
					? '90deg'
					: direction === 'to-left'
						? '270deg'
						: direction === 'to-bottom'
							? '180deg'
							: direction === 'to-top'
								? '0deg'
								: '90deg'
			}, 
				  ${template.backgroundColor}, ${template.gradientColor});`;
		}
		return `background-color: ${template.backgroundColor};`;
	}
</script>

<div class="space-y-4">
	<h3 class="text-lg font-medium text-gray-900">Preset Templates</h3>
	<p class="text-sm text-gray-500">Click on a template to quickly create an emoji</p>

	<div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
		{#each templates as template (template.id)}
			<button
				class="flex flex-col items-center rounded-md border border-gray-300 p-3 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
				onclick={() => selectTemplate(template)}
			>
				<div
					class="mb-2 flex h-16 w-16 items-center justify-center overflow-hidden rounded-md"
					style="{getBackgroundStyle(
						template
					)} color: {template.textColor}; font-family: {template.font};"
				>
					<div
						class="overflow-hidden text-ellipsis px-1 text-center"
						style="max-width: 100%; max-height: 100%; font-size: {Math.min(
							template.fontSize / 3,
							16
						)}px; 
						   {template.textBorder
							? `text-shadow: -1px -1px 0 ${template.textBorderColor}, 1px -1px 0 ${template.textBorderColor}, -1px 1px 0 ${template.textBorderColor}, 1px 1px 0 ${template.textBorderColor};`
							: ''}
						   {template.textGlow
							? `filter: drop-shadow(0 0 ${Math.min(template.textGlowBlur || 0 / 2, 5)}px ${template.textGlowColor});`
							: ''}
						   {template.textShadow
							? `text-shadow: ${Math.min(template.textShadowOffsetX || 0 / 2, 2)}px ${Math.min(template.textShadowOffsetY || 0 / 2, 2)}px ${Math.min(template.textShadowBlur || 0 / 2, 3)}px ${template.textShadowColor};`
							: ''}"
					>
						{template.text.length > 10 ? template.text.substring(0, 10) + '...' : template.text}
					</div>
				</div>
				<span class="w-full truncate text-center text-xs font-medium text-gray-900"
					>{template.name}</span
				>
			</button>
		{/each}
	</div>
</div>
