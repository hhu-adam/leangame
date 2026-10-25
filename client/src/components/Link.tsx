import { useSetAtom } from 'jotai'
import type { AnchorHTMLAttributes, MouseEvent } from 'react'

import { locationAtom } from '../state/location'

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

/** A link to a page of the client, which navigates without reloading the page */
export function Link({ href, onClick, children, ...props }: LinkProps) {
  const setLocation = useSetAtom(locationAtom)

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event)
    // let the browser handle e.g. ctrl+click to open a new tab
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return
    }
    event.preventDefault()
    setLocation(prev => ({
      ...prev,
      pathname: href,
      searchParams: undefined,
      hash: undefined,
    }))
  }

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  )
}
