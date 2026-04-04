<script setup>
import { ref, computed } from 'vue'

// Constants
const MIN_PANEL_WATTAGE = 300
const MAX_PANEL_WATTAGE = 600
const PEAK_SUN_HOURS_PER_MONTH = 130 // ~4.3 peak sun hours/day × 30 days (Philippines average)
const WATTS_PER_KW = 1000
const DEFAULT_EFFICIENCY = 80 // percent

// Reactive state — all numbers, no mixed string/number types
const monthlyBill = ref(10000)
const targetSavings = ref(50)
const costPerKwh = ref(13.82)
const systemEfficiency = ref(DEFAULT_EFFICIENCY)
const selectedPanelWattage = ref(550)
const totalSystemCost = ref(300000)
const isConfigExpanded = ref(false)
const isHowToUseExpanded = ref(false)

// Format a number for display (commas, up to 2 decimal places)
const formatNumber = (num) => {
    return Number(num).toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    })
}

// Raw numeric computed values — keep math and formatting separate
const savingsAmount = computed(() => {
    if (!monthlyBill.value) return 0
    return monthlyBill.value * (targetSavings.value / 100)
})

const recommendedSystemSize = computed(() => {
    if (!monthlyBill.value || !costPerKwh.value || !systemEfficiency.value) return 0
    const monthlyKwhToOffset = (monthlyBill.value * (targetSavings.value / 100)) / costPerKwh.value
    return monthlyKwhToOffset / PEAK_SUN_HOURS_PER_MONTH / (systemEfficiency.value / 100)
})

const recommendedPanelCount = computed(() => {
    if (!recommendedSystemSize.value) return 0
    return Math.ceil(recommendedSystemSize.value * WATTS_PER_KW / selectedPanelWattage.value)
})

const annualSavings = computed(() => {
    return savingsAmount.value * 12
})

const roiYears = computed(() => {
    if (!totalSystemCost.value || !annualSavings.value) return 0
    return (totalSystemCost.value / annualSavings.value).toFixed(2)
})

// Handle system cost input: strip commas, store raw number, re-format
const formatSystemCost = (event) => {
    const raw = event.target.value.replace(/,/g, '')
    const num = Number(raw)
    if (!isNaN(num) && raw !== '') {
        totalSystemCost.value = num
        event.target.value = formatNumber(num)
    }
}
</script>

