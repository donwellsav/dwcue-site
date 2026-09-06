<template>
  <section id="download" class="dl-section" aria-labelledby="download-title">
    <div class="dl-wrap">
      <header class="dl-header">
        <div class="dl-kicker">
          <span>{{ t('download.eyebrow') }}</span>
          <span class="dl-version" :aria-label="t('download.versionLabel')">v{{ version }}</span>
        </div>
        <h2 id="download-title" class="dl-title">{{ t('download.title') }}</h2>
        <div class="dl-intro">
          <p>{{ t('download.fallbackText') }}</p>
          <a
            class="dl-release-link"
            href="https://github.com/donwellsav/dwcue/releases"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>{{ t('download.allReleases') }}</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>

      <div class="dl-platform-selector" :aria-label="t('download.eyebrow')">
        <button
          v-for="platform in platforms"
          :id="`dl-platform-${platform.key}`"
          :key="platform.key"
          class="dl-platform-button"
          type="button"
          :aria-pressed="selectedPlatform === platform.key"
          :aria-controls="`dl-panel-${platform.key}`"
          @click="selectedPlatform = platform.key"
        >
          <span>{{ platform.label }}</span>
          <span class="dl-platform-button__count" aria-hidden="true">{{ platform.count }}</span>
        </button>
      </div>

      <div aria-live="polite">
        <div
          v-for="platform in platforms"
          v-show="selectedPlatform === platform.key"
          :id="`dl-panel-${platform.key}`"
          :key="platform.key"
          class="dl-platform-panel"
          role="region"
          :aria-labelledby="`dl-platform-${platform.key}`"
        >
          <div class="dl-panel-heading">
            <span class="dl-panel-heading__index" aria-hidden="true">{{ platformData[platform.key].index }}</span>
            <div>
              <h3>{{ platformData[platform.key].heading }}</h3>
              <p>{{ platformData[platform.key].description }}</p>
            </div>
          </div>

          <div class="dl-rows">
            <a
              v-for="artifact in artifacts[platform.key]"
              :key="artifact.key"
              class="dl-row"
              :href="artifact.href"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span class="dl-row__architecture">{{ artifact.architecture }}</span>
              <span class="dl-row__copy">
                <strong>{{ artifact.label }}</strong>
                <small>{{ artifact.detail }}</small>
              </span>
              <span class="dl-row__format">{{ artifact.format }}</span>
              <svg class="dl-row__icon" aria-hidden="true" viewBox="0 0 40 40" fill="none">
                <path d="M20 4v24M10 19l10 10 10-10M8 35h24" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div class="dl-install-grid">
        <section class="dl-install" aria-labelledby="quick-install-title">
          <div class="dl-install__number" aria-hidden="true">01</div>
          <div class="dl-install__content">
            <h3 id="quick-install-title">{{ t('download.quickTitle') }}</h3>
            <p>{{ t('download.quickText') }}</p>
            <code class="dl-command" tabindex="0">curl -fsSL https://dwcue.com/install.sh | bash</code>
            <p class="dl-install__footnote">{{ t('download.quickAlt') }}</p>
          </div>
        </section>

        <section class="dl-install" aria-labelledby="first-run-title">
          <div class="dl-install__number" aria-hidden="true">02</div>
          <div class="dl-install__content">
            <h3 id="first-run-title">{{ t('download.firstRunTitle') }}</h3>
            <p>{{ t('download.firstRunText') }}</p>
            <p class="dl-install__footnote dl-install__footnote--warning">
              <span aria-hidden="true">!</span>
              {{ t('download.firstRunWin') }}
            </p>
          </div>
        </section>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from '../composables/useI18n';

type PlatformKey = 'mac' | 'windows' | 'linux';

interface Artifact {
  key: string;
  architecture: string;
  label: string;
  detail: string;
  format: string;
  href: string;
}

const props = defineProps<{ version: string }>();
const { t } = useI18n();
const baseURL = useRuntimeConfig().app.baseURL;
const siteURL = baseURL === '/' ? 'https://dwcue.com/' : baseURL;
const selectedPlatform = ref<PlatformKey>('mac');

