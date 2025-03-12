<script lang="ts">
	export let fontSize = 32;
	export let horizontalAlign = 'center';
	export let verticalAlign = 'middle';

	const alignOptions = {
		horizontal: [
			{ id: 'left', name: 'Left' },
			{ id: 'center', name: 'Center' },
			{ id: 'right', name: 'Right' }
		],
		vertical: [
			{ id: 'top', name: 'Top' },
			{ id: 'middle', name: 'Middle' },
			{ id: 'bottom', name: 'Bottom' }
		]
	};
</script>

<div class="space-y-6">
	<h3 class="text-lg font-medium text-gray-900">Size & Position</h3>

	<div class="space-y-4">
		<div>
			<label for="font-size" class="block text-sm font-medium text-gray-700">
				Font Size (px): {fontSize}
			</label>
			<input
				id="font-size"
				type="range"
				min="12"
				max="200"
				bind:value={fontSize}
				class="focus:border-primary-500 focus:ring-primary-500 mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
			/>
		</div>
	</div>

	<div class="grid grid-cols-2 gap-4">
		<div>
			<label for="horizontal-align" class="block text-sm font-medium text-gray-700">
				Horizontal Alignment
			</label>
			<select
				id="horizontal-align"
				bind:value={horizontalAlign}
				class="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
			>
				{#each alignOptions.horizontal as option (option.id)}
					<option value={option.id}>
						{option.name}
					</option>
				{/each}
			</select>
		</div>

		<div>
			<label for="vertical-align" class="block text-sm font-medium text-gray-700">
				Vertical Alignment
			</label>
			<select
				id="vertical-align"
				bind:value={verticalAlign}
				class="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
			>
				{#each alignOptions.vertical as option (option.id)}
					<option value={option.id}>
						{option.name}
					</option>
				{/each}
			</select>
		</div>
	</div>
</div>
