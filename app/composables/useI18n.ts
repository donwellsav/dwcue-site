import enData from '../../public/locales/en.json';

type CopyTree = { [key: string]: string | CopyTree };
const english: CopyTree = enData;

// This website edition is English-only. Keep copy keys centralized without
// browser-language detection, locale requests, or persisted language state.
const t = (path: string, params?: Record<string, string>): string => {
  let value: string | CopyTree | undefined = english;
  for (const key of path.split('.')) {
    if (!value || typeof value === 'string') return path;
    value = value[key];
  }
  const text = typeof value === 'string' ? value : path;
  return params
    ? text.replace(/\{(\w+)\}/g, (match, name: string) => params[name] ?? match)
    : text;
};

const copy = { t };
export const useI18n = () => copy;
