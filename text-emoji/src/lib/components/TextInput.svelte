<script lang="ts">
	export let value = '';
	export let maxLength = 20;
	export let placeholder = 'Enter text for emoji';

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
			{placeholder}
			bind:value
			oninput={handleInput}
			rows="3"
			class="focus:border-primary-500 focus:ring-primary-500 block w-full resize-none rounded-md border-gray-300 p-3 shadow-sm sm:text-lg"
		></textarea>

		<div class="absolute bottom-2 right-2 text-xs text-gray-500">
			{value.length}/{maxLength}
		</div>
	</div>

	{#if value.length >= maxLength}
		<p class="text-xs text-red-500">Maximum character limit reached</p>
	{/if}
</div>
