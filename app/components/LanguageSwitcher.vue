<template>
  <div class="language-switcher">
    <label class="sr-only" for="language-select">{{ t('common.changeLanguage') }}</label>
    <select
      id="language-select"
      class="language-select"
      :value="locale"
      :aria-label="t('common.changeLanguage')"
      @change="handleChange"
    >
      <option v-for="(name, code) in locales" :key="code" :value="code">
        {{ name }}
      </option>
    </select>
    <span class="language-chevron" aria-hidden="true">⌄</span>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '../composables/useI18n';

const { t, locale, locales, setLocale } = useI18n();

const handleChange = async (event: Event) => {
  const code = (event.target as HTMLSelectElement).value;
  await setLocale(code);
};
</script>

<style scoped lang="scss">
.language-switcher {
  position: relative;
  display: inline-flex;
  align-items: center;

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .language-select {
    min-width: 64px;
    min-height: 44px;
    padding: 0 28px 0 12px;
    appearance: none;
    border: 1px solid rgba(21, 24, 29, 0.15);
    border-radius: 4px;
    background: #f3f1ec;
    color: #15181d;
    cursor: pointer;
    font: 600 10px/1 'IBM Plex Mono', ui-monospace, monospace;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    transition: background 0.16s ease, border-color 0.16s ease;

    &:hover,
    &:focus-visible {
      border-color: #315fcf;
      background: rgba(49, 95, 207, 0.08);
      outline: none;
    }
  }

  .language-chevron {
    position: absolute;
    inset-inline-end: 10px;
    top: 50%;
    pointer-events: none;
    transform: translateY(-50%);
    color: #65707b;
    font-size: 15px;
    line-height: 1;
  }
}

@media (max-width: 480px) {
  .language-switcher {
    .language-select {
      min-width: 60px;
      padding-inline: 9px 24px;
      font-size: 9px;
    }
  }
}
</style>
