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
      <FontPreview />
    </div>
  )
}

// TODO: sample code to preview the fonts, remove once no longer needed
const weights = [
  'font-thin',
  'font-light',
  'font-normal',
  'font-medium',
  'font-bold',
  'font-black',
]

const leanSample = `theorem add_comm' (a b : ℕ) : a + b = b + a := by
  induction b with
  | zero => simp
  | succ n ih => rw [Nat.add_succ, ih]; rfl

example (p q : Prop) (hp : p) (hq : q) : p ∧ q := ⟨hp, hq⟩
-- ∀ ∃ λ → ↔ ¬ ≠ ≤ ≥ ∈ ∉ ⊆ ∪ ∩ ⁻¹ ∘ ⊢`

function FontPreview() {
  return (
    <div className="flex flex-col gap-6 p-6 text-left">
      <section>
        <h2>Roboto Slab (font-sans)</h2>
        {weights.map(w => (
          <p key={w} className={w}>
            {w}: The quick brown fox jumps over the lazy dog. 0123456789
          </p>
        ))}
        <p className="italic">italic (synthesis disabled, so stays upright)</p>
      </section>
      <section>
        <h2>JuliaMono (font-mono)</h2>
        <pre className="overflow-x-auto rounded bg-(--code-bg) p-4 font-mono text-[15px] text-(--text-h)">
          {leanSample}
        </pre>
        <p>
          inline: <code>simp [Nat.add_comm] at h ⊢</code>
        </p>
      </section>
      <section>
        <h2>Noto Color Emoji (subset)</h2>
        <p className="font-mono text-3xl">🎉❌✅💥🎭⏳🟡💡🐙🔍🏁</p>
        <p className="font-sans text-3xl">
          🎉❌✅💥🎭⏳🟡💡🐙🔍🏁 (in font-sans, system emoji)
        </p>
      </section>
    </div>
  )
}