const downloadLinks = computed(() => {
  const releaseBaseURL = `https://github.com/donwellsav/dwcue/releases/download/v${props.version}`;
  const macBaseURL = baseURL === '/' ? `${siteURL}downloads` : releaseBaseURL;

  return {
    windows: `${releaseBaseURL}/DonWells-Cue-Setup-${props.version}.exe`,
    macArm: `${macBaseURL}/DonWells-Cue-${props.version}-arm64.dmg`,
    linux: `${releaseBaseURL}/DonWells-Cue-${props.version}-x86_64.AppImage`,
    deb: `${releaseBaseURL}/DonWells-Cue-${props.version}-amd64.deb`,
    rpm: `${releaseBaseURL}/DonWells-Cue-${props.version}-x86_64.rpm`,
    macArmZip: `${macBaseURL}/DonWells-Cue-${props.version}-arm64.zip`,
    macIntel: `${macBaseURL}/DonWells-Cue-${props.version}-x64.dmg`,
    macIntelZip: `${macBaseURL}/DonWells-Cue-${props.version}-x64.zip`
  };
});

const platforms = computed(() => [
  { key: 'mac' as const, label: 'macOS', count: '04' },
  { key: 'windows' as const, label: t('download.windows.title'), count: '01' },
  { key: 'linux' as const, label: t('download.linux.title'), count: '03' }
]);

const platformData = computed(() => ({
  mac: {
    index: '01',
    heading: 'macOS',
    description: `${t('download.macArm.meta')} + Intel x64`
  },
  windows: {
    index: '02',
    heading: t('download.windows.title'),
    description: t('download.windows.description')
  },
  linux: {
    index: '03',
    heading: t('download.linux.title'),
    description: t('download.linux.description')
  }
}));


const artifacts = computed<Record<PlatformKey, Artifact[]>>(() => ({
  mac: [
    {
      key: 'mac-arm-dmg',
      architecture: 'ARM64',
      label: t('download.macArm.title'),
      detail: t('download.macArm.description'),
      format: '.dmg',
      href: downloadLinks.value.macArm
    },
    {
      key: 'mac-arm-zip',
      architecture: 'ARM64',
      label: t('download.macZip'),
      detail: t('download.macArm.description'),
      format: '.zip',
      href: downloadLinks.value.macArmZip
    },
    {
      key: 'mac-intel-dmg',
      architecture: 'x64',
      label: t('download.macIntelDmg'),
      detail: 'Intel x64',
      format: '.dmg',
      href: downloadLinks.value.macIntel
    },
    {
      key: 'mac-intel-zip',
      architecture: 'x64',
      label: t('download.intelZip'),
      detail: 'Intel x64',
      format: '.zip',
      href: downloadLinks.value.macIntelZip
    }
  ],
  windows: [
    {
      key: 'windows-exe',
      architecture: 'x64',
      label: t('download.windows.action'),
      detail: t('download.windows.meta'),
      format: '.exe',
      href: downloadLinks.value.windows
    }
  ],
  linux: [
    {
      key: 'linux-appimage',
      architecture: 'x86_64',
      label: t('download.linux.action'),
      detail: t('download.linux.meta'),
      format: '.AppImage',
      href: downloadLinks.value.linux
    },
    {
      key: 'linux-deb',
      architecture: 'x86_64',
      label: t('download.linuxDeb'),
      detail: t('download.linux.description'),
      format: '.deb',
      href: downloadLinks.value.deb
    },
    {
      key: 'linux-rpm',
      architecture: 'x86_64',
      label: t('download.linuxRpm'),
      detail: t('download.linux.description'),
      format: '.rpm',
      href: downloadLinks.value.rpm
    }
  ]
}));

</script>

