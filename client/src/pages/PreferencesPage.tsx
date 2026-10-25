import { useAtom } from 'jotai'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { Switch } from '../components/Switch'
import config from '../config.json'
import { setLanguage } from '../i18n'
import { type Preferences, preferencesAtom } from '../state/preferences-atoms'

const layouts = [
  'mobile',
  'auto',
  'desktop',
] as const satisfies Preferences['layout'][]

/** The settings of the user, see `preferencesAtom` */
export function PreferencesPage() {
  const { t, i18n } = useTranslation()
  const [preferences, setPreferences] = useAtom(preferencesAtom)
  const update = (changes: Partial<Preferences>) =>
    setPreferences(prev => ({ ...prev, ...changes }))

  return (
    <div className="mx-auto flex-col w-full max-w-3xl gap-8 p-8 text-left">
      <h2>{t('preferences.title')}</h2>

      <Category title={t('preferences.language')}>
        <select
          className="w-72 rounded border border-(--border) bg-(--bg) px-3 py-2 text-(--text-h)"
          aria-label={t('preferences.language')}
          value={i18n.language}
          onChange={ev => setLanguage(ev.target.value)}
        >
          {config.languages.map(({ iso, name }) => (
            <option key={iso} value={iso}>
              {name}
            </option>
          ))}
        </select>
        <p>{t('preferences.languageNote')}</p>
        <Switch
          checked={preferences.useFlags}
          onChange={useFlags => update({ useFlags })}
          label={t('preferences.useFlags')}
        />
      </Category>

      <Category title={t('preferences.layout')}>
        <div
          role="radiogroup"
          aria-label={t('preferences.layout')}
          className="inline-flex self-start overflow-hidden rounded border border-primary"
        >
          {layouts.map(layout => (
            <label
              key={layout}
              className="cursor-pointer px-4 py-2 has-checked:bg-primary has-checked:text-white has-focus-visible:outline-2 has-focus-visible:-outline-offset-4 has-focus-visible:outline-white"
            >
              <input
                type="radio"
                name="layout"
                className="sr-only"
                checked={preferences.layout === layout}
                onChange={() => update({ layout })}
              />
              {t(`preferences.layouts.${layout}`)}
            </label>
          ))}
        </div>
        <Switch
          checked={preferences.showLockedInventory}
          onChange={showLockedInventory => update({ showLockedInventory })}
          label={t('preferences.showLockedInventory')}
        />
      </Category>

      <Category title={t('preferences.browserStorage')}>
        <Switch
          checked={preferences.isSavePreferences}
          onChange={isSavePreferences => update({ isSavePreferences })}
          label={t('preferences.savePreferences')}
        />
      </Category>
    </div>
  )
}

function Category({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex-col gap-3">
      <h3 className="text-lg font-medium text-(--text-h)">{title}</h3>
      {children}
    </section>
  )
}
