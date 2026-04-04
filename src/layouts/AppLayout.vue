<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import SolarCalculator from '../components/SolarCalculator.vue'

const route = useRoute()
const isHomeRoute = computed(() => route.path === '/')
const isBlogIndexRoute = computed(() => route.path === '/blog')
const isCalculatorVisibleOnMobile = ref(false)

watch(
    () => route.path,
    () => {
        isCalculatorVisibleOnMobile.value = false
    }
)
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
                    to="/blog"
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

        <main
            class="flex-1 w-full"
            :class="isHomeRoute ? 'py-8 md:py-12' : 'py-8'"
        >
            <div
                v-if="isHomeRoute"
                class="max-w-3xl mx-auto px-4"
            >
                <div class="text-center mb-8">
                    <h1 class="text-2xl sm:text-3xl font-bold text-[#333333]">Solar Panel Calculator for Filipino Homeowners</h1>
                    <p class="mt-3 text-sm sm:text-base text-gray-600">Estimate your panel count, system size, monthly savings, and ROI from your current electricity bill.</p>
                </div>
                <SolarCalculator />
            </div>

            <div class="max-w-6xl mx-auto px-4 flex flex-col lg:flex-row gap-8 items-start">
                <template v-if="!isHomeRoute">

                    <!-- Calculator Column -->
                    <div
                        v-if="isBlogIndexRoute || isCalculatorVisibleOnMobile"
                        class="w-full lg:hidden"
                    >
                        <SolarCalculator />
                    </div>

                    <div class="hidden w-full lg:block lg:w-[500px] lg:flex-shrink-0">
                        <SolarCalculator />
                    </div>

                    <!-- Content Column (router-driven) -->
                    <div class="flex-1 min-w-0">
                        <div
                            v-if="!isBlogIndexRoute"
                            class="mb-4 lg:hidden"
                        >
                            <button
                                type="button"
                                class="flex w-full items-center justify-between rounded-lg border border-[#FFD93D] bg-white px-4 py-3 text-sm font-medium text-[#333333] shadow-sm transition-colors hover:bg-[#FFD93D]"
                                @click="isCalculatorVisibleOnMobile = !isCalculatorVisibleOnMobile"
                            >
                                <div class="flex items-center space-x-2">
                                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                        <rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" stroke-width="2"/>
                                        <path d="M8 9H16M8 13H12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                    </svg>
                                    <span>{{ isCalculatorVisibleOnMobile ? 'Hide Calculator' : 'Show Calculator' }}</span>
                                </div>
                                <svg
                                    class="w-5 h-5 transform transition-transform duration-200"
                                    :class="{ 'rotate-180': isCalculatorVisibleOnMobile }"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>
                        <RouterView />
                    </div>

                </template>
            </div>
        </main>
    </div>
</template>
