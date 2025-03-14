<script lang="ts">
	import { onMount } from 'svelte';
	import GIF from 'gif.js';
	import { getFontFamily } from '$lib/utils/fontUtils';

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
		horizontalAlign = $bindable('center'),
		verticalAlign = $bindable('middle'),
		lineHeight = $bindable(1.0),
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
		animationDuration = $bindable(1000),
		animationDelay = $bindable(0),
		animationLoop = $bindable(true),
		animationDirection = $bindable('normal')
	} = $props();

	// GIF generation settings
	let gifQuality = $state(10); // 1-20, lower is better quality
	let gifFrameCount = $state(30); // Default frame count
	let gifSmoothing = $state(false); // Enable smooth transition between frames
	let gifOutputSize = $state(128); // Default GIF output size (same as preview size)

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

	// Add a reactive variable for the preview image URL
	let previewImageUrl = $state<string>('');

	// For sliding text animation
	let slidingTextCanvas = $state<HTMLCanvasElement | null>(null);
	let slidingTextWidth = $state(0);
	let slidingTextPadding = 128; // Padding for sliding text animation

	// Track changes to trigger rendering
	// let renderKey = $state(0);

	// Watch for changes in all properties to trigger rendering
	$effect(() => {
		// Create a dependency on all properties that should trigger a render
		const _ = [
			text,
			font,
			textColor,
			backgroundColor,
			fontSize,
			horizontalAlign,
			verticalAlign,
			lineHeight,
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
			animationDuration,
			animationDelay,
			animationLoop,
			animationDirection
			// Remove renderKey from dependencies
			// renderKey
		];

		if (canvas) {
			// If animation is enabled, start animation loop
			if (animationEnabled && animationType !== 'none') {
				// Stop any existing animation first to ensure a clean restart
				stopAnimation();

				// For sliding text animation, prepare the sliding text canvas
				if (animationType === 'sliding-text') {
					prepareSlidingTextCanvas();
				}
				// Start animation with a reset animation start time to ensure proper direction
				animationStartTime = null;
				startAnimation();
			} else {
				// Otherwise, just render once
				stopAnimation();
				renderEmoji();
				// Reset sliding text canvas when switching to non-animated preset
				slidingTextCanvas = null;
			}
		}
	});

	onMount(() => {
		renderEmoji();
		// Preload the worker script
		preloadWorkerScript();

		// Remove the keyboard event listeners setup
		// const cleanup = setupKeyListeners();

		// Initialize the preview image URL after the first render
		if (canvas) {
			previewImageUrl = canvas.toDataURL('image/png');
		}

		// Return cleanup function for onMount
		return () => {
			// Remove the cleanup call for keyboard listeners
			// cleanup();
			stopAnimation();
		};
	});

	// Prepare the sliding text canvas with the text rendered across it
	function prepareSlidingTextCanvas() {
		// Create a temporary canvas for measuring text width
		const tempCanvas = document.createElement('canvas');
		const tempCtx = tempCanvas.getContext('2d');
		if (!tempCtx) return;

		// Set font to measure text width
		tempCtx.font = `${fontSize}px ${getFontFamily(font)}`;

		// Handle multiline text
		let maxWidth = 0;
		let totalHeight = previewSize;

		if (text.includes('\n')) {
			const lines = text.split('\n');
			const calculatedLineHeight = fontSize * lineHeight; // Use the lineHeight property

			// Find the widest line
			lines.forEach((line) => {
				const textMetrics = tempCtx.measureText(line);
				maxWidth = Math.max(maxWidth, Math.ceil(textMetrics.width));
			});

			// Calculate total height needed
			totalHeight = calculatedLineHeight * lines.length;
		} else {
			// Single line text (original behavior)
			const textMetrics = tempCtx.measureText(text);
			maxWidth = Math.ceil(textMetrics.width);
		}

		// Calculate total width needed for sliding text
		// Add extra padding on both sides to ensure smooth scrolling in both directions
		slidingTextWidth = maxWidth + slidingTextPadding * 2;

		// Create or resize the sliding text canvas
		if (!slidingTextCanvas) {
			slidingTextCanvas = document.createElement('canvas');
		}
		slidingTextCanvas.width = slidingTextWidth;
		slidingTextCanvas.height = Math.max(previewSize, totalHeight);

		const ctx = slidingTextCanvas.getContext('2d');
		if (!ctx) return;

		// Clear canvas
		ctx.clearRect(0, 0, slidingTextWidth, slidingTextCanvas.height);

		// Draw background
		if (showGradient) {
			const gradient = createSlidingGradient(ctx);
			ctx.fillStyle = gradient;
		} else {
			ctx.fillStyle = backgroundColor;
		}
		ctx.fillRect(0, 0, slidingTextWidth, slidingTextCanvas.height);

		// Set text properties
		ctx.font = `${fontSize}px ${getFontFamily(font)}`;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';

		// Handle multiline text
		if (text.includes('\n')) {
			const lines = text.split('\n');
			const calculatedLineHeight = fontSize * lineHeight; // Use the lineHeight property
			const totalTextHeight = calculatedLineHeight * lines.length;

			// Calculate starting Y position
			let startY = (slidingTextCanvas.height - totalTextHeight) / 2 + calculatedLineHeight / 2;

			// Draw each line with effects
			lines.forEach((line, index) => {
				const lineY = startY + index * calculatedLineHeight;

				// Apply text effects for each line
				if (textGlow) {
					ctx.save();
					ctx.shadowColor = textGlowColor;
					ctx.shadowBlur = textGlowBlur;
					ctx.shadowOffsetX = 0;
					ctx.shadowOffsetY = 0;
					ctx.fillStyle = textGlowColor;
					ctx.globalAlpha = 0.7;
					ctx.fillText(line, slidingTextWidth / 2, lineY);
					ctx.restore();
				}

				if (textShadow) {
					ctx.save();
					ctx.fillStyle = textShadowColor;
					ctx.shadowColor = textShadowColor;
					ctx.shadowBlur = textShadowBlur;
					ctx.shadowOffsetX = textShadowOffsetX;
					ctx.shadowOffsetY = textShadowOffsetY;
					ctx.fillText(line, slidingTextWidth / 2, lineY);
					ctx.restore();
				}

				if (textBorder) {
					ctx.save();
					ctx.strokeStyle = textBorderColor;
					ctx.lineWidth = textBorderWidth;
					ctx.strokeText(line, slidingTextWidth / 2, lineY);
					ctx.restore();
				}

				// Draw main text
				ctx.fillStyle = textColor;
				ctx.fillText(line, slidingTextWidth / 2, lineY);
			});
		} else {
			// Single line text (original behavior)
			// Apply text effects
			if (textGlow) {
				ctx.save();
				ctx.shadowColor = textGlowColor;
				ctx.shadowBlur = textGlowBlur;
				ctx.shadowOffsetX = 0;
				ctx.shadowOffsetY = 0;
				ctx.fillStyle = textGlowColor;
				ctx.globalAlpha = 0.7;
				ctx.fillText(text, slidingTextWidth / 2, previewSize / 2);
				ctx.restore();
			}

			if (textShadow) {
				ctx.save();
				ctx.fillStyle = textShadowColor;
				ctx.shadowColor = textShadowColor;
				ctx.shadowBlur = textShadowBlur;
				ctx.shadowOffsetX = textShadowOffsetX;
				ctx.shadowOffsetY = textShadowOffsetY;
				ctx.fillText(text, slidingTextWidth / 2, previewSize / 2);
				ctx.restore();
			}

			if (textBorder) {
				ctx.save();
				ctx.strokeStyle = textBorderColor;
				ctx.lineWidth = textBorderWidth;
				ctx.strokeText(text, slidingTextWidth / 2, previewSize / 2);
				ctx.restore();
			}

			// Draw main text
			ctx.fillStyle = textColor;
			ctx.fillText(text, slidingTextWidth / 2, previewSize / 2);
		}
	}

	// Create gradient for sliding text canvas
	function createSlidingGradient(ctx: CanvasRenderingContext2D) {
		let gradient;

		if (gradientDirection === 'to-right') {
			gradient = ctx.createLinearGradient(0, 0, slidingTextWidth, 0);
		} else if (gradientDirection === 'to-bottom') {
			gradient = ctx.createLinearGradient(0, 0, 0, slidingTextCanvas?.height || previewSize);
		} else {
			gradient = ctx.createLinearGradient(
				0,
				0,
				slidingTextWidth,
				slidingTextCanvas?.height || previewSize
			);
		}

		gradient.addColorStop(0, backgroundColor);
		gradient.addColorStop(1, gradientColor);

		return gradient;
	}

	function startAnimation() {
		// Stop any existing animation
		stopAnimation();

		// Reset animation start time
		animationStartTime = null;

		// Start animation loop
		animateEmoji();
	}

	function stopAnimation() {
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
		let progress = (effectiveElapsedTime % animationDuration) / animationDuration;

		// Apply direction
		// For sliding-text, we'll handle the direction in renderAnimationFrame
		// to avoid double-reversing the animation
		if (animationType !== 'sliding-text') {
			if (animationDirection === 'reverse') {
				progress = 1 - progress;
			} else if (animationDirection === 'alternate') {
				const cycle = Math.floor(effectiveElapsedTime / animationDuration);
				if (cycle % 2 === 1) {
					progress = 1 - progress;
				}
			}
		}

		// Render frame with animation progress
		renderAnimationFrame(progress);

		// Update the preview image URL after rendering
		if (canvas) {
			previewImageUrl = canvas.toDataURL('image/png');
		}

		// Continue animation loop if looping is enabled
		if (animationLoop || effectiveElapsedTime < animationDuration) {
			animationFrame = requestAnimationFrame(animateEmoji);
		} else {
			// Render final frame if not looping
			renderAnimationFrame(animationDirection === 'reverse' ? 0 : 1);

			// Update the preview image URL after rendering the final frame
			if (canvas) {
				previewImageUrl = canvas.toDataURL('image/png');
			}
		}
	}

	// Add interpolation function
	function interpolate(start: number, end: number, progress: number): number {
		// Apply easing function - smooth start and end
		// Using sine easing function
		const easedProgress = 0.5 - 0.5 * Math.cos(progress * Math.PI);
		return start + (end - start) * easedProgress;
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

		// Special handling for sliding text animation
		if (animationType === 'sliding-text' && slidingTextCanvas) {
			// Draw background
			if (showGradient) {
				const gradient = createGradient(ctx);
				ctx.fillStyle = gradient;
			} else {
				ctx.fillStyle = backgroundColor;
			}
			ctx.fillRect(0, 0, previewSize, previewSize);

			// Calculate the offset for sliding text
			// The text should move from right to left (or left to right if reversed)
			const totalMovement = slidingTextWidth - previewSize;
			let offset;

			// For sliding-text animation, we handle the direction directly here
			// rather than modifying the progress value in animateEmoji
			if (animationDirection === 'reverse') {
				// Left to right (reverse direction)
				// For reverse, we want to start at the end (right side) and move left
				offset = (1 - progress) * totalMovement;
			} else if (animationDirection === 'alternate') {
				// Alternate between directions
				const cycle = Math.floor(progress * 2);
				const cycleProgress = (progress * 2) % 1;
				offset =
					cycle % 2 === 0 ? cycleProgress * totalMovement : (1 - cycleProgress) * totalMovement;
			} else {
				// Right to left (normal direction)
				// For normal, we want to start at the beginning (left side) and move right
				offset = progress * totalMovement;
			}

			// Draw the portion of the sliding text canvas that should be visible
			ctx.drawImage(
				slidingTextCanvas,
				offset,
				0,
				previewSize,
				previewSize,
				0,
				0,
				previewSize,
				previewSize
			);

			return;
		}

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
					? previewSize - 10
					: 10;
		const baseY =
			verticalAlign === 'middle'
				? previewSize / 2
				: verticalAlign === 'bottom'
					? previewSize - 10
					: 10;

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
			// Apply easing for smooth animation
			const easedProgress = 0.5 - 0.5 * Math.cos(progress * Math.PI * 2);

			switch (animationType) {
				case 'slide-left-to-right':
					translateX = interpolate(-previewSize / 2, previewSize / 2, progress);
					break;
				case 'slide-right-to-left':
					translateX = interpolate(previewSize / 2, -previewSize / 2, progress);
					break;
				case 'slide-top-to-bottom':
					translateY = interpolate(-previewSize / 2, previewSize / 2, progress);
					break;
				case 'slide-bottom-to-top':
					translateY = interpolate(previewSize / 2, -previewSize / 2, progress);
					break;
				case 'fade-in-out':
					// Smooth fade in/out
					alpha =
						progress < 0.5
							? interpolate(0, 1, progress * 2)
							: interpolate(1, 0, (progress - 0.5) * 2);
					break;
				case 'pulse':
					// Smooth pulse effect
					scale = interpolate(0.8, 1.2, easedProgress);
					break;
				case 'rotate':
					// Smooth rotation
					rotation = progress * Math.PI * 2;
					break;
				case 'bounce':
					// Smooth bounce effect
					translateY = -Math.abs(Math.sin(progress * Math.PI)) * 20;
					// Add slight pause effect at the bounce peak
					if (progress > 0.4 && progress < 0.6) {
						const peakFactor = 1 - Math.abs((progress - 0.5) * 10); // Closer to 0.5, closer to 1
						translateY *= 1 + peakFactor * 0.2; // Slightly higher at the peak
					}
					break;
			}
		}

		// Apply transformations
		x += translateX;
		y += translateY;

		// Set font
		ctx.font = `${fontSize * scale}px ${getFontFamily(font)}`;

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

			// Handle multiline text for glow effect
			if (text.includes('\n')) {
				const lines = text.split('\n');
				const calculatedLineHeight = fontSize * scale * lineHeight;
				const totalHeight = calculatedLineHeight * (lines.length - 1);

				let startY;
				if (verticalAlign === 'middle') {
					startY = y - totalHeight / 2;
				} else if (verticalAlign === 'bottom') {
					startY = y - totalHeight;
				} else {
					startY = y;
				}

				lines.forEach((line, index) => {
					const lineY = startY + index * calculatedLineHeight;
					ctx.fillText(line, x, lineY);
				});
			} else {
				ctx.fillText(text, x, y);
			}

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

			// Handle multiline text for shadow effect
			if (text.includes('\n')) {
				const lines = text.split('\n');
				const calculatedLineHeight = fontSize * scale * lineHeight;
				const totalHeight = calculatedLineHeight * (lines.length - 1);

				let startY;
				if (verticalAlign === 'middle') {
					startY = y - totalHeight / 2;
				} else if (verticalAlign === 'bottom') {
					startY = y - totalHeight;
				} else {
					startY = y;
				}

				lines.forEach((line, index) => {
					const lineY = startY + index * calculatedLineHeight;
					ctx.fillText(line, x, lineY);
				});
			} else {
				ctx.fillText(text, x, y);
			}

			ctx.restore();
		}

		if (textBorder) {
			// Draw text border/stroke
			ctx.save();
			ctx.strokeStyle = textBorderColor;
			ctx.lineWidth = textBorderWidth;

			// Handle multiline text for border effect
			if (text.includes('\n')) {
				const lines = text.split('\n');
				const calculatedLineHeight = fontSize * scale * lineHeight;
				const totalHeight = calculatedLineHeight * (lines.length - 1);

				let startY;
				if (verticalAlign === 'middle') {
					startY = y - totalHeight / 2;
				} else if (verticalAlign === 'bottom') {
					startY = y - totalHeight;
				} else {
					startY = y;
				}

				lines.forEach((line, index) => {
					const lineY = startY + index * calculatedLineHeight;
					ctx.strokeText(line, x, lineY);
				});
			} else {
				ctx.strokeText(text, x, y);
			}

			ctx.restore();
		}

		// Draw main text
		ctx.fillStyle = textColor;

		// Handle multiline text
		if (text.includes('\n')) {
			const lines = text.split('\n');
			const calculatedLineHeight = fontSize * scale * lineHeight;
			const totalHeight = calculatedLineHeight * (lines.length - 1);

			// Calculate starting Y position based on vertical alignment
			let startY;
			if (verticalAlign === 'middle') {
				startY = y - totalHeight / 2;
			} else if (verticalAlign === 'bottom') {
				startY = y - totalHeight;
			} else {
				startY = y;
			}

			// Draw each line
			lines.forEach((line, index) => {
				const lineY = startY + index * calculatedLineHeight;
				ctx.fillText(line, x, lineY);

				// Apply the same effects to each line if needed
				if (textBorder) {
					ctx.save();
					ctx.strokeStyle = textBorderColor;
					ctx.lineWidth = textBorderWidth;
					ctx.strokeText(line, x, lineY);
					ctx.restore();
				}
			});
		} else {
			// Single line text (original behavior)
			ctx.fillText(text, x, y);
		}

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

		// Update the preview image URL after rendering
		if (canvas) {
			previewImageUrl = canvas.toDataURL('image/png');
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

			// Create a temporary canvas for scaling if needed
			const tempCanvas = document.createElement('canvas');
			tempCanvas.width = gifOutputSize;
			tempCanvas.height = gifOutputSize;
			const tempCtx = tempCanvas.getContext('2d');

			if (!tempCtx) {
				throw new Error('Failed to get temporary canvas context');
			}

			// Create a GIF encoder with improved quality settings
			const gif = new GIF({
				workers: 4, // 더 많은 워커 사용
				quality: gifQuality, // 사용자 설정 품질
				width: gifOutputSize,
				height: gifOutputSize,
				workerScript: './gif.worker.js',
				background: backgroundColor,
				dither: false, // 디더링 비활성화로 색상 전환 부드럽게
				transparent: null, // 투명도 없음
				debug: true // 디버깅 활성화
			});

			// Verify that the GIF object was created properly
			if (!gif || typeof gif.on !== 'function' || typeof gif.render !== 'function') {
				throw new Error('Failed to initialize GIF encoder properly');
			}

			// 사용자 설정 프레임 수 사용
			const framesCount = gifFrameCount;

			// 애니메이션 속도에 따라 프레임 간 딜레이 조정
			// 빠른 애니메이션은 더 짧은 딜레이, 느린 애니메이션은 더 긴 딜레이
			const speedFactor = Math.min(2, Math.max(0.5, 1000 / animationDuration));
			const frameDelay = Math.max(20, Math.min(100, 40 / speedFactor));

			// Stop any running animation to control our own rendering
			stopAnimation();

			// 특정 애니메이션 유형에 대해 더 많은 프레임 생성
			const needsMoreFrames = ['rotate', 'bounce', 'pulse', 'sliding-text'].includes(animationType);
			let actualFramesCount = needsMoreFrames ? framesCount * 1.5 : framesCount;

			// Double the frame count for alternate direction to ensure a complete cycle
			if (animationDirection === 'alternate') {
				actualFramesCount *= 2;
			}

			// Add frames to the GIF
			for (let i = 0; i < actualFramesCount; i++) {
				// Calculate progress for this frame (0 to 1)
				const rawProgress = (i / actualFramesCount) % 1;

				// Apply animation direction, just like in animateEmoji function
				let progress = rawProgress;
				// For sliding-text, we'll handle the direction in renderAnimationFrame
				// to avoid double-reversing the animation
				if (animationType !== 'sliding-text') {
					if (animationDirection === 'reverse') {
						progress = 1 - rawProgress;
					} else if (animationDirection === 'alternate') {
						const cycle = Math.floor((i / actualFramesCount) * 2);
						if (cycle % 2 === 1) {
							progress = 1 - rawProgress;
						}
					}
				}

				// 부드러운 전환이 활성화된 경우에만 이징 적용
				let easedProgress = progress;
				if (gifSmoothing) {
					// 바운스나 펄스 같은 애니메이션은 이징 함수로 부드럽게
					if (['bounce', 'pulse'].includes(animationType)) {
						// 사인 이징으로 부드러운 움직임
						easedProgress = 0.5 - 0.5 * Math.cos(progress * Math.PI * 2);
					}
					// 회전 애니메이션은 선형 진행
					else if (animationType === 'rotate') {
						// Keep linear progress
					}
					// 슬라이드 애니메이션은 약간의 가속/감속 적용
					else if (animationType.startsWith('slide-') || animationType === 'sliding-text') {
						// 이징 함수로 가속/감속 효과
						easedProgress = 0.5 - 0.5 * Math.cos(progress * Math.PI);
					}
				}

				// Render the frame at this progress point
				renderAnimationFrame(easedProgress);

				// Scale the frame to the desired output size if different from preview size
				if (gifOutputSize !== previewSize && tempCtx) {
					// Clear the temporary canvas
					tempCtx.clearRect(0, 0, gifOutputSize, gifOutputSize);

					// Draw the current frame scaled to the output size
					tempCtx.drawImage(
						canvas,
						0,
						0,
						previewSize,
						previewSize,
						0,
						0,
						gifOutputSize,
						gifOutputSize
					);

					// Add the scaled frame
					gif.addFrame(tempCanvas, {
						copy: true,
						delay: frameDelay,
						dispose: 2 // 이전 프레임을 지우고 새 프레임 그리기 (더 부드러운 전환)
					});
				} else {
					// Add the current canvas content as a frame with optimized settings
					gif.addFrame(canvas, {
						copy: true,
						delay: frameDelay,
						dispose: 2 // 이전 프레임을 지우고 새 프레임 그리기 (더 부드러운 전환)
					});
				}

				// Update progress (non-reactive)
				gifProgress = ((i + 1) / actualFramesCount) * 0.8; // 80% of progress is for frame generation
				// Update display progress (reactive, but only once per frame)
				if (i % 5 === 0 || i === actualFramesCount - 1) {
					displayGifProgress = gifProgress;
				}
			}

			// Add error handler
			gif.on('error' as any, (error: any) => {
				console.error('GIF generation error:', error);
				alert('Error generating GIF: ' + (error instanceof Error ? error.message : String(error)));
				isGeneratingGif = false;
				startAnimation();
			});

			// Event handlers
			gif.on('progress' as any, (p: number) => {
				// Remaining 20% of progress is for rendering
				gifProgress = 0.8 + p * 0.2;
				// Update display progress less frequently to avoid rendering issues
				if (Math.round(p * 10) % 2 === 0) {
					displayGifProgress = gifProgress;
				}
			});

			gif.on('finished' as any, (blob: Blob) => {
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

			// Start rendering the GIF
			gif.render();
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
		// Don't use renderKey anymore
		// renderKey++;
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
			padding: 10,
			lineHeight,
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
			animationDuration,
			animationDelay,
			animationLoop,
			animationDirection,
			// GIF settings
			gifQuality,
			gifFrameCount,
			gifSmoothing,
			gifOutputSize,
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
							src={previewImageUrl}
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
							src={previewImageUrl}
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
							src={previewImageUrl}
							alt="Large preview"
							width={smallPreviewSize * 2}
							height={smallPreviewSize * 2}
						/>
					</div>
				</div>
			</div>
		</div>
	</div>

	{#if animationEnabled && animationType !== 'none'}
		<div class="rounded-md border bg-white p-4">
			<h3 class="mb-4 text-lg font-medium text-gray-900">GIF Quality Settings</h3>

			<div class="space-y-4">
				<div>
					<label for="gif-quality" class="block text-sm font-medium text-gray-700">
						GIF Quality (lower is better quality, larger file size)
					</label>
					<input
						type="range"
						id="gif-quality"
						bind:value={gifQuality}
						min="1"
						max="20"
						step="1"
						class="mt-1 block w-full rounded-md border-gray-300"
					/>
					<div class="mt-1 flex justify-between text-xs text-gray-500">
						<span>High Quality</span>
						<span>Current: {gifQuality}</span>
						<span>Low Quality</span>
					</div>
				</div>

				<div>
					<label for="gif-frames" class="block text-sm font-medium text-gray-700">
						Frame Count (higher is smoother, larger file size)
					</label>
					<input
						type="range"
						id="gif-frames"
						bind:value={gifFrameCount}
						min="5"
						max="60"
						step="10"
						class="mt-1 block w-full rounded-md border-gray-300"
					/>
					<div class="mt-1 flex justify-between text-xs text-gray-500">
						<span>Few</span>
						<span>Current: {gifFrameCount} frames</span>
						<span>Many</span>
					</div>
				</div>

				<div>
					<label for="gif-size" class="block text-sm font-medium text-gray-700">
						GIF Size (output dimensions in pixels)
					</label>
					<input
						type="range"
						id="gif-size"
						bind:value={gifOutputSize}
						min="32"
						max="512"
						step="32"
						class="mt-1 block w-full rounded-md border-gray-300"
					/>
					<div class="mt-1 flex justify-between text-xs text-gray-500">
						<span>Small</span>
						<span>Current: {gifOutputSize}×{gifOutputSize}px</span>
						<span>Large</span>
					</div>
					<div class="mt-1 flex justify-between text-xs text-gray-400">
						<span>32px</span>
						<span>64px</span>
						<span>128px</span>
						<span>256px</span>
						<span>512px</span>
					</div>
					<div class="mt-2 flex space-x-2">
						<button
							type="button"
							class="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50"
							onclick={() => (gifOutputSize = 32)}
						>
							32×32
						</button>
						<button
							type="button"
							class="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50"
							onclick={() => (gifOutputSize = 64)}
						>
							64×64
						</button>
						<button
							type="button"
							class="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50"
							onclick={() => (gifOutputSize = 128)}
						>
							128×128
						</button>
						<button
							type="button"
							class="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50"
							onclick={() => (gifOutputSize = 256)}
						>
							256×256
						</button>
						<button
							type="button"
							class="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50"
							onclick={() => (gifOutputSize = 512)}
						>
							512×512
						</button>
					</div>
					<p class="mt-1 text-xs italic text-gray-500">
						Note: This only affects the exported GIF file size, not the preview.
					</p>
				</div>

				<div class="flex items-center">
					<input
						id="gif-smoothing"
						name="gif-smoothing"
						type="checkbox"
						bind:checked={gifSmoothing}
						class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
					/>
					<label for="gif-smoothing" class="ml-2 block text-sm text-gray-900">
						Enable smooth transition between frames
					</label>
				</div>
			</div>
		</div>
	{/if}

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
				{#if animationEnabled && animationType !== 'none'}
					<span class="flex flex-col">
						<span>Download GIF</span>
						<span class="text-xs">(Slack icon size limit is 128KB)</span>
					</span>
				{:else}
					Download PNG
				{/if}
			{/if}
		</button>

		{#if !animationEnabled || animationType === 'none'}
			<button
				onclick={copyToClipboard}
				class="focus:ring-primary-500 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
			>
				{copySuccess ? 'Copied!' : 'Copy to Clipboard'}
			</button>
		{/if}
	</div>
</div>
