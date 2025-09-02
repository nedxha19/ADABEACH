<script>
    export let data;
    
    // Function to handle fade-in animations
    function animateOnScroll() {
        if (typeof window !== 'undefined') {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, { threshold: 0.1 });

            const cards = document.querySelectorAll('.menu-card');
            cards.forEach(card => observer.observe(card));
        }
    }
    
    // Execute animation after component mounts
    import { onMount } from 'svelte';
    onMount(animateOnScroll);
</script>

<svelte:head>
    <title>Seaside Bistro - Menu</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .gradient-bg {
            background: linear-gradient(135deg, #1e3a8a, #60a5fa);
        }
        .menu-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .menu-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
        }
        .fade-in {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .fade-in.visible {
            opacity: 1;
            transform: translateY(0);
        }
        .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
    </style>
</svelte:head>

<!-- Navbar -->
<nav class="gradient-bg text-white fixed w-full top-0 z-10 shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
            <div class="flex-shrink-0">
                <a href="/" class="text-2xl font-bold">Seaside Bistro</a>
            </div>
            <div class="hidden md:flex space-x-8">
                <a href="#menu" class="hover:text-blue-200 transition">Menu</a>
            </div>
            <div class="md:hidden">
                
            </div>
        </div>
    </div>
    <div id="mobile-menu" class="hidden md:hidden bg-blue-800">
        <div class="flex flex-col space-y-4 px-4 py-6">
            <a href="#menu" class="hover:text-blue-200">Menu</a>
        </div>
    </div>
</nav>

<!-- Hero Section -->
<section class="h-screen bg-cover bg-center" style="background-image: url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop');">
    <div class="flex items-center justify-center h-full bg-black bg-opacity-40">
        <div class="text-center text-white">
            <h1 class="text-5xl font-bold mb-4">Welcome to Seaside Bistro</h1>
            <p class="text-xl mb-6">Savor fresh seafood and coastal flavors with a stunning ocean view.</p>
            <a href="#menu" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full transition">Explore Our Menu</a>
        </div>
    </div>
</section>

<!-- Menu Section -->
<section id="menu" class="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
    <h2 class="text-4xl font-bold text-center mb-12">Our Menu</h2>
    
    {#if Object.keys(data.menuByCategory).length === 0}
        <div class="text-center py-12">
            <p class="text-gray-600 text-lg">No menu items available yet. Please check back later.</p>
        </div>
    {:else}
        {#each Object.entries(data.menuByCategory) as [category, items]}
            <div class="mb-16">
                <h3 class="text-3xl font-semibold mb-8 text-center text-blue-800">{category}</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {#each items as item}
                        <div class="menu-card fade-in bg-white rounded-lg shadow-md overflow-hidden">
                            {#if item.image_url}
                                <img src={item.image_url} alt={item.name} class="h-48 w-full object-cover" />
                            {:else}
                                <div class="h-48 w-full bg-gray-200 flex items-center justify-center">
                                    <span class="text-gray-500">No image</span>
                                </div>
                            {/if}
                            <div class="p-6">
                                <h4 class="text-2xl font-semibold mb-2 text-blue-800">{item.name}</h4>
                                <p class="text-gray-600 mb-4">{item.description}</p>
                                <p class="text-blue-600 font-bold">${item.price}</p>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        {/each}
    {/if}
</section>

<!-- Footer -->
<footer class="gradient-bg text-white py-3">
    <div class="mt-2 text-center">
        <p>&copy; 2025 Seaside Bistro. All rights reserved.</p>
    </div>
</footer>

