<template>
  <div ref="shell" class="site-shell" dir="ltr">
    <a class="skip-link" href="#main">{{ t('common.skipLink') }}</a>

    <header class="site-header">
      <div class="wrap site-header__inner">
        <a class="brand" href="#top" :aria-label="t('brand.home')">
          <img :src="asset('assets/logo.svg')" alt="" class="brand__mark" />
          <span class="brand__name">DonWells Cue</span>
        </a>

        <nav class="site-nav" :aria-label="t('nav.label')">
          <a v-for="link in navigationLinks" :key="link.href" :href="link.href">{{ link.label }}</a>
        </nav>

        <div class="site-header__actions">
          <a class="button button--acid button--compact header-download" href="#download">
            {{ t('redesign.header.download', { version }) }}
          </a>
          <button
            ref="mobileMenuToggle"
            class="mobile-menu-toggle"
            type="button"
            :aria-label="isMobileNavOpen ? t('nav.closeMenu') : t('nav.openMenu')"
            :aria-expanded="isMobileNavOpen"
            aria-controls="mobile-nav"
            @click="toggleMobileNav"
          >
            <span>{{ isMobileNavOpen ? t('nav.closeMenu') : t('nav.openMenu') }}</span>
            <i aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </header>

    <div v-if="isMobileNavOpen" id="mobile-nav" ref="mobileNav" class="mobile-nav">
      <nav class="wrap mobile-nav__links" :aria-label="t('nav.label')">
        <a v-for="link in navigationLinks" :key="link.href" :href="link.href" @click="closeMobileNav(false)">
          {{ link.label }} <span aria-hidden="true">↘</span>
        </a>
      </nav>
    </div>

    <main id="main">
      <section id="top" class="hero">
        <div class="wrap hero__top" data-reveal>
          <p class="eyebrow eyebrow--acid">{{ t('redesign.hero.eyebrow') }}</p>
          <p class="hero__version">v{{ version }} / {{ t('redesign.header.status') }}</p>
        </div>

        <div class="wrap hero__headline" data-reveal>
          <h1 :aria-label="`${t('redesign.hero.titleFirst')} ${t('redesign.hero.titleSecond')}`">
            <span>{{ t('redesign.hero.titleFirst') }}</span>
            <span class="hero__headline-second">{{ t('redesign.hero.titleSecond') }}</span>
          </h1>
          <div class="hero__intro">
            <p>{{ t('redesign.hero.lede') }}</p>
            <div class="hero__actions">
              <a class="button button--acid" href="#download">{{ t('redesign.hero.primaryAction', { version }) }} <span aria-hidden="true">↗</span></a>
              <a class="button button--ghost" href="#workflow">{{ t('redesign.hero.secondaryAction') }} <span aria-hidden="true">↓</span></a>
            </div>
            <a class="hero-go-callout" href="#show-mode">
              <span class="hero-go-callout__key">{{ t('redesign.show.go') }}</span>
              <span><strong>{{ t('redesign.show.go') }}</strong><small>{{ t('redesign.show.goHint') }}</small></span>
              <i aria-hidden="true">↘</i>
            </a>
          </div>
        </div>

        <div class="wrap hero__capture" data-reveal>
          <button
            class="screenshot-trigger screenshot-trigger--hero"
            type="button"
            :aria-label="`${t('redesign.hero.zoomHint')}: ${t('redesign.hero.captureLabel')}`"
            @click="openZoom(heroCapture)"
          >
            <img
              :src="heroCapture.src"
              :alt="heroCapture.alt"
              width="2400"
              height="1488"
              loading="eager"
              fetchpriority="high"
              decoding="async"
            />
            <span class="screenshot-trigger__affordance" aria-hidden="true">＋</span>
          </button>
          <div class="capture-caption capture-caption--dark">
            <span>{{ t('redesign.hero.captureLabel') }}</span>
            <span>{{ t('redesign.hero.zoomHint') }} ↗</span>
          </div>
        </div>

        <dl class="wrap hero__facts" data-reveal>
          <div>
            <dt>{{ t('redesign.hero.factOneValue') }}</dt>
            <dd>{{ t('redesign.hero.factOneLabel') }}</dd>
          </div>
          <div>
            <dt>{{ t('redesign.hero.factTwoValue') }}</dt>
            <dd>{{ t('redesign.hero.factTwoLabel') }}</dd>
          </div>
          <div>
            <dt>{{ t('redesign.hero.factThreeValue') }}</dt>
            <dd>{{ t('redesign.hero.factThreeLabel') }}</dd>
          </div>
        </dl>
      </section>

      <section id="workflow" class="section workflow-section">
        <div class="wrap">
          <div class="section-intro section-intro--offset" data-reveal>
            <p class="eyebrow">{{ t('redesign.workflow.eyebrow') }}</p>
            <h2>{{ t('redesign.workflow.title') }}</h2>
            <p class="section-intro__lede">{{ t('redesign.workflow.intro') }}</p>
          </div>

          <div class="workflow-tour" data-reveal>
            <div class="workflow-tabs" role="tablist" :aria-label="t('redesign.workflow.tabLabel')">
              <button
                v-for="(key, index) in workflowOrder"
                :id="`workflow-tab-${key}`"
                :key="key"
                class="workflow-tab"
                :class="{ 'is-active': activeWorkflow === key }"
                type="button"
                role="tab"
                :aria-selected="activeWorkflow === key"
                :aria-controls="`workflow-panel-${key}`"
                @click="activeWorkflow = key"
              >
                <span>0{{ index + 1 }}</span>
                <strong>{{ workflowItems[key].label }}</strong>
                <small>{{ workflowItems[key].title }}</small>
              </button>
            </div>

            <div
              :id="`workflow-panel-${activeWorkflow}`"
              class="workflow-panel"
              role="tabpanel"
              :aria-labelledby="`workflow-tab-${activeWorkflow}`"
              tabindex="0"
            >
              <div class="workflow-panel__copy">
                <span class="index-label">{{ workflowItems[activeWorkflow].label }}</span>
                <h3>{{ workflowItems[activeWorkflow].title }}</h3>
                <p>{{ workflowItems[activeWorkflow].text }}</p>
              </div>
              <button class="screenshot-trigger" type="button" :aria-label="`${t('redesign.workflow.zoomAction')}: ${workflowItems[activeWorkflow].caption}`" @click="openZoom(workflowItems[activeWorkflow])">
                <img
                  :src="workflowItems[activeWorkflow].src"
                  :alt="workflowItems[activeWorkflow].alt"
                  :width="workflowItems[activeWorkflow].width"
                  :height="workflowItems[activeWorkflow].height"
                  loading="lazy"
                  decoding="async"
                />
                <span class="screenshot-trigger__affordance" aria-hidden="true">＋</span>
              </button>
              <div class="capture-caption">
                <span>{{ workflowItems[activeWorkflow].caption }}</span>
                <span>{{ t('redesign.workflow.zoomAction') }} ↗</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="section precision-section">
        <div class="wrap">
          <div class="precision-heading" data-reveal>
            <div>
              <p class="eyebrow">{{ t('redesign.precision.eyebrow') }}</p>
              <h2>{{ t('redesign.precision.title') }}</h2>
            </div>
            <p>{{ t('redesign.precision.intro') }}</p>
          </div>

          <div class="precision-waveform" data-reveal>
            <button class="screenshot-trigger screenshot-trigger--waveform" type="button" :aria-label="`${t('redesign.workflow.zoomAction')}: ${t('redesign.precision.captureLabel')}`" @click="openZoom(precisionCapture)">
              <img :src="precisionCapture.src" :alt="precisionCapture.alt" width="1800" height="370" loading="lazy" decoding="async" />
              <span class="screenshot-trigger__affordance" aria-hidden="true">＋</span>
            </button>
            <div class="capture-caption">
              <span>{{ t('redesign.precision.captureLabel') }}</span>
              <span>{{ t('redesign.workflow.zoomAction') }} ↗</span>
            </div>
          </div>

          <div class="precision-details" data-reveal>
            <article v-for="(item, index) in precisionItems" :key="item.title">
              <span>0{{ index + 1 }}</span>
              <h3>{{ item.title }}</h3>
              <p>{{ item.text }}</p>
            </article>
          </div>

          <aside class="operator-note" data-reveal>
            <span>{{ t('redesign.precision.operatorNote') }}</span>
            <p>{{ t('redesign.precision.operatorNoteText') }}</p>
          </aside>
        </div>
      </section>

      <section id="show-mode" class="section show-section">
        <div class="wrap">
          <div class="show-heading" data-reveal>
            <p class="eyebrow eyebrow--acid">{{ t('redesign.show.eyebrow') }}</p>
            <h2>{{ t('redesign.show.title') }}</h2>
            <p>{{ t('redesign.show.intro') }}</p>
          </div>

          <div class="show-demo" :aria-label="t('redesign.show.demoLabel')" data-reveal>
            <div class="show-demo__bar">
              <span>{{ t('redesign.show.demoStatus') }}</span>
              <span>0{{ demoStep }} / 0{{ demoCues.length }}</span>
            </div>

            <ol class="cue-sequence">
              <li
                v-for="(cue, index) in demoCues"
                :key="cue.name"
                :class="{
                  'is-selected': index === selectedDemoIndex,
                  'is-next': index === nextDemoIndex,
                  'is-active': index === activeDemoIndex,
                }"
              >
                <span class="cue-sequence__number">0{{ index + 1 }}</span>
                <div>
                  <strong>{{ cue.name }}</strong>
                  <small>{{ cue.detail }}</small>
                </div>
                <div class="cue-sequence__states">
                  <span v-if="index === selectedDemoIndex" class="state-label state-label--selected">{{ t('redesign.show.selected') }}</span>
                  <span v-if="index === nextDemoIndex" class="state-label state-label--next">{{ t('redesign.show.upNext') }}</span>
                  <span v-if="index === activeDemoIndex" class="state-label state-label--active">{{ t('redesign.show.active') }}</span>
                </div>
              </li>
            </ol>

            <div class="show-demo__controls">
              <button class="go-button" type="button" :disabled="demoStep >= demoCues.length" :aria-describedby="'show-keyboard-hint'" @click="advanceDemo">
                <span>{{ demoStep >= demoCues.length ? t('redesign.show.complete') : t('redesign.show.go') }}</span>
                <small>{{ t('redesign.show.goHint') }}</small>
              </button>
              <button class="reset-button" type="button" @click="resetDemo">{{ t('redesign.show.reset') }}</button>
              <p id="show-keyboard-hint">{{ t('redesign.show.keyboardHint') }}</p>
              <p class="sr-only" aria-live="polite">{{ demoAnnouncement }}</p>
            </div>
          </div>

          <div class="show-proof" data-reveal>
            <div class="show-proof__image">
              <button class="screenshot-trigger" type="button" :aria-label="`${t('redesign.workflow.zoomAction')}: ${t('redesign.show.transportLabel')}`" @click="openZoom(transportCapture)">
                <img :src="transportCapture.src" :alt="transportCapture.alt" width="1800" height="736" loading="lazy" decoding="async" />
                <span class="screenshot-trigger__affordance" aria-hidden="true">＋</span>
              </button>
              <div class="capture-caption capture-caption--dark">
                <span>{{ t('redesign.show.transportLabel') }}</span>
                <span>{{ t('redesign.workflow.zoomAction') }} ↗</span>
              </div>
            </div>
            <ol class="state-key">
              <li><span>01</span>{{ t('redesign.show.distinctionOne') }}</li>
              <li><span>02</span>{{ t('redesign.show.distinctionTwo') }}</li>
              <li><span>03</span>{{ t('redesign.show.distinctionThree') }}</li>
            </ol>
          </div>
        </div>
      </section>

      <section id="one-shots" class="section one-shots-section">
        <div class="wrap one-shots-layout">
          <div class="one-shots-copy" data-reveal>
            <p class="eyebrow eyebrow--acid">{{ t('redesign.oneShots.eyebrow') }}</p>
            <h2>{{ t('redesign.oneShots.title') }}</h2>
            <p class="one-shots-copy__intro">{{ t('redesign.oneShots.intro') }}</p>

            <div class="mode-switcher" role="tablist" :aria-label="t('redesign.oneShots.modeLabel')">
              <button
                v-for="key in oneShotOrder"
                :id="`oneshot-tab-${key}`"
                :key="key"
                type="button"
                role="tab"
                :aria-selected="activeOneShotMode === key"
                :aria-controls="`oneshot-panel-${key}`"
                :class="{ 'is-active': activeOneShotMode === key }"
                @click="activeOneShotMode = key"
              >
                {{ oneShotModes[key].label }}
              </button>
            </div>
            <div
              :id="`oneshot-panel-${activeOneShotMode}`"
              class="mode-copy"
              role="tabpanel"
              :aria-labelledby="`oneshot-tab-${activeOneShotMode}`"
              tabindex="0"
            >
              <h3>{{ oneShotModes[activeOneShotMode].title }}</h3>
              <p>{{ oneShotModes[activeOneShotMode].text }}</p>
            </div>

            <aside class="one-shot-safety">
              <span>{{ t('redesign.oneShots.safetyLabel') }}</span>
              <p>{{ t('redesign.oneShots.safetyText') }}</p>
            </aside>

            <button class="screenshot-trigger one-shot-armed" type="button" :aria-label="`${t('redesign.workflow.zoomAction')}: ${t('redesign.oneShots.armedCaption')}`" @click="openZoom(oneShotArmedCapture)">
              <img :src="oneShotArmedCapture.src" :alt="oneShotArmedCapture.alt" width="1080" height="740" loading="lazy" decoding="async" />
              <span class="screenshot-trigger__affordance" aria-hidden="true">＋</span>
            </button>
            <div class="capture-caption capture-caption--dark">
              <span>{{ t('redesign.oneShots.armedCaption') }}</span>
              <span>{{ t('redesign.workflow.zoomAction') }} ↗</span>
            </div>
          </div>

          <figure class="one-shots-settings" data-reveal>
            <button class="screenshot-trigger" type="button" :aria-label="`${t('redesign.workflow.zoomAction')}: ${t('redesign.oneShots.settingsCaption')}`" @click="openZoom(oneShotSettingsCapture)">
              <img :src="oneShotSettingsCapture.src" :alt="oneShotSettingsCapture.alt" width="1240" height="3020" loading="lazy" decoding="async" />
              <span class="screenshot-trigger__affordance" aria-hidden="true">＋</span>
            </button>
            <figcaption>{{ t('redesign.oneShots.settingsCaption') }}</figcaption>
          </figure>
        </div>
      </section>

      <section id="video-output" class="section output-section">
        <div class="wrap">
          <div class="output-heading" data-reveal>
            <div>
              <p class="eyebrow">{{ t('redesign.output.eyebrow') }}</p>
              <h2>{{ t('redesign.output.title') }}</h2>
            </div>
            <p>{{ t('redesign.output.intro') }}</p>
          </div>

          <div class="output-specs" data-reveal>
            <div><span>{{ t('redesign.output.formatLabel') }}</span><strong>{{ t('redesign.output.formatValue') }}</strong></div>
            <div><span>{{ t('redesign.output.previewLabel') }}</span><strong>{{ t('redesign.output.previewValue') }}</strong></div>
            <div><span>{{ t('redesign.output.scopeLabel') }}</span><strong>{{ t('redesign.output.scopeValue') }}</strong></div>
          </div>

          <div class="output-tour" data-reveal>
            <div class="output-tabs" role="tablist" :aria-label="t('redesign.output.tabLabel')">
              <button
                v-for="key in outputOrder"
                :id="`output-tab-${key}`"
                :key="key"
                type="button"
                role="tab"
                :aria-selected="activeOutput === key"
                :aria-controls="`output-panel-${key}`"
                :class="{ 'is-active': activeOutput === key }"
                @click="activeOutput = key"
              >
                {{ outputItems[key].label }}
              </button>
            </div>
            <div
              :id="`output-panel-${activeOutput}`"
              class="output-panel"
              role="tabpanel"
              :aria-labelledby="`output-tab-${activeOutput}`"
              tabindex="0"
            >
              <div class="output-panel__copy">
                <h3>{{ outputItems[activeOutput].title }}</h3>
                <p>{{ outputItems[activeOutput].text }}</p>
              </div>
              <button class="screenshot-trigger" type="button" :aria-label="`${t('redesign.workflow.zoomAction')}: ${outputItems[activeOutput].caption}`" @click="openZoom(outputItems[activeOutput])">
                <img
                  :src="outputItems[activeOutput].src"
                  :alt="outputItems[activeOutput].alt"
                  :width="outputItems[activeOutput].width"
                  :height="outputItems[activeOutput].height"
                  loading="lazy"
                  decoding="async"
                />
                <span class="screenshot-trigger__affordance" aria-hidden="true">＋</span>
              </button>
              <div class="capture-caption">
                <span>{{ outputItems[activeOutput].caption }}</span>
                <span>{{ t('redesign.workflow.zoomAction') }} ↗</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="section projects-section">
        <div class="wrap">
          <div class="projects-heading" data-reveal>
            <p class="eyebrow">{{ t('redesign.projects.eyebrow') }}</p>
            <h2>{{ t('redesign.projects.title') }}</h2>
            <p>{{ t('redesign.projects.intro') }}</p>
          </div>

          <div class="connection-diagram" aria-hidden="true" data-reveal>
            <div><span>01</span><strong>{{ t('redesign.projects.localTitle') }}</strong></div>
            <i></i>
            <div><span>02</span><strong>{{ t('redesign.projects.lanTitle') }}</strong></div>
            <i></i>
            <div><span>03</span><strong>{{ t('redesign.projects.portableTitle') }}</strong></div>
          </div>

          <div class="project-facts" data-reveal>
            <article>
              <span>01</span>
              <h3>{{ t('redesign.projects.localTitle') }}</h3>
              <p>{{ t('redesign.projects.localText') }}</p>
            </article>
            <article>
              <span>02</span>
              <h3>{{ t('redesign.projects.lanTitle') }}</h3>
              <p>{{ t('redesign.projects.lanText') }}</p>
            </article>
            <article>
              <span>03</span>
              <h3>{{ t('redesign.projects.portableTitle') }}</h3>
              <p>{{ t('redesign.projects.portableText') }}</p>
            </article>
          </div>

          <div class="project-captures" data-reveal>
            <figure>
              <button class="screenshot-trigger" type="button" :aria-label="`${t('redesign.workflow.zoomAction')}: ${t('redesign.projects.connectionCaption')}`" @click="openZoom(connectionCapture)">
                <img :src="connectionCapture.src" :alt="connectionCapture.alt" width="1484" height="1094" loading="lazy" decoding="async" />
                <span class="screenshot-trigger__affordance" aria-hidden="true">＋</span>
              </button>
              <figcaption>{{ t('redesign.projects.connectionCaption') }}</figcaption>
            </figure>
            <figure>
              <button class="screenshot-trigger" type="button" :aria-label="`${t('redesign.workflow.zoomAction')}: ${t('redesign.projects.importCaption')}`" @click="openZoom(importCapture)">
                <img :src="importCapture.src" :alt="importCapture.alt" width="1800" height="1200" loading="lazy" decoding="async" />
                <span class="screenshot-trigger__affordance" aria-hidden="true">＋</span>
              </button>
              <figcaption>{{ t('redesign.projects.importCaption') }}</figcaption>
            </figure>
          </div>

          <div class="project-notes" data-reveal>
            <div>
              <span>{{ t('redesign.projects.autosaveTitle') }}</span>
              <p>{{ t('redesign.projects.autosaveText') }}</p>
            </div>
            <div class="project-notes__caveat">
              <span>{{ t('redesign.projects.caveatLabel') }}</span>
              <p>{{ t('redesign.projects.caveatText') }}</p>
            </div>
          </div>
        </div>
      </section>

      <DownloadSection :version="version" />

      <section id="docs" class="section docs-section">
        <div class="wrap">
          <div class="docs-heading" data-reveal>
            <div>
              <p class="eyebrow eyebrow--acid">{{ t('redesign.docs.eyebrow') }}</p>
              <h2>{{ t('redesign.docs.title') }}</h2>
            </div>
            <div class="docs-heading__copy">
              <p>{{ t('redesign.docs.intro') }}</p>
              <a class="button button--acid" :href="asset('manual/operators-manual-2.6.14.pdf')" target="_blank" rel="noopener noreferrer">
                {{ t('redesign.docs.manualAction') }} <span aria-hidden="true">↗</span>
              </a>
              <span>{{ t('redesign.docs.manualMeta') }}</span>
            </div>
          </div>

          <aside class="edition-note" data-reveal>
            <span>2.6.14 / PDF</span>
            <p>{{ t('redesign.docs.editionNote') }}</p>
          </aside>

          <div class="faq" data-reveal>
            <div class="faq__heading">
              <span>{{ t('redesign.docs.faqLabel') }}</span>
              <span>01—05</span>
            </div>
            <details v-for="(item, index) in faqItems" :key="item.question">
              <summary><span>0{{ index + 1 }}</span>{{ item.question }}<i aria-hidden="true">＋</i></summary>
              <p>{{ item.answer }}</p>
            </details>
          </div>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <div class="wrap site-footer__main">
        <div>
          <strong>DonWells Cue</strong>
          <span>{{ t('footer.tagline') }}</span>
        </div>
        <a href="#top">{{ t('footer.backToTop') }} ↑</a>
      </div>
      <div class="wrap site-footer__legal">
        <p>{{ t('redesign.docs.sourceText') }}</p>
        <div>
          <a href="https://github.com/donwellsav/dwcue/blob/main/LICENCE.txt" target="_blank" rel="noopener noreferrer">AGPL-3.0-only ↗</a>
          <a href="https://github.com/donwellsav/dwcue" target="_blank" rel="noopener noreferrer">{{ t('footer.correspondingSource') }} ↗</a>
        </div>
      </div>
    </footer>

    <ScreenshotDialog
      :open="zoomOpen"
      :src="zoomImage.src"
      :alt="zoomImage.alt"
      :caption="zoomImage.caption"
      @update:open="zoomOpen = $event"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
