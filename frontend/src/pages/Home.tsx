import {
  ShieldCheck,
  Zap,
  Bot,
  Code2,
  GitMerge,
  Check,
  ArrowRight,
  Sparkles,
  Clock,
  Link2,
  Database,
  ScanLine,
  GitCommit,
  Twitter,
  Github,
  Linkedin,
  Mail,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useState } from "react";

function Header() {
  const { user } = useAuthStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden">
            <img src="/favicon.png" alt="CodeOwl" className="w-full h-full object-cover" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight">
            Code<span className="text-primary">Owl</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#features" className="transition hover:text-foreground">Features</a>
          <a href="#how" className="transition hover:text-foreground">How it works</a>
          <a href="#pricing" className="transition hover:text-foreground">Pricing</a>
          <a href="#faq" className="transition hover:text-foreground">FAQ</a>
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-elegant transition hover:opacity-90"
            >
              Dashboard <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <Link
              to="/login"
              className="hidden text-sm font-medium text-muted-foreground transition hover:text-foreground sm:block"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero">
      <div className="absolute inset-0 grid-pattern opacity-40" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-primary/10 blur-[100px]" />
      <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-accent/8 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 md:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Now reviewing 1M+ pull requests
          </div>

          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
            Ship code your team
            <br />
            <span className="text-gradient">actually trusts.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            CodeOwl indexes your repo, understands your conventions, and
            reviews every pull request — automatically, in under 60 seconds.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/login"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-elegant transition hover:shadow-glow"
            >
              Start free trial <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#how"
              className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-card/60 px-6 py-3 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:bg-card hover:shadow-elegant"
            >
              See how it works
            </a>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Free for open source · No credit card required
          </p>
        </div>

        <ProcessCard />
      </div>
    </section>
  );
}

