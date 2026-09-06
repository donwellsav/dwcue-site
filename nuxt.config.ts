import process from 'node:process'
const baseURL = process.env.NUXT_APP_BASE_URL || '/'
const siteURL = baseURL === '/' ? 'https://dwcue.com/' : baseURL
const productImage = `${siteURL}screenshots/manual-20260906/show-mode.webp`
const description = 'Audio and video cue playback for live events. Prepare precise cues, perform in Show Mode, trigger One Shots, and control dedicated audio and video outputs.'

export default defineNuxtConfig({
  ssr: true,
  rootDir: './',
  app: {
    baseURL,
    buildAssetsDir: 'assets',
    head: {
      title: 'DonWells Cue — Audio + Video Cue Playback for Live Events',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: description },
        { name: 'robots', content: 'index, follow' },
        { name: 'theme-color', content: '#101313' },
        { property: 'og:title', content: 'DonWells Cue — Audio + Video Cue Playback for Live Events' },
        { property: 'og:description', content: description },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: siteURL },
        { property: 'og:image', content: productImage },
        { property: 'og:image:width', content: '2400' },
        { property: 'og:image:height', content: '1488' },
        { property: 'og:image:type', content: 'image/webp' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'DonWells Cue — Audio + Video Cue Playback for Live Events' },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: productImage }
      ],
      script: [{
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'DonWells Cue',
          description,
          applicationCategory: 'MultimediaApplication',
          operatingSystem: 'Windows, macOS, Linux',
          license: 'https://www.gnu.org/licenses/agpl-3.0.html',
          url: siteURL,
          downloadUrl: `${siteURL}#download`,
          image: productImage
        })
      }],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: `${baseURL}favicon-cue.ico` },
        { rel: 'canonical', href: siteURL },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap' }
      ]
    }
  },
  css: ['~/assets/styles/main.scss'],
  vite: {
    css: {
      preprocessorOptions: {
        scss: { additionalData: '' }
      }
    }
  },
  nitro: { preset: 'static' },
  typescript: { strict: false, typeCheck: false },
  compatibilityDate: '2025-01-01'
})