import DownloadSection from './components/DownloadSection.vue';
import ScreenshotDialog from './components/ScreenshotDialog.vue';
import { useI18n } from './composables/useI18n';

interface Capture {
  src: string;
  alt: string;
  caption: string;
  width?: number;
  height?: number;
}

type WorkflowKey = 'prepare' | 'perform' | 'output';
type OneShotKey = 'overlay' | 'duck' | 'replace';
type OutputKey = 'testCard' | 'routing' | 'settings';

const { t } = useI18n();
const baseURL = useRuntimeConfig().app.baseURL || '/';
const asset = (path: string) => `${baseURL}${path.replace(/^\/+/, '')}`;
const siteURL = baseURL === '/' ? 'https://dwcue.com/' : baseURL;
const version = ref('2.6.15');
const shell = ref<HTMLElement | null>(null);

const navigationLinks = computed(() => [
  { href: '#workflow', label: t('nav.workflow') },
  { href: '#show-mode', label: t('nav.showMode') },
  { href: '#one-shots', label: t('nav.oneShots') },
  { href: '#video-output', label: t('nav.videoOutput') },
  { href: '#download', label: t('nav.download') },
  { href: '#docs', label: t('nav.docs') },
]);

const isMobileNavOpen = ref(false);
const mobileMenuToggle = ref<HTMLButtonElement | null>(null);
const mobileNav = ref<HTMLElement | null>(null);

