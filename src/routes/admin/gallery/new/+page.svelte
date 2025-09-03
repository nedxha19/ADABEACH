<script>
	import { enhance } from '$app/forms';
	export let data;
</script>

<main class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-orange-50 p-6">
	<div class="w-full max-w-lg rounded-2xl bg-white shadow-xl p-8 border border-gray-200">
		<h1 class="mb-6 text-center text-2xl font-bold text-gray-800">➕ Add New Menu Item</h1>

		<form
			action="?/addItem"
			method="POST"
			use:enhance
			enctype="multipart/form-data"
			class="space-y-5"
		>
			<!-- Category -->
			<div>
				<label class="block text-sm font-medium text-gray-700">Category</label>
				<select
					name="category_id"
					required
					class="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 focus:ring-2 focus:ring-orange-400"
				>
					<option value="">Select a category</option>
					{#each data.categories as category}
						<option value={category.id}>{category.name}</option>
					{/each}
				</select>
			</div>

			<!-- Item Name -->
			<div>
				<label class="block text-sm font-medium text-gray-700">Item Name</label>
				<input
					type="text"
					name="name"
					required
					placeholder="e.g., Tropical Cocktail"
					class="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-orange-400"
				/>
			</div>

			<!-- Description -->
			<div>
				<label class="block text-sm font-medium text-gray-700">Description</label>
				<textarea
					name="description"
					rows="3"
					placeholder="Describe the item..."
					class="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-orange-400"
				></textarea>
			</div>

			<!-- Price -->
			<div>
				<label class="block text-sm font-medium text-gray-700">Price ($)</label>
				<input
					type="number"
					name="price"
					step="0.01"
					min="0"
					required
					placeholder="0.00"
					class="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-orange-400"
				/>
			</div>

			<!-- Image Upload -->
			<div>
				<label class="block text-sm font-medium text-gray-700">Item Image</label>
				<input
					type="file"
					name="image"
					accept="image/*"
					class="mt-2 w-full text-gray-700 cursor-pointer file:mr-3 file:rounded-md file:border-0 file:bg-orange-500 file:px-4 file:py-2 file:text-white file:font-medium hover:file:bg-orange-600"
				/>
			</div>

			<!-- Submit -->
			<button
				type="submit"
				class="w-full rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white shadow-md hover:bg-orange-600 transition"
			>
				Add Item
			</button>
		</form>
	</div>
</main>
