<script lang="ts">
	export let textColor = '#000000';
	export let backgroundColor = '#ffffff';
	export let label = 'Color';
	export let showGradient = false;
	export let gradientColor = '#ffffff';
	export let gradientDirection = 'to-right';

	const gradientDirections = [
		{ id: 'to-right', name: 'Horizontal' },
		{ id: 'to-bottom', name: 'Vertical' },
		{ id: 'to-br', name: 'Diagonal' }
	];
</script>

<div class="space-y-4">
	<div>
		<label class="mb-1 block text-sm font-medium text-gray-700">
			{label}
		</label>

		<div class="grid grid-cols-2 gap-4">
			<div>
				<label for="text-color" class="mb-1 block text-xs text-gray-500"> Text Color </label>
				<div class="flex items-center">
					<input
						id="text-color"
						type="color"
						bind:value={textColor}
						class="h-8 w-8 rounded-md border-gray-300 shadow-sm"
					/>
					<input
						type="text"
						bind:value={textColor}
						class="focus:border-primary-500 focus:ring-primary-500 ml-2 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
					/>
				</div>
			</div>

			<div>
				<label for="bg-color" class="mb-1 block text-xs text-gray-500"> Background Color </label>
				<div class="flex items-center">
					<input
						id="bg-color"
						type="color"
						bind:value={backgroundColor}
						class="h-8 w-8 rounded-md border-gray-300 shadow-sm"
					/>
					<input
						type="text"
						bind:value={backgroundColor}
						class="focus:border-primary-500 focus:ring-primary-500 ml-2 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
					/>
				</div>
			</div>
		</div>
	</div>

	<div>
		<div class="flex items-center">
			<input
				id="gradient-toggle"
				type="checkbox"
				bind:checked={showGradient}
				class="text-primary-600 focus:ring-primary-500 h-4 w-4 rounded border-gray-300"
			/>
			<label for="gradient-toggle" class="ml-2 block text-sm text-gray-700">
				Use Gradient Background
			</label>
		</div>

		{#if showGradient}
			<div class="mt-2 grid grid-cols-2 gap-4">
				<div>
					<label for="gradient-color" class="mb-1 block text-xs text-gray-500">
						Gradient Color
					</label>
					<div class="flex items-center">
						<input
							id="gradient-color"
							type="color"
							bind:value={gradientColor}
							class="h-8 w-8 rounded-md border-gray-300 shadow-sm"
						/>
						<input
							type="text"
							bind:value={gradientColor}
							class="focus:border-primary-500 focus:ring-primary-500 ml-2 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
						/>
					</div>
				</div>

				<div>
					<label for="gradient-direction" class="mb-1 block text-xs text-gray-500">
						Direction
					</label>
					<select
						id="gradient-direction"
						bind:value={gradientDirection}
						class="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
					>
						{#each gradientDirections as direction}
							<option value={direction.id}>
								{direction.name}
							</option>
						{/each}
					</select>
				</div>
			</div>
		{/if}
	</div>
</div>