const closeMobileNav = (returnFocus = true) => {
  if (!isMobileNavOpen.value) return;
  isMobileNavOpen.value = false;
  if (returnFocus) void nextTick(() => mobileMenuToggle.value?.focus());
};

const toggleMobileNav = async () => {
  isMobileNavOpen.value = !isMobileNavOpen.value;
  if (isMobileNavOpen.value) {
    await nextTick();
    mobileNav.value?.querySelector<HTMLElement>('a')?.focus();
  } else {
    mobileMenuToggle.value?.focus();
  }
};

const handleGlobalKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isMobileNavOpen.value) {
    event.preventDefault();
    closeMobileNav();
  }
};

const heroCapture = computed<Capture>(() => ({
  src: asset('screenshots/manual-20260906/show-mode.webp'),
  alt: t('redesign.hero.screenshotAlt'),
  caption: t('redesign.hero.captureLabel'),
}));

const activeWorkflow = ref<WorkflowKey>('prepare');
const workflowOrder: WorkflowKey[] = ['prepare', 'perform', 'output'];
const workflowItems = computed<Record<WorkflowKey, Capture & { label: string; title: string; text: string; width: number; height: number }>>(() => ({
  prepare: {
    label: t('redesign.workflow.prepareLabel'),
    title: t('redesign.workflow.prepareTitle'),
    text: t('redesign.workflow.prepareText'),
    caption: t('redesign.workflow.prepareCaption'),
    alt: t('redesign.workflow.prepareAlt'),
    src: asset('screenshots/manual-20260906/edit-workspace.webp'),
    width: 1800,
    height: 1021,
  },
  perform: {
    label: t('redesign.workflow.performLabel'),
    title: t('redesign.workflow.performTitle'),
    text: t('redesign.workflow.performText'),
    caption: t('redesign.workflow.performCaption'),
    alt: t('redesign.workflow.performAlt'),
    src: asset('screenshots/manual-20260906/show-mode.webp'),
    width: 2400,
    height: 1488,
  },
  output: {
    label: t('redesign.workflow.outputLabel'),
    title: t('redesign.workflow.outputTitle'),
    text: t('redesign.workflow.outputText'),
    caption: t('redesign.workflow.outputCaption'),
    alt: t('redesign.workflow.outputAlt'),
    src: asset('screenshots/manual-20260906/output-routing-current.webp'),
    width: 1800,
    height: 432,
  },
}));

