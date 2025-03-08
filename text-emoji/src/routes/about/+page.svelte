<script lang="ts">
	// About page
</script>

<div class="py-6">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="mb-8 text-center">
			<h1 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">About Slack Emoji Generator</h1>
			<p class="mx-auto mt-3 max-w-2xl text-xl text-gray-500 sm:mt-4">
				A simple tool to create custom text-based emojis for Slack
			</p>
		</div>

		<div class="overflow-hidden rounded-lg bg-white shadow">
			<div class="px-4 py-5 sm:p-6">
				<div class="prose prose-primary max-w-none">
					<h2>What is this?</h2>
					<p>
						Slack Emoji Generator is a free tool that allows you to create custom text-based emojis
						for Slack. It's inspired by <a
							href="https://emoji-gen.ninja/en/"
							target="_blank"
							rel="noopener noreferrer">emoji-gen.ninja</a
						>
						but built with SvelteKit for a modern, responsive user experience.
					</p>

					<h2>How does it work?</h2>
					<p>
						The tool uses HTML Canvas to generate PNG images from your text input. You can customize
						the font, colors, size, and position of your text to create the perfect emoji for your
						Slack workspace.
					</p>

					<h2>Features</h2>
					<ul>
						<li>Simple text input with character limit</li>
						<li>Multiple font options</li>
						<li>Custom text and background colors</li>
						<li>Gradient background option</li>
						<li>Size and position controls</li>
						<li>Real-time preview in different sizes</li>
						<li>One-click download</li>
					</ul>

					<h2>How to add custom emojis to Slack</h2>
					<ol>
						<li>Create and download your emoji from this tool</li>
						<li>Go to your Slack workspace in a web browser</li>
						<li>Click on the workspace name in the top left</li>
						<li>Select "Customize Slack" from the dropdown menu</li>
						<li>Click on the "Emoji" tab</li>
						<li>Click "Add Custom Emoji"</li>
						<li>Upload your emoji image and give it a name</li>
						<li>Click "Save"</li>
					</ol>

					<h2>Privacy</h2>
					<p>
						All emoji generation happens directly in your browser. We don't store your emojis or any
						data about them on our servers.
					</p>

					<h2>Open Source</h2>
					<p>This project is open source and available on GitHub. Contributions are welcome!</p>
				</div>
			</div>
		</div>

		<div class="mt-8 text-center">
			<a
				href="/"
				class="bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
			>
				Back to Generator
			</a>
		</div>
	</div>
</div>