<style scoped>
.dl-section {
  --dl-ink: var(--ink, #101313);
  --dl-paper: var(--paper, #f5f2e9);
  --dl-lime: var(--lime, #dcfa72);
  --dl-line: color-mix(in srgb, var(--dl-ink) 54%, transparent);
  background: var(--dl-lime);
  color: var(--dl-ink);
  padding: clamp(4.5rem, 9vw, 8.5rem) 0 clamp(3.5rem, 7vw, 7rem);
  scroll-margin-top: var(--header-height, 0);
}

.dl-section,
.dl-section * {
  box-sizing: border-box;
}

.dl-wrap {
  width: min(calc(100% - clamp(1.75rem, 6vw, 7rem)), 90rem);
  margin-inline: auto;
}

.dl-header {
  border-bottom: 1px solid var(--dl-ink);
  padding-bottom: clamp(1.5rem, 3vw, 2.5rem);
}

.dl-kicker,
.dl-intro,
.dl-platform-selector,
.dl-panel-heading,
.dl-row,
.dl-install {
  display: flex;
}

.dl-kicker {
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: clamp(1.75rem, 3.5vw, 3.25rem);
  font: 700 0.75rem/1.2 var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace);
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.dl-version {
  border: 1px solid currentColor;
  min-height: 2rem;
  padding: 0.4rem 0.7rem;
}

.dl-title {
  max-width: 12ch;
  overflow-wrap: anywhere;
  margin: 0;
  font-family: var(--font-display, "Arial Narrow", "Helvetica Neue", Arial, sans-serif);
  font-size: clamp(4rem, 10.5vw, 10.5rem);
  font-weight: 800;
  letter-spacing: -0.075em;
  line-height: 0.82;
  text-wrap: balance;
}

.dl-intro {
  align-items: flex-end;
  justify-content: space-between;
  gap: 2rem;
  margin-top: clamp(2rem, 4vw, 3.5rem);
}

.dl-intro p {
  max-width: 42rem;
  margin: 0;
  font-size: clamp(1.05rem, 1.55vw, 1.35rem);
  line-height: 1.45;
}

.dl-release-link {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
  min-height: 2.75rem;
  border-bottom: 1px solid currentColor;
  color: inherit;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
}

.dl-platform-selector {
  border-bottom: 1px solid var(--dl-ink);
}

.dl-platform-button {
  flex: 1 1 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 4.75rem;
  padding: 0.75rem clamp(0.8rem, 2vw, 1.5rem);
  border: 0;
  border-inline-end: 1px solid var(--dl-ink);
  border-radius: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font: 750 clamp(1rem, 2vw, 1.4rem)/1 var(--font-display, "Helvetica Neue", Arial, sans-serif);
  text-align: start;
}

.dl-platform-button:last-child {
  border-inline-end: 0;
}

.dl-platform-button[aria-pressed="true"] {
  background: var(--dl-ink);
  color: var(--dl-lime);
}

.dl-platform-button__count {
  font: 700 0.7rem/1 var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace);
}

.dl-platform-panel {
  border-bottom: 1px solid var(--dl-ink);
}

.dl-panel-heading {
  align-items: flex-start;
  gap: clamp(1rem, 3vw, 3rem);
  padding: clamp(1.5rem, 4vw, 3.5rem) 0;
}

.dl-panel-heading__index {
  padding-top: 0.45rem;
  font: 700 0.72rem/1 var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace);
}

.dl-panel-heading h3 {
  margin: 0;
  overflow-wrap: anywhere;
  font-family: var(--font-display, "Arial Narrow", "Helvetica Neue", Arial, sans-serif);
  font-size: clamp(3rem, 7vw, 7rem);
  font-weight: 800;
  letter-spacing: -0.065em;
  line-height: 0.84;
}

.dl-panel-heading p {
  margin: 0.9rem 0 0;
  font-size: clamp(0.9rem, 1.3vw, 1.1rem);
}

.dl-rows {
  border-top: 1px solid var(--dl-ink);
}

.dl-row {
  display: grid;
  grid-template-columns: minmax(5rem, 0.6fr) minmax(12rem, 2.3fr) minmax(6rem, 0.9fr) 3rem;
  align-items: center;
  gap: clamp(0.75rem, 2vw, 2rem);
  min-height: clamp(5.75rem, 8.5vw, 8rem);
  border-bottom: 1px solid var(--dl-line);
  color: inherit;
  text-decoration: none;
}

.dl-row:last-child {
  border-bottom: 0;
}

.dl-row__architecture,
.dl-row__format {
  font: 700 clamp(0.7rem, 0.95vw, 0.82rem)/1.2 var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace);
  letter-spacing: 0.08em;
}

.dl-row__copy {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  min-width: 0;
}

.dl-row__copy strong {
  font-family: var(--font-display, "Helvetica Neue", Arial, sans-serif);
  font-size: clamp(1.35rem, 2.6vw, 2.5rem);
  letter-spacing: -0.045em;
  line-height: 1;
}

.dl-row__copy small {
  font-size: clamp(0.72rem, 0.95vw, 0.85rem);
  line-height: 1.35;
}

.dl-row__format {
  font-size: clamp(0.85rem, 1.4vw, 1.15rem);
  text-decoration: underline;
  text-underline-offset: 0.3rem;
}

.dl-row__icon {
  width: 2.5rem;
  height: 2.5rem;
}

.dl-row__icon path {
  stroke: currentColor;
  stroke-linecap: square;
  stroke-linejoin: miter;
  stroke-width: 2;
}

.dl-install-grid {
  border-bottom: 1px solid var(--dl-ink);
}

