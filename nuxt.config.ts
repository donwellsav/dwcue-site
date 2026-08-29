const baseURL = process.env.NUXT_APP_BASE_URL || '/'
const siteURL = baseURL === '/' ? 'https://dwcue.com/' : baseURL

export default defineNuxtConfig({
  ssr: true,
  
  // Ensure we don't inherit from parent project
  rootDir: './',

  app: {
    baseURL,
    buildAssetsDir: 'assets',
    head: {
      title: 'DonWells Cue - Audio + Video Cue Playback for Live Events',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Audio and video cue playback for live events, with One Shots, Show Mode, dedicated Video Output, and true-peak protection.' },
        { name: 'robots', content: 'index, follow' },
        { name: 'theme-color', content: '#315FCF' },
        // Open Graph
        { property: 'og:title', content: 'DonWells Cue - Audio + Video Cue Playback for Live Events' },
        { property: 'og:description', content: 'Audio and video cue playback for live events, with One Shots, Show Mode, dedicated Video Output, and true-peak protection.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: siteURL },
        { property: 'og:image', content: `${siteURL}screenshots/donwells_cue_main.jpg` },
        { property: 'og:image:width', content: '1920' },
        { property: 'og:image:height', content: '1080' },
        { property: 'og:image:type', content: 'image/jpeg' },
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'DonWells Cue - Audio + Video Cue Playback for Live Events' },
        { name: 'twitter:description', content: 'Audio and video cue playback for live events, with One Shots, Show Mode, dedicated Video Output, and true-peak protection.' },
        { name: 'twitter:image', content: `${siteURL}screenshots/donwells_cue_main.jpg` }
      ],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'DonWells Cue',
            description: 'Audio and video cue playback for live events, with One Shots, Show Mode, dedicated Video Output, and true-peak protection.',
            applicationCategory: 'MultimediaApplication',
            operatingSystem: 'Windows, macOS, Linux',
            isAccessibleForFree: true,
            license: 'https://www.gnu.org/licenses/agpl-3.0.html',
            url: siteURL,
            downloadUrl: `${siteURL}#download`,
            image: `${siteURL}screenshots/donwells_cue_main.jpg`,
            sameAs: ['https://github.com/donwellsav/dwcue']
          })
        }
      ],
      link: [
        // Point explicitly at the current CUE favicon so browsers do not retain an older icon.
        { rel: 'icon', type: 'image/x-icon', href: `${baseURL}favicon-cue.ico` },
        { rel: 'canonical', href: siteURL },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap' }
      ]
    }
  },

  css: ['~/assets/styles/main.scss'],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: ''
        }
      }
    }
  },

  nitro: {
    preset: 'static'
  },

  typescript: {
    strict: false,
    typeCheck: false
  },

  compatibilityDate: '2025-01-01'
})
