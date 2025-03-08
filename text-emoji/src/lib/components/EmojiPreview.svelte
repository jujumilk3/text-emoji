<script lang="ts">
	import { onMount } from 'svelte';

	export let text = '';
	export let font = 'sans-serif';
	export let textColor = '#000000';
	export let backgroundColor = '#ffffff';
	export let fontSize = 32;
	export let padding = 10;
	export let horizontalAlign = 'center';
	export let verticalAlign = 'middle';
	export let showGradient = false;
	export let gradientColor = '#ffffff';
	export let gradientDirection = 'to-right';

	let canvas: HTMLCanvasElement;
	let previewSize = 128;
	let smallPreviewSize = 32;

	$: if (canvas) {
		renderEmoji();
	}

	onMount(() => {
		renderEmoji();
	});

	function renderEmoji() {
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

		// Draw text
		ctx.fillStyle = textColor;
		ctx.font = `${fontSize}px ${font}`;
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

		// Draw text
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

	<div class="flex justify-center">
		<button
			on:click={downloadEmoji}
			class="bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
		>
			Download Emoji
		</button>
	</div>
</div>
