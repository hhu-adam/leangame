import 'katex/dist/katex.min.css'
import ReactMarkdown, { defaultUrlTransform } from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

/**
 * Renders Markdown with GitHub extensions and `$…$` math. For texts of a game, pass its
 * `owner/repo` as `game`, so that images like `images/cover.png` load from the game.
 */
export function Markdown({
  children,
  game,
}: {
  children: string
  game?: string
}) {
  return (
    <div className="[&_code]:rounded-[.3em] [&_code]:bg-[rgb(223,227,234)] [&_code]:px-[.3em] [&_code]:text-[85%] [&_code]:text-[rgba(0,32,90,0.87)] [&_li_ol]:mx-[1.5em] [&_li_ol]:mb-0 [&_li_ul]:mx-[1.5em] [&_li_ul]:mb-0 [&_ol]:mx-[1.5em] [&_ol]:mb-[1.5em] [&_ol]:list-decimal [&_pre]:overflow-auto [&_pre]:rounded-[.3em] [&_pre]:bg-[rgb(223,227,234)] [&_pre]:py-[.6em] [&_pre]:pl-[.3em] [&_pre]:leading-[1.45] [&_pre]:text-[rgba(0,32,90,0.87)] [&_pre_code]:p-0 [&_ul]:mx-[1.5em] [&_ul]:mb-[1.5em] [&_ul]:list-disc">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        urlTransform={url =>
          game && url.startsWith('images/')
            ? `/api/data/${game}/${url}`
            : defaultUrlTransform(url)
        }
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