const precisionCapture = computed<Capture>(() => ({
  src: asset('screenshots/manual-20260906/cue-playback-current.webp'),
  alt: t('redesign.precision.screenshotAlt'),
  caption: t('redesign.precision.captureLabel'),
}));

const precisionItems = computed(() => [
  { title: t('redesign.precision.inTitle'), text: t('redesign.precision.inText') },
  { title: t('redesign.precision.outTitle'), text: t('redesign.precision.outText') },
  { title: t('redesign.precision.fadesTitle'), text: t('redesign.precision.fadesText') },
  { title: t('redesign.precision.nextTitle'), text: t('redesign.precision.nextText') },
  { title: t('redesign.precision.loudnessTitle'), text: t('redesign.precision.loudnessText') },
]);

const demoStep = ref(0);
const selectedDemoIndex = 2;
const activeDemoIndex = computed(() => demoStep.value > 0 ? demoStep.value - 1 : -1);
const nextDemoIndex = computed(() => demoStep.value < 3 ? demoStep.value : -1);
const demoCues = computed(() => [
  { name: t('redesign.show.cueOne'), detail: t('redesign.show.cueOneDetail') },
  { name: t('redesign.show.cueTwo'), detail: t('redesign.show.cueTwoDetail') },
  { name: t('redesign.show.cueThree'), detail: t('redesign.show.cueThreeDetail') },
]);
const demoAnnouncement = computed(() => {
  if (demoStep.value >= demoCues.value.length) return t('redesign.show.complete');
  return `${t('redesign.show.upNext')}: ${demoCues.value[demoStep.value]?.name ?? ''}`;
});
const advanceDemo = () => {
  if (demoStep.value < demoCues.value.length) demoStep.value += 1;
};
const resetDemo = () => {
  demoStep.value = 0;
};

