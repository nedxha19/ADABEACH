<script>
  export let data;

  // Simple currency helper
  const money = (n) => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(n);

  const links = [
    { href: '#menu', label: 'Menu' },
    { href: '#about', label: 'About' }
  ];

  const toggleMobile = () => {
    const el = document.getElementById('mobile-menu');
    el && el.classList.toggle('hidden');
  };
</script>

<svelte:head>
  <title>Seaside Bistro</title>
  <meta name="description" content="Fresh seafood and coastal flavors with an ocean view." />
</svelte:head>

<!-- NAV -->
<nav class="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-gradient-to-r from-sky-900/80 to-blue-700/80 backdrop-blur">
  <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
    <a href="/" class="text-xl font-semibold tracking-tight text-white">Seaside&nbsp;Bistro</a>

    <div class="hidden items-center gap-6 md:flex">
      {#each links as l}
        <a class="text-white/90 hover:text-white transition-colors" href={l.href}>{l.label}</a>
      {/each}

      {#if data.user}
        <a class="text-white/90 hover:text-white transition-colors" href="/admin/gallery">Dashboard</a>
        <a class="rounded-lg bg-white/10 px-3 py-1.5 text-white hover:bg-white/20 transition" href="/admin/logout">Logout</a>
      {:else}
        <a class="text-white/90 hover:text-white transition-colors" href="/admin/login">Login</a>
        <a class="rounded-lg bg-white px-3 py-1.5 text-sky-900 hover:bg-blue-50 transition" href="/admin/register">Register</a>
      {/if}
    </div>

    <button class="md:hidden text-white" aria-label="Toggle menu" on:click={toggleMobile}>
      <svg viewBox="0 0 24 24" class="h-7 w-7" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  </div>

  <div id="mobile-menu" class="hidden border-t border-white/10 bg-sky-900/95 md:hidden">
    <div class="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4">
      {#each links as l}
        <a class="text-white/90 hover:text-white transition-colors" href={l.href} on:click={toggleMobile}>{l.label}</a>
      {/each}

      {#if data.user}
        <a class="text-white/90 hover:text-white" href="/admin/gallery" on:click={toggleMobile}>Dashboard</a>
        <a class="rounded-lg bg-white/10 px-3 py-1.5 text-white hover:bg-white/20 transition" href="/admin/logout" on:click={toggleMobile}>Logout</a>
      {:else}
        <a class="text-white/90 hover:text-white" href="/admin/login" on:click={toggleMobile}>Login</a>
        <a class="rounded-lg bg-white px-3 py-1.5 text-sky-900 hover:bg-blue-50 transition" href="/admin/register" on:click={toggleMobile}>Register</a>
      {/if}
    </div>
  </div>
</nav>

<!-- HERO -->
<header class="relative isolate flex min-h-[92vh] items-center overflow-hidden bg-neutral-950 pt-20">
  <img
    src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop"
    alt=""
    class="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover opacity-70" />
  <div class="absolute inset-0 -z-10 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent"></div>

  <div class="mx-auto max-w-7xl px-4">
    <div class="max-w-2xl text-white">
      <h1 class="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
        Ocean-fresh plates. Sunset views. Easy vibes.
      </h1>
      <p class="mt-4 text-white/80">
        Discover seasonal seafood and coastal classics made with care.
      </p>
      <div class="mt-6 flex gap-3">
        <a href="#menu" class="rounded-xl bg-white px-5 py-3 font-medium text-sky-900 hover:bg-blue-50 transition">Explore Menu</a>
      </div>
    </div>
  </div>
</header>

<!-- MENU -->
<section id="menu" class="mx-auto max-w-7xl px-4 py-16">
  <div class="mb-8 flex items-end justify-between">
    <div>
      <h2 class="text-3xl font-semibold tracking-tight text-neutral-900">Our Menu</h2>
      <p class="text-neutral-500">Curated favorites by category.</p>
    </div>
  </div>

  {#if Object.keys(data.menuByCategory).length === 0}
    <div class="rounded-xl border border-neutral-200 bg-white p-8 text-center text-neutral-500">
      Menu coming soon. Check back shortly.
    </div>
  {:else}
    <div class="space-y-12">
      {#each Object.entries(data.menuByCategory) as [category, items]}
        <div>
          <h3 class="mb-6 text-2xl font-semibold text-neutral-900">{category}</h3>
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {#each items as it}
              <article class="group overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md">
                {#if it.image_url}
                  <img src={it.image_url} alt={it.name} class="h-44 w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
                {/if}
                <div class="p-5">
                  <div class="flex items-start justify-between gap-3">
                    <h4 class="text-lg font-semibold text-neutral-900">{it.name}</h4>
                    <span class="shrink-0 rounded-full bg-neutral-100 px-3 py-1 text-sm font-medium text-neutral-700">{money(it.price)}</span>
                  </div>
                  {#if it.description}
                    <p class="mt-2 line-clamp-2 text-sm text-neutral-600">{it.description}</p>
                  {/if}
                </div>
              </article>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</section>

<!-- ABOUT -->
<section id="about" class="bg-neutral-50">
  <div class="mx-auto max-w-7xl px-4 py-16">
    <div class="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
      <div>
        <h2 class="text-3xl font-semibold tracking-tight text-neutral-900">Made by the coast</h2>
        <p class="mt-3 text-neutral-600">
          We source locally and change seasonally—so every visit tastes a little different (in a good way).
        </p>
      </div>
      <div class="rounded-2xl border border-neutral-200 bg-white p-6">
        <dl class="grid grid-cols-2 gap-6">
          <div><dt class="text-sm text-neutral-500">Founded</dt><dd class="text-lg font-medium">2015</dd></div>
          <div><dt class="text-sm text-neutral-500">Outdoor seats</dt><dd class="text-lg font-medium">60+</dd></div>
          <div><dt class="text-sm text-neutral-500">Signature dishes</dt><dd class="text-lg font-medium">8</dd></div>
          <div><dt class="text-sm text-neutral-500">Local suppliers</dt><dd class="text-lg font-medium">12</dd></div>
        </dl>
      </div>
    </div>
  </div>
</section>

<footer class="border-t border-neutral-200 bg-white">
  <div class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-neutral-600 md:flex-row">
    <p>© {new Date().getFullYear()} Seaside Bistro</p>
    <div class="flex items-center gap-4">
      <a class="hover:text-neutral-900" href="#menu">Menu</a>
      <a class="hover:text-neutral-900" href="#about">About</a>
      <a class="hover:text-neutral-900" href="#reserve">Reserve</a>
    </div>
  </div>
</footer>


