<script>
    import { enhance } from '$app/forms';
    export let form;
</script>

<div class="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#005C99] to-[#00A3E0] p-4">
    <div class="w-full max-w-md rounded-2xl border border-[#00A3E0] bg-[#F5F5F0] p-8 shadow-xl">
        <div class="mb-8 text-center">
            <h1 class="text-3xl font-bold text-[#005C99]">ADA Beach Admin</h1>
            <p class="mt-2 text-gray-600">Sign in to access the admin dashboard</p>
        </div>

        <form method="POST" action="?/login" use:enhance class="space-y-6">
            <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00A3E0] focus:border-transparent transition"
                    placeholder="your@email.com"
                />
            </div>

            <div>
                <label for="password" class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    required
                    class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00A3E0] focus:border-transparent transition"
                    placeholder="••••••••"
                />
            </div>

            <button
                type="submit"
                class="w-full bg-[#00A3E0] hover:bg-[#00A3E0]/90 text-white py-3.5 px-4 rounded-lg font-medium transition-all duration-300"
            >
                Sign In
            </button>

            {#if form && !form.success}
                <div class="p-3 bg-red-100/30 border border-red-400/50 rounded-lg text-red-600 text-sm">
                    {form.message}
                </div>
            {/if}

            <div class="text-center pt-4">
                <p class="text-sm text-gray-500">
                    Don't have an account?
                    <a href="/admin/register" class="font-medium text-[#00A3E0] hover:text-[#00A3E0]/80 transition ml-1">
                        Register here
                    </a>
                </p>
            </div>
        </form>
    </div>
</div>