'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Send, Sparkles, X, Loader2, MessageCircle } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { MarkdownRender } from '@/components/blog/markdown-render'
import { listKnowledgeBaseVoByPage } from '@/api/ai/knowledgeBaseController'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export function RAGChatPanel({ algorithmName }: { algorithmName: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `你好！我是 AI 算法助手 🤖。关于 **${algorithmName}**，你有什么疑问吗？无论是原理解释还是时间复杂度分析，我都可以为你解答！`,
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [kbId, setKbId] = useState<string | number | null>('2039641490393399297')
  const scrollRef = useRef<HTMLDivElement>(null)

  // 动态获取当前算法对应的知识库ID (用户要求先显示指定 2039641490393399297)
  /*
  useEffect(() => {
    if (isOpen && kbId === null) {
      async function fetchKbId() {
        try {
          const searchQuery = algorithmName.split(' ')[0] // e.g. "冒泡排序 (Bubble Sort)" -> "冒泡排序"
          const res = await listKnowledgeBaseVoByPage({ searchText: searchQuery, pageSize: 1 })
          if (res?.code === 0 && res.data?.records && res.data.records.length > 0) {
            setKbId(res.data.records[0].id ?? '2039641490393399297')
          } else {
            console.log(`Knowledge Base for ${searchQuery} not found, falling back to 2039641490393399297`)
            setKbId('2039641490393399297') // Fallback default
          }
        } catch (error) {
          console.error('Failed to fetch KB ID, falling back to 2039641490393399297:', error)
          setKbId('2039641490393399297')
        }
      }
      fetchKbId()
    }
  }, [isOpen, kbId, algorithmName])
  */

  // 自动滚动到最新消息
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const finalKbId = kbId !== null ? kbId : 1
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || ''

      const response = await fetch(`${baseUrl}/ai/rag/ask/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          question: `请结合知识库，为我解答关于 ${algorithmName} 的问题：${userMessage.content}`,
          knowledgeBaseId: finalKbId,
          topK: 5,
          conversationId: 'system-default-conversation',
        }),
      })

      if (!response.ok) {
        throw new Error('Network Error')
      }
      if (!response.body) {
        throw new Error('Streaming not supported')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder('utf-8')
      const aiMessageId = (Date.now() + 1).toString()

      // 植入 AI 占位消息，准备接受流式写入
      setMessages(prev => [...prev, { id: aiMessageId, role: 'assistant', content: '' }])

      let done = false
      let buffer = ''

      while (!done) {
        const { value, done: readerDone } = await reader.read()
        done = readerDone
        if (value) {
          buffer += decoder.decode(value, { stream: true })
        }

        // 核心解析：处理后端标准的流式 Server-Sent Events (SSE)
        // 按照双换行符分隔区块
        const chunks = buffer.split('\n\n')
        buffer = chunks.pop() || '' // 最后一个不完整的数据块留回缓存下一次解析

        let newlyParsed = ''
        for (const ev of chunks) {
          const lines = ev.split('\n')
          for (const line of lines) {
            if (line.startsWith('data:')) {
              let payload = line.slice(5).trim()
              if (payload === '[DONE]') continue

              // 处理 Java SSE JSON 序列化带来的外层包裹双引号和转义字符
              if (payload.startsWith('"') && payload.endsWith('"')) {
                try {
                  payload = JSON.parse(payload) // 此时会还原出文本中的 \n 回车等
                } catch {
                  // Ignore incomplete JSON strings during stream
                }
              }
              newlyParsed += payload
            }
          }
        }

        // 把清洗后的纯净文本追加到最后一条消息
        if (newlyParsed) {
          setMessages(prev =>
            prev.map(m => (m.id === aiMessageId ? { ...m, content: m.content + newlyParsed } : m))
          )
        }
      }
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '抱歉，网络似乎出了点问题。请再次尝试发送。',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-8 right-8 z-50 flex items-center gap-2 rounded-full bg-[#007AFF] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(0,122,255,0.3)] transition-all hover:bg-[#0066CC] dark:bg-[#007AFF] dark:hover:bg-[#0066CC]"
        >
          <Sparkles className="h-4 w-4" />
          <span>AI 答疑</span>
        </motion.button>
      </SheetTrigger>

      {/* Promax 级别的磨砂玻璃边界 */}
      <SheetContent className="flex w-[450px] flex-col border-l border-border/50 bg-background p-0 shadow-2xl sm:w-[600px] sm:max-w-xl">
        <SheetHeader className="flex flex-row items-center justify-between border-b border-border/50 bg-card/80 backdrop-blur-xl px-6 py-4">
          <SheetTitle className="flex items-center gap-2.5 text-base font-bold text-foreground">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <Bot className="h-4 w-4" />
            </div>
            AI 算法导师
          </SheetTitle>
        </SheetHeader>

        {/* 聊天记录区域 */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800"
        >
          <AnimatePresence initial={false}>
            {messages.map(msg => {
              // 清理后端传回来的丑陋的源片段标记，例如：[chunkId=2039641490393399297_0] |:
              const cleanContent = msg.content
                .replace(/\[chunkId=[^\]]+\](?:[\s|:])*/g, '')
                .trim()
                
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                <div
                  className={`group relative max-w-[85%] px-5 py-3.5 text-[15px] leading-relaxed transition-all ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-[22px] rounded-br-[6px] shadow-sm'
                      : 'bg-card text-foreground rounded-[22px] rounded-bl-[6px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] ring-1 ring-black/5 dark:ring-white/5 dark:shadow-none'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <div className="font-medium tracking-wide">{cleanContent}</div>
                  ) : (
                    <div className="prose prose-zinc prose-sm dark:prose-invert max-w-none prose-p:leading-[1.6] prose-p:my-3 prose-pre:bg-muted prose-pre:ring-1 prose-pre:ring-black/5 dark:prose-pre:ring-white/10 prose-headings:font-bold prose-headings:mt-5 prose-headings:mb-2 text-foreground">
                      <MarkdownRender content={cleanContent} />
                    </div>
                  )}
                </div>
              </motion.div>
            )})}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex max-w-[85%] items-center gap-3 rounded-[22px] rounded-bl-[6px] bg-card px-5 py-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] ring-1 ring-black/5 dark:ring-white/5">
                  <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
                  <span className="text-sm font-medium text-zinc-500">正在思考...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 底部输入框 */}
        <div className="border-t border-border/50 bg-background/50 p-4 backdrop-blur-md">
          <div className="relative flex items-end gap-2">
              <Textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="发送给 AI 算法导师..."
              className="max-h-32 min-h-[50px] w-full resize-none rounded-[18px] border border-border/80 bg-card pl-4 pr-12 pt-3.5 text-[15px] shadow-sm text-foreground focus-visible:ring-1 focus-visible:ring-primary/30"
              rows={1}
            />
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute bottom-1 right-1 h-9 w-9 shrink-0 rounded-full bg-primary text-primary-foreground transition-all hover:opacity-90 disabled:opacity-30"
            >
              <Send className="h-[15px] w-[15px]" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
