<script>
	import { enhance } from '$app/forms';
	import { fade, scale } from 'svelte/transition';
	export let data;
</script>

<section class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 p-8">
	<div class="mx-auto max-w-7xl">
		<!-- Header -->
		<div class="mb-8 flex flex-col items-center gap-2">
			<h1 class="text-3xl font-bold text-gray-800">🍹 Menu Management</h1>
			<a
				href="/admin/gallery/new"
				class="text-sm font-medium text-orange-600 hover:underline"
			>
				+ Add New Menu Item
			</a>
		</div>

		<!-- Add Category -->
		<div class="mb-10 rounded-xl bg-white shadow-lg border border-gray-200 p-6">
			<h2 class="mb-4 text-lg font-semibold text-gray-800">➕ Add New Category</h2>
			<form action="?/addCategory" method="POST" use:enhance class="grid gap-4 sm:grid-cols-2">
				<input
					type="text"
					name="name"
					placeholder="Category Name"
					required
					class="rounded-lg border border-gray-300 px-3 py-2 text-gray-800 focus:ring-2 focus:ring-orange-400"
				/>
				<input
					type="text"
					name="description"
					placeholder="Category Description"
					class="rounded-lg border border-gray-300 px-3 py-2 text-gray-800 focus:ring-2 focus:ring-orange-400"
				/>
				<div class="sm:col-span-2">
					<button
						type="submit"
						class="w-full rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white shadow-md hover:bg-orange-600"
					>
						Add Category
					</button>
				</div>
			</form>
		</div>

		<!-- Menu Items Grid -->
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.menuItems as item (item.id)}
				<div
					class="rounded-xl overflow-hidden bg-white shadow-md border border-gray-200 hover:shadow-xl transition transform hover:-translate-y-1"
					in:fade
					out:fade
				>
					<!-- Image -->
					{#if item.image_url}
						<div class="relative">
							<img
								src={item.image_url}
								alt={item.name}
								class="h-48 w-full object-cover"
								loading="lazy"
							/>
							<span class="absolute top-2 left-2 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-md">
								{item.category_name}
							</span>
						</div>
					{/if}

					<!-- Content -->
					<div class="p-5 flex flex-col justify-between h-56">
						<div>
							<h3 class="mb-1 text-lg font-bold text-gray-800">{item.name}</h3>
							<p class="mb-3 text-sm text-gray-600 line-clamp-3">{item.description}</p>
							<p class="font-bold text-orange-500">${item.price}</p>
						</div>

						<!-- Actions -->
						<div class="mt-4 flex gap-2 justify-end">
							<a
								href={`/admin/gallery/edit/${item.id}`}
								class="px-3 py-2 rounded-md text-sm font-medium bg-blue-500 text-white hover:bg-blue-600"
							>
								Edit
							</a>
							<form action="?/deleteItem" method="POST" use:enhance>
								<input type="hidden" name="id" value={item.id} />
								<button
									type="submit"
									class="px-3 py-2 rounded-md text-sm font-medium bg-red-500 text-white hover:bg-red-600"
								>
									Delete
								</button>
							</form>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
