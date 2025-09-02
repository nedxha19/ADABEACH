

<script>
    import { enhance } from '$app/forms';
    export let form;
</script>

<div class="flex min-h-screen items-center justify-center bg-lightblue-100 p-4">
    <div class="w-full max-w-md rounded-2xl border border-[#FF4F00] bg-[#1a1a1a] p-8 shadow-xl">
        <div class="mb-8 text-center">
            <h1 class="text-3xl font-bold text-[#FF4F00]">Create Account</h1>
            <p class="mt-2 text-gray-400">Create an admin account for ADA Beach</p>
        </div>

        <form method="POST" action="?/register" use:enhance class="space-y-5">
            <div>
                <label for="email" class="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    class="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:border-transparent transition"
                    placeholder="your@email.com"
                />
            </div>

            <div>
                <label for="username" class="block text-sm font-medium text-gray-300 mb-2">Username</label>
                <input
                    type="text"
                    name="username"
                    id="username"
                    required
                    class="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:border-transparent transition"
                    placeholder="Choose a username"
                />
            </div>

            <div>
                <label for="password" class="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    required
                    class="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:border-transparent transition"
                    placeholder="Create a password"
                />
            </div>

            <div>
                <label for="confirmPassword" class="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    required
                    class="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:border-transparent transition"
                    placeholder="Confirm your password"
                />
            </div>

            <button
                type="submit"
                class="w-full bg-[#FF4F00] hover:bg-[#FF4F00]/90 text-white py-3.5 px-4 rounded-lg font-medium transition-all duration-300"
            >
                Create Account
            </button>

            {#if form && !form.success}
                <div class="p-3 bg-red-900/30 border border-red-800/50 rounded-lg text-red-300 text-sm">
                    {form.message}
                </div>
            {/if}

            <div class="text-center pt-4">
                <p class="text-sm text-gray-500">
                    Already have an account?
                    <a href="/login" class="font-medium text-[#FF4F00] hover:text-[#FF4F00]/80 transition ml-1">
                        Login here
                    </a>
                </p>
            </div>
        </form>
    </div>
</div>
