import enTranslations from '@/messages/en.json';
import teTranslations from '@/messages/te.json';

export type Translations = typeof enTranslations;

export { useLanguage } from './LanguageContext';