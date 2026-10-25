import './i18n'
import './App.css'
import { useTranslation } from 'react-i18next'

export function App() {
  const { t } = useTranslation()
  return (
    <div>
      <p>{t('helloWorld')}</p>
      <button
        className="cursor-pointer rounded-xl border border-gray-800 p-2"
        onClick={() => {
          fetch('/ping')
            .then(res => res.text())
            .then(res => console.info(res))
            .catch(error => console.error(error))
        }}
      >
        Ping?
      </button>
    </div>
  )
}