const transportCapture = computed<Capture>(() => ({
  src: asset('screenshots/manual-20260906/transport-detail-current.webp'),
  alt: t('redesign.show.transportAlt'),
  caption: t('redesign.show.transportLabel'),
}));

const activeOneShotMode = ref<OneShotKey>('overlay');
const oneShotOrder: OneShotKey[] = ['overlay', 'duck', 'replace'];
const oneShotModes = computed<Record<OneShotKey, { label: string; title: string; text: string }>>(() => ({
  overlay: { label: t('redesign.oneShots.overlayLabel'), title: t('redesign.oneShots.overlayTitle'), text: t('redesign.oneShots.overlayText') },
  duck: { label: t('redesign.oneShots.duckLabel'), title: t('redesign.oneShots.duckTitle'), text: t('redesign.oneShots.duckText') },
  replace: { label: t('redesign.oneShots.replaceLabel'), title: t('redesign.oneShots.replaceTitle'), text: t('redesign.oneShots.replaceText') },
}));
const oneShotArmedCapture = computed<Capture>(() => ({
  src: asset('screenshots/manual-20260906/one-shot-armed-current.webp'),
  alt: t('redesign.oneShots.armedAlt'),
  caption: t('redesign.oneShots.armedCaption'),
}));
const oneShotSettingsCapture = computed<Capture>(() => ({
  src: asset('screenshots/manual-20260906/one-shot-settings-current.webp'),
  alt: t('redesign.oneShots.settingsAlt'),
  caption: t('redesign.oneShots.settingsCaption'),
}));

