import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { CTAButton } from "./Buttons";

const ease = [0.22, 1, 0.36, 1];

export function SEO({ title, description }) {
  useEffect(() => {
    document.title = title;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = description;
  }, [title, description]);
  return null;
}

export function FadeUp({ children, delay = 0, className = "", testId }) {
  return (
    <motion.div
      data-testid={testId}
      className={className}
      initial={{ opacity: 0, y: 44 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

export function LineReveal({ lines, className = "", lineClassName = "", delay = 0 }) {
  return (
    <div className={className}>
      {lines.map((line, index) => (
        <span key={`${line}-${index}`} className="block overflow-hidden pb-1">
          <motion.span
            className={`block ${lineClassName}`}
            initial={{ y: "115%", rotate: 2 }}
            animate={{ y: 0, rotate: 0 }}
            transition={{ duration: 0.9, delay: delay + index * 0.12, ease }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </div>
  );
}

export function SectionHeading({ eyebrow, lines, copy, light = false, className = "" }) {
  return (
    <FadeUp className={className} testId={`${eyebrow?.toLowerCase().replace(/\s+/g, "-") || "section"}-heading`}>
      {eyebrow && <p className="mb-5 font-mono text-xs font-bold uppercase tracking-[0.3em] text-[#CCFF00]">{eyebrow}</p>}
      <h2 className={`max-w-5xl text-3xl font-extrabold uppercase leading-[0.94] tracking-[-0.05em] sm:text-5xl lg:text-6xl ${light ? "text-neutral-950" : "text-neutral-50"}`}>
        {lines.map((line) => <span className="block" key={line}>{line}</span>)}
      </h2>
      {copy && <p className={`mt-6 max-w-2xl text-base leading-relaxed sm:text-lg ${light ? "text-neutral-700" : "text-neutral-400"}`}>{copy}</p>}
    </FadeUp>
  );
}

export function PageHero({ eyebrow, lines, copy, children }) {
  return (
    <section className="relative overflow-hidden border-b border-neutral-800 bg-[#0A0A0A] px-4 pb-20 pt-36 sm:px-6 lg:px-12 lg:pb-28 lg:pt-44">
      <div className="pointer-events-none absolute right-[-12vw] top-20 h-72 w-72 rounded-full bg-[#CCFF00] opacity-10 blur-3xl" />
      <div className="mx-auto max-w-7xl">
        <motion.p
          className="mb-6 font-mono text-xs font-bold uppercase tracking-[0.32em] text-[#CCFF00]"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
        >
          {eyebrow}
        </motion.p>
        <LineReveal lines={lines} className="max-w-6xl text-4xl font-extrabold uppercase leading-[0.9] tracking-[-0.06em] text-neutral-50 sm:text-6xl lg:text-8xl" />
        {copy && (
          <motion.p
            className="mt-8 max-w-2xl text-lg leading-relaxed text-neutral-400 sm:text-xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease }}
          >
            {copy}
          </motion.p>
        )}
        {children}
      </div>
    </section>
  );
}

export function ImageReveal({ src, alt, className = "", imageClassName = "" }) {
  return (
    <motion.figure
      className={`image-spotlight overflow-hidden bg-neutral-900 ${className}`}
      initial={{ clipPath: "inset(12% 12% 12% 12%)", opacity: 0 }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
      viewport={{ once: true, margin: "-90px" }}
      transition={{ duration: 1, ease }}
    >
      <img src={src} alt={alt} loading="lazy" className={`h-full w-full object-cover transition-transform duration-700 hover:scale-105 ${imageClassName}`} />
    </motion.figure>
  );
}

export function Counter({ value }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const numeric = value.match(/^\d+/);
  const [display, setDisplay] = useState(numeric ? "0" : value);

  useEffect(() => {
    if (!inView || !numeric) return;
    const target = Number(numeric[0]);
    const suffix = value.replace(numeric[0], "");
    const start = performance.now();
    const duration = 1300;
    let frame;
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(`${Math.round(target * eased)}${suffix}`);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, numeric, value]);

  return <span ref={ref}>{display}</span>;
}

export function CTASection({ eyebrow = "NEXT MOVE", lines, copy, button, to = "/contact", light = false }) {
  return (
    <section className={`relative overflow-hidden px-4 py-24 sm:px-6 lg:px-12 lg:py-36 ${light ? "bg-[#CCFF00] text-neutral-950" : "border-t border-neutral-800 bg-[#0A0A0A] text-neutral-50"}`}>
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.35fr] lg:items-end">
        <FadeUp>
          <p className={`mb-5 font-mono text-xs font-bold uppercase tracking-[0.3em] ${light ? "text-neutral-800" : "text-[#CCFF00]"}`}>{eyebrow}</p>
          <h2 className="max-w-5xl text-4xl font-extrabold uppercase leading-[0.9] tracking-[-0.06em] sm:text-6xl lg:text-8xl">
            {lines.map((line) => <span className="block" key={line}>{line}</span>)}
          </h2>
          {copy && <p className={`mt-8 max-w-2xl text-lg leading-relaxed ${light ? "text-neutral-800" : "text-neutral-400"}`}>{copy}</p>}
        </FadeUp>
        <FadeUp delay={0.15} className="lg:justify-self-end">
          <CTAButton to={to} testId={`${button.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-cta`} variant={light ? "outline" : "lime"}>{button}</CTAButton>
        </FadeUp>
      </div>
    </section>
  );
}