function ProcessCard() {
  const steps = [
    {
      icon: <Link2 className="h-5 w-5" />,
      title: "Connect repository",
      desc: "Securely link your GitHub repo via OAuth. No installs required.",
      log: "✓ Authorized github.com/acme/api",
    },
    {
      icon: <Database className="h-5 w-5" />,
      title: "Index & embed codebase",
      desc: "Files are chunked, embedded and stored in a vector database for deep context.",
      log: "✓ 4,812 chunks indexed → pgvector",
    },
    {
      icon: <ScanLine className="h-5 w-5" />,
      title: "Analyze PR diff",
      desc: "On every PR, the diff is compared against your repo context and conventions.",
      log: "✓ PR #482 analyzed in 38s",
    },
    {
      icon: <GitCommit className="h-5 w-5" />,
      title: "Commit & push review",
      desc: "Inline review comments are committed and pushed back to GitHub automatically.",
      log: "✓ 3 issues · 2 suggestions posted",
    },
  ];

  return (
    <div className="relative mx-auto mt-16 max-w-5xl">
      <div className="absolute -inset-2 rounded-3xl bg-gradient-primary opacity-20 blur-2xl" />
      <div className="relative rounded-2xl border border-border/60 bg-card/90 shadow-card backdrop-blur-sm">
        <div className="flex items-center justify-between border-b border-border/60 px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-destructive/80" />
            <span className="h-3 w-3 rounded-full bg-muted-foreground/40" />
            <span className="h-3 w-3 rounded-full bg-muted-foreground/40" />
          </div>
          <div className="flex items-center gap-1.5 rounded-md bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Live
          </div>
        </div>

        <div className="grid gap-0 p-6 md:grid-cols-4 md:gap-4">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className="group relative animate-fade-in opacity-0"
              style={{
                animationDelay: `${i * 200}ms`,
                animationFillMode: "forwards",
              }}
            >
              <div className="relative rounded-xl border border-border/50 bg-background/60 p-4 transition duration-300 hover:border-primary/40 hover:bg-background hover:shadow-elegant">
                <div className="flex items-center gap-2">
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary transition group-hover:bg-primary/25">
                    {s.icon}
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Step 0{i + 1}
                  </div>
                </div>
                <h4 className="mt-3 text-sm font-semibold">{s.title}</h4>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {s.desc}
                </p>
                <div className="mt-3 rounded-md border border-border/60 bg-card px-2 py-1.5 font-mono text-[10px] text-primary/90">
                  {s.log}
                </div>
              </div>

              {i < steps.length - 1 && (
                <div className="pointer-events-none absolute right-[-12px] top-1/2 hidden -translate-y-1/2 md:block">
                  <div className="relative h-px w-6 bg-gradient-to-r from-primary/60 to-transparent">
                    <div
                      className="absolute -top-[3px] h-1.5 w-1.5 rounded-full bg-primary shadow-glow"
                      style={{
                        animation: "flow 2.4s ease-in-out infinite",
                        animationDelay: `${i * 0.6}s`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-border/60 px-5 py-3 text-xs text-muted-foreground">
          <span className="font-mono">main ← codeowl/pr-482-review</span>
          <span className="flex items-center gap-1.5 text-primary">
            <Check className="h-3.5 w-3.5" /> Pushed to GitHub
          </span>
        </div>
      </div>

      <style>{`
        @keyframes flow {
          0% { transform: translateX(-4px); opacity: 0; }
          40% { opacity: 1; }
          100% { transform: translateX(24px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function Features() {
  const items = [
    { icon: <Bot className="h-5 w-5" />, title: "Context-aware reviews", body: "Trained on your repo's conventions, style guides and prior PRs — not generic boilerplate." },
    { icon: <ShieldCheck className="h-5 w-5" />, title: "Security & secrets scan", body: "Flags injection, leaked keys, unsafe deps and OWASP issues before merge." },
    { icon: <Zap className="h-5 w-5" />, title: "Under 60 seconds", body: "Streaming reviews kick off the moment a PR opens. Your team never waits." },
    { icon: <Code2 className="h-5 w-5" />, title: "Every major language", body: "TypeScript, Python, Go, Rust, Java, Ruby, PHP, Swift, Kotlin and more." },
    { icon: <GitMerge className="h-5 w-5" />, title: "Inline GitHub comments", body: "Suggestions appear right on the diff. Accept with a single click." },
    { icon: <Clock className="h-5 w-5" />, title: "Learns from feedback", body: "Resolve or react and the model adapts to your team's taste over time." },
  ];
  return (
    <section id="features" className="relative border-t border-border/60 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Features</p>
          <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
            A senior engineer on <span className="text-gradient">every PR</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            CodeOwl reads your code the way your best reviewer would — and never sleeps.
          </p>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((f) => (
            <div
              key={f.title}
              className="group relative rounded-xl border border-border/50 bg-card/60 p-6 transition duration-300 hover:border-primary/50 hover:bg-card hover:shadow-elegant"
            >
              <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition group-hover:opacity-100" />
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary transition group-hover:bg-primary/25 group-hover:text-primary">
                {f.icon}
              </div>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", icon: <Link2 className="h-5 w-5" />, t: "Connect your repository", d: "Authorize CodeOwl with GitHub OAuth and pick the repos to review." },
    { n: "02", icon: <Database className="h-5 w-5" />, t: "We index your codebase", d: "Files are chunked, embedded and stored in a vector DB for deep semantic context." },
    { n: "03", icon: <ScanLine className="h-5 w-5" />, t: "Every PR is analyzed", d: "The diff is compared against your repo context, conventions and prior decisions." },
    { n: "04", icon: <GitCommit className="h-5 w-5" />, t: "Review pushed back", d: "Inline comments and suggestions are committed and pushed straight to your PR." },
  ];
  return (
    <section id="how" className="relative border-t border-border/60 bg-card/30 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">How it works</p>
          <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
            From connect to commit — fully automated
          </h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="group relative rounded-xl border border-border/50 bg-background p-6 transition duration-300 hover:border-primary/40 hover:shadow-elegant">
              <div className="flex items-center justify-between">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary transition group-hover:bg-primary/25">
                  {s.icon}
                </div>
                <div className="font-display text-4xl font-bold text-primary/25">{s.n}</div>
              </div>
              <h3 className="mt-4 text-lg font-semibold">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const plans = [
    { name: "Hobby", price: "$0", desc: "For open source and personal projects.", features: ["Unlimited public repos", "Basic AI reviews", "Community support"], cta: "Start free", featured: false },
    { name: "Team", price: "$29", per: "/dev / month", desc: "For startups shipping fast.", features: ["Unlimited private repos", "Advanced security scans", "Custom style guides", "Priority support"], cta: "Start 14-day trial", featured: true },
    { name: "Enterprise", price: "Custom", desc: "SSO, audit logs and self-hosted.", features: ["SAML SSO", "Self-hosted deploy", "Dedicated CSM", "SOC 2 reports"], cta: "Talk to sales", featured: false },
  ];
  return (
    <section id="pricing" className="relative border-t border-border/60 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Pricing</p>
          <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
            Simple, per-developer pricing
          </h2>
          <p className="mt-4 text-muted-foreground">
            No seat games. No surprise overages. Cancel anytime.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative rounded-2xl border p-8 transition duration-300 hover:-translate-y-1 ${
                p.featured
                  ? "border-primary/60 bg-card shadow-elegant hover:shadow-glow"
                  : "border-border/60 bg-card/60 hover:border-primary/30 hover:bg-card hover:shadow-elegant"
              }`}
            >
              {p.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-glow">
                  Most popular
                </div>
              )}
              <h3 className="font-display text-xl font-bold">{p.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-display text-5xl font-bold">{p.price}</span>
                {p.per && <span className="text-sm text-muted-foreground">{p.per}</span>}
              </div>
              <Link
                to="/login"
                className={`mt-6 inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  p.featured
                    ? "bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95"
                    : "border border-border/80 bg-background hover:border-primary/40 hover:bg-card"
                }`}
              >
                {p.cta}
              </Link>
              <ul className="mt-6 space-y-3 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How does CodeOwl understand my codebase?",
      answer: "CodeOwl indexes your repository by chunking files, creating embeddings, and storing them in a vector database. This allows it to understand your code's context, conventions, and patterns, providing reviews that are specific to your project rather than generic suggestions."
    },
    {
      question: "What programming languages are supported?",
      answer: "CodeOwl supports all major programming languages including TypeScript, Python, Go, Rust, Java, Ruby, PHP, Swift, Kotlin, JavaScript, C++, and more. Our AI is trained on diverse codebases to provide accurate reviews across different languages and frameworks."
    },
    {
      question: "Is my code secure and private?",
      answer: "Absolutely. We use enterprise-grade encryption for data in transit and at rest. Your code is never used to train our models, and we comply with SOC 2, GDPR, and other major security standards. You can also choose self-hosted deployment for complete control."
    },
    {
      question: "How long does a code review take?",
      answer: "Most reviews are completed in under 60 seconds. The moment a pull request is opened, CodeOwl begins analyzing the diff against your indexed codebase. Complex changes in large repositories may take slightly longer, but you'll never wait hours for feedback."
    },
    {
      question: "Can I customize the review criteria?",
      answer: "Yes! Team and Enterprise plans include custom style guides and rule configuration. You can define coding standards, security policies, and architectural patterns that CodeOwl should enforce. The AI learns from your team's feedback over time to align with your preferences."
    },
    {
      question: "What happens if I disagree with a review?",
      answer: "CodeOwl provides explanations for each suggestion, so you can understand the reasoning. You can dismiss suggestions with feedback, which helps the AI learn your team's preferences. Over time, the reviews become more aligned with your coding style and decisions."
    }
  ];

  return (
    <section id="faq" className="relative border-t border-border/60 py-24">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">FAQ</p>
          <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
            Frequently asked <span className="text-gradient">questions</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Everything you need to know about CodeOwl
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-xl border border-border/50 bg-card/60 overflow-hidden transition duration-300 hover:border-primary/40 hover:bg-card hover:shadow-elegant"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
              >
                <h3 className="font-semibold text-lg">{faq.question}</h3>
                <ChevronDown
                  className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-5 pt-0">
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="relative border-t border-border/60 py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-card p-12 text-center shadow-elegant">
          <div className="absolute inset-0 bg-hero opacity-70" />
          <div className="absolute inset-0 grid-pattern opacity-30" />
          <div className="absolute left-1/3 top-0 h-48 w-48 rounded-full bg-primary/20 blur-[80px]" />
          <div className="absolute right-1/4 bottom-0 h-64 w-64 rounded-full bg-accent/15 blur-[100px]" />
          <div className="relative">
            <h2 className="font-display text-4xl font-bold md:text-5xl">
              Stop reviewing boilerplate.<br />
              <span className="text-gradient">Start shipping signal.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Connect a repo and let CodeOwl handle the rest — indexing, analysis and review.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/login"
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition hover:opacity-95"
              >
                Start free trial <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
              <a
                href="#pricing"
                className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-background/70 px-6 py-3 text-sm font-semibold transition hover:border-primary/40 hover:bg-card"
              >
                See pricing <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const cols: { title: string; links: string[] }[] = [
    { title: "Product", links: ["Features", "How it works", "Pricing", "Changelog", "Roadmap"] },
    { title: "Company", links: ["About", "Careers", "Blog", "Press", "Contact"] },
    { title: "Resources", links: ["Docs", "API reference", "Status", "Security", "Community"] },
    { title: "Legal", links: ["Privacy", "Terms", "DPA", "Cookies", "Subprocessors"] },
  ];
  return (
    <footer className="relative border-t border-border/60 bg-card/30">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden">
                <img src="/favicon.png" alt="CodeOwl" className="w-full h-full object-cover" />
              </div>
              <span className="font-display text-lg font-bold tracking-tight">
                Code<span className="text-primary">Owl</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              AI code reviews that understand your codebase. Connect a repo, get
              senior-level feedback on every PR.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[Twitter, Github, Linkedin, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-background text-muted-foreground transition hover:border-primary/50 hover:text-primary hover:shadow-elegant"
                  aria-label="social"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="font-display text-sm font-semibold">{c.title}</h4>
              <ul className="mt-4 space-y-3 text-sm">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-muted-foreground transition hover:text-foreground">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 text-xs text-muted-foreground md:flex-row">
          <span>© {new Date().getFullYear()} CodeOwl Inc. All rights reserved.</span>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