const activeOutput = ref<OutputKey>('testCard');
const outputOrder: OutputKey[] = ['testCard', 'routing', 'settings'];
const outputItems = computed<Record<OutputKey, Capture & { label: string; title: string; text: string; width: number; height: number }>>(() => ({
  testCard: {
    label: t('redesign.output.testCardLabel'),
    title: t('redesign.output.testCardTitle'),
    text: t('redesign.output.testCardText'),
    caption: t('redesign.output.testCardCaption'),
    alt: t('redesign.output.testCardAlt'),
    src: asset('screenshots/manual-20260906/video-test-card-current.webp'),
    width: 1800,
    height: 952,
  },
  routing: {
    label: t('redesign.output.routingLabel'),
    title: t('redesign.output.routingTitle'),
    text: t('redesign.output.routingText'),
    caption: t('redesign.output.routingCaption'),
    alt: t('redesign.output.routingAlt'),
    src: asset('screenshots/manual-20260906/audio-settings-current.webp'),
    width: 1448,
    height: 1120,
  },
  settings: {
    label: t('redesign.output.settingsLabel'),
    title: t('redesign.output.settingsTitle'),
    text: t('redesign.output.settingsText'),
    caption: t('redesign.output.settingsCaption'),
    alt: t('redesign.output.settingsAlt'),
    src: asset('screenshots/manual-20260906/video-settings-current.webp'),
    width: 1440,
    height: 1408,
  },
}));

