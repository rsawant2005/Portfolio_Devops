"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"

const statements = [
  "I build infrastructure that scales.",
  "Systems that breathe. Pipelines that never sleep.",
  "Automation first. Reliability always.",
  "DevOps is a philosophy, not a role.",
  "Scale without limits. Ship without fear.",
]

// ─── Linux Terminal Logic ──────────────────────────────────────────────────

type HistoryEntry = { input: string; output: string[] }

const fileSystem: Record<string, string[]> = {
  "/": ["home", "etc", "var", "usr"],
  "/home": ["roshan"],
  "/home/roshan": ["projects", "scripts", ".bashrc", "README.md"],
  "/home/roshan/projects": ["k8s-cluster", "terraform-aws", "ci-cd-pipeline"],
  "/home/roshan/scripts": ["deploy.sh", "monitor.sh", "backup.sh"],
}

const fileContents: Record<string, string[]> = {
  ".bashrc": [
    "# Roshan's bash config",
    "export PATH=$PATH:/usr/local/bin",
    'alias k="kubectl"',
    'alias tf="terraform"',
    'alias dps="docker ps --format \"table {{.Names}}\\t{{.Status}}\""',
    "export AWS_PROFILE=prod",
  ],
  "README.md": [
    "# Roshan Sawant — DevOps Engineer",
    "",
    "Welcome to my system.",
    "> Infrastructure architect. Pipeline builder. Cloud tamer.",
    "",
    "Run `whoami` to learn more.",
  ],
  "deploy.sh": [
    "#!/bin/bash",
    "echo '🚀 Deploying to production...'",
    "terraform apply -auto-approve",
    "kubectl rollout restart deploy/api",
    "echo '✅ Deploy complete.'",
  ],
  "monitor.sh": [
    "#!/bin/bash",
    "watch -n5 'kubectl get pods -A | grep -v Running'",
  ],
}

const commands: Record<string, (args: string[], cwd: string, setCwd: (d: string) => void) => string[]> = {
  help: () => [
    "┌─────────────────────────────────────────┐",
    "│          AVAILABLE COMMANDS              │",
    "├─────────────────────────────────────────┤",
    "│  whoami      — show user info            │",
    "│  ls          — list directory            │",
    "│  cd <dir>    — change directory          │",
    "│  cat <file>  — read a file               │",
    "│  pwd         — print working directory   │",
    "│  uname -a    — system info               │",
    "│  docker ps   — running containers        │",
    "│  kubectl     — cluster status            │",
    "│  neofetch    — system overview           │",
    "│  clear       — clear terminal            │",
    "└─────────────────────────────────────────┘",
  ],
  whoami: () => [
    "roshan",
    "",
    "┌─────────────────────────────────────────────┐",
    "│  Roshan Sawant                               │",
    "│  Role    : DevOps Engineer                   │",
    "│  Skills  : Docker · K8s · AWS · Terraform    │",
    "│  GitHub  : github.com/rsawant2005             │",
    "│  Status  : Available for work ●              │",
    "└─────────────────────────────────────────────┘",
  ],
  pwd: (_args, cwd) => [cwd],
  ls: (_args, cwd) => {
    const items = fileSystem[cwd]
    if (!items) return ["ls: cannot access directory"]
    return [
      items
        .map((i) => {
          const isDir = fileSystem[`${cwd === "/" ? "" : cwd}/${i}`]
          return isDir ? `\x1b[36m${i}/\x1b[0m` : i
        })
        .join("  "),
    ]
  },
  cd: (args, cwd, setCwd) => {
    if (!args[0] || args[0] === "~") { setCwd("/home/roshan"); return [] }
    if (args[0] === "..") {
      const parts = cwd.split("/").filter(Boolean)
      parts.pop()
      setCwd(parts.length === 0 ? "/" : "/" + parts.join("/"))
      return []
    }
    const target = cwd === "/" ? `/${args[0]}` : `${cwd}/${args[0]}`
    if (fileSystem[target]) { setCwd(target); return [] }
    return [`bash: cd: ${args[0]}: No such file or directory`]
  },
  cat: (args, cwd) => {
    if (!args[0]) return ["cat: missing operand"]
    const content = fileContents[args[0]]
    if (content) return content
    const fullPath = `${cwd}/${args[0]}`
    if (fileContents[fullPath]) return fileContents[fullPath]
    return [`cat: ${args[0]}: No such file or directory`]
  },
  "uname": () => [
    "Linux roshan-devbox 6.8.0-aws #1 SMP x86_64 GNU/Linux",
  ],
  "docker": (args) => {
    if (args[0] === "ps") return [
      "CONTAINER ID   IMAGE              STATUS         NAMES",
      "a1b2c3d4e5f6   nginx:alpine       Up 3 days      web-proxy",
      "b2c3d4e5f6a7   postgres:15        Up 3 days      db-primary",
      "c3d4e5f6a7b8   redis:7            Up 3 days      cache",
      "d4e5f6a7b8c9   grafana/grafana    Up 12 hours    monitoring",
    ]
    return [`docker: '${args[0]}' command not found`]
  },
  "kubectl": (args) => {
    if (!args[0] || args[0] === "get") return [
      "NAME                     READY   STATUS    RESTARTS   AGE",
      "api-deployment-abc123    3/3     Running   0          5d",
      "worker-deployment-def456 2/2     Running   1          5d",
      "nginx-ingress-xyz789     1/1     Running   0          5d",
    ]
    return [`kubectl: '${args.join(" ")}' — try 'kubectl get pods'`]
  },
  neofetch: () => [
    "          #####          roshan@devbox",
    "         #######         ────────────────────────",
    "         ##O#O##         OS: Ubuntu 22.04.3 LTS",
    "         #######         Kernel: 6.8.0-aws",
    "       ###########       Shell: bash 5.1.16",
    "      #############      Terminal: tmux 3.3a",
    "     ###############     CPU: 8× Intel Xeon (AWS c6i)",
    "    #################    Memory: 12GB / 32GB",
    "   ###################  Cloud: AWS us-east-1",
    "  #####################  Tools: Docker · K8s · Terraform",
    " #######################",
    "─────────────────────────",
  ],
}

