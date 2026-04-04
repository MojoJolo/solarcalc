import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const siteUrl = 'https://solartayo.com'
const fallbackTitle = 'Solar Tayo'
const fallbackDescription = 'Calculate solar panel size, estimated savings, and ROI for your home in the Philippines using your monthly electricity bill.'

const upsertMeta = (selector, attributes) => {
    let element = document.head.querySelector(selector)

    if (!element) {
        element = document.createElement('meta')
        document.head.appendChild(element)
    }

    Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value)
    })
}

const upsertLink = (selector, attributes) => {
    let element = document.head.querySelector(selector)

    if (!element) {
        element = document.createElement('link')
        document.head.appendChild(element)
    }

    Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value)
    })
}

const upsertJsonLd = (data) => {
    const selector = 'script[data-route-jsonld="true"]'
    const existing = document.head.querySelector(selector)

    if (!data) {
        existing?.remove()
        return
    }

    const script = existing || document.createElement('script')
    script.setAttribute('type', 'application/ld+json')
    script.setAttribute('data-route-jsonld', 'true')
    script.textContent = JSON.stringify(data)

    if (!existing) {
        document.head.appendChild(script)
    }
}

const applyRouteMeta = (route) => {
    const meta = route.meta || {}
    const title = meta.title || fallbackTitle
    const description = meta.description || fallbackDescription
    const canonicalPath = meta.canonical || route.path
    const canonicalUrl = canonicalPath.startsWith('http') ? canonicalPath : `${siteUrl}${canonicalPath}`
    const ogType = meta.type || 'website'
    const image = meta.image || `${siteUrl}/favicon.svg`

    document.title = title

    upsertMeta('meta[name="description"]', { name: 'description', content: description })
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title })
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description })
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: ogType })
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl })
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: image })
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title })
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description })
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: meta.twitterCard || 'summary' })
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: image })
    upsertLink('link[rel="canonical"]', { rel: 'canonical', href: canonicalUrl })

    if (meta.jsonLd) {
        upsertJsonLd(meta.jsonLd)
    } else {
        upsertJsonLd(null)
    }
}

router.afterEach((to) => {
    applyRouteMeta(to)
})

router.isReady().then(() => {
    applyRouteMeta(router.currentRoute.value)
})

createApp(App).use(router).mount('#app')