const connectionCapture = computed<Capture>(() => ({
  src: asset('screenshots/manual-20260906/server-connection-current.webp'),
  alt: t('redesign.projects.connectionAlt'),
  caption: t('redesign.projects.connectionCaption'),
}));
const importCapture = computed<Capture>(() => ({
  src: asset('screenshots/manual-20260906/import-options-current.webp'),
  alt: t('redesign.projects.importAlt'),
  caption: t('redesign.projects.importCaption'),
}));

const faqItems = computed(() => [
  { question: t('redesign.docs.faqOneQuestion'), answer: t('redesign.docs.faqOneAnswer') },
  { question: t('redesign.docs.faqTwoQuestion'), answer: t('redesign.docs.faqTwoAnswer') },
  { question: t('redesign.docs.faqThreeQuestion'), answer: t('redesign.docs.faqThreeAnswer') },
  { question: t('redesign.docs.faqFourQuestion'), answer: t('redesign.docs.faqFourAnswer') },
  { question: t('redesign.docs.faqFiveQuestion'), answer: t('redesign.docs.faqFiveAnswer') },
]);

const zoomOpen = ref(false);
const zoomImage = ref<Capture>({ src: '', alt: '', caption: '' });
const openZoom = (capture: Capture) => {
  zoomImage.value = capture;
  zoomOpen.value = true;
};

