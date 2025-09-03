<script>
  import { enhance } from '$app/forms';
  export let data;

  // UI state
  let q = '';                  // search
  let cat = '';                // filter category id (string)
  let selected = new Set();    // bulk selection
  let editing = null;          // { id, name, description, price, category_id }
  let busy = false;

  const money = (n) => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(n);

  // derived list
  $: filtered = data.items.filter(it => {
    const matchQ = !q || [it.name, it.description, it.category_name].some(s => (s || '').toLowerCase().includes(q.toLowerCase()));
    const matchC = !cat || String(it.category_id) === String(cat);
    return matchQ && matchC;
  });

  const toggleAll = (checked) => {
    selected = new Set(checked ? filtered.map(i => i.id) : []);
  };

  const toggleSel = (id) => {
    const s = new Set(selected);
    s.has(id) ? s.delete(id) : s.add(id);
    selected = s;
  };

  const startEdit = (it) => {
    editing = { id: it.id, name: it.name, description: it.description, price: it.price, category_id: it.category_id };
  };
  const stopEdit = () => editing = null;
</script>

<section class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 p-8">
  <div class="mx-auto max-w-7xl">
    <!-- Header / Toolbar -->
    <div class="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-neutral-900">Menu Gallery</h1>
        <p class="text-neutral-500">Manage items, categories, and media.</p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <a href="/admin/gallery/new" class="btn-primary">+ Add Item</a>
        <form action="?/bulkDelete" method="POST" use:enhance={{ pending: () => busy=true, result: () => (busy=false, selected.clear()) }}>
          {#each Array.from(selected) as id}
            <input type="hidden" name="ids" value={id} />
          {/each}
          <button class="btn-danger disabled:opacity-50" type="submit" disabled={!selected.size || busy}>
            Delete Selected ({selected.size})
          </button>
        </form>
      </div>
    </div>

    <!-- Filters -->
    <div class="mb-6 grid gap-3 sm:grid-cols-3">
      <input class="input" placeholder="Search name, description..." bind:value={q} />
      <select class="input" bind:value={cat}>
        <option value="">All categories</option>
        {#each data.categories as c}
          <option value={c.id}>{c.name}</option>
        {/each}
      </select>

      <!-- Add Category -->
      <form action="?/addCategory" method="POST" use:enhance class="grid grid-cols-3 gap-2">
        <input class="input col-span-1" name="name" placeholder="New category" required />
        <input class="input col-span-1" name="description" placeholder="Description (opt.)" />
        <button class="btn-secondary col-span-1" type="submit">Add Category</button>
      </form>
    </div>

    <!-- List -->
    <div class="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      <div class="hidden grid-cols-[48px_1fr_1fr_120px_140px_140px] items-center gap-4 border-b border-neutral-200 px-4 py-3 text-sm text-neutral-600 md:grid">
        <div><input type="checkbox" on:change={(e)=>toggleAll(e.currentTarget.checked)} checked={selected.size===filtered.length && filtered.length>0} /></div>
        <div>Name</div>
        <div class="hidden sm:block">Category</div>
        <div class="hidden sm:block text-right">Price</div>
        <div class="hidden sm:block">Actions</div>
        <div class="hidden sm:block">Preview</div>
      </div>

      {#if !filtered.length}
        <div class="p-6 text-neutral-500">No items match your filters.</div>
      {:else}
        {#each filtered as it (it.id)}
          <div class="grid grid-cols-1 items-center gap-4 border-t border-neutral-100 px-4 py-4 md:grid-cols-[48px_1fr_1fr_120px_140px_140px]">
            <div>
              <input type="checkbox" checked={selected.has(it.id)} on:change={() => toggleSel(it.id)} />
            </div>

            <div>
              <div class="font-medium text-neutral-900">{it.name}</div>
              {#if it.description}<div class="line-clamp-2 text-sm text-neutral-500">{it.description}</div>{/if}
            </div>

            <div class="hidden sm:block">
              <span class="rounded-full bg-neutral-100 px-2.5 py-1 text-sm text-neutral-700">{it.category_name}</span>
            </div>

            <div class="hidden text-right font-medium text-neutral-900 sm:block">{money(it.price)}</div>

            <div class="hidden items-center gap-2 sm:flex">
              <button class="btn-secondary" on:click={() => startEdit(it)}>Edit</button>
              <form action="?/deleteItem" method="POST" use:enhance>
                <input type="hidden" name="id" value={it.id} />
                <button class="btn-danger" type="submit">Delete</button>
              </form>
            </div>

            <div class="hidden sm:block">
              {#if it.image_url}
                <img alt="" src={it.image_url} class="h-16 w-28 rounded-lg object-cover ring-1 ring-neutral-200" loading="lazy" />
              {:else}
                <div class="h-16 w-28 rounded-lg bg-neutral-100"></div>
              {/if}
            </div>
          </div>
        {/each}
      {/if}
    </div>
  </div>

  <!-- Edit Modal -->
  {#if editing}
    <dialog open class="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div class="w-full max-w-lg rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl">
        <header class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-neutral-900">Edit Item</h3>
          <button class="text-neutral-500 hover:text-neutral-800" on:click={stopEdit} aria-label="Close">✕</button>
        </header>

        <form action="?/updateItem" method="POST" use:enhance={{ result: () => stopEdit() }} class="space-y-4">
          <input type="hidden" name="id" value={editing.id} />

          <div class="grid gap-4 sm:grid-cols-2">
            <div>
            
              <input class="input mt-1" name="name" bind:value={editing.name} required />
            </div>
            <div>
             
              <input class="input mt-1" type="number" step="0.01" min="0" name="price" bind:value={editing.price} required />
            </div>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <div class="sm:col-span-1">
              <select class="input mt-1" name="category_id" bind:value={editing.category_id} required>
                {#each data.categories as c}
                  <option value={c.id}>{c.name}</option>
                {/each}
              </select>
            </div>
            <div class="sm:col-span-2">
              
              <textarea class="input mt-1 min-h-[96px]" name="description" bind:value={editing.description}></textarea>
            </div>
          </div>

          <div class="mt-2 flex items-center justify-end gap-2">
            <button type="button" class="btn-secondary" on:click={stopEdit}>Cancel</button>
            <button class="btn-primary" type="submit">Save changes</button>
          </div>
        </form>
      </div>
    </dialog>
  {/if}
</section>


