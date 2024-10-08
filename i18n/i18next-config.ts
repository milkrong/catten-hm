'use client';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { LanguagesSupported } from '@/i18n/language';

const loadLangResources = (lang: string) => ({
  translation: {
    global: require(`./${lang}/global`).default,
    menu: require(`./${lang}/menu`).default,
    task: require(`./${lang}/task`).default,
    expenses: require(`./${lang}/expenses`).default,
  },
});

// Automatically generate the resources object
const resources = LanguagesSupported.reduce((acc: any, lang: string) => {
  acc[lang] = loadLangResources(lang);
  return acc;
}, {});

i18n.use(initReactI18next).init({
  lng: undefined,
  fallbackLng: 'zh-CN',
  resources,
});

export const changeLanguage = i18n.changeLanguage;
export default i18n;
