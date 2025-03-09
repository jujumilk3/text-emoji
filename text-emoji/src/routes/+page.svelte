<script lang="ts">
	import TextInput from '$lib/components/TextInput.svelte';
	import FontSelector from '$lib/components/FontSelector.svelte';
	import ColorPicker from '$lib/components/ColorPicker.svelte';
	import SizeControls from '$lib/components/SizeControls.svelte';
	import EmojiPreview from '$lib/components/EmojiPreview.svelte';
	import TextEffects from '$lib/components/TextEffects.svelte';
	import PresetTemplates from '$lib/components/PresetTemplates.svelte';
	import RecentEmojis from '$lib/components/RecentEmojis.svelte';
	import type { EmojiTemplate, SavedEmoji } from '$lib/types/emoji';

	// Emoji state
	let text = $state('Hi!');
	let font = $state('sans-serif');
	let textColor = $state('#000000');
	let backgroundColor = $state('#ffffff');
	let fontSize = $state(32);
	let padding = $state(10);
	let horizontalAlign = $state('center');
	let verticalAlign = $state('middle');
	let showGradient = $state(false);
	let gradientColor = $state('#e0f2fe');
	let gradientDirection = $state('to-right');

	// Text effects state
	let textShadow = $state(false);
	let textShadowColor = $state('#000000');
	let textShadowBlur = $state(4);
	let textShadowOffsetX = $state(2);
	let textShadowOffsetY = $state(2);

	let textBorder = $state(false);
	let textBorderColor = $state('#000000');
	let textBorderWidth = $state(2);

	let textGlow = $state(false);
	let textGlowColor = $state('#ff9900');
	let textGlowBlur = $state(10);

	// References to components
	let emojiPreviewComponent: EmojiPreview;
	let recentEmojisComponent: RecentEmojis;

	// Handle template selection
	function handleTemplateSelect(event: CustomEvent<EmojiTemplate>) {
		const template = event.detail;

		// Update all properties from the template
		text = template.text;
		font = template.font;
		textColor = template.textColor;
		backgroundColor = template.backgroundColor;
		fontSize = template.fontSize;
		padding = template.padding;
		horizontalAlign = template.horizontalAlign;
		verticalAlign = template.verticalAlign;
		showGradient = template.showGradient;

		if (template.showGradient) {
			gradientColor = template.gradientColor || gradientColor;
			gradientDirection = template.gradientDirection || gradientDirection;
		}

		// Update text effects if present in template
		textShadow = template.textShadow || false;
		if (template.textShadow) {
			textShadowColor = template.textShadowColor || textShadowColor;
			textShadowBlur = template.textShadowBlur || textShadowBlur;
			textShadowOffsetX = template.textShadowOffsetX || textShadowOffsetX;
			textShadowOffsetY = template.textShadowOffsetY || textShadowOffsetY;
		}

		textBorder = template.textBorder || false;
		if (template.textBorder) {
			textBorderColor = template.textBorderColor || textBorderColor;
			textBorderWidth = template.textBorderWidth || textBorderWidth;
		}

		textGlow = template.textGlow || false;
		if (template.textGlow) {
			textGlowColor = template.textGlowColor || textGlowColor;
			textGlowBlur = template.textGlowBlur || textGlowBlur;
		}

		// Force render the preview after applying template
		if (emojiPreviewComponent) {
			emojiPreviewComponent.forceRender();
		}
	}

	// Handle recent emoji selection
	function handleRecentEmojiSelect(event: CustomEvent<SavedEmoji>) {
		const emoji = event.detail;

		// Update all properties from the saved emoji
		text = emoji.text;
		font = emoji.font;
		textColor = emoji.textColor;
		backgroundColor = emoji.backgroundColor;
		fontSize = emoji.fontSize;
		padding = emoji.padding;
		horizontalAlign = emoji.horizontalAlign;
		verticalAlign = emoji.verticalAlign;
		showGradient = emoji.showGradient;

		if (emoji.showGradient) {
			gradientColor = emoji.gradientColor || gradientColor;
			gradientDirection = emoji.gradientDirection || gradientDirection;
		}

		// Update text effects if present
		textShadow = emoji.textShadow || false;
		if (emoji.textShadow) {
			textShadowColor = emoji.textShadowColor || textShadowColor;
			textShadowBlur = emoji.textShadowBlur || textShadowBlur;
			textShadowOffsetX = emoji.textShadowOffsetX || textShadowOffsetX;
			textShadowOffsetY = emoji.textShadowOffsetY || textShadowOffsetY;
		}

		textBorder = emoji.textBorder || false;
		if (emoji.textBorder) {
			textBorderColor = emoji.textBorderColor || textBorderColor;
			textBorderWidth = emoji.textBorderWidth || textBorderWidth;
		}

		textGlow = emoji.textGlow || false;
		if (emoji.textGlow) {
			textGlowColor = emoji.textGlowColor || textGlowColor;
			textGlowBlur = emoji.textGlowBlur || textGlowBlur;
		}

		// Force render the preview after applying saved emoji
		if (emojiPreviewComponent) {
			emojiPreviewComponent.forceRender();
		}
	}

	// Save current emoji to recent emojis
	function saveCurrentEmoji() {
		if (emojiPreviewComponent && recentEmojisComponent) {
			const emojiData = emojiPreviewComponent.getEmojiData();
			recentEmojisComponent.saveEmoji(emojiData);
		}
	}
</script>

<div class="py-6">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="mb-8 text-center">
			<h1 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">Text Emoji Generator</h1>
			<p class="mx-auto mt-3 max-w-2xl text-xl text-gray-500 sm:mt-4">
				Create custom text-based emojis for Slack, Discord, and more in seconds
			</p>
		</div>

		<div class="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
			<div class="sm:col-span-4">
				<div class="space-y-6">
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

					<div class="overflow-hidden rounded-lg bg-white p-6 shadow">
						<TextEffects
							bind:textShadow
							bind:textShadowColor
							bind:textShadowBlur
							bind:textShadowOffsetX
							bind:textShadowOffsetY
							bind:textBorder
							bind:textBorderColor
							bind:textBorderWidth
							bind:textGlow
							bind:textGlowColor
							bind:textGlowBlur
						/>
					</div>

					<div class="overflow-hidden rounded-lg bg-white p-6 shadow">
						<PresetTemplates on:select={handleTemplateSelect} />
					</div>
				</div>
			</div>

			<div class="sm:col-span-2">
				<div class="sticky top-6 space-y-6">
					<EmojiPreview
						bind:this={emojiPreviewComponent}
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
						{textShadow}
						{textShadowColor}
						{textShadowBlur}
						{textShadowOffsetX}
						{textShadowOffsetY}
						{textBorder}
						{textBorderColor}
						{textBorderWidth}
						{textGlow}
						{textGlowColor}
						{textGlowBlur}
					/>

					<div class="flex justify-center">
						<button
							onclick={saveCurrentEmoji}
							class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
						>
							Save to Recent
						</button>
					</div>

					<div class="overflow-hidden rounded-lg bg-white p-6 shadow">
						<RecentEmojis bind:this={recentEmojisComponent} on:select={handleRecentEmojiSelect} />
					</div>
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
				<li>5. Add text effects like shadows or borders</li>
				<li>6. Download your emoji or copy to clipboard</li>
				<li>7. Upload to Slack, Discord, or other platforms in your workspace settings</li>
			</ol>
		</div>
	</div>
</div>
