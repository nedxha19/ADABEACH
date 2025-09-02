<script>
    import { enhance } from '$app/forms';
    import { slide } from 'svelte/transition';
    let { data } = $props();
</script>

<section class="flex-1 bg-gradient-to-br from-blue-100 via-orange-50 to-yellow-100 p-6">
    <div class="mx-auto max-w-7xl">
        <div class="mb-8 text-center">
            <h1 class="mb-3 text-2xl font-bold text-blue-800 tracking-tight">Menu Management</h1>
            <a
                href="/admin/gallery/new"
                class="text-sm font-medium text-blue-600 hover:text-orange-400 transition-colors"
            >
                Add New Menu Item
            </a>
        </div>

        <!-- Add Category Form -->
        <div class="mb-10 rounded-2xl bg-white/80 backdrop-blur-lg p-6 shadow-lg border border-blue-200">
            <h2 class="mb-4 text-xl font-semibold text-blue-800">Add New Category</h2>
            <form action="?/addCategory" method="POST" use:enhance class="space-y-4">
                <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <input
                        type="text"
                        name="name"
                        placeholder="Category Name"
                        required
                        class="rounded-lg border border-blue-300 bg-white/50 px-4 py-3 text-blue-800 placeholder-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-400/50 transition-all"
                    />
                    <input
                        type="text"
                        name="description"
                        placeholder="Category Description"
                        class="rounded-lg border border-blue-300 bg-white/50 px-4 py-3 text-blue-800 placeholder-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-400/50 transition-all"
                    />
                </div>
                <button
                    type="submit"
                    class="rounded-lg bg-orange-400 px-6 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:bg-orange-500"
                >
                    Add Category
                </button>
            </form>
        </div>

        <!-- Menu Items Grid -->
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {#each data.menuItems as item (item.id)}
                <div
                    class="overflow-hidden rounded-2xl bg-white/80 backdrop-blur-lg shadow-lg border border-blue-200 transition-all duration-300 hover:shadow-xl hover:scale-105"
                    transition:slide
                >
                    {#if item.image_url}
                        <img src={item.image_url} alt={item.name} class="h-48 w-full object-cover" loading="lazy" />
                    {/if}

                    <div class="p-5">
                        <p class="mb-1 text-xs font-medium text-blue-600">{item.category_name}</p>
                        <h3 class="mb-2 text-lg font-semibold text-blue-800">{item.name}</h3>
                        <p class="mb-3 text-sm text-gray-600 line-clamp-2">{item.description}</p>
                        <p class="mb-4 font-bold text-orange-400">${item.price}</p>

                        <form action="?/deleteItem" method="POST" use:enhance class="text-right">
                            <input type="hidden" name="id" value={item.id} />
                            <button
                                type="submit"
                                class="rounded-lg bg-orange-400 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:bg-orange-500"
                            >
                                Delete
                            </button>
                        </form>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</section>