function LinuxTerminal() {
  const [cwd, setCwd] = useState("/home/roshan")
  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      input: "",
      output: [
        "Welcome to roshan@devbox — Type 'help' to explore.",
        "────────────────────────────────────────────────────",
      ],
    },
  ])
  const [input, setInput] = useState("")
  const [cmdHistory, setCmdHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isCleared, setIsCleared] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [history])

  const prompt = `roshan@devbox:${cwd === "/home/roshan" ? "~" : cwd}$`

  const runCommand = useCallback((raw: string) => {
    const trimmed = raw.trim()
    if (!trimmed) return

    if (trimmed === "clear") {
      setIsCleared(false)
      setHistory([])
      setCmdHistory((p) => [trimmed, ...p])
      setHistoryIndex(-1)
      return
    }

    const [cmd, ...args] = trimmed.split(" ")
    const handler = commands[cmd]
    let output: string[]

    if (handler) {
      output = handler(args, cwd, setCwd)
    } else {
      output = [`bash: ${cmd}: command not found — try 'help'`]
    }

    setHistory((h) => [...h, { input: `${prompt} ${trimmed}`, output }])
    setCmdHistory((p) => [trimmed, ...p])
    setHistoryIndex(-1)
  }, [cwd, prompt])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      runCommand(input)
      setInput("")
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      const newIndex = Math.min(historyIndex + 1, cmdHistory.length - 1)
      setHistoryIndex(newIndex)
      setInput(cmdHistory[newIndex] ?? "")
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      const newIndex = Math.max(historyIndex - 1, -1)
      setHistoryIndex(newIndex)
      setInput(newIndex === -1 ? "" : cmdHistory[newIndex] ?? "")
    } else if (e.key === "Tab") {
      e.preventDefault()
      // autocomplete from current dir
      const items = fileSystem[cwd] ?? []
      const match = items.find((i) => i.startsWith(input.split(" ").pop() ?? ""))
      if (match) setInput((prev) => prev.split(" ").slice(0, -1).concat(match).join(" "))
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="mx-8 md:mx-12 rounded-xl overflow-hidden border border-white/10"
      style={{ background: "rgba(10,10,10,0.95)", backdropFilter: "blur(12px)" }}
      onMouseDown={(e) => {
        // Only focus input if clicking directly on terminal background, not on buttons/input
        const target = e.target as HTMLElement
        if (!target.closest('button') && !target.closest('input')) {
          e.preventDefault()
          inputRef.current?.focus({ preventScroll: true })
        }
      }}
    >
      {/* Title Bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10" style={{ background: "rgba(255,255,255,0.04)" }}>
        <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        <span className="ml-4 font-mono text-[11px] text-white/30 tracking-widest">roshan@devbox — bash</span>
      </div>

      {/* Output Area */}
      <div className="p-4 h-72 overflow-y-auto font-mono text-[13px] leading-6 cursor-text scrollbar-thin">
        {history.map((entry, i) => (
          <div key={i} className="mb-1">
            {entry.input && (
              <p>
                <span className="text-[#7c3aed]">roshan@devbox</span>
                <span className="text-white/40">:</span>
                <span className="text-[#28c840]">{entry.input.split("$")[0].split(":")[1] ?? "~"}</span>
                <span className="text-white/40">$</span>
                <span className="text-white ml-1">{entry.input.split("$ ")[1]}</span>
              </p>
            )}
            {entry.output.map((line, j) => (
              <p key={j} className="text-white/70 whitespace-pre">{line}</p>
            ))}
          </div>
        ))}

        {/* Active Input Line */}
        <div className="flex items-center gap-1 mt-1">
          <span className="text-[#7c3aed]">roshan@devbox</span>
          <span className="text-white/40">:</span>
          <span className="text-[#28c840]">{cwd === "/home/roshan" ? "~" : cwd}</span>
          <span className="text-white/40">$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 ml-1 bg-transparent outline-none text-white caret-[#7c3aed] font-mono text-[13px]"
            autoComplete="off"
            spellCheck={false}
            aria-label="Terminal input"
          />
        </div>
        <div ref={bottomRef} />
      </div>

      {/* Hint Bar */}
      <div className="px-4 py-2 border-t border-white/10 flex gap-6" style={{ background: "rgba(255,255,255,0.02)" }}>
        {["help", "neofetch", "docker ps", "kubectl"].map((hint) => (
          <button
            key={hint}
            type="button"
            onMouseDown={(e) => {
              e.preventDefault() // prevents page scroll & focus steal
              e.stopPropagation()
              runCommand(hint)
              setInput("")
              inputRef.current?.focus({ preventScroll: true })
            }}
            className="font-mono text-[10px] text-white/30 hover:text-[#7c3aed] transition-colors tracking-widest"
          >
            {hint}
          </button>
        ))}
      </div>
    </motion.div>
  )
}

