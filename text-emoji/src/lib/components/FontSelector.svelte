<script lang="ts">
	export let selectedFont = 'sans-serif';

	const fonts = [
		{ id: 'sans-serif', name: 'Sans Serif', family: 'sans-serif' },
		{ id: 'serif', name: 'Serif', family: 'serif' },
		{ id: 'monospace', name: 'Monospace', family: 'monospace' },
		{ id: 'cursive', name: 'Cursive', family: 'cursive' },
		{ id: 'fantasy', name: 'Fantasy', family: 'fantasy' }
	];
</script>

<div class="space-y-2">
	<label for="font-selector" class="block text-sm font-medium text-gray-700"> Font Style </label>

	<select
		id="font-selector"
		bind:value={selectedFont}
		class="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
	>
		{#each fonts as font (font.id)}
			<option value={font.id} style="font-family: {font.family}">
				{font.name}
			</option>
		{/each}
	</select>

	<div class="mt-2 rounded-md border p-2">
		<p class="text-sm text-gray-500">Preview:</p>
		<p style="font-family: {selectedFont}" class="text-lg">Sample Text</p>
	</div>
</div>
