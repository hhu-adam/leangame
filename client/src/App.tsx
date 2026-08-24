import './i18n'
import './App.css'
import { useTranslation } from 'react-i18next'

export function App() {
  const { t } = useTranslation()
  return (
    <div>
      <p>{t('helloWorld')}</p>
      <button
        className="p-2 border rounded-xl border-gray-800 cursor-pointer"
        onClick={() => {
          fetch('/ping')
            .then((res) => res.text())
            .then((res) => console.info(res))
        }}
      >
        Ping?
      </button>
    </div>
  )
}
