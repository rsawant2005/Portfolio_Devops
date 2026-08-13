"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowUpRight, Send, Github, Linkedin, Mail } from "lucide-react"

const CONTACT_EMAIL = "sawantroshan642@gmail.com"

export function Footer() {
  const [time, setTime] = useState("")
  const [formState, setFormState] = useState({ name: "", email: "", message: "" })
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hours = now.getHours().toString().padStart(2, "0")
      const minutes = now.getMinutes().toString().padStart(2, "0")
      const seconds = now.getSeconds().toString().padStart(2, "0")
      const milliseconds = now.getMilliseconds().toString().padStart(3, "0")
      setTime(`${hours}:${minutes}:${seconds}.${milliseconds}`)
    }
    updateTime()
    const interval = setInterval(updateTime, 10)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setError("")

    try {
      // Try Web3Forms (free, no signup for basic use)
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: "a2fc9225-9faf-47ad-a46c-ac0ca4a0b415",
          name: formState.name,
          email: formState.email,
          message: formState.message,
          subject: `Portfolio Contact from ${formState.name}`,
        }),
      })

      if (response.ok) {
        setSubmitted(true)
      } else {
        throw new Error("Service unavailable")
      }
    } catch {
      // Reliable fallback: open mail client with pre-filled data
      const subject = encodeURIComponent(`Portfolio Contact from ${formState.name}`)
      const body = encodeURIComponent(
        `Hi Roshan,\n\nName: ${formState.name}\nEmail: ${formState.email}\n\nMessage:\n${formState.message}`
      )
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
      setSubmitted(true)
    } finally {
      setSending(false)
    }
  }

  const socialLinks = [
    { label: "GitHub",   href: "https://github.com/rsawant2005",                              icon: Github  },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/roshan-sawant-049939340/",        icon: Linkedin },
    { label: "Email",    href: `mailto:${CONTACT_EMAIL}`,                                     icon: Mail    },
  ]

  return (
    <footer id="contact" className="relative">
      {/* Contact Section */}
      <section className="relative py-32 px-8 md:px-12 border-t border-white/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground mb-4">06 — CONTACT</p>
          <h2 className="font-sans text-3xl md:text-5xl font-light italic">
            Let's <span className="not-italic">Build</span> Together
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 md:gap-24">
          {/* Left — Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="flex flex-col gap-8"
          >
            <p className="font-mono text-sm text-muted-foreground leading-relaxed">
              I'm currently open to new opportunities — whether it's a DevOps role, a freelance infrastructure project, or a conversation about cloud systems. Let's connect.
            </p>

            {/* Social Links */}
            <div className="flex flex-col gap-4">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor-hover
                  className="group flex items-center gap-4 font-mono text-xs tracking-widest text-muted-foreground hover:text-white transition-colors duration-300"
                  whileHover={{ x: 8 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <Icon className="w-4 h-4" />
                  {label.toUpperCase()}
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.a>
              ))}
            </div>

            {/* Status */}
            <div className="flex items-center gap-3 mt-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7c3aed] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7c3aed]" />
              </span>
              <span className="font-mono text-xs tracking-wider text-muted-foreground">AVAILABLE FOR WORK</span>
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center h-full gap-4 text-center py-16"
              >
                <div className="w-16 h-16 rounded-full border border-[#7c3aed] flex items-center justify-center">
                  <Send className="w-6 h-6 text-[#7c3aed]" />
                </div>
                <p className="font-sans text-2xl font-light">Message Transmitted</p>
                <p className="font-mono text-xs text-muted-foreground tracking-widest">I'll respond within 24 hours.</p>
                <button
                  onClick={() => { setSubmitted(false); setFormState({ name: "", email: "", message: "" }) }}
                  className="mt-4 font-mono text-[10px] tracking-widest text-muted-foreground hover:text-white transition-colors underline underline-offset-4"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {[
                  { id: "name",    label: "NAME",    type: "text",  placeholder: "Your Name"        },
                  { id: "email",   label: "EMAIL",   type: "email", placeholder: "your@email.com"   },
                ].map((field) => (
                  <div key={field.id} className="flex flex-col gap-2">
                    <label htmlFor={field.id} className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">
                      {field.label}
                    </label>
                    <input
                      id={field.id}
                      type={field.type}
                      placeholder={field.placeholder}
                      required
                      value={formState[field.id as keyof typeof formState]}
                      onChange={(e) => setFormState({ ...formState, [field.id]: e.target.value })}
                      className="bg-transparent border-b border-white/20 pb-3 font-mono text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#7c3aed] transition-colors duration-300"
                    />
                  </div>
                ))}

                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">
                    MESSAGE
                  </label>
                  <textarea
                    id="message"
                    placeholder="Tell me about your project..."
                    rows={4}
                    required
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className="bg-transparent border-b border-white/20 pb-3 font-mono text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#7c3aed] transition-colors duration-300 resize-none"
                  />
                </div>

                {error && (
                  <p className="font-mono text-[10px] text-red-400 tracking-widest">{error}</p>
                )}

                <motion.button
                  data-cursor-hover
                  type="submit"
                  disabled={sending}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative mt-4 px-8 py-4 border border-white/20 rounded-full font-mono text-sm tracking-widest uppercase bg-transparent hover:bg-[#7c3aed] hover:border-[#7c3aed] transition-all duration-500 flex items-center justify-center gap-3 group disabled:opacity-50"
                >
                  {sending ? (
                    <>
                      <span className="w-4 h-4 border border-white/40 border-t-white rounded-full animate-spin" />
                      Transmitting...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                    </>
                  )}
                </motion.button>

                <p className="font-mono text-[10px] text-muted-foreground tracking-widest text-center">
                  Or email directly:{" "}
                  <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#7c3aed] hover:underline">
                    {CONTACT_EMAIL}
                  </a>
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer Bar */}
      <div className="px-8 md:px-12 py-8 border-t border-white/10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Local Time */}
          <div className="font-mono text-xs tracking-widest text-muted-foreground">
            <span className="mr-2">LOCAL TIME</span>
            <span className="text-white tabular-nums">{time}</span>
          </div>

          {/* Links */}
          <div className="flex gap-8">
            <a
              href="https://github.com/rsawant2005"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-hover
              className="font-mono text-xs tracking-widest text-muted-foreground hover:text-white transition-colors duration-300"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/roshan-sawant-049939340/"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-hover
              className="font-mono text-xs tracking-widest text-muted-foreground hover:text-white transition-colors duration-300"
            >
              LinkedIn
            </a>
          </div>

          {/* Copyright */}
          <p className="font-mono text-xs tracking-widest text-muted-foreground">
            © {new Date().getFullYear()} ROSHAN SAWANT
          </p>
        </div>
      </div>
    </footer>
  )
}
