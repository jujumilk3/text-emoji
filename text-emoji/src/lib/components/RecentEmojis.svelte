<script lang="ts">
	import { onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';

	// Define the emoji interface
	interface SavedEmoji {
		id: string;
		text: string;
		font: string;
		textColor: string;
		backgroundColor: string;
		fontSize: number;
		padding: number;
		horizontalAlign: string;
		verticalAlign: string;
		showGradient: boolean;
		gradientColor?: string;
		gradientDirection?: string;
		textShadow?: boolean;
		textShadowColor?: string;
		textShadowBlur?: number;
		textShadowOffsetX?: number;
		textShadowOffsetY?: number;
		textBorder?: boolean;
		textBorderColor?: string;
		textBorderWidth?: number;
		textGlow?: boolean;
		textGlowColor?: string;
		textGlowBlur?: number;
		timestamp: number;
		imageData?: string;
	}

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
			if (recentEmojis.length > 8) {
				recentEmojis = recentEmojis.slice(0, 8);
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
</script>

<div class="space-y-4">
	<h3 class="text-lg font-medium text-gray-900">Recent Emojis</h3>

	{#if recentEmojis.length === 0}
		<p class="text-sm text-gray-500">
			No recent emojis. Create and save some emojis to see them here.
		</p>
	{:else}
		<div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
			{#each recentEmojis as emoji (emoji.id)}
				<div class="relative">
					<button
						class="flex w-full flex-col items-center rounded-md border border-gray-300 p-3 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
						onclick={() => selectEmoji(emoji)}
					>
						{#if emoji.imageData}
							<img src={emoji.imageData} alt={emoji.text} class="mb-2 h-16 w-16 rounded-md" />
						{:else}
							<div
								class="mb-2 flex h-16 w-16 items-center justify-center rounded-md"
								style="background-color: {emoji.backgroundColor}; color: {emoji.textColor}; font-family: {emoji.font}; font-size: {emoji.fontSize /
									3}px;"
							>
								{emoji.text}
							</div>
						{/if}
						<span class="max-w-full truncate text-xs font-medium text-gray-900">{emoji.text}</span>
					</button>

					<button
						class="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
						onclick={() => deleteEmoji(emoji.id)}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-4 w-4"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fill-rule="evenodd"
								d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
								clip-rule="evenodd"
							/>
						</svg>
					</button>
				</div>
			{/each}
		</div>
	{/if}
</div>