const seoTitle = computed(() => `DonWells Cue — ${t('header.tagline')}`);
const seoDescription = computed(() => t('seo.description'));
const ogImage = `${siteURL}screenshots/manual-20260906/show-mode.webp`;

useHead(() => ({
  title: seoTitle.value,
  htmlAttrs: { lang: 'en', dir: 'ltr' },
}));
useSeoMeta(() => ({
  title: seoTitle.value,
  description: seoDescription.value,
  ogTitle: seoTitle.value,
  ogDescription: seoDescription.value,
  ogType: 'website',
  ogUrl: siteURL,
  ogImage,
  ogImageWidth: '2400',
  ogImageHeight: '1488',
  ogImageType: 'image/webp',
  twitterCard: 'summary_large_image',
  twitterTitle: seoTitle.value,
  twitterDescription: seoDescription.value,
  twitterImage: ogImage,
}));

let revealObserver: IntersectionObserver | null = null;

onMounted(async () => {
  document.addEventListener('keydown', handleGlobalKeydown);

  try {
    const response = await fetch(asset('package.json'));
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const runtimePackage = await response.json();
    if (typeof runtimePackage.version === 'string') version.value = runtimePackage.version;
  } catch (error) {
    console.warn('Using fallback site version:', error);
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reducedMotion && 'IntersectionObserver' in window && shell.value) {
    const revealTargets = shell.value.querySelectorAll<HTMLElement>('[data-reveal]');
    revealObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        (entry.target as HTMLElement).classList.add('is-revealed');
        revealObserver?.unobserve(entry.target);
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });

    for (const target of revealTargets) revealObserver.observe(target);
    shell.value.classList.add('reveal-ready');
  }
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleGlobalKeydown);
  revealObserver?.disconnect();
});

</script>
