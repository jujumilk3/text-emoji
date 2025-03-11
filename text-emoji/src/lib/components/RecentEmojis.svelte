<script lang="ts">
	import { onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	import { CloseIcon } from '$lib/components/icons';
	import type { SavedEmoji } from '$lib/types/emoji';

	// Event dispatcher for emoji selection
	const dispatch = createEventDispatcher<{ select: SavedEmoji }>();

	// State for recent emojis
	let recentEmojis = $state<SavedEmoji[]>([]);

	// Load recent emojis from localStorage on mount
	onMount(() => {
		try {
			const savedEmojis = localStorage.getItem('recentEmojis');
			if (savedEmojis) {
				recentEmojis = JSON.parse(savedEmojis);
				// Sort by timestamp (newest first)
				recentEmojis.sort((a, b) => b.timestamp - a.timestamp);
				// Limit to 8 most recent
				if (recentEmojis.length > 8) {
					recentEmojis = recentEmojis.slice(0, 8);
				}
			}
		} catch (error) {
			console.error('Failed to load recent emojis:', error);
		}
	});

	// Function to save a new emoji
	export function saveEmoji(emoji: Omit<SavedEmoji, 'id' | 'timestamp'>) {
		try {
			// Create a new emoji object with id and timestamp
			const newEmoji: SavedEmoji = {
				...emoji,
				id: `emoji_${Date.now()}`,
				timestamp: Date.now()
			};

			// Add to recent emojis
			recentEmojis = [newEmoji, ...recentEmojis];

			// Limit to 8 most recent
			if (recentEmojis.length > 6) {
				recentEmojis = recentEmojis.slice(0, 6);
			}

			// Save to localStorage
			localStorage.setItem('recentEmojis', JSON.stringify(recentEmojis));
		} catch (error) {
			console.error('Failed to save emoji:', error);
		}
	}

	// Function to select an emoji
	function selectEmoji(emoji: SavedEmoji) {
		dispatch('select', emoji);
	}

	// Function to delete an emoji
	function deleteEmoji(id: string) {
		recentEmojis = recentEmojis.filter((emoji) => emoji.id !== id);
		localStorage.setItem('recentEmojis', JSON.stringify(recentEmojis));
	}

	// Helper function to create gradient background style
	function getBackgroundStyle(emoji: SavedEmoji): string {
		if (emoji.showGradient && emoji.gradientColor) {
			const direction = emoji.gradientDirection || 'to-right';
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
				  ${emoji.backgroundColor}, ${emoji.gradientColor});`;
		}
		return `background-color: ${emoji.backgroundColor};`;
	}
</script>

<div class="space-y-4">
	<h3 class="text-lg font-medium text-gray-900">Recent Emojis</h3>

	{#if recentEmojis.length === 0}
		<p class="text-sm text-gray-500">
			No recent emojis. Create and save some emojis to see them here.
		</p>
	{:else}
		<div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
			{#each recentEmojis as emoji (emoji.id)}
				<div class="relative">
					<button
						class="flex w-full flex-col items-center rounded-md border border-gray-300 p-3 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
						onclick={() => selectEmoji(emoji)}
					>
						{#if emoji.imageData}
							<img src={emoji.imageData} alt={emoji.text} class="mb-2 h-20 w-20 rounded-md" />
						{:else}
							<div
								class="mb-2 flex h-20 w-20 items-center justify-center overflow-hidden rounded-md"
								style="{getBackgroundStyle(
									emoji
								)} color: {emoji.textColor}; font-family: {emoji.font};"
							>
								<div
									class="overflow-hidden text-ellipsis px-1 text-center"
									style="max-width: 100%; max-height: 100%; font-size: {Math.min(
										emoji.fontSize / 2.5,
										20
									)}px; 
									   {emoji.textBorder
										? `text-shadow: -1px -1px 0 ${emoji.textBorderColor}, 1px -1px 0 ${emoji.textBorderColor}, -1px 1px 0 ${emoji.textBorderColor}, 1px 1px 0 ${emoji.textBorderColor};`
										: ''}
									   {emoji.textGlow
										? `filter: drop-shadow(0 0 ${Math.min(emoji.textGlowBlur || 0 / 2, 5)}px ${emoji.textGlowColor});`
										: ''}
									   {emoji.textShadow
										? `text-shadow: ${Math.min(emoji.textShadowOffsetX || 0 / 2, 2)}px ${Math.min(emoji.textShadowOffsetY || 0 / 2, 2)}px ${Math.min(emoji.textShadowBlur || 0 / 2, 3)}px ${emoji.textShadowColor};`
										: ''}"
								>
									{emoji.text.length > 10 ? emoji.text.substring(0, 10) + '...' : emoji.text}
								</div>
							</div>
						{/if}
						<span class="max-w-full truncate text-center text-sm font-medium text-gray-900"
							>{emoji.text}</span
						>
					</button>

					<button
						onclick={() => deleteEmoji(emoji.id)}
						class="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
						aria-label="Delete emoji"
					>
						<CloseIcon />
					</button>
				</div>
			{/each}
		</div>
	{/if}
</div>
