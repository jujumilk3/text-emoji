<script lang="ts">
	import { PencilIcon } from '$lib/components/icons';

	export let textColor = '#000000';
	export let backgroundColor = '#ffffff';
	export let label = 'Colors';
	export let showGradient = false;
	export let gradientColor = '#e0f2fe';
	export let gradientDirection = 'to-right';

	const gradientDirections = [
		{ id: 'to-right', name: 'Left to Right' },
		{ id: 'to-bottom', name: 'Top to Bottom' },
		{ id: 'to-bottom-right', name: 'Diagonal' }
	];
</script>

<div class="space-y-4">
	<h3 class="text-lg font-medium text-gray-900">{label}</h3>

	<div class="space-y-3">
		<div>
			<label for="text-color" class="block text-sm font-medium text-gray-700">Text Color</label>
			<div class="mt-1 flex rounded-md shadow-sm">
				<input
					type="text"
					name="text-color"
					id="text-color"
					bind:value={textColor}
					class="block w-full rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
					placeholder="#000000"
				/>
				<div
					class="-ml-px flex h-full w-12 items-center justify-center rounded-r-md border border-gray-300 bg-gray-50 px-3 py-2"
				>
					<PencilIcon />
				</div>
			</div>
		</div>

		<div>
			<label for="background-color" class="block text-sm font-medium text-gray-700"
				>Background Color</label
			>
			<div class="mt-1 flex rounded-md shadow-sm">
				<input
					type="text"
					name="background-color"
					id="background-color"
					bind:value={backgroundColor}
					class="block w-full rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
					placeholder="#ffffff"
				/>
				<div
					class="-ml-px flex h-full w-12 items-center justify-center rounded-r-md border border-gray-300 bg-gray-50 px-3 py-2"
				>
					<PencilIcon />
				</div>
			</div>
		</div>

		<div class="flex items-center">
			<input
				id="show-gradient"
				name="show-gradient"
				type="checkbox"
				bind:checked={showGradient}
				class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
			/>
			<label for="show-gradient" class="ml-2 block text-sm text-gray-900"
				>Use Gradient Background</label
			>
		</div>

		{#if showGradient}
			<div class="ml-6 space-y-3">
				<div>
					<label for="gradient-color" class="block text-sm font-medium text-gray-700"
						>Gradient Color</label
					>
					<div class="mt-1 flex rounded-md shadow-sm">
						<input
							type="text"
							name="gradient-color"
							id="gradient-color"
							bind:value={gradientColor}
							class="block w-full rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							placeholder="#e0f2fe"
						/>
						<div
							class="-ml-px flex h-full w-12 items-center justify-center rounded-r-md border border-gray-300 bg-gray-50 px-3 py-2"
						>
							<PencilIcon />
						</div>
					</div>
				</div>

				<div>
					<label for="gradient-direction" class="block text-sm font-medium text-gray-700">
						Gradient Direction
					</label>
					<select
						id="gradient-direction"
						name="gradient-direction"
						bind:value={gradientDirection}
						class="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
					>
						{#each gradientDirections as direction (direction.id)}
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
