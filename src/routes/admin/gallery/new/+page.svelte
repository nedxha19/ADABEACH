<script>
  import { enhance } from '$app/forms';
  export let data;

  let preview = '';
  const onFile = (e) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return (preview = '');
    const ok = ['image/jpeg','image/png','image/webp','image/avif'].includes(file.type) && file.size <= 5*1024*1024;
    if (!ok) { e.currentTarget.value = ''; return (preview = ''); }
    const reader = new FileReader();
    reader.onload = () => (preview = reader.result);
    reader.readAsDataURL(file);
  };
</script>

<main class="min-h-screen bg-gradient-to-br from-sky-50 via-white to-amber-50 p-6 sm:p-8">
  <div class="mx-auto w-full max-w-2xl rounded-2xl border border-neutral-200 bg-white/90 p-6 sm:p-8 shadow-xl backdrop-blur">
    <header class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-semibold tracking-tight text-neutral-900">Add Menu Item</h1>
      <a
        href="/admin/gallery"
        class="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-800 shadow-sm transition hover:bg-neutral-50"
        aria-label="Back to Gallery"
      >
        ← Back
      </a>
    </header>

    <form
      action="?/addItem"
      method="POST"
      use:enhance
      enctype="multipart/form-data"
      class="space-y-5"
    >
      <!-- Category -->
      <select
        name="category_id"
        required
        aria-label="Category"
        class="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-[15px] text-neutral-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
      >
        <option value="">Select a category</option>
        {#each data.categories as c}
          <option value={c.id}>{c.name}</option>
        {/each}
      </select>

      <!-- Name + Price -->
      <div class="grid gap-4 sm:grid-cols-2">
        <input
          name="name"
          required
          aria-label="Item name"
          placeholder="e.g., Grilled Sea Bass *"
          class="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-[15px] text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
        />
        <input
          type="number"
          step="0.01"
          min="0"
          name="price"
          required
          aria-label="Price"
          placeholder="0.00 *"
          class="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-[15px] text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
        />
      </div>

      <!-- Description -->
      <textarea
        name="description"
        aria-label="Description"
        placeholder="Short description (optional)"
        class="min-h-[96px] w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-[15px] text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
      ></textarea>

      <!-- Image -->
      <div>
        <input
          type="file"
          name="image"
          accept="image/*"
          aria-label="Item image"
          on:change={onFile}
          class="block w-full cursor-pointer rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-[15px] text-neutral-900 outline-none transition file:mr-3 file:rounded-md file:border-0 file:bg-sky-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-sky-700 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
        />
        {#if preview}
          <img
            alt="Preview"
            src={preview}
            class="mt-3 h-40 w-full rounded-xl object-cover ring-1 ring-neutral-200"
          />
        {/if}
      </div>

      <!-- Submit -->
      <button
        type="submit"
        class="w-full inline-flex items-center justify-center rounded-xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-300"
      >
        Add Item
      </button>
    </form>
  </div>
</main>
