<script lang="ts">
	import TextInput from '$lib/components/TextInput.svelte';
	import FontSelector from '$lib/components/FontSelector.svelte';
	import ColorPicker from '$lib/components/ColorPicker.svelte';
	import SizeControls from '$lib/components/SizeControls.svelte';
	import EmojiPreview from '$lib/components/EmojiPreview.svelte';

	// Emoji state
	let text = 'Hi!';
	let font = 'sans-serif';
	let textColor = '#000000';
	let backgroundColor = '#ffffff';
	let fontSize = 32;
	let padding = 10;
	let horizontalAlign = 'center';
	let verticalAlign = 'middle';
	let showGradient = false;
	let gradientColor = '#e0f2fe';
	let gradientDirection = 'to-right';
</script>

<div class="py-6">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="mb-8 text-center">
			<h1 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">Slack Emoji Generator</h1>
			<p class="mx-auto mt-3 max-w-2xl text-xl text-gray-500 sm:mt-4">
				Create custom text-based emojis for Slack in seconds
			</p>
		</div>

		<div class="mt-12 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
			<div class="space-y-6 sm:col-span-4">
				<div class="overflow-hidden rounded-lg bg-white p-6 shadow">
					<TextInput bind:value={text} maxLength={10} />
				</div>

				<div class="overflow-hidden rounded-lg bg-white p-6 shadow">
					<FontSelector bind:selectedFont={font} />
				</div>

				<div class="overflow-hidden rounded-lg bg-white p-6 shadow">
					<ColorPicker
						bind:textColor
						bind:backgroundColor
						bind:showGradient
						bind:gradientColor
						bind:gradientDirection
						label="Colors"
					/>
				</div>

				<div class="overflow-hidden rounded-lg bg-white p-6 shadow">
					<SizeControls bind:fontSize bind:padding bind:horizontalAlign bind:verticalAlign />
				</div>
			</div>

			<div class="sm:col-span-2">
				<div class="sticky top-6">
					<EmojiPreview
						{text}
						{font}
						{textColor}
						{backgroundColor}
						{fontSize}
						{padding}
						{horizontalAlign}
						{verticalAlign}
						{showGradient}
						{gradientColor}
						{gradientDirection}
					/>
				</div>
			</div>
		</div>

		<div class="mt-12 text-center">
			<h2 class="text-2xl font-bold text-gray-900">How to Use</h2>
			<ol class="mx-auto mt-4 max-w-3xl space-y-2 text-left text-gray-600">
				<li>1. Enter the text for your emoji (max 10 characters)</li>
				<li>2. Choose a font style that fits your needs</li>
				<li>3. Select colors for text and background</li>
				<li>4. Adjust size and position settings</li>
				<li>5. Download your emoji</li>
				<li>6. Upload to Slack in your workspace settings</li>
			</ol>
		</div>
	</div>
</div>
