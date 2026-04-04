import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BlogView from '../views/BlogView.vue'
import AboutView from '../views/AboutView.vue'
import PrivacyView from '../views/PrivacyView.vue'
import SolarSavingsPost from '../views/blog/SolarSavingsPost.vue'
import CommonMistakesPost from '../views/blog/CommonMistakesPost.vue'
import GasPricesSolarPost from '../views/blog/GasPricesSolarPost.vue'

const siteName = 'Solar Tayo'
const siteUrl = 'https://solartayo.com'
const defaultImage = `${siteUrl}/favicon.svg`

const baseMeta = {
    siteName,
    siteUrl,
    image: defaultImage,
    twitterCard: 'summary',
    type: 'website',
}

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: HomeView,
            meta: {
                ...baseMeta,
                title: 'Solar Panel System Calculator Philippines | Estimate Your Solar Needs',
                description: 'Calculate solar panel size, estimated savings, and ROI for your home in the Philippines using your monthly electricity bill.',
                canonical: '/',
                jsonLd: {
                    '@context': 'https://schema.org',
                    '@type': 'WebPage',
                    name: 'Solar Panel System Calculator Philippines',
                    url: `${siteUrl}/`,
                    description: 'Calculate solar panel size, estimated savings, and ROI for your home in the Philippines using your monthly electricity bill.',
                },
            },
        },
        {
            path: '/blog',
            component: BlogView,
            meta: {
                ...baseMeta,
                title: 'Solar Insights Blog | Solar Tayo',
                description: 'Read practical solar guides for Filipino homeowners, from ROI and pricing to quote comparison and energy-cost trends.',
                canonical: '/blog',
                jsonLd: {
                    '@context': 'https://schema.org',
                    '@type': 'CollectionPage',
                    name: 'Solar Insights Blog',
                    url: `${siteUrl}/blog`,
                    description: 'Read practical solar guides for Filipino homeowners, from ROI and pricing to quote comparison and energy-cost trends.',
                },
            },
        },
        {
            path: '/about',
            component: AboutView,
            meta: {
                ...baseMeta,
                title: 'About Solar Tayo | Solar Calculator for Filipino Homeowners',
                description: 'Learn what Solar Tayo is, how the calculator works, and who built this independent solar planning tool for Filipino homeowners.',
                canonical: '/about',
            },
        },
        {
            path: '/privacy',
            component: PrivacyView,
            meta: {
                ...baseMeta,
                title: 'Privacy Policy | Solar Tayo',
                description: 'Read the Solar Tayo privacy policy and how this site handles analytics, cookies, and visitor data.',
                canonical: '/privacy',
            },
        },
        {
            path: '/blog/solar-savings-meralco-2026',
            component: SolarSavingsPost,
            meta: {
                ...baseMeta,
                type: 'article',
                title: 'How Much Can Solar Panels Save You on Your Meralco Bill? (2026 Philippines Guide)',
                description: 'A practical guide to solar savings, system cost, and ROI for Meralco customers in the Philippines.',
                canonical: '/blog/solar-savings-meralco-2026',
                jsonLd: {
                    '@context': 'https://schema.org',
                    '@type': 'Article',
                    headline: 'How Much Can Solar Panels Save You on Your Meralco Bill? (2026 Philippines Guide)',
                    description: 'A practical guide to solar savings, system cost, and ROI for Meralco customers in the Philippines.',
                    author: {
                        '@type': 'Person',
                        name: 'Jolo',
                        url: `${siteUrl}/about`,
                    },
                    publisher: {
                        '@type': 'Organization',
                        name: siteName,
                        url: siteUrl,
                    },
                    mainEntityOfPage: `${siteUrl}/blog/solar-savings-meralco-2026`,
                    datePublished: '2026-03-26',
                    dateModified: '2026-04-04',
                },
            },
        },
        {
            path: '/blog/common-mistakes-buying-solar-philippines',
            component: CommonMistakesPost,
            meta: {
                ...baseMeta,
                type: 'article',
                title: 'Common Mistakes When Buying Solar in the Philippines',
                description: 'The most common mistakes Filipino homeowners make when buying solar, from weak quotes to bad system sizing.',
                canonical: '/blog/common-mistakes-buying-solar-philippines',
                jsonLd: {
                    '@context': 'https://schema.org',
                    '@type': 'Article',
                    headline: 'Common Mistakes When Buying Solar in the Philippines',
                    description: 'The most common mistakes Filipino homeowners make when buying solar, from weak quotes to bad system sizing.',
                    author: {
                        '@type': 'Person',
                        name: 'Jolo',
                        url: `${siteUrl}/about`,
                    },
                    publisher: {
                        '@type': 'Organization',
                        name: siteName,
                        url: siteUrl,
                    },
                    mainEntityOfPage: `${siteUrl}/blog/common-mistakes-buying-solar-philippines`,
                    datePublished: '2026-04-04',
                    dateModified: '2026-04-04',
                },
            },
        },
        {
            path: '/blog/how-gas-prices-affect-solar-philippines',
            component: GasPricesSolarPost,
            meta: {
                ...baseMeta,
                type: 'article',
                title: 'How Rising Gas and Fuel Prices Make Solar More Attractive in the Philippines',
                description: 'How rising fuel prices can push electricity costs higher and improve the long-term economics of solar in the Philippines.',
                canonical: '/blog/how-gas-prices-affect-solar-philippines',
                jsonLd: {
                    '@context': 'https://schema.org',
                    '@type': 'Article',
                    headline: 'How Rising Gas and Fuel Prices Make Solar More Attractive in the Philippines',
                    description: 'How rising fuel prices can push electricity costs higher and improve the long-term economics of solar in the Philippines.',
                    author: {
                        '@type': 'Person',
                        name: 'Jolo',
                        url: `${siteUrl}/about`,
                    },
                    publisher: {
                        '@type': 'Organization',
                        name: siteName,
                        url: siteUrl,
                    },
                    mainEntityOfPage: `${siteUrl}/blog/how-gas-prices-affect-solar-philippines`,
                    datePublished: '2026-04-04',
                    dateModified: '2026-04-04',
                },
            },
        },
    ],
})

export default router
