<script lang="ts">
	import { onMount } from 'svelte';
	import GIF from 'gif.js';

	// Preload the GIF worker script
	let workerScriptLoaded = $state(false);

	function preloadWorkerScript() {
		// Check if the worker script exists by creating a test request
		fetch('./gif.worker.js')
			.then((response) => {
				if (!response.ok) {
					throw new Error(
						`Failed to load worker script: ${response.status} ${response.statusText}`
					);
				}
				console.log('GIF worker script found and loaded successfully');
				workerScriptLoaded = true;
			})
			.catch((error) => {
				console.error('Error preloading GIF worker script:', error);
				alert('Warning: GIF worker script could not be loaded. GIF generation may not work.');
			});
	}

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
		textGlowBlur = $bindable(10),
		// Animation properties
		animationEnabled = $bindable(false),
		animationType = $bindable('none'),
		animationSpeed = $bindable(1000),
		animationDelay = $bindable(0),
		animationLoop = $bindable(true),
		animationDirection = $bindable('normal')
	} = $props();

	let canvas = $state<HTMLCanvasElement | null>(null);
	let previewSize = 128;
	let smallPreviewSize = 32;
	let copySuccess = $state(false);
	let copyTimeout: ReturnType<typeof setTimeout>;
	let animationFrame: number | null;
	let animationStartTime: number | null;
	let isGeneratingGif = $state(false);
	let gifProgress = 0;
	let displayGifProgress = $state(0);

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
		console.log('effect');
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
			animationEnabled,
			animationType,
			animationSpeed,
			animationDelay,
			animationLoop,
			animationDirection,
			renderKey
		];

		if (canvas) {
			// If animation is enabled, start animation loop
			if (animationEnabled && animationType !== 'none') {
				startAnimation();
			} else {
				console.log('$effect, else');
				// Otherwise, just render once
				stopAnimation();
				renderEmoji();
			}
		}
	});

	onMount(() => {
		renderEmoji();
		// Preload the worker script
		preloadWorkerScript();
		// Setup key listeners and store cleanup function
		const cleanup = setupKeyListeners();

		// Return cleanup function for onMount
		return () => {
			cleanup();
			stopAnimation();
		};
	});

	function startAnimation() {
		// Stop any existing animation
		// stopAnimation();

		// Reset animation start time
		animationStartTime = null;

		// Start animation loop
		animateEmoji();
	}

	function stopAnimation() {
		console.log('stopAnimation');
		console.log('animationFrame', animationFrame);
		// Cancel any existing animation frame
		if (animationFrame !== null) {
			cancelAnimationFrame(animationFrame);
			animationFrame = null;
		}
	}

	function animateEmoji(timestamp?: number) {
		if (!animationEnabled || animationType === 'none') {
			renderEmoji();
			return;
		}

		// Initialize start time on first frame
		if (animationStartTime === null) {
			animationStartTime = timestamp || performance.now();
		}

		// Calculate elapsed time
		const elapsedTime = (timestamp || performance.now()) - (animationStartTime || 0);

		// Apply delay before starting animation
		if (elapsedTime < animationDelay) {
			animationFrame = requestAnimationFrame(animateEmoji);
			return;
		}

		// Calculate animation progress (0 to 1)
		const effectiveElapsedTime = elapsedTime - animationDelay;
		let progress = (effectiveElapsedTime % animationSpeed) / animationSpeed;

		// Apply direction
		if (animationDirection === 'reverse') {
			progress = 1 - progress;
		} else if (animationDirection === 'alternate') {
			const cycle = Math.floor(effectiveElapsedTime / animationSpeed);
			if (cycle % 2 === 1) {
				progress = 1 - progress;
			}
		}

		// Render frame with animation progress
		renderAnimationFrame(progress);

		// Continue animation loop if looping is enabled
		if (animationLoop || effectiveElapsedTime < animationSpeed) {
			animationFrame = requestAnimationFrame(animateEmoji);
		} else {
			// Render final frame if not looping
			renderAnimationFrame(animationDirection === 'reverse' ? 0 : 1);
		}
	}

	function renderAnimationFrame(progress: number) {
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

		// Calculate base text position
		const baseX =
			horizontalAlign === 'center'
				? previewSize / 2
				: horizontalAlign === 'right'
					? previewSize - padding
					: padding;
		const baseY =
			verticalAlign === 'middle'
				? previewSize / 2
				: verticalAlign === 'bottom'
					? previewSize - padding
					: padding;

		// Apply animation transformations
		let x = baseX;
		let y = baseY;
		let alpha = 1;
		let scale = 1;
		let rotation = 0;
		let translateX = 0;
		let translateY = 0;

		// Apply different animations based on type
		if (animationEnabled && animationType !== 'none') {
			switch (animationType) {
				case 'slide-left-to-right':
					translateX = (progress - 0.5) * previewSize;
					break;
				case 'slide-right-to-left':
					translateX = (0.5 - progress) * previewSize;
					break;
				case 'slide-top-to-bottom':
					translateY = (progress - 0.5) * previewSize;
					break;
				case 'slide-bottom-to-top':
					translateY = (0.5 - progress) * previewSize;
					break;
				case 'fade-in-out':
					// Fade in for first half, fade out for second half
					alpha = progress < 0.5 ? progress * 2 : 2 - progress * 2;
					break;
				case 'pulse':
					// Scale between 0.8 and 1.2
					scale = 0.8 + 0.4 * Math.sin(progress * Math.PI * 2);
					break;
				case 'rotate':
					// Rotate 360 degrees
					rotation = progress * Math.PI * 2;
					break;
				case 'bounce':
					// Simple bounce effect
					translateY = -Math.abs(Math.sin(progress * Math.PI)) * 20;
					break;
			}
		}

		// Apply transformations
		x += translateX;
		y += translateY;

		// Set font
		ctx.font = `${fontSize * scale}px ${font}`;

		// Save context for transformations
		ctx.save();

		// Apply rotation if needed
		if (rotation !== 0) {
			ctx.translate(baseX, baseY);
			ctx.rotate(rotation);
			ctx.translate(-baseX, -baseY);
		}

		// Apply alpha
		ctx.globalAlpha = alpha;

		// Apply text effects
		if (textGlow) {
			// Draw text glow
			ctx.save();
			ctx.shadowColor = textGlowColor;
			ctx.shadowBlur = textGlowBlur;
			ctx.shadowOffsetX = 0;
			ctx.shadowOffsetY = 0;
			ctx.fillStyle = textGlowColor;
			ctx.globalAlpha = 0.7 * alpha;
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

		// Restore context
		ctx.restore();
	}

	function renderEmoji() {
		if (animationEnabled && animationType !== 'none') {
			// For static rendering, use a neutral animation position
			renderAnimationFrame(0.5);
		} else {
			// Render without animation
			renderAnimationFrame(0);
		}
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

		// If animation is enabled, create and download a GIF
		if (animationEnabled && animationType !== 'none') {
			createAndDownloadGif();
		} else {
			// For static emojis, download as PNG
			const link = document.createElement('a');
			link.download = `emoji-${text.replace(/\s+/g, '-')}.png`;
			link.href = canvas.toDataURL('image/png');
			link.click();
		}
	}

	function createAndDownloadGif() {
		console.log('createAndDownloadGif');
		if (!canvas) return;

		// Check if worker script is loaded
		if (!workerScriptLoaded) {
			alert('GIF worker script is not loaded yet. Please try again in a moment.');
			// Try to load it again
			preloadWorkerScript();
			return;
		}

		try {
			isGeneratingGif = true;
			gifProgress = 0;
			displayGifProgress = 0;

			// Check if GIF constructor is available
			if (typeof GIF !== 'function') {
				throw new Error('GIF.js library is not properly loaded');
			}

			// Create a GIF encoder
			const gif = new GIF({
				workers: 2,
				quality: 10,
				width: previewSize,
				height: previewSize,
				workerScript: './gif.worker.js', // Fix the path to the worker script
				background: backgroundColor
			});

			// Verify that the GIF object was created properly
			if (!gif || typeof gif.on !== 'function' || typeof gif.render !== 'function') {
				throw new Error('Failed to initialize GIF encoder properly');
			}

			console.log('gif created', gif);

			// Number of frames to capture for one animation cycle
			const framesCount = 30; // Increased for smoother animation
			const frameDelay = Math.max(50, animationSpeed / framesCount); // Ensure minimum delay of 50ms per frame

			// Stop any running animation to control our own rendering
			stopAnimation();

			// Add frames to the GIF
			for (let i = 0; i < framesCount; i++) {
				console.log('Adding frame', i);

				// Calculate progress for this frame (0 to 1)
				const progress = i / framesCount;

				// Render the frame at this progress point
				renderAnimationFrame(progress);

				// Add the current canvas content as a frame
				gif.addFrame(canvas, { copy: true, delay: frameDelay });

				// Update progress (non-reactive)
				gifProgress = ((i + 1) / framesCount) * 0.8; // 80% of progress is for frame generation
				// Update display progress (reactive, but only once per frame)
				if (i % 5 === 0 || i === framesCount - 1) {
					displayGifProgress = gifProgress;
				}
			}

			console.log('All frames added');

			// Add error handler
			gif.on('error' as any, (error: any) => {
				console.error('GIF generation error:', error);
				alert('Error generating GIF: ' + (error instanceof Error ? error.message : String(error)));
				isGeneratingGif = false;
				startAnimation();
			});

			console.log('Error handler added');

			// Event handlers
			gif.on('progress' as any, (p: number) => {
				console.log('GIF progress:', p);
				// Remaining 20% of progress is for rendering
				gifProgress = 0.8 + p * 0.2;
				// Update display progress less frequently to avoid rendering issues
				if (Math.round(p * 10) % 2 === 0) {
					displayGifProgress = gifProgress;
				}
			});

			console.log('Progress handler added');

			gif.on('finished' as any, (blob: Blob) => {
				console.log('GIF finished!');
				// Create download link
				const url = URL.createObjectURL(blob);
				const link = document.createElement('a');
				link.href = url;
				link.download = `emoji-${text.replace(/\s+/g, '-')}.gif`;
				document.body.appendChild(link); // Append to body to ensure it works in all browsers
				link.click();
				document.body.removeChild(link); // Clean up

				// Clean up
				setTimeout(() => {
					URL.revokeObjectURL(url);
				}, 100); // Small delay to ensure download starts before revoking

				isGeneratingGif = false;
				gifProgress = 0;
				displayGifProgress = 0;

				// Restart the animation preview
				startAnimation();
			});

			console.log('Finished handler added');

			// Start rendering the GIF
			console.log('Starting GIF render');
			gif.render();
			console.log('GIF render started');
		} catch (error) {
			console.error('Error setting up GIF generation:', error);
			alert('Failed to generate GIF: ' + (error instanceof Error ? error.message : String(error)));
			isGeneratingGif = false;
			startAnimation();
		}
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
			id: '', // This will be generated by the RecentEmojis component
			name: `Emoji-${new Date().toISOString().slice(0, 10)}`, // Add a default name
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
			animationEnabled,
			animationType,
			animationSpeed,
			animationDelay,
			animationLoop,
			animationDirection,
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
			disabled={isGeneratingGif}
			title={animationEnabled && animationType !== 'none'
				? 'Download as animated GIF'
				: 'Download as PNG image'}
		>
			{#if isGeneratingGif}
				<svg class="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
					<circle
						class="opacity-25"
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						stroke-width="4"
						fill="none"
					></circle>
					<path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					></path>
				</svg>
				Generating GIF ({Math.round(displayGifProgress * 100)}%)
			{:else}
				<svg
					class="mr-2 h-4 w-4"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
						clip-rule="evenodd"
					/>
				</svg>
				Download {animationEnabled && animationType !== 'none' ? 'GIF' : 'PNG'}
			{/if}
		</button>

		<button
			onclick={copyToClipboard}
			class="focus:ring-primary-500 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
		>
			{copySuccess ? 'Copied!' : 'Copy to Clipboard'}
		</button>
	</div>
</div>
