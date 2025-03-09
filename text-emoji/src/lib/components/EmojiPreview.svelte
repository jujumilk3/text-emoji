<script lang="ts">
	import { onMount } from 'svelte';

	let {
		text = $bindable(''),
		font = $bindable('sans-serif'),
		textColor = $bindable('#000000'),
		backgroundColor = $bindable('#ffffff'),
		fontSize = $bindable(32),
		padding = $bindable(10),
		horizontalAlign = $bindable('center'),
		verticalAlign = $bindable('middle'),
		showGradient = $bindable(false),
		gradientColor = $bindable('#ffffff'),
		gradientDirection = $bindable('to-right'),
		textShadow = $bindable(false),
		textShadowColor = $bindable('#000000'),
		textShadowBlur = $bindable(4),
		textShadowOffsetX = $bindable(2),
		textShadowOffsetY = $bindable(2),
		textBorder = $bindable(false),
		textBorderColor = $bindable('#000000'),
		textBorderWidth = $bindable(2),
		textGlow = $bindable(false),
		textGlowColor = $bindable('#ff9900'),
		textGlowBlur = $bindable(10)
	} = $props();

	let canvas = $state<HTMLCanvasElement | null>(null);
	let previewSize = 128;
	let smallPreviewSize = 32;
	let copySuccess = $state(false);
	let copyTimeout: ReturnType<typeof setTimeout>;

	// Track changes to trigger rendering
	let renderKey = $state(0);

	// Listen for document-wide key events to trigger rendering
	function setupKeyListeners() {
		const handleKeyEvent = () => {
			renderKey++;
			renderEmoji();
		};

		// Add event listeners for key events
		window.addEventListener('keyup', handleKeyEvent);
		window.addEventListener('keydown', handleKeyEvent);

		// Return cleanup function
		return () => {
			window.removeEventListener('keyup', handleKeyEvent);
			window.removeEventListener('keydown', handleKeyEvent);
		};
	}

	// Watch for changes in all properties to trigger rendering
	$effect(() => {
		// Create a dependency on all properties that should trigger a render
		const _ = [
			text,
			font,
			textColor,
			backgroundColor,
			fontSize,
			padding,
			horizontalAlign,
			verticalAlign,
			showGradient,
			gradientColor,
			gradientDirection,
			textShadow,
			textShadowColor,
			textShadowBlur,
			textShadowOffsetX,
			textShadowOffsetY,
			textBorder,
			textBorderColor,
			textBorderWidth,
			textGlow,
			textGlowColor,
			textGlowBlur,
			renderKey
		];

		if (canvas) {
			renderEmoji();
		}
	});

	onMount(() => {
		renderEmoji();
		// Setup key listeners and store cleanup function
		const cleanup = setupKeyListeners();

		// Return cleanup function for onMount
		return cleanup;
	});

	function renderEmoji() {
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		// Set canvas dimensions
		canvas.width = previewSize;
		canvas.height = previewSize;

		// Clear canvas
		ctx.clearRect(0, 0, previewSize, previewSize);

		// Draw background
		if (showGradient) {
			const gradient = createGradient(ctx);
			ctx.fillStyle = gradient;
		} else {
			ctx.fillStyle = backgroundColor;
		}
		ctx.fillRect(0, 0, previewSize, previewSize);

		// Set text alignment
		ctx.textAlign =
			horizontalAlign === 'center' ? 'center' : horizontalAlign === 'right' ? 'right' : 'left';
		ctx.textBaseline =
			verticalAlign === 'middle' ? 'middle' : verticalAlign === 'bottom' ? 'bottom' : 'top';

		// Calculate text position
		const x =
			horizontalAlign === 'center'
				? previewSize / 2
				: horizontalAlign === 'right'
					? previewSize - padding
					: padding;
		const y =
			verticalAlign === 'middle'
				? previewSize / 2
				: verticalAlign === 'bottom'
					? previewSize - padding
					: padding;

		// Set font
		ctx.font = `${fontSize}px ${font}`;

		// Apply text effects
		if (textGlow) {
			// Draw text glow
			ctx.save();
			ctx.shadowColor = textGlowColor;
			ctx.shadowBlur = textGlowBlur;
			ctx.shadowOffsetX = 0;
			ctx.shadowOffsetY = 0;
			ctx.fillStyle = textGlowColor;
			ctx.globalAlpha = 0.7;
			ctx.fillText(text, x, y);
			ctx.restore();
		}

		if (textShadow) {
			// Draw text shadow
			ctx.save();
			ctx.fillStyle = textShadowColor;
			ctx.shadowColor = textShadowColor;
			ctx.shadowBlur = textShadowBlur;
			ctx.shadowOffsetX = textShadowOffsetX;
			ctx.shadowOffsetY = textShadowOffsetY;
			ctx.fillText(text, x, y);
			ctx.restore();
		}

		if (textBorder) {
			// Draw text border/stroke
			ctx.save();
			ctx.strokeStyle = textBorderColor;
			ctx.lineWidth = textBorderWidth;
			ctx.strokeText(text, x, y);
			ctx.restore();
		}

		// Draw main text
		ctx.fillStyle = textColor;
		ctx.fillText(text, x, y);
	}

	function createGradient(ctx: CanvasRenderingContext2D) {
		let gradient;

		if (gradientDirection === 'to-right') {
			gradient = ctx.createLinearGradient(0, 0, previewSize, 0);
		} else if (gradientDirection === 'to-bottom') {
			gradient = ctx.createLinearGradient(0, 0, 0, previewSize);
		} else {
			gradient = ctx.createLinearGradient(0, 0, previewSize, previewSize);
		}

		gradient.addColorStop(0, backgroundColor);
		gradient.addColorStop(1, gradientColor);

		return gradient;
	}

	function downloadEmoji() {
		if (!canvas) return;

		const link = document.createElement('a');
		link.download = `emoji-${text.replace(/\s+/g, '-')}.png`;
		link.href = canvas.toDataURL('image/png');
		link.click();
	}

	async function copyToClipboard() {
		if (!canvas) return;

		try {
			// Convert canvas to blob
			const blob = await new Promise<Blob>((resolve) => {
				if (!canvas) return;

				canvas.toBlob((blob) => {
					if (blob) resolve(blob);
				}, 'image/png');
			});

			// Create ClipboardItem
			const item = new ClipboardItem({ 'image/png': blob });

			// Write to clipboard
			await navigator.clipboard.write([item]);

			// Show success message
			copySuccess = true;

			// Clear previous timeout if exists
			if (copyTimeout) clearTimeout(copyTimeout);

			// Hide success message after 2 seconds
			copyTimeout = setTimeout(() => {
				copySuccess = false;
			}, 2000);
		} catch (error) {
			alert(
				'Failed to copy image to clipboard. This feature may not be supported in your browser.'
			);
		}
	}

	// Function to manually trigger a render
	export function forceRender() {
		renderKey++;
		renderEmoji();
	}

	// Function to get current emoji data for saving
	export function getEmojiData() {
		return {
			text,
			font,
			textColor,
			backgroundColor,
			fontSize,
			padding,
			horizontalAlign,
			verticalAlign,
			showGradient,
			gradientColor,
			gradientDirection,
			textShadow,
			textShadowColor,
			textShadowBlur,
			textShadowOffsetX,
			textShadowOffsetY,
			textBorder,
			textBorderColor,
			textBorderWidth,
			textGlow,
			textGlowColor,
			textGlowBlur,
			imageData: canvas?.toDataURL('image/png')
		};
	}
