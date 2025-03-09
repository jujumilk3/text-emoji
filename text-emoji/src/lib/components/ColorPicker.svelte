<script lang="ts">
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

<div class="space-y-6">
	<h3 class="text-lg font-medium text-gray-900">{label}</h3>

	<div class="space-y-4">
		<div>
			<label for="text-color" class="block text-sm font-medium text-gray-700"> Text Color </label>
			<div class="mt-1 flex rounded-md shadow-sm">
				<div class="relative flex flex-grow items-stretch focus-within:z-10">
					<input
						type="text"
						name="text-color"
						id="text-color"
						bind:value={textColor}
						class="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-none rounded-l-md border-gray-300 sm:text-sm"
					/>
				</div>
				<div class="relative">
					<input
						type="color"
						bind:value={textColor}
						id="text-color-picker"
						class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
					/>
					<div
						class="-ml-px flex h-full w-12 items-center justify-center rounded-r-md border border-gray-300 bg-gray-50 px-3 py-2"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							class="h-5 w-5 text-gray-500"
						>
							<path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z" />
						</svg>
					</div>
				</div>
			</div>
		</div>

		<div>
			<label for="background-color" class="block text-sm font-medium text-gray-700">
				Background Color
			</label>
			<div class="mt-1 flex rounded-md shadow-sm">
				<div class="relative flex flex-grow items-stretch focus-within:z-10">
					<input
						type="text"
						name="background-color"
						id="background-color"
						bind:value={backgroundColor}
						class="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-none rounded-l-md border-gray-300 sm:text-sm"
					/>
				</div>
				<div class="relative">
					<input
						type="color"
						bind:value={backgroundColor}
						id="background-color-picker"
						class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
					/>
					<div
						class="-ml-px flex h-full w-12 items-center justify-center rounded-r-md border border-gray-300 bg-gray-50 px-3 py-2"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							class="h-5 w-5 text-gray-500"
						>
							<path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z" />
						</svg>
					</div>
				</div>
			</div>
		</div>

		<div class="space-y-2">
			<div class="flex items-center">
				<input
					id="gradient"
					name="gradient"
					type="checkbox"
					bind:checked={showGradient}
					class="focus:ring-primary-500 h-4 w-4 rounded border-gray-300 text-indigo-600"
				/>
				<label for="gradient" class="ml-2 block text-sm text-gray-900">
					Use Gradient Background
				</label>
			</div>

			{#if showGradient}
				<div class="ml-6 space-y-4">
					<div>
						<label for="gradient-color" class="block text-sm font-medium text-gray-700">
							Gradient End Color
						</label>
						<div class="mt-1 flex rounded-md shadow-sm">
							<div class="relative flex flex-grow items-stretch focus-within:z-10">
								<input
									type="text"
									name="gradient-color"
									id="gradient-color"
									bind:value={gradientColor}
									class="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-none rounded-l-md border-gray-300 sm:text-sm"
								/>
							</div>
							<div class="relative">
								<input
									type="color"
									bind:value={gradientColor}
									id="gradient-color-picker"
									class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
								/>
								<div
									class="-ml-px flex h-full w-12 items-center justify-center rounded-r-md border border-gray-300 bg-gray-50 px-3 py-2"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="currentColor"
										class="h-5 w-5 text-gray-500"
									>
										<path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z" />
									</svg>
								</div>
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
</div>
