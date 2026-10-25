import i18n from 'i18next'
import Backend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'

import { de } from './translations/de'
import { en } from './translations/en'
import { es } from './translations/es'
import { fr } from './translations/fr'
import { it } from './translations/it'
import { ko } from './translations/ko'
import { uk } from './translations/uk'
import { zh } from './translations/zh'

void i18n
  .use(initReactI18next)
  .use(Backend)
  .init({
    ns: ['translation'],
    backend: {
      // > see https://github.com/i18next/i18next-http-backend
      loadPath: function (lngs: any, namespaces: Array<string>) {
        const lng = lngs[0]
        const ns = namespaces[0]

        if (ns.startsWith('g/')) {
          return `/i18n/${ns}/${lng}`
        } else {
          return `/locales/${lng}/${ns}.json`
        }
      },
    },
    // > language to use, more information here:
    // > https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    lng: 'en',
    // Fallback to English if other translations are missing
    fallbackLng: 'en',
    // > you can use the i18n.changeLanguage function to change the language manually:
    // > https://www.i18next.com/overview/api#changelanguage
    // > if you're using a language detector, do not define the lng option
    returnEmptyString: false,
    nsSeparator: false, // to allow `:` in the key
    interpolation: {
      // > react already safes from xss
      escapeValue: false,
    },
    resources: {
      de: { translation: de },
      en: { translation: en },
      es: { translation: es },
      fr: { translation: fr },
      it: { translation: it },
      ko: { translation: ko },
      uk: { translation: uk },
      zh: { translation: zh },
    },
  })

export default i18n