</script>

<div class="space-y-4">
	<div class="rounded-md border bg-white p-4">
		<h3 class="mb-4 text-lg font-medium text-gray-900">Preview</h3>

		<div class="flex flex-col items-center space-y-4">
			<canvas
				bind:this={canvas}
				width={previewSize}
				height={previewSize}
				class="rounded-md border shadow-sm"
			></canvas>

			<div class="flex space-x-4">
				<div class="flex flex-col items-center">
					<p class="mb-1 text-xs text-gray-500">Small</p>
					<div class="h-8 w-8 overflow-hidden rounded-md border">
						<img
							src={canvas?.toDataURL('image/png')}
							alt="Small preview"
							width={smallPreviewSize}
							height={smallPreviewSize}
						/>
					</div>
				</div>

				<div class="flex flex-col items-center">
					<p class="mb-1 text-xs text-gray-500">Medium</p>
					<div class="h-12 w-12 overflow-hidden rounded-md border">
						<img
							src={canvas?.toDataURL('image/png')}
							alt="Medium preview"
							width={smallPreviewSize * 1.5}
							height={smallPreviewSize * 1.5}
						/>
					</div>
				</div>

				<div class="flex flex-col items-center">
					<p class="mb-1 text-xs text-gray-500">Large</p>
					<div class="h-16 w-16 overflow-hidden rounded-md border">
						<img
							src={canvas?.toDataURL('image/png')}
							alt="Large preview"
							width={smallPreviewSize * 2}
							height={smallPreviewSize * 2}
						/>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="flex justify-center space-x-4">
		<button
			onclick={downloadEmoji}
			class="focus:ring-primary-500 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
		>
			Download Emoji
		</button>

		<button
			onclick={copyToClipboard}
			class="focus:ring-primary-500 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
		>
			{copySuccess ? 'Copied!' : 'Copy to Clipboard'}
		</button>
	</div>
</div>
