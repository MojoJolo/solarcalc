<script setup>
import { ref, computed } from 'vue'

// Constants for calculations
const MIN_PANEL_WATTAGE = 300
const MAX_PANEL_WATTAGE = 600
const HOURS_PER_DAY = 130 // average sun hours per year / 365
const KW_TO_WATTS = 1000 // conversion factor
const DEFAULT_EFFICIENCY = 0.80 // 80% system efficiency (including panel efficiency, inverter loss, etc.)

const monthlyBill = ref('10000')
const targetSavings = ref(50) // Default to 50%
const costPerKwh = ref(13.0127)
const systemEfficiency = ref(DEFAULT_EFFICIENCY * 100) // Convert to percentage for display
const selectedPanelWattage = ref(400) // Default to 40W
const isConfigExpanded = ref(false) // Controls visibility of system configuration

const formatNumber = (num) => {
    return Number(num).toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    })
}

const savingsAmount = computed(() => {
    if (!monthlyBill.value) return 0
    return formatNumber(monthlyBill.value * (targetSavings.value / 100))
})

const recommendedSystemSize = computed(() => {
    if (!monthlyBill.value || !costPerKwh.value) return 0
    // Adjust system size based on efficiency
    const baseSize = (monthlyBill.value * (targetSavings.value / 100)) / costPerKwh.value / HOURS_PER_DAY
    return formatNumber(baseSize / (systemEfficiency.value / 100))
})

const recommendedPanelCount = computed(() => {
    if (!recommendedSystemSize.value) return 0
    return Math.ceil(recommendedSystemSize.value * KW_TO_WATTS / selectedPanelWattage.value)
})

</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div class="w-[500px] p-8 bg-white rounded-xl shadow-lg mt-8 mb-8">
            <h1 class="text-2xl font-bold mb-6 text-center text-gray-800">Solar Panel System Calculator</h1>
            <div class="flex flex-col items-center space-y-4">
                <div class="w-96">
                    <label class="block mb-2 text-sm font-medium text-gray-700">Electricity Rate (₱ per kWh)</label>
                    <div class="relative">
                        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₱</span>
                        <input 
                            type="number" 
                            v-model="costPerKwh"
                            step="0.1"
                            class="w-full pl-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        >
                    </div>
                </div>
                
                <div class="w-96">
                    <label class="block mb-2 text-sm font-medium text-gray-700">Current Monthly Electricity Bill</label>
                    <div class="relative">
                        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₱</span>
                        <input 
                            type="number" 
                            v-model="monthlyBill" 
                            placeholder="Enter your current bill amount"
                            class="w-full pl-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        >
                    </div>
                </div>
                
                <div class="w-96">
                    <label class="block mb-2 text-sm font-medium text-gray-700">Desired Energy Savings: {{ targetSavings }}%</label>
                    <input 
                        type="range" 
                        v-model="targetSavings"
                        min="0"
                        max="100"
                        step="1"
                        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    >
                </div>

                <div class="w-96 mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div class="p-3 bg-white rounded-lg border border-gray-200">
                            <p class="text-sm font-medium text-gray-700 mb-1">System Capacity</p>
                            <p class="text-xl font-bold text-gray-800">{{ recommendedSystemSize }} kWp</p>
                        </div>
                        <div class="p-3 bg-white rounded-lg border border-gray-200">
                            <p class="text-sm font-medium text-gray-700 mb-1">Solar Panels</p>
                            <p class="text-xl font-bold text-gray-800">
                                {{ recommendedPanelCount }} <span class="text-sm font-normal text-gray-600">({{ selectedPanelWattage }}W panels)</span>
                            </p>
                        </div>
                    </div>

                    <div class="pt-4 border-t border-gray-200">
                        <p class="text-sm font-medium text-gray-700 mb-1">Estimated Monthly Savings</p>
                        <p class="text-lg font-semibold text-gray-800">₱{{ savingsAmount }}</p>
                    </div>
                </div>

                <div class="w-96 mt-8 pt-6 border-t border-gray-200">
                    <button 
                        @click="isConfigExpanded = !isConfigExpanded"
                        class="flex items-center justify-between w-full text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none"
                    >
                        <span>More System Configuration</span>
                        <svg 
                            class="w-5 h-5 transform transition-transform duration-200" 
                            :class="{ 'rotate-180': isConfigExpanded }"
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    
                    <div 
                        class="mt-4 space-y-6 transition-all duration-200 ease-in-out"
                        :class="{ 'max-h-0 overflow-hidden': !isConfigExpanded, 'max-h-96': isConfigExpanded }"
                    >
                        <div>
                            <label class="block mb-2 text-sm font-medium text-gray-700">Panel Wattage: {{ selectedPanelWattage }}W</label>
                            <input 
                                type="range" 
                                v-model="selectedPanelWattage"
                                :min="MIN_PANEL_WATTAGE"
                                :max="MAX_PANEL_WATTAGE"
                                step="10"
                                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            >
                            <div class="flex justify-between text-xs text-gray-500 mt-1">
                                <span>300W</span>
                                <span>600W</span>
                            </div>
                        </div>

                        <div>
                            <label class="block mb-2 text-sm font-medium text-gray-700">System Efficiency: {{ systemEfficiency }}%</label>
                            <input 
                                type="range" 
                                v-model="systemEfficiency"
                                min="70"
                                max="95"
                                step="1"
                                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            >
                            <p class="mt-2 text-sm text-gray-600">Includes panel efficiency, inverter loss, and other system losses</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- FAQ Section -->
            <div class="mt-15 pt-15 border-t border-gray-200">
                <h2 class="text-lg font-semibold text-gray-800 mb-4">Frequently Asked Questions</h2>
                <div class="space-y-4">
                    <div class="border border-gray-200 rounded-lg p-4">
                        <h3 class="font-medium text-gray-700">How accurate is this calculator?</h3>
                        <p class="mt-2 text-sm text-gray-600">This calculator provides estimates based on average conditions in the Philippines. Actual results may vary based on your location, roof orientation, shading, and other factors.</p>
                    </div>

                    <div class="border border-gray-200 rounded-lg p-4">
                        <h3 class="font-medium text-gray-700">What is the source of the electricity rate?</h3>
                        <p class="mt-2 text-sm text-gray-600">The default electricity rate is based on Meralco's April 2025 residential rates of ₱13.0127 per kWh. This rate includes generation, transmission, and other charges. You can adjust this rate to match your current electricity provider's rates. Rates may vary depending on your location and consumption level.</p>
                        <p class="mt-2 text-sm text-gray-500">Source: <a href="https://company.meralco.com.ph/news-and-advisories/higher-rates-april-2025" target="_blank" class="text-blue-600 hover:underline">Meralco April 2025 Rates</a></p>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="mt-8 pt-6 border-t border-gray-200 text-center">
                <p class="text-sm text-gray-600">
                    Made by <a href="https://jolo.xyz/" target="_blank" class="text-blue-600 hover:underline">Jolo Balbin</a> with the help of AI.
                </p>
            </div>
        </div>
    </div>
</template>