<template>
    <div class="w-full p-2 sm:p-4 md:p-8 bg-white rounded-xl shadow-lg">
        <h1 class="text-lg sm:text-xl font-bold mb-2 text-center text-[#333333]">Free Solar Panel Calculator for the Philippines</h1>
        <h2 class="text-sm sm:text-base text-center text-[#666666] mb-4 sm:mb-6">Enter your Meralco bill to estimate your solar panel system size, cost, and monthly savings.</h2>

        <!-- How to Use Section -->
        <div class="mb-6">
            <button
                @click="isHowToUseExpanded = !isHowToUseExpanded"
                class="flex items-center justify-between w-full text-sm font-medium text-[#333333] border border-[#FFD93D] rounded-lg px-4 py-2 hover:bg-[#FFD93D] transition-colors"
            >
                <div class="flex items-center space-x-2">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>
                        <path d="M12 8V12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <circle cx="12" cy="16" r="1" fill="currentColor"/>
                    </svg>
                    <span>How to Use This Calculator</span>
                </div>
                <svg
                    class="w-5 h-5 transform transition-transform duration-200"
                    :class="{ 'rotate-180': isHowToUseExpanded }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <div
                class="mt-3 p-4 bg-[#F5F5F5] border border-gray-200 rounded-lg space-y-2 transition-all duration-200 ease-in-out"
                :class="{ 'hidden': !isHowToUseExpanded }"
            >
                <ol class="list-decimal list-inside space-y-2 text-sm text-gray-600">
                    <li class="pl-2">Enter your current electricity rate per kWh (default is ₱13.82 based on Meralco's March 2026 rates)</li>
                    <li class="pl-2">Input your current monthly electricity bill amount</li>
                    <li class="pl-2">Adjust the desired energy savings percentage using the slider (default is 50%)</li>
                    <li class="pl-2">Click "More System Configuration" to adjust:
                        <ul class="list-disc list-inside ml-4 mt-1">
                            <li>Panel wattage (300W to 600W)</li>
                            <li>System efficiency (70% to 95%)</li>
                        </ul>
                    </li>
                    <li class="pl-2">In the ROI section, enter your total system cost to calculate your return on investment period</li>
                </ol>
            </div>
        </div>

        <div class="flex flex-col items-center space-y-3 sm:space-y-4">
            <div class="w-full">
                <label for="cost-per-kwh" class="block mb-1 sm:mb-2 text-sm font-medium text-[#333333]">Electricity Rate (₱ per kWh)</label>
                <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[#333333]" aria-hidden="true">₱</span>
                    <input
                        id="cost-per-kwh"
                        type="number"
                        v-model="costPerKwh"
                        step="0.1"
                        aria-label="Electricity rate in Philippine Pesos per kilowatt-hour"
                        class="w-full pl-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD93D] focus:border-[#FFD93D] transition-all"
                    >
                </div>
            </div>

            <div class="w-full">
                <label for="monthly-bill" class="block mb-1 sm:mb-2 text-sm font-medium text-[#333333]">Current Monthly Electricity Bill</label>
                <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[#333333]" aria-hidden="true">₱</span>
                    <input
                        id="monthly-bill"
                        type="number"
                        v-model="monthlyBill"
                        placeholder="Enter your current bill amount"
                        aria-label="Monthly electricity bill in Philippine Pesos"
                        class="w-full pl-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD93D] focus:border-[#FFD93D] transition-all"
                    >
                </div>
            </div>

            <div class="w-full">
                <label for="target-savings" class="block mb-1 sm:mb-2 text-sm font-medium text-[#333333]">Desired Energy Savings: {{ targetSavings }}%</label>
                <input
                    id="target-savings"
                    type="range"
                    v-model="targetSavings"
                    min="0"
                    max="100"
                    step="1"
                    aria-label="Target energy savings percentage"
                    class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FFD93D]"
                >
            </div>

            <div class="w-full mt-4 p-3 sm:p-4 bg-[#F5F5F5] border border-gray-200 rounded-lg space-y-3 sm:space-y-4">
                <div class="grid grid-cols-2 gap-3 sm:gap-4">
                    <div class="p-2 sm:p-3 bg-white rounded-lg border border-gray-200">
                        <p class="text-sm font-medium text-[#333333] mb-1">Solar Panels</p>
                        <p class="text-lg sm:text-xl font-bold text-[#333333]">
                            {{ recommendedPanelCount }} <span class="text-xs sm:text-sm font-normal text-gray-600">({{ selectedPanelWattage }}W panels)</span>
                        </p>
                    </div>
                    <div class="p-2 sm:p-3 bg-white rounded-lg border border-gray-200">
                        <p class="text-sm font-medium text-[#333333] mb-1">System Capacity</p>
                        <p class="text-lg sm:text-xl font-bold text-[#333333]">{{ formatNumber(recommendedSystemSize) }} kWp</p>
                    </div>
                </div>

                <div class="pt-3 sm:pt-4 border-t border-gray-200">
                    <p class="text-sm font-medium text-[#333333] mb-1">Estimated Monthly Savings</p>
                    <p class="text-base sm:text-lg font-semibold text-[#333333]">₱{{ formatNumber(savingsAmount) }}</p>
                    <p class="text-xs text-gray-600 mt-1">Annual Savings: ₱{{ formatNumber(annualSavings) }}</p>
                </div>
            </div>

            <div class="w-full mt-6 sm:mt-8">
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
                    :class="{ 'hidden': !isConfigExpanded }"
                >
                    <div>
                        <label for="panel-wattage" class="block mb-1 sm:mb-2 text-sm font-medium text-[#333333]">Panel Wattage: {{ selectedPanelWattage }}W</label>
                        <input
                            id="panel-wattage"
                            type="range"
                            v-model="selectedPanelWattage"
                            :min="MIN_PANEL_WATTAGE"
                            :max="MAX_PANEL_WATTAGE"
                            step="10"
                            aria-label="Solar panel wattage"
                            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FFD93D]"
                        >
                        <div class="flex justify-between text-xs text-gray-500 mt-1">
                            <span>300W</span>
                            <span>600W</span>
                        </div>
                    </div>

                    <div>
                        <label for="system-efficiency" class="block mb-1 sm:mb-2 text-sm font-medium text-[#333333]">System Efficiency: {{ systemEfficiency }}%</label>
                        <input
                            id="system-efficiency"
                            type="range"
                            v-model="systemEfficiency"
                            min="70"
                            max="95"
                            step="1"
                            aria-label="Solar system efficiency percentage"
                            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FFD93D]"
                        >
                        <p class="mt-2 text-xs sm:text-sm text-gray-600">Includes panel efficiency, inverter loss, and other system losses</p>
                    </div>
                </div>
            </div>

            <div class="w-full mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
                <!-- ROI Section -->
                <div class="p-3 sm:p-4 bg-[#F5F5F5] border border-gray-200 rounded-lg space-y-3 sm:space-y-4">
                    <h3 class="text-base sm:text-lg font-semibold text-[#333333]">Return on Investment</h3>

                    <div class="w-full">
                        <label for="system-cost" class="block mb-1 sm:mb-2 text-sm font-medium text-[#333333]">Total System Cost</label>
                        <div class="relative">
                            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[#333333]" aria-hidden="true">₱</span>
                            <input
                                id="system-cost"
                                type="text"
                                :value="formatNumber(totalSystemCost)"
                                @input="formatSystemCost"
                                placeholder="Enter total system cost"
                                aria-label="Total solar system cost in Philippine Pesos"
                                class="w-full pl-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD93D] focus:border-[#FFD93D] transition-all"
                            >
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-3 sm:gap-4">
                        <div class="p-2 sm:p-3 bg-white rounded-lg border border-gray-200">
                            <p class="text-sm font-medium text-[#333333] mb-1">Annual Savings</p>
                            <p class="text-lg sm:text-xl font-bold text-[#333333]">₱{{ formatNumber(annualSavings) }}</p>
                        </div>
                        <div class="p-2 sm:p-3 bg-white rounded-lg border border-gray-200">
                            <p class="text-sm font-medium text-[#333333] mb-1">ROI Period</p>
                            <p class="text-lg sm:text-xl font-bold text-[#333333]">{{ roiYears }} years</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- FAQ Section -->
            <section class="mt-8 sm:mt-15 pt-6 sm:pt-15 border-t border-gray-200" aria-labelledby="faq-heading">
                <h2 id="faq-heading" class="text-base sm:text-lg font-semibold text-[#333333] mb-3 sm:mb-4">Frequently Asked Questions</h2>
                <div class="space-y-3 sm:space-y-4">
                    <div class="border border-gray-200 rounded-lg p-3 sm:p-4">
                        <h3 class="font-medium text-[#333333]">How accurate is this calculator?</h3>
                        <p class="mt-2 text-xs sm:text-sm text-gray-600">This calculator provides estimates based on average conditions in the Philippines. Actual results may vary based on your location, roof orientation, shading, and other factors.</p>
                    </div>

                    <div class="border border-gray-200 rounded-lg p-3 sm:p-4">
                        <h3 class="font-medium text-[#333333]">What is the source of the electricity rate?</h3>
                        <p class="mt-2 text-xs sm:text-sm text-gray-600">The default electricity rate is based on Meralco's March 2026 residential rates of ₱13.82 per kWh. This rate includes generation, transmission, and other charges. You can adjust this rate to match your current electricity provider's rates. Rates may vary depending on your location and consumption level.</p>
                        <p class="mt-2 text-xs sm:text-sm text-gray-500">Source: <a href="https://company.meralco.com.ph/news-and-advisories/higher-rates-april-2025" target="_blank" class="text-[#333333] hover:text-[#FFD93D] underline hover:no-underline">Meralco March 2026 Rates</a></p>
                    </div>

                    <div class="border border-gray-200 rounded-lg p-3 sm:p-4">
                        <h3 class="font-medium text-[#333333]">What is Solar Tayo?</h3>
                        <p class="mt-2 text-xs sm:text-sm text-gray-600">Solar Tayo is an independent website that helps you estimate how many solar panels you need based on your electricity bill and savings goal. Whether you're just curious or seriously planning to go solar, Solar Tayo gives you a simple way to calculate your potential savings.</p>
                    </div>

                    <div class="border border-gray-200 rounded-lg p-3 sm:p-4">
                        <h3 class="font-medium text-[#333333]">How many solar panels do I need in the Philippines?</h3>
                        <p class="mt-2 text-xs sm:text-sm text-gray-600">The number of solar panels depends on your electricity consumption, desired savings, panel wattage, and system efficiency. A typical Filipino household with a ₱5,000–₱10,000 monthly electricity bill may need 4–10 solar panels rated at 550W each. Use the calculator above to get a personalized estimate.</p>
                    </div>

                    <div class="border border-gray-200 rounded-lg p-3 sm:p-4">
                        <h3 class="font-medium text-[#333333]">What is the average ROI for solar panels in the Philippines?</h3>
                        <p class="mt-2 text-xs sm:text-sm text-gray-600">The return on investment for solar panels in the Philippines typically ranges from 5–8 years, depending on system cost, electricity rates, and energy consumption. After the payback period, you enjoy essentially free electricity for the remaining lifespan of the panels (25+ years).</p>
                    </div>

                    <div class="border border-gray-200 rounded-lg p-3 sm:p-4">
                        <h3 class="font-medium text-[#333333]">Is net metering available in the Philippines?</h3>
                        <p class="mt-2 text-xs sm:text-sm text-gray-600">Yes, the Philippines supports net metering through the Renewable Energy Act. If your solar panel system produces more electricity than you consume, the excess is exported to the grid and credited to your bill. Contact your local distribution utility for specific net metering requirements.</p>
                    </div>
                </div>
            </section>

            <!-- Footer -->
            <footer class="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 text-center">
                <p class="text-xs sm:text-sm text-gray-600">
                    Solar Tayo, free solar panel calculator for Filipino homeowners.
                </p>
            </footer>
        </div>
    </div>
</template>
