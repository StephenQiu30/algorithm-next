'use client'

import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeKatex from 'rehype-katex'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import 'katex/dist/katex.min.css'
import { cn } from '@/lib/utils'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRender({ content, className }: MarkdownRendererProps) {
  return (
    <article
      className={cn(
        'prose prose-sm md:prose-base prose-neutral dark:prose-invert max-w-none tracking-tight break-words',
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeSlug, rehypeKatex]}
        components={{
          // 自定义标题样式
          h1: ({ children, ...props }) => (
            <header className="border-border/40 mb-8 border-b pb-4">
              <h1
                className="text-foreground text-3xl font-black tracking-tighter md:text-4xl"
                {...props}
              >
                {children}
              </h1>
            </header>
          ),
          h2: ({ id, children }) => (
            <h2
              id={id}
              className="text-foreground group relative mt-10 mb-5 scroll-m-24 text-xl font-black tracking-tight first:mt-0 md:text-2xl"
            >
              <div className="bg-primary/20 absolute top-1/2 -left-6 h-5 w-1.5 -translate-y-1/2 rounded-full opacity-0 transition-all group-hover:opacity-100" />
              {children}
            </h2>
          ),
          h3: ({ id, children }) => (
            <h3
              id={id}
              className="text-foreground mt-8 mb-4 scroll-m-24 text-lg font-black tracking-tight md:text-xl"
            >
              {children}
            </h3>
          ),
          h4: ({ id, children }) => (
            <h4
              id={id}
              className="text-foreground mt-6 mb-3 scroll-m-24 text-base font-black tracking-tight md:text-lg"
            >
              {children}
            </h4>
          ),

          // 段落
          p: ({ children }) => (
            <p className="!text-foreground/80 text-[14px] leading-relaxed md:text-[15px] [&:not(:first-child)]:mt-5">
              {children}
            </p>
          ),

          // 链接
          a: ({ href, children }) => {
            const isRef = href && href.startsWith('#')
            return (
              <a
                href={href}
                target={isRef ? undefined : '_blank'}
                rel={isRef ? undefined : 'noopener noreferrer'}
                className="text-primary/80 hover:text-primary border-primary/20 hover:border-primary/50 border-b font-bold no-underline transition-colors"
              >
                {children}
              </a>
            )
          },

          // 图片
          img: ({ src, alt }) => (
            <span className="my-10 block first:mt-0 last:mb-0">
              <img
                src={src || ''}
                alt={alt || ''}
                className="bg-muted border-border/10 max-h-[700px] w-full rounded-2xl border object-contain shadow-sm"
                loading="lazy"
              />
              {alt && (
                <span className="text-muted-foreground mt-3 block text-center text-xs font-bold opacity-60">
                  {alt}
                </span>
              )}
            </span>
          ),

          // 代码块
          pre: ({ children }) => <>{children}</>,
          code: ({ node, inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '')
            const language = match ? match[1] : 'text'
            const [copied, setCopied] = React.useState(false)

            const onCopy = () => {
              navigator.clipboard.writeText(String(children).replace(/\n$/, ''))
              setCopied(true)
              setTimeout(() => setCopied(false), 2000)
            }

            if (!inline && match) {
              const { ref, ...rest } = props
              return (
                <div className="group border-border/10 bg-muted/20 hover:bg-muted/40 hover:shadow-primary/5 relative my-10 overflow-hidden rounded-2xl border transition-all duration-300 first:mt-0 last:mb-0 hover:shadow-2xl">
                  <div className="border-border/5 bg-muted/30 flex h-11 items-center justify-between border-b px-5">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/20 h-2 w-2 rounded-full" />
                      <div className="bg-primary/10 h-2 w-2 rounded-full" />
                      <div className="bg-primary/5 h-2 w-2 rounded-full" />
                    </div>
                    <span className="text-muted-foreground/40 ml-2 font-mono text-[10px] font-black tracking-[0.3em] uppercase">
                      {language}
                    </span>
                  </div>
                  <div className="scrollbar-hide relative overflow-x-auto p-6 px-8 font-mono text-[13px] leading-relaxed [&_code]:!bg-transparent [&_code::after]:!content-none [&_code::before]:!content-none [&_pre]:!bg-transparent">
                    <SyntaxHighlighter
                      {...rest}
                      style={oneDark as any}
                      language={language}
                      PreTag="div"
                      customStyle={{
                        margin: 0,
                        padding: 0,
                        background: 'transparent',
                      }}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  </div>
                </div>
              )
            }
            return (
              <code
                className="bg-muted text-foreground/70 border-border/5 rounded-md border px-[0.3rem] py-[0.1rem] font-mono text-[12px] font-bold [&::after]:!content-none [&::before]:!content-none"
                {...props}
              >
                {children}
              </code>
            )
          },

          // 引用块
          blockquote: ({ children }) => (
            <blockquote className="border-primary/40 bg-primary/[0.03] text-foreground/80 ring-primary/5 hover:bg-primary/[0.06] my-10 overflow-hidden rounded-r-2xl border-l-[5px] py-8 pr-8 pl-10 shadow-sm ring-1 transition-all ring-inset hover:shadow-md">
              <div className="relative text-[15px] leading-loose font-medium italic md:text-[16px]">
                {children}
              </div>
            </blockquote>
          ),

          // 列表
          ul: ({ children }) => (
            <ul className="marker:text-muted-foreground/50 my-5 ml-5 list-disc space-y-2">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="marker:text-muted-foreground/50 my-5 ml-5 list-decimal space-y-2">
              {children}
            </ol>
          ),
          li: ({ children }) => {
            return (
              <li className="!text-foreground/80 pl-1 text-[14px] leading-relaxed md:text-[15px]">
                {children}
              </li>
            )
          },

          strong: ({ children }) => (
            <strong className="!text-foreground font-bold">{children}</strong>
          ),

          // 表格
          table: ({ children }) => (
            <div className="group border-border/20 bg-card/30 hover:shadow-primary/5 relative my-12 w-full overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-2xl">
              <div className="scrollbar-hide overflow-x-auto">
                <table className="w-full min-w-[600px] border-collapse text-[13px] leading-relaxed">
                  {children}
                </table>
              </div>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted/30 border-border/50 border-b">{children}</thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-border/20 bg-card/[0.02] divide-y">{children}</tbody>
          ),
          tr: ({ children }) => <tr className="hover:bg-muted/20 transition-colors">{children}</tr>,
          th: ({ children }) => (
            <th className="!text-foreground/60 px-5 py-3 text-left text-[10px] font-black tracking-[0.2em] uppercase">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="!text-foreground/70 border-border/10 border-l px-5 py-4 align-middle font-medium first:border-l-0">
              {children}
            </td>
          ),

          // 分隔线
          hr: () => <hr className="border-border/30 my-10 border-t" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  )
}
