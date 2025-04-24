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
    <div class="min-h-screen flex flex-col items-center bg-white">
        <!-- Header with Logo -->
        <header class="w-full py-4 px-4 sm:px-6 flex items-center justify-center border-b-2 border-[#FFD93D]">
            <div class="flex items-center space-x-2">
                <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="6" fill="#FFD93D"/>
                    <path d="M12 2V4M12 20V22M4 12H2M22 12H20M5.64 5.64L7.05 7.05M16.95 16.95L18.36 18.36M5.64 18.36L7.05 16.95M16.95 7.05L18.36 5.64" stroke="#333333" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <span class="text-xl font-bold text-[#333333]">SOLAR TAYO</span>
            </div>
        </header>

        <!-- Calculator Container -->
        <div class="flex-1 flex items-center justify-center w-full py-8">
            <div class="w-full min-w-[300px] sm:w-[400px] md:w-[500px] p-2 sm:p-4 md:p-8 bg-white rounded-xl shadow-lg mt-4 mb-4 sm:mt-8 sm:mb-8">
                <h1 class="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center text-[#333333]">Solar Panel System Calculator</h1>
                <div class="flex flex-col items-center space-y-3 sm:space-y-4">
                    <div class="w-full sm:w-96">
                        <label class="block mb-1 sm:mb-2 text-sm font-medium text-[#333333]">Electricity Rate (₱ per kWh)</label>
                        <div class="relative">
                            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[#333333]">₱</span>
                            <input 
                                type="number" 
                                v-model="costPerKwh"
                                step="0.1"
                                class="w-full pl-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD93D] focus:border-[#FFD93D] transition-all"
                            >
                        </div>
                    </div>
                    
                    <div class="w-full sm:w-96">
                        <label class="block mb-1 sm:mb-2 text-sm font-medium text-[#333333]">Current Monthly Electricity Bill</label>
                        <div class="relative">
                            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[#333333]">₱</span>
                            <input 
                                type="number" 
                                v-model="monthlyBill" 
                                placeholder="Enter your current bill amount"
                                class="w-full pl-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD93D] focus:border-[#FFD93D] transition-all"
                            >
                        </div>
                    </div>
                    
                    <div class="w-full sm:w-96">
                        <label class="block mb-1 sm:mb-2 text-sm font-medium text-[#333333]">Desired Energy Savings: {{ targetSavings }}%</label>
                        <input 
                            type="range" 
                            v-model="targetSavings"
                            min="0"
                            max="100"
                            step="1"
                            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FFD93D]"
                        >
                    </div>

                    <div class="w-full sm:w-96 mt-4 p-3 sm:p-4 bg-[#F5F5F5] border border-gray-200 rounded-lg space-y-3 sm:space-y-4">
                        <div class="grid grid-cols-2 gap-3 sm:gap-4">
                            <div class="p-2 sm:p-3 bg-white rounded-lg border border-gray-200">
                                <p class="text-sm font-medium text-[#333333] mb-1">Solar Panels</p>
                                <p class="text-lg sm:text-xl font-bold text-[#333333]">
                                    {{ recommendedPanelCount }} <span class="text-xs sm:text-sm font-normal text-gray-600">({{ selectedPanelWattage }}W panels)</span>
                                </p>
                            </div>
                            <div class="p-2 sm:p-3 bg-white rounded-lg border border-gray-200">
                                <p class="text-sm font-medium text-[#333333] mb-1">System Capacity</p>
                                <p class="text-lg sm:text-xl font-bold text-[#333333]">{{ recommendedSystemSize }} kWp</p>
                            </div>
                        </div>

                        <div class="pt-3 sm:pt-4 border-t border-gray-200">
                            <p class="text-sm font-medium text-[#333333] mb-1">Estimated Monthly Savings</p>
                            <p class="text-base sm:text-lg font-semibold text-[#333333]">₱{{ savingsAmount }}</p>
                        </div>
                    </div>

                    <div class="w-full sm:w-96 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
                        <button 
                            @click="isConfigExpanded = !isConfigExpanded"
                            class="flex items-center justify-between w-full text-sm font-medium text-[#333333] border border-[#FFD93D] rounded-lg px-4 py-2 hover:bg-[#FFD93D] transition-colors"
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
                            class="mt-3 sm:mt-4 space-y-4 sm:space-y-6 transition-all duration-200 ease-in-out"
                            :class="{ 'max-h-0 overflow-hidden': !isConfigExpanded, 'max-h-96': isConfigExpanded }"
                        >
                            <div>
                                <label class="block mb-1 sm:mb-2 text-sm font-medium text-[#333333]">Panel Wattage: {{ selectedPanelWattage }}W</label>
                                <input 
                                    type="range" 
                                    v-model="selectedPanelWattage"
                                    :min="MIN_PANEL_WATTAGE"
                                    :max="MAX_PANEL_WATTAGE"
                                    step="10"
                                    class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FFD93D]"
                                >
                                <div class="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>300W</span>
                                    <span>600W</span>
                                </div>
                            </div>

                            <div>
                                <label class="block mb-1 sm:mb-2 text-sm font-medium text-[#333333]">System Efficiency: {{ systemEfficiency }}%</label>
                                <input 
                                    type="range" 
                                    v-model="systemEfficiency"
                                    min="70"
                                    max="95"
                                    step="1"
                                    class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FFD93D]"
                                >
                                <p class="mt-2 text-xs sm:text-sm text-gray-600">Includes panel efficiency, inverter loss, and other system losses</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- FAQ Section -->
                <div class="mt-8 sm:mt-15 pt-6 sm:pt-15 border-t border-gray-200">
                    <h2 class="text-base sm:text-lg font-semibold text-[#333333] mb-3 sm:mb-4">Frequently Asked Questions</h2>
                    <div class="space-y-3 sm:space-y-4">
                        <div class="border border-gray-200 rounded-lg p-3 sm:p-4">
                            <h3 class="font-medium text-[#333333]">How accurate is this calculator?</h3>
                            <p class="mt-2 text-xs sm:text-sm text-gray-600">This calculator provides estimates based on average conditions in the Philippines. Actual results may vary based on your location, roof orientation, shading, and other factors.</p>
                        </div>

                        <div class="border border-gray-200 rounded-lg p-3 sm:p-4">
                            <h3 class="font-medium text-[#333333]">What is the source of the electricity rate?</h3>
                            <p class="mt-2 text-xs sm:text-sm text-gray-600">The default electricity rate is based on Meralco's April 2025 residential rates of ₱13.0127 per kWh. This rate includes generation, transmission, and other charges. You can adjust this rate to match your current electricity provider's rates. Rates may vary depending on your location and consumption level.</p>
                            <p class="mt-2 text-xs sm:text-sm text-gray-500">Source: <a href="https://company.meralco.com.ph/news-and-advisories/higher-rates-april-2025" target="_blank" class="text-[#333333] hover:text-[#FFD93D] underline hover:no-underline">Meralco April 2025 Rates</a></p>
                        </div>

                        <div class="border border-gray-200 rounded-lg p-3 sm:p-4">
                            <h3 class="font-medium text-[#333333]">What is Solar Tayo?</h3>
                            <p class="mt-2 text-xs sm:text-sm text-gray-600">Solar Tayo is an independent website that helps you estimate how many solar panels you need based on your electricity bill and savings goal. Whether you're just curious or seriously planning to go solar, Solar Tayo gives you a simple way to calculate your potential savings.</p>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 text-center">
                    <p class="text-xs sm:text-sm text-gray-600">
                        Made using AI with the help of <a href="https://jolo.xyz/" target="_blank" class="text-[#333333] hover:text-[#FFD93D] underline hover:no-underline">Jolo</a> • 
                        Follow me on <a href="https://x.com/MojoJolo" target="_blank" class="text-[#333333] hover:text-[#FFD93D] underline hover:no-underline">X</a>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>