import type { ButtonHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

/** A button with the primary colour, e.g. in popups */
export function Button({
  className,
  type = 'button',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={twMerge(
        'cursor-pointer rounded bg-primary px-3 py-1.5 text-white hover:bg-primary/85',
        'disabled:cursor-default disabled:opacity-50 disabled:hover:bg-primary',
        className,
      )}
      {...props}
    />
  )
}
