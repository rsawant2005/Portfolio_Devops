"use client"

const techItems = [
  "DOCKER",
  "KUBERNETES",
  "AWS",
  "FIREBASE",
  "TERRAFORM",
  "CI/CD",
  "GITHUB ACTIONS",
  "PYTHON",
  "NODE.JS",
  "REACT",
  "NEXT.JS",
  "TYPESCRIPT",
]

const concepts = [
  "INFRASTRUCTURE",
  "AUTOMATION",
  "SCALABILITY",
  "RELIABILITY",
  "MONITORING",
  "DEVOPS",
  "PIPELINES",
  "POSTGRESQL",
  "MONGODB",
  "LINUX",
  "NGINX",
  "ANSIBLE",
]

function MarqueeRow({ items, direction = "left" }: { items: string[]; direction?: "left" | "right" }) {
  const duplicatedItems = [...items, ...items, ...items, ...items]

  return (
    <div className="relative overflow-hidden py-4">
      <div
        className={`flex gap-8 ${direction === "left" ? "animate-marquee-left" : "animate-marquee-right"}`}
        style={{ width: "fit-content" }}
      >
        {duplicatedItems.map((item, index) => (
          <span
            key={index}
            className="group font-sans text-5xl md:text-7xl lg:text-8xl font-light tracking-tight whitespace-nowrap cursor-default"
            style={{
              WebkitTextStroke: "1px rgba(255,255,255,0.3)",
              color: "transparent",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "white"
              e.currentTarget.style.WebkitTextStroke = "none"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "transparent"
              e.currentTarget.style.WebkitTextStroke = "1px rgba(255,255,255,0.3)"
            }}
          >
            {item}
            <span className="mx-8 text-white/20">•</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export function TechMarquee() {
  return (
    <section id="skills" className="relative py-24 overflow-hidden md:py-32">
      {/* Section Header */}
      <div className="px-8 md:px-12 mb-16">
        <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground mb-4">05 — TECHNICAL ARSENAL</p>
        <h2 className="font-sans text-3xl md:text-5xl font-light italic">Tools & Weapons</h2>
      </div>

      {/* Marquee Rows */}
      <div className="space-y-4">
        <MarqueeRow items={techItems} direction="left" />
        <MarqueeRow items={concepts} direction="right" />
      </div>
    </section>
  )
}
