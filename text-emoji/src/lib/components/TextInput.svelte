<script lang="ts">
	export let value = '';
	export let maxLength = 10;
	export let placeholder = 'Enter text for emoji';
	export let rows = 2;

	function handleInput(event: Event) {
		const target = event.target as HTMLTextAreaElement;
		if (target.value.length > maxLength) {
			value = target.value.slice(0, maxLength);
		} else {
			value = target.value;
		}
	}
</script>

<div class="space-y-2">
	<label for="emoji-text" class="block text-sm font-medium text-gray-700"> Emoji Text </label>

	<div class="relative">
		<textarea
			id="emoji-text"
			{rows}
			{placeholder}
			bind:value
			on:input={handleInput}
			class="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
		></textarea>

		<div class="absolute right-2 bottom-2 text-xs text-gray-500">
			{value.length}/{maxLength}
		</div>
	</div>

	{#if value.length >= maxLength}
		<p class="text-xs text-red-500">Maximum character limit reached</p>
	{/if}
</div>
