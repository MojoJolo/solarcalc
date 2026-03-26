<script setup>
import SolarCalculator from '../components/SolarCalculator.vue'
</script>

<template>
    <div class="min-h-screen flex flex-col bg-white">
        <!-- Header -->
        <header class="w-full border-b-2 border-[#FFD93D]" role="banner">
            <div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <RouterLink to="/" class="flex items-center space-x-2">
                <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Solar Tayo sun logo">
                    <circle cx="12" cy="12" r="6" fill="#FFD93D"/>
                    <path d="M12 2V4M12 20V22M4 12H2M22 12H20M5.64 5.64L7.05 7.05M16.95 16.95L18.36 18.36M5.64 18.36L7.05 16.95M16.95 7.05L18.36 5.64" stroke="#333333" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <span class="text-xl font-bold text-[#333333]">SOLAR TAYO</span>
            </RouterLink>

            <nav class="flex items-center space-x-6 text-sm font-medium" aria-label="Site navigation">
                <RouterLink
                    to="/"
                    class="text-[#666666] hover:text-[#333333] transition-colors"
                    active-class="text-[#333333] border-b-2 border-[#FFD93D]"
                >Blog</RouterLink>
                <RouterLink
                    to="/about"
                    class="text-[#666666] hover:text-[#333333] transition-colors"
                    active-class="text-[#333333] border-b-2 border-[#FFD93D]"
                >About</RouterLink>
                <RouterLink
                    to="/privacy"
                    class="text-[#666666] hover:text-[#333333] transition-colors"
                    active-class="text-[#333333] border-b-2 border-[#FFD93D]"
                >Privacy</RouterLink>
            </nav>
            </div>
        </header>

        <!-- Two-column layout: calculator always left, content always right -->
        <main class="flex-1 w-full py-8">
            <div class="max-w-6xl mx-auto px-4 flex flex-col lg:flex-row gap-8 items-start">

                <!-- Calculator Column (always present) -->
                <div class="w-full lg:w-[500px] flex-shrink-0">
                    <SolarCalculator />
                </div>

                <!-- Content Column (router-driven) -->
                <div class="flex-1 min-w-0">
                    <RouterView />
                </div>

            </div>
        </main>
    </div>
</template>