.dl-install {
  gap: clamp(1rem, 3vw, 3rem);
  padding: clamp(2rem, 4vw, 3.75rem) 0;
  border-bottom: 1px solid var(--dl-ink);
}

.dl-install:last-child {
  border-bottom: 0;
}

.dl-install__number {
  flex: 0 0 clamp(2.5rem, 6vw, 6rem);
  font: 700 0.72rem/1 var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace);
}

.dl-install__content {
  width: min(100%, 62rem);
  min-width: 0;
}

.dl-install h3 {
  max-width: 23ch;
  margin: 0;
  font-family: var(--font-display, "Helvetica Neue", Arial, sans-serif);
  font-size: clamp(1.9rem, 4vw, 3.8rem);
  letter-spacing: -0.055em;
  line-height: 0.98;
  text-wrap: balance;
}

.dl-install p {
  max-width: 54rem;
  margin: 1.25rem 0 0;
  font-size: clamp(0.9rem, 1.2vw, 1rem);
  line-height: 1.65;
}

.dl-command {
  display: block;
  width: 100%;
  margin-top: 1.5rem;
  overflow-x: auto;
  border: 1px solid var(--dl-ink);
  padding: 1rem;
  background: transparent;
  color: inherit;
  font: 650 clamp(0.72rem, 1.25vw, 0.95rem)/1.5 var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace);
  user-select: all;
  white-space: nowrap;
}

.dl-install__footnote {
  font-size: 0.8rem !important;
}

.dl-install__footnote--warning {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  border-top: 1px solid var(--dl-line);
  padding-top: 1rem;
}

.dl-install__footnote--warning span {
  display: inline-grid;
  flex: 0 0 1.5rem;
  width: 1.5rem;
  height: 1.5rem;
  place-items: center;
  background: var(--dl-ink);
  color: var(--dl-lime);
  font: 800 0.75rem/1 var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace);
}

.dl-platform-button,
.dl-row,
.dl-release-link {
  transition: background-color 150ms ease, color 150ms ease;
}

.dl-platform-button:hover,
.dl-row:hover {
  background: var(--dl-ink);
  color: var(--dl-lime);
}

.dl-release-link:hover {
  background: var(--dl-ink);
  color: var(--dl-lime);
}

.dl-platform-button:focus-visible,
.dl-row:focus-visible,
.dl-release-link:focus-visible,
.dl-command:focus-visible {
  outline: 3px solid var(--dl-ink);
  outline-offset: 4px;
  box-shadow: 0 0 0 6px var(--dl-paper);
  position: relative;
  z-index: 1;
}

@media (max-width: 44rem) {
  .dl-wrap {
    width: min(calc(100% - 1.75rem), 40rem);
  }

  .dl-title {
    font-size: clamp(3.5rem, 18vw, 6rem);
    line-height: 0.86;
  }

  .dl-intro {
    align-items: flex-start;
    flex-direction: column;
    gap: 1.25rem;
  }

  .dl-platform-selector {
    overflow-x: auto;
  }

  .dl-platform-button {
    flex: 1 0 auto;
    min-width: 6.75rem;
    min-height: 3.5rem;
  }

  .dl-row {
    grid-template-columns: 3.7rem minmax(0, 1fr) 2.5rem;
    gap: 0.75rem;
    min-height: 6.75rem;
    padding: 0.9rem 0;
  }

  .dl-row__copy strong {
    overflow-wrap: anywhere;
  }

  .dl-row__format {
    grid-column: 2;
    grid-row: 2;
  }

  .dl-row__icon {
    grid-column: 3;
    grid-row: 1 / span 2;
    width: 2.25rem;
    height: 2.25rem;
  }

  .dl-install {
    display: block;
  }

  .dl-install__number {
    margin-bottom: 1.5rem;
  }
}

@media (max-width: 23.5rem) {
  .dl-kicker {
    align-items: flex-start;
    flex-direction: column;
  }

  .dl-row {
    grid-template-columns: minmax(0, 1fr) 2.5rem;
  }

  .dl-row__architecture {
    grid-column: 1;
  }

  .dl-row__copy {
    grid-column: 1;
  }

  .dl-row__format {
    grid-column: 1;
    grid-row: auto;
  }

  .dl-row__icon {
    grid-column: 2;
    grid-row: 1 / span 3;
  }
}

@media (prefers-reduced-motion: reduce) {
  .dl-platform-button,
  .dl-row,
  .dl-release-link {
    transition: none;
  }
}
</style>
