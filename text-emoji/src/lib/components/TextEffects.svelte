<script lang="ts">
	// Text effects component for adding shadows, borders, and other effects to text emojis

	let {
		textShadow = $bindable(false),
		textShadowColor = $bindable('#000000'),
		textShadowBlur = $bindable(4),
		textShadowOffsetX = $bindable(2),
		textShadowOffsetY = $bindable(2),
		textBorder = $bindable(false),
		textBorderColor = $bindable('#000000'),
		textBorderWidth = $bindable(2),
		textGlow = $bindable(false),
		textGlowColor = $bindable('#ff9900'),
		textGlowBlur = $bindable(10)
	} = $props();
</script>

<div class="space-y-6">
	<h3 class="text-lg font-medium text-gray-900">Text Effects</h3>

	<!-- Text Shadow -->
	<div class="space-y-3">
		<div class="flex items-center justify-between">
			<label for="text-shadow" class="block text-sm font-medium text-gray-700"> Text Shadow </label>
			<div class="flex h-5 items-center">
				<input
					id="text-shadow"
					type="checkbox"
					bind:checked={textShadow}
					class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
				/>
			</div>
		</div>

		{#if textShadow}
			<div class="grid grid-cols-2 gap-4">
				<div>
					<label for="shadow-color" class="block text-sm font-medium text-gray-700">
						Shadow Color
					</label>
					<input
						id="shadow-color"
						type="color"
						bind:value={textShadowColor}
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
					/>
				</div>
				<div>
					<label for="shadow-blur" class="block text-sm font-medium text-gray-700">
						Blur (px)
					</label>
					<input
						id="shadow-blur"
						type="range"
						min="0"
						max="20"
						bind:value={textShadowBlur}
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
					/>
				</div>
				<div>
					<label for="shadow-x" class="block text-sm font-medium text-gray-700">
						Offset X (px)
					</label>
					<input
						id="shadow-x"
						type="range"
						min="-10"
						max="10"
						bind:value={textShadowOffsetX}
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
					/>
				</div>
				<div>
					<label for="shadow-y" class="block text-sm font-medium text-gray-700">
						Offset Y (px)
					</label>
					<input
						id="shadow-y"
						type="range"
						min="-10"
						max="10"
						bind:value={textShadowOffsetY}
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
					/>
				</div>
			</div>
		{/if}
	</div>

	<!-- Text Border -->
	<div class="space-y-3">
		<div class="flex items-center justify-between">
			<label for="text-border" class="block text-sm font-medium text-gray-700"> Text Border </label>
			<div class="flex h-5 items-center">
				<input
					id="text-border"
					type="checkbox"
					bind:checked={textBorder}
					class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
				/>
			</div>
		</div>

		{#if textBorder}
			<div class="grid grid-cols-2 gap-4">
				<div>
					<label for="border-color" class="block text-sm font-medium text-gray-700">
						Border Color
					</label>
					<input
						id="border-color"
						type="color"
						bind:value={textBorderColor}
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
					/>
				</div>
				<div>
					<label for="border-width" class="block text-sm font-medium text-gray-700">
						Border Width (px)
					</label>
					<input
						id="border-width"
						type="range"
						min="1"
						max="10"
						bind:value={textBorderWidth}
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
					/>
				</div>
			</div>
		{/if}
	</div>

	<!-- Text Glow -->
	<div class="space-y-3">
		<div class="flex items-center justify-between">
			<label for="text-glow" class="block text-sm font-medium text-gray-700"> Text Glow </label>
			<div class="flex h-5 items-center">
				<input
					id="text-glow"
					type="checkbox"
					bind:checked={textGlow}
					class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
				/>
			</div>
		</div>

		{#if textGlow}
			<div class="grid grid-cols-2 gap-4">
				<div>
					<label for="glow-color" class="block text-sm font-medium text-gray-700">
						Glow Color
					</label>
					<input
						id="glow-color"
						type="color"
						bind:value={textGlowColor}
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
					/>
				</div>
				<div>
					<label for="glow-blur" class="block text-sm font-medium text-gray-700">
						Glow Intensity
					</label>
					<input
						id="glow-blur"
						type="range"
						min="1"
						max="20"
						bind:value={textGlowBlur}
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
					/>
				</div>
			</div>
		{/if}
	</div>
</div>
