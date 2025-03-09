<script lang="ts">
	// Animation types and their properties
	let {
		animationEnabled = $bindable(false),
		animationType = $bindable('none'),
		animationSpeed = $bindable(1000), // in milliseconds
		animationDelay = $bindable(0), // in milliseconds
		animationLoop = $bindable(true),
		animationDirection = $bindable('normal') // normal, reverse, alternate
	} = $props();

	// Animation type options
	const animationTypes = [
		{ value: 'none', label: 'None' },
		{ value: 'sliding-text', label: 'Scrolling' },
		{ value: 'slide-left-to-right', label: 'Slide Left to Right' },
		{ value: 'slide-right-to-left', label: 'Slide Right to Left' },
		{ value: 'slide-top-to-bottom', label: 'Slide Top to Bottom' },
		{ value: 'slide-bottom-to-top', label: 'Slide Bottom to Top' },
		{ value: 'fade-in-out', label: 'Fade In/Out' },
		{ value: 'pulse', label: 'Pulse' },
		{ value: 'rotate', label: 'Rotate' },
		{ value: 'bounce', label: 'Bounce' }
	];

	// Animation direction options
	const directionOptions = [
		{ value: 'normal', label: 'Normal' },
		{ value: 'reverse', label: 'Reverse' },
		{ value: 'alternate', label: 'Alternate' }
	];

	// Handle animation type change
	function handleAnimationTypeChange(event: Event) {
		const select = event.target as HTMLSelectElement;
		animationType = select.value;

		// If animation type is not 'none', enable animation
		if (animationType !== 'none') {
			animationEnabled = true;
		} else {
			animationEnabled = false;
		}
	}
</script>

<div>
	<h3 class="mb-4 text-lg font-medium text-gray-900">Animation</h3>

	<div class="space-y-4">
		<div>
			<label for="animation-type" class="block text-sm font-medium text-gray-700">
				Animation Type
			</label>
			<select
				id="animation-type"
				class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
				value={animationType}
				onchange={handleAnimationTypeChange}
			>
				{#each animationTypes as type}
					<option value={type.value}>{type.label}</option>
				{/each}
			</select>
		</div>

		{#if animationEnabled}
			<div>
				<label for="animation-speed" class="block text-sm font-medium text-gray-700">
					Speed (ms): {animationSpeed}
				</label>
				<input
					id="animation-speed"
					type="range"
					min="100"
					max="5000"
					step="100"
					bind:value={animationSpeed}
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
				/>
			</div>

			<div>
				<label for="animation-delay" class="block text-sm font-medium text-gray-700">
					Delay (ms): {animationDelay}
				</label>
				<input
					id="animation-delay"
					type="range"
					min="0"
					max="3000"
					step="100"
					bind:value={animationDelay}
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
				/>
			</div>

			<div>
				<label for="animation-direction" class="block text-sm font-medium text-gray-700">
					Direction
				</label>
				<select
					id="animation-direction"
					class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
					bind:value={animationDirection}
				>
					{#each directionOptions as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
			</div>

			<div class="flex items-center">
				<input
					id="animation-loop"
					type="checkbox"
					bind:checked={animationLoop}
					class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
				/>
				<label for="animation-loop" class="ml-2 block text-sm text-gray-700">Loop animation</label>
			</div>
		{/if}
	</div>
</div>
