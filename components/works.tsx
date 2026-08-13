"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

const projects = [
  {
    title: "CloudOps Pipeline",
    tags: ["AWS", "Terraform", "GitHub Actions", "Docker"],
    description: "End-to-end CI/CD pipeline for microservices on AWS ECS with zero-downtime deployments and automated rollbacks.",
    year: "2024",
    color: "#7c3aed",
  },
  {
    title: "K8s Monitoring Stack",
    tags: ["Kubernetes", "Prometheus", "Grafana", "Helm"],
    description: "Production-grade observability platform — metrics, logs, and traces unified for a distributed k8s cluster.",
    year: "2024",
    color: "#7c3aed",
  },
  {
    title: "Infra-as-Code Framework",
    tags: ["Terraform", "Ansible", "Python", "AWS"],
    description: "Modular IaC framework reducing provisioning time by 80%. Multi-region, multi-env with one-click deploys.",
    year: "2023",
    color: "#7c3aed",
  },
]

export function Works() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springX = useSpring(mouseX, { stiffness: 150, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      mouseX.set(e.clientX - rect.left)
      mouseY.set(e.clientY - rect.top)
    }
  }

  return (
    <section id="projects" className="relative py-32 px-8 md:px-12 md:py-24">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-24"
      >
        <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground mb-4">04 — SELECTED WORKS</p>
        <h2 className="font-sans text-3xl md:text-5xl font-light italic">The Build Log</h2>
      </motion.div>

      {/* Projects List */}
      <div ref={containerRef} onMouseMove={handleMouseMove} className="relative">
        {projects.map((project, index) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className="relative border-t border-white/10 py-8 md:py-12"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <a
              href="#"
              data-cursor-hover
              className="group flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Title + Description */}
              <div className="flex-1">
                <motion.h3
                  className="font-sans text-4xl md:text-6xl lg:text-7xl font-light tracking-tight group-hover:text-white/70 transition-colors duration-300"
                  animate={{
                    x: hoveredIndex === index ? 20 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {project.title}
                </motion.h3>
                <motion.p
                  className="font-mono text-xs text-muted-foreground mt-2 max-w-lg"
                  animate={{ opacity: hoveredIndex === index ? 1 : 0, y: hoveredIndex === index ? 0 : -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {project.description}
                </motion.p>
              </div>

              {/* Tags */}
              <div className="flex gap-2 flex-wrap order-2 md:order-none">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[10px] tracking-wider px-3 py-1 border border-white/20 rounded-full text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          </motion.div>
        ))}

        {/* Floating Glow */}
        <motion.div
          className="absolute pointer-events-none z-50 w-48 h-48 rounded-full blur-3xl"
          style={{
            x: springX,
            y: springY,
            translateX: "-50%",
            translateY: "-50%",
            background: "radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)",
          }}
          animate={{
            opacity: hoveredIndex !== null ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Bottom Border */}
      <div className="border-t border-white/10 mt-8" />
    </section>
  )
}