// ─── Main About Section ────────────────────────────────────────────────────

export function About() {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-100%"])
  const smoothX = useSpring(x, { stiffness: 100, damping: 30 })

  return (
    <section id="about" ref={containerRef} className="relative py-32 overflow-hidden md:py-0">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="px-8 md:px-12 mb-0 py-20"
      >
        <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground mb-4">03 — PHILOSOPHY</p>
        <h2 className="font-sans text-3xl md:text-5xl font-light italic">Stream of Consciousness</h2>
        <p className="font-mono text-sm text-muted-foreground mt-6 max-w-xl">
          A DevOps Engineer obsessed with building systems that scale effortlessly, pipelines that deploy flawlessly, and infrastructure that breathes on its own. I bridge the gap between development and operations — crafting cloud-native, resilient systems.
        </p>
      </motion.div>

      {/* Horizontal Scroll Text */}
      <div className="relative flex items-center overflow-hidden py-0 gap-0 h-16">
        <motion.div style={{ x: smoothX }} className="flex gap-16 md:gap-24 px-8 md:px-12 whitespace-nowrap">
          {statements.map((statement, index) => (
            <motion.p
              key={index}
              className="text-4xl md:text-6xl lg:text-7xl font-sans font-light tracking-tight text-white/90"
              style={{
                WebkitTextStroke: index % 2 === 0 ? "none" : "1px rgba(255,255,255,0.3)",
                color: index % 2 === 0 ? "inherit" : "transparent",
              }}
            >
              {statement}
            </motion.p>
          ))}
        </motion.div>
      </div>

      {/* Linux Terminal */}
      <div className="pt-20 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="px-8 md:px-12 mb-6"
        >
          <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground">
            ↳ INTERACTIVE LINUX ENV — try <span className="text-[#7c3aed]">neofetch</span>, <span className="text-[#7c3aed]">docker ps</span>, <span className="text-[#7c3aed]">ls</span>, <span className="text-[#7c3aed]">cat .bashrc</span>
          </p>
        </motion.div>
        <LinuxTerminal />
      </div>

      {/* Decorative Line */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="mt-16 mx-8 md:mx-12 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent origin-left"
      />
    </section>
  )
}
