import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/codex')({
  component: CodexInputExample,
})

function RouteComponent() {
  return <div>Hello "/codex"!</div>
}






import { useEffect, useRef, useState } from 'react'
import { Plus, Hand, Zap, Mic, ArrowUp, ChevronDown, FolderGit2, Laptop, GitBranch, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PromptArea } from '@workspace/ui/components/prompt-area/prompt-area'
import { ActionBar } from '@workspace/ui/components/prompt-area/action-bar'
import type { Segment, PromptAreaHandle } from '@workspace/ui/components/prompt-area/types'

const TOOLBAR_PILL = 'text-[#8f9091] hover:bg-accent hover:text-foreground dark:text-muted-foreground flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[13px] transition-colors'
const ICON_BTN = 'text-[#8f9091] hover:bg-accent hover:text-foreground dark:text-muted-foreground flex size-8 items-center justify-center rounded-full transition-colors'
const TRAY_PILL = 'text-[#8f9091] hover:bg-accent hover:text-foreground dark:text-muted-foreground flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs transition-colors'
const MENU = 'bg-popover absolute z-20 flex flex-col rounded-xl border p-1 shadow-md'
const MENU_ITEM = 'flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left text-sm hover:bg-accent'

function CodexInputExample() {
  const [segments, setSegments] = useState<Segment[]>([])
  // Snapshot of the last submission so Reset can restore it for another send.
  const [submitted, setSubmitted] = useState<Segment[] | null>(null)
  const [model, setModel] = useState({ version: '6 Astra', effort: 'Extra High' })
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const promptRef = useRef<PromptAreaHandle>(null)
  const toggleMenu = (id: string) => setOpenMenu((cur) => (cur === id ? null : id))

  const submit = (segs: Segment[]) => {
    if (!segs.length) return
    setSubmitted(segs)
    promptRef.current?.clear()
    setSegments([])
  }
  const reset = () => {
    if (submitted) setSegments(submitted)
    setSubmitted(null)
    promptRef.current?.focus()
  }

  // Close the open menu on outside click — one root ref covers every dropdown.
  useEffect(() => {
    if (!openMenu) return
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpenMenu(null)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [openMenu])

  return (
    <div className="relative flex flex-col p-10" ref={rootRef}>
      {/* Foreground composer */}
      <div
        className="bg-card dark:bg-[#2d2d2d] relative z-10 rounded-[24px] border border-[#ececec] shadow-sm dark:border-0 dark:shadow-none"
        style={{ '--prompt-area-surface': 'var(--card)', '--prompt-area-placeholder': 'oklch(0.7 0 0)' } as React.CSSProperties}>
        <div className="pt-[13.5px] pr-2 pb-2 pl-[13px]">
          <PromptArea
            ref={promptRef}
            value={segments}
            onChange={setSegments}
            placeholder="Do anything"
            onSubmit={submit}
            markdown
            autoGrow
            minHeight={40}
            maxHeight={280}
          />


          <ActionBar
            className="flex-wrap gap-y-2 pt-2"
            left={
              <div className="flex items-center gap-0.5">
                <button className={ICON_BTN} aria-label="Add"><Plus className="size-4" /></button>
                <div className="relative">
                  <button onClick={() => toggleMenu('permissions')} className={TOOLBAR_PILL}>
                    <Hand className="size-4" /> Default permissions <ChevronDown className="size-3.5 opacity-60" />
                  </button>
                  {openMenu === 'permissions' && (
                    <div className={cn(MENU, 'bottom-full left-0 mb-1.5 w-48')}>
                      {['Default permissions', 'Read only', 'Full access'].map((p) => (
                        <button key={p} className={MENU_ITEM} onClick={() => setOpenMenu(null)}>
                          <Hand className="size-4" /> {p}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            }
            right={
              <div className="flex items-center gap-0.5">
                <div className="relative">
                  <button onClick={() => toggleMenu('model')} className={TOOLBAR_PILL}>
                    <Zap className="size-4" />
                    <span className="text-foreground font-semibold">{model.version}</span>
                    {model.effort}
                    <ChevronDown className="size-3.5 opacity-60" />
                  </button>
                  {openMenu === 'model' && (
                    <div className={cn(MENU, 'right-0 bottom-full mb-1.5 w-52')}>
                      {[{ version: '6 Astra', effort: 'Extra High' }, { version: '5.6 Sol', effort: 'Extra High' }, { version: '5.6 Sol', effort: 'High' }, { version: '5.6 Terra', effort: 'Medium' }, { version: '5.6 Luna', effort: 'Low' }].map((m, i) => (
                        <button key={i} className={MENU_ITEM} onClick={() => { setModel(m); setOpenMenu(null) }}>
                          <Zap className="size-4" />
                          <span className="text-foreground font-semibold">{m.version}</span>
                          <span className="text-muted-foreground">{m.effort}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button className={ICON_BTN} aria-label="Voice input"><Mic className="size-4" /></button>
                <button
                  onClick={() => submit(segments)}
                  className="bg-black text-white hover:bg-[#1a1a1a] disabled:bg-[#dadada] disabled:text-[#7a7a7a] dark:bg-white dark:text-black dark:hover:bg-neutral-200 dark:disabled:bg-[#969696] dark:disabled:text-[#2d2d2d] flex size-8 items-center justify-center rounded-full disabled:cursor-not-allowed"
                  aria-label="Send">
                  <ArrowUp className="size-4" />
                </button>
              </div>
            }
          />
        </div>
      </div>

      {/* Background context tray — peeks out below the composer */}
      <div className="bg-[#f6f6f6] dark:bg-[#1f1f1f] -mt-5 rounded-b-[24px] px-1.5 pt-[27px] pb-[7px]">
        <div className="flex flex-wrap items-center gap-0.5">
          <button onClick={() => toggleMenu('repo')} className={TRAY_PILL}>
            <FolderGit2 className="size-3.5" /> acme-enterprise <ChevronDown className="size-3 opacity-60" />
          </button>
          <button onClick={() => toggleMenu('environment')} className={TRAY_PILL}>
            <Laptop className="size-3.5" /> Work locally <ChevronDown className="size-3 opacity-60" />
          </button>
          <button onClick={() => toggleMenu('branch')} className={cn(TRAY_PILL, 'min-w-0 max-w-[200px]')} title="cursor/prod-data-memoization-layer">
            <GitBranch className="size-3.5 shrink-0" />
            <span className="min-w-0 truncate">cursor/prod-data-memoization-layer</span>
            <ChevronDown className="size-3 shrink-0 opacity-60" />
          </button>
        </div>
      </div>

      {submitted && (
        <div className="bg-muted/50 mt-2 flex items-center justify-between rounded-lg border p-3 text-sm">
          <span className="text-muted-foreground">Submitted — clear to send again.</span>
          <button
            onClick={reset}
            className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs"
            aria-label="Reset">
            <RotateCcw className="size-3.5" /> Reset
          </button>
        </div>
      )}
    </div>
  )
}