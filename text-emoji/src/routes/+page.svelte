<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import TextInput from '$lib/components/TextInput.svelte';
	import FontSelector from '$lib/components/FontSelector.svelte';
	import ColorPicker from '$lib/components/ColorPicker.svelte';
	import SizeControls from '$lib/components/SizeControls.svelte';
	import EmojiPreview from '$lib/components/EmojiPreview.svelte';
	import TextEffects from '$lib/components/TextEffects.svelte';
	import PresetTemplates from '$lib/components/PresetTemplates.svelte';
	// import RecentEmojis from '$lib/components/RecentEmojis.svelte';
	import AnimationControls from '$lib/components/AnimationControls.svelte';
	import { parseUrlToEmoji, copyShareableUrl } from '$lib/utils/urlParams';
	import { findTemplateById } from '$lib/utils/templateUtils';
	import type { EmojiTemplate, SavedEmoji } from '$lib/types/emoji';

	// Emoji state
	let text = $state('Hi!');
	let font = $state('sans-serif');
	let textColor = $state('#000000');
	let backgroundColor = $state('#ffffff');
	let fontSize = $state(72);
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

	// Animation state
	let animationEnabled = $state(false);
	let animationType = $state('none');
	let animationDuration = $state(1000);
	let animationDelay = $state(0);
	let animationLoop = $state(true);
	let animationDirection = $state('normal');

	// References to components
	let emojiPreviewComponent: EmojiPreview;
	// let recentEmojisComponent: RecentEmojis;

	// Share URL state
	let shareUrlCopied = $state(false);
	let shareUrlTimeout: ReturnType<typeof setTimeout>;

	const maxTextLength = 20;

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

		// Update animation if present in template
		animationEnabled = template.animationEnabled || false;
		if (template.animationEnabled) {
			animationType = template.animationType || animationType;
			animationDuration = template.animationDuration || animationDuration;
			animationDelay = template.animationDelay || animationDelay;
			animationLoop = template.animationLoop || animationLoop;
			animationDirection = template.animationDirection || animationDirection;
		}

		// Force render the preview after applying template
		if (emojiPreviewComponent) {
			emojiPreviewComponent.forceRender();
		}
	}

	// Apply template properties
	function applyTemplate(template: Partial<EmojiTemplate>) {
		// Update all properties from the template if they exist
		if (template.text) text = template.text;
		if (template.font) font = template.font;
		if (template.textColor) textColor = template.textColor;
		if (template.backgroundColor) backgroundColor = template.backgroundColor;
		if (template.fontSize) fontSize = template.fontSize;
		if (template.padding) padding = template.padding;
		if (template.horizontalAlign) horizontalAlign = template.horizontalAlign;
		if (template.verticalAlign) verticalAlign = template.verticalAlign;

		// Apply gradient properties if they exist
		if (template.showGradient !== undefined) showGradient = template.showGradient;
		if (showGradient) {
			if (template.gradientColor) gradientColor = template.gradientColor;
			if (template.gradientDirection) gradientDirection = template.gradientDirection;
		}

		// Apply text effects if they exist
		if (template.textShadow !== undefined) textShadow = template.textShadow;
		if (textShadow) {
			if (template.textShadowColor) textShadowColor = template.textShadowColor;
			if (template.textShadowBlur) textShadowBlur = template.textShadowBlur;
			if (template.textShadowOffsetX) textShadowOffsetX = template.textShadowOffsetX;
			if (template.textShadowOffsetY) textShadowOffsetY = template.textShadowOffsetY;
		}

		if (template.textBorder !== undefined) textBorder = template.textBorder;
		if (textBorder) {
			if (template.textBorderColor) textBorderColor = template.textBorderColor;
			if (template.textBorderWidth) textBorderWidth = template.textBorderWidth;
		}

		if (template.textGlow !== undefined) textGlow = template.textGlow;
		if (textGlow) {
			if (template.textGlowColor) textGlowColor = template.textGlowColor;
			if (template.textGlowBlur) textGlowBlur = template.textGlowBlur;
		}

		// Apply animation properties if they exist
		if (template.animationEnabled !== undefined) animationEnabled = template.animationEnabled;
		if (animationEnabled) {
			if (template.animationType) animationType = template.animationType;
			if (template.animationDuration) animationDuration = template.animationDuration;
			if (template.animationDelay) animationDelay = template.animationDelay;
			if (template.animationLoop !== undefined) animationLoop = template.animationLoop;
			if (template.animationDirection) animationDirection = template.animationDirection;
		}

		// Force render after applying template
		setTimeout(() => {
			if (emojiPreviewComponent) {
				emojiPreviewComponent.forceRender();
			}
		}, 100);
	}

	// Handle recent emoji selection
	// function handleRecentEmojiSelect(event: CustomEvent<SavedEmoji>) {
	// 	const emoji = event.detail;
	// 	applyTemplate(emoji);
	// }

	// Save current emoji to recent emojis
	// function saveCurrentEmoji() {
	// 	if (emojiPreviewComponent && recentEmojisComponent) {
	// 		const emojiData = emojiPreviewComponent.getEmojiData();
	// 		recentEmojisComponent.saveEmoji(emojiData);
	// 	}
	// }

	// Share current emoji as URL
	async function shareCurrentEmoji() {
		if (emojiPreviewComponent) {
			const emojiData = emojiPreviewComponent.getEmojiData();
			try {
				await copyShareableUrl(emojiData);
				shareUrlCopied = true;

				// Clear any existing timeout
				if (shareUrlTimeout) {
					clearTimeout(shareUrlTimeout);
				}

				// Reset the copied state after 3 seconds
				shareUrlTimeout = setTimeout(() => {
					shareUrlCopied = false;
				}, 3000);
			} catch (error) {
				console.error('Failed to copy share URL:', error);
				alert('Failed to copy share URL to clipboard');
			}
		}
	}

	// Apply URL parameters on mount
	onMount(() => {
		// Check if there are URL parameters to apply
		if ($page.url.search) {
			// Check if a template ID is specified
			const templateId = $page.url.searchParams.get('template');
			if (templateId) {
				// Try to find the template by ID
				const template = findTemplateById(templateId);
				if (template) {
					// Apply the template
					applyTemplate(template);
					return;
				}
			}

			// If no template ID or template not found, parse URL parameters
			const urlTemplate = parseUrlToEmoji($page.url);
			applyTemplate(urlTemplate);
		}
	});
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
						<TextInput bind:value={text} maxLength={maxTextLength} />
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
						<AnimationControls
							bind:animationEnabled
							bind:animationType
							bind:animationDuration
							bind:animationDelay
							bind:animationLoop
							bind:animationDirection
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
						{animationEnabled}
						{animationType}
						{animationDuration}
						{animationDelay}
						{animationLoop}
						{animationDirection}
					/>

					<div class="flex justify-center space-x-4">
						<!-- <button
							onclick={saveCurrentEmoji}
							class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
						>
							Save to Recent
						</button> -->

						<button
							onclick={shareCurrentEmoji}
							class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
						>
							{#if shareUrlCopied}
								✓ URL Copied!
							{:else}
								Share URL
							{/if}
						</button>
					</div>

					<!-- <div class="overflow-hidden rounded-lg bg-white p-6 shadow">
						<RecentEmojis bind:this={recentEmojisComponent} on:select={handleRecentEmojiSelect} />
					</div> -->
				</div>
			</div>
		</div>

		<div class="mt-12 text-center">
			<h2 class="text-2xl font-bold text-gray-900">How to Use</h2>
			<ol class="mx-auto mt-4 max-w-3xl space-y-2 text-left text-gray-600">
				<li>1. Enter the text for your emoji (max {maxTextLength} characters)</li>
				<li>2. Choose a font style that fits your needs</li>
				<li>3. Select colors for text and background</li>
				<li>4. Adjust size and position settings</li>
				<li>5. Add text effects like shadows or borders</li>
				<li>6. Download your emoji or copy to clipboard</li>
				<li>7. Upload to Slack, Discord, or other platforms in your workspace settings</li>
				<li>8. Share your emoji with others using the Share URL button</li>
			</ol>
		</div>
	</div>
</div>
