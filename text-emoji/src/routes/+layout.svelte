<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<svelte:head>
	<title>Text Emoji Generator</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<header class="bg-white shadow">
		<div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
			<a href="/text-emoji/">
				<h1 class="text-primary-600 text-2xl font-bold">Text Emoji Generator</h1>
			</a>
			<div class="flex items-center">
				<a
					href="https://github.com/jujumilk3/text-emoji"
					target="_blank"
					rel="noopener noreferrer"
					class="hover:text-primary-600 text-gray-600"
				>
					<img src="/text-emoji/github-icon.svg" alt="GitHub" class="h-10 w-10" />
				</a>
			</div>
			<!-- <nav>
				  <ul class="flex space-x-4">
					  <li><a href="/" class="hover:text-primary-600 text-gray-600">Home</a></li>
					  <li><a href="/about" class="hover:text-primary-600 text-gray-600">About</a></li>
				  </ul>
			  </nav> -->
		</div>
	</header>

	<main class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
		{@render children()}
	</main>

	<footer class="mt-auto bg-white">
		<div class="mx-auto max-w-7xl px-4 py-4 text-center text-gray-500 sm:px-6 lg:px-8">
			<p>
				© {new Date().getFullYear()} Text Emoji Generator. Inspired by
				<a
					href="https://emoji-gen.ninja/en/"
					class="text-primary-600 hover:underline"
					target="_blank"
					rel="noopener noreferrer">emoji-gen.ninja</a
				>
			</p>
		</div>
	</footer>
</div>
