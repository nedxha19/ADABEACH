<script>
    import { enhance } from '$app/forms';
    let { data } = $props();
</script>

<main class="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 via-orange-50 to-yellow-100 p-6">
    <div class="w-full max-w-xl rounded-2xl bg-white/80 backdrop-blur-lg p-8 shadow-lg border border-blue-200">
        <h1 class="mb-6 text-center text-3xl font-bold text-blue-800 tracking-tight">Add New Menu Item</h1>

        <form action="?/addItem" method="POST" use:enhance class="space-y-6" enctype="multipart/form-data">
            <!-- Category Selection -->
            <label class="block">
                <span class="font-medium text-blue-700">Category</span>
                <select
                    name="category_id"
                    required
                    class="mt-2 block w-full rounded-lg border border-blue-300 bg-white/50 px-4 py-3 text-blue-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-400/50 transition-all"
                >
                    <option value="">Select a category</option>
                    {#each data.categories as category}
                        <option value={category.id}>{category.name}</option>
                    {/each}
                </select>
            </label>

            <!-- Item Name -->
            <label class="block">
                <span class="font-medium text-blue-700">Item Name</span>
                <input
                    type="text"
                    name="name"
                    required
                    class="mt-2 block w-full rounded-lg border border-blue-300 bg-white/50 px-4 py-3 text-blue-800 placeholder-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-400/50 transition-all"
                    placeholder="e.g., Tropical Cocktail"
                />
            </label>

            <!-- Description -->
            <label class="block">
                <span class="font-medium text-blue-700">Description</span>
                <textarea
                    name="description"
                    rows="4"
                    class="mt-2 block w-full rounded-lg border border-blue-300 bg-white/50 px-4 py-3 text-blue-800 placeholder-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-400/50 transition-all"
                    placeholder="Describe the item..."
                ></textarea>
            </label>

            <!-- Price -->
            <label class="block">
                <span class="font-medium text-blue-700">Price ($)</span>
                <input
                    type="number"
                    name="price"
                    step="0.01"
                    min="0"
                    required
                    class="mt-2 block w-full rounded-lg border border-blue-300 bg-white/50 px-4 py-3 text-blue-800 placeholder-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-400/50 transition-all"
                    placeholder="0.00"
                />
            </label>

            <!-- Image Upload -->
            <label class="block">
                <span class="font-medium text-blue-700">Item Image</span>
                <input
                    type="file"
                    name="image"
                    accept="image/*"
                    class="mt-2 block w-full cursor-pointer rounded-lg border border-blue-300 bg-white/50 px-4 py-3 text-blue-800 file:mr-4 file:rounded-lg file:border-0 file:bg-orange-400 file:px-4 file:py-2 file:text-white file:font-medium file:transition-all file:hover:bg-orange-500"
                />
            </label>

            <!-- Submit Button -->
            <button
                type="submit"
                class="w-full rounded-lg bg-orange-400 px-6 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:bg-orange-500"
            >
                Add Menu Item
            </button>
        </form>
    </div>
</main>