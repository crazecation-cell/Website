import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { approach, images, marqueeSlots, services, stats } from "../data/content";
import { ArrowLink, CTAButton, ScrollCue } from "../components/site/Buttons";
import { Counter, CTASection, FadeUp, ImageReveal, LineReveal, SectionHeading, SEO } from "../components/site/Animated";

function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yOne = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const yTwo = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 8]);

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden bg-[#0A0A0A] px-4 pt-32 sm:px-6 lg:px-12 lg:pt-36" data-testid="home-hero-section">
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute left-1/2 top-28 h-[36rem] w-[36rem] -translate-x-1/4 rounded-full bg-[#CCFF00] opacity-[0.08] blur-3xl" />
      <div className="relative mx-auto grid min-h-[calc(100vh-9rem)] max-w-7xl items-center gap-12 pb-14 lg:grid-cols-[1.02fr_0.98fr]">
        <div>
          <motion.p
            className="mb-6 font-mono text-xs font-bold uppercase tracking-[0.32em] text-[#CCFF00]"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            data-testid="hero-eyebrow"
          >
            GROWTH PARTNER FOR AMBITIOUS BRANDS
          </motion.p>
          <LineReveal
            lines={["WE MAKE", "BRANDS", "GROW."]}
            className="text-[clamp(4rem,11vw,10.5rem)] font-extrabold uppercase leading-[0.78] tracking-[-0.08em] text-neutral-50"
          />
          <motion.div
            className="mt-8 max-w-2xl"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <p className="text-xl font-semibold uppercase leading-snug text-neutral-50 sm:text-2xl" data-testid="hero-subheading">
              Not just louder.<br />Not just prettier.<br /><span className="text-[#CCFF00]">Bigger. Better. Smarter.</span>
            </p>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-neutral-400 sm:text-lg">
              Crazecation is a growth partner for ambitious brands — combining strategy, creativity and performance to turn attention into business.
            </p>
            <div className="mt-9 flex flex-col gap-5 sm:flex-row sm:items-center">
              <CTAButton to="/contact" testId="hero-lets-talk-button">LET'S TALK</CTAButton>
              <ScrollCue testId="hero-see-services-link" />
            </div>
          </motion.div>
        </div>

        <motion.div
          className="relative hidden min-h-[620px] lg:block"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25, duration: 1 }}
          data-testid="hero-kinetic-collage"
        >
          <motion.div style={{ y: yOne, rotate }} className="clip-notch absolute left-4 top-0 z-20 h-[390px] w-[58%] overflow-hidden bg-neutral-900 shadow-2xl shadow-black">
            <img src={images.fashion} alt="High fashion brand campaign" className="h-full w-full object-cover" />
          </motion.div>
          <motion.div style={{ y: yTwo }} className="absolute right-0 top-32 z-10 h-[430px] w-[48%] overflow-hidden rounded-t-full border border-neutral-800 bg-neutral-900">
            <img src={images.studio} alt="Creative studio campaign direction" className="h-full w-full object-cover grayscale transition-[filter] duration-500 hover:grayscale-0" />
          </motion.div>
          <motion.div style={{ y: yOne }} className="absolute bottom-0 left-24 z-30 h-56 w-64 -rotate-6 overflow-hidden border-8 border-[#0A0A0A] bg-[#CCFF00] p-2">
            <img src={images.product} alt="Minimal brand product photography" className="h-full w-full object-cover mix-blend-multiply" />
          </motion.div>
          <div className="absolute bottom-28 right-8 z-40 flex h-36 w-36 animate-[spin_18s_linear_infinite] items-center justify-center rounded-full border border-[#CCFF00] bg-neutral-950/80 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-[#CCFF00] backdrop-blur">
            STRATEGY<br />CREATIVE<br />GROWTH
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Intro() {
  return (
    <section className="bg-[#F4F4F5] px-4 py-24 text-neutral-950 sm:px-6 lg:px-12 lg:py-36" data-testid="home-intro-section">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.28fr_1fr]">
        <FadeUp className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-neutral-500">01 / POTENTIAL</FadeUp>
        <div>
          <SectionHeading light lines={["YOUR BRAND HAS POTENTIAL.", "LET'S UNLOCK IT."]} />
          <FadeUp delay={0.15} className="mt-10 grid max-w-4xl gap-4 text-xl leading-relaxed text-neutral-700 sm:text-2xl">
            <p>Great products don't always become great brands.</p>
            <p>Sometimes you need better positioning.</p>
            <p>Sometimes you need better content.</p>
            <p>Sometimes you need more people to discover you.</p>
            <p>And sometimes, you just need someone who sees the opportunity you don't.</p>
            <p className="pt-4 text-3xl font-extrabold uppercase tracking-[-0.04em] text-neutral-950">That's where we come in.</p>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

function ServicesIntro() {
  return (
    <section id="services-intro" className="border-y border-neutral-800 bg-[#0A0A0A] px-4 py-24 sm:px-6 lg:px-12 lg:py-32" data-testid="home-services-section">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="WHAT WE DO"
          lines={["EVERYTHING YOUR BRAND NEEDS", "TO MOVE FORWARD."]}
          copy="From strategy and branding to websites, content and performance — we bring together the right tools to help brands build, grow and scale."
        />
        <div className="mt-16 grid grid-cols-1 gap-px border border-neutral-800 bg-neutral-800 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <FadeUp key={service.name} delay={index * 0.04} className="h-full">
              <Link
                data-testid={`home-service-${service.number}-link`}
                to="/services"
                className={`group flex h-full min-h-64 flex-col justify-between p-6 transition-colors duration-300 ${service.premium ? "bg-[#CCFF00] text-neutral-950" : "bg-[#0A0A0A] text-neutral-50 hover:bg-[#121212]"}`}
              >
                <div>
                  <div className="mb-10 flex items-center justify-between font-mono text-xs tracking-[0.24em]">
                    <span>{service.number}</span>
                    {service.tag && <span className="bg-[#CCFF00] px-2 py-1 text-neutral-950">{service.tag}</span>}
                  </div>
                  <h3 className="text-2xl font-extrabold uppercase tracking-[-0.04em]">{service.name}</h3>
                  <p className={`mt-4 text-sm leading-relaxed ${service.premium ? "text-neutral-800" : "text-neutral-400"}`}>{service.short}</p>
                </div>
                <ArrowUpRight className={`mt-10 h-6 w-6 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 ${service.premium ? "text-neutral-950" : "text-[#CCFF00] opacity-0 group-hover:opacity-100"}`} />
              </Link>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function Why() {
  return (
    <section className="bg-[#0A0A0A] px-4 py-24 sm:px-6 lg:px-12 lg:py-36" data-testid="home-why-section">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.8fr] lg:items-end">
        <div>
          <FadeUp className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-[#CCFF00]">02 / MINDSET</FadeUp>
          <SectionHeading className="mt-5" lines={["WE DON'T THINK LIKE AN AGENCY.", "WE THINK LIKE YOUR GROWTH PARTNER."]} />
        </div>
        <FadeUp delay={0.15} className="border-l-2 border-[#CCFF00] pl-6 text-lg leading-relaxed text-neutral-300">
          <p>That means we don't just ask:</p>
          <p className="mt-4 text-2xl font-extrabold uppercase tracking-[-0.03em] text-neutral-50">"What should we post?"</p>
          <p className="mt-8">We ask:</p>
          <p className="mt-4 text-2xl font-extrabold uppercase tracking-[-0.03em] text-[#CCFF00]">"What are we trying to achieve?"</p>
          <div className="mt-8 grid gap-2 text-neutral-400">
            <span>More awareness?</span><span>More leads?</span><span>More sales?</span><span>More customers?</span><span>A stronger brand?</span>
          </div>
          <p className="mt-8 font-semibold text-neutral-50">Then we build backwards from there.</p>
        </FadeUp>
      </div>
    </section>
  );
}

function Approach() {
  return (
    <section className="bg-[#F4F4F5] px-4 py-24 text-neutral-950 sm:px-6 lg:px-12 lg:py-32" data-testid="home-approach-section">
      <div className="mx-auto max-w-7xl">
        <SectionHeading light eyebrow="THE MOVE" lines={["THINK.", "CREATE.", "EXECUTE.", "GROW."]} />
        <div className="mt-16 grid gap-px border border-neutral-300 bg-neutral-300 md:grid-cols-2 lg:grid-cols-4">
          {approach.map((step, index) => (
            <FadeUp key={step.title} delay={index * 0.08} className="group min-h-80 bg-[#F4F4F5] p-6 transition-colors duration-300 hover:bg-neutral-950 hover:text-neutral-50">
              <span className="font-mono text-xs tracking-[0.24em] text-neutral-500 group-hover:text-[#CCFF00]">{step.number}</span>
              <h3 className="mt-20 text-4xl font-extrabold uppercase tracking-[-0.06em]">{step.title}</h3>
              <p className="mt-5 text-sm leading-relaxed text-neutral-600 group-hover:text-neutral-400">{step.text}</p>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClientsMarquee() {
  return (
    <section className="overflow-hidden border-y border-neutral-800 bg-[#0A0A0A] py-24" data-testid="home-clients-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <SectionHeading
          eyebrow="CLIENTS"
          lines={["BRANDS THAT TRUST US."]}
          copy="Different industries. Different challenges. Different ambitions. One goal: Growth."
        />
      </div>
      <div className="marquee mt-16 border-y border-neutral-800 py-8" aria-label="Editable client placeholder marquee">
        <div className="marquee-track">
          {[...marqueeSlots, ...marqueeSlots].map((slot, index) => (
            <span key={`${slot}-${index}`} className="mx-8 inline-flex items-center gap-8 text-5xl font-extrabold uppercase tracking-[-0.06em] text-neutral-800 sm:text-7xl">
              {slot}<span className="h-3 w-3 rounded-full bg-[#CCFF00]" />
            </span>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-12">
        <ArrowLink to="/clients" testId="home-view-clients-link">VIEW ALL CLIENTS</ArrowLink>
      </div>
    </section>
  );
}

function Numbers() {
  return (
    <section className="bg-[#CCFF00] px-4 py-24 text-neutral-950 sm:px-6 lg:px-12 lg:py-32" data-testid="home-numbers-section">
      <div className="mx-auto max-w-7xl">
        <SectionHeading light lines={["A FEW NUMBERS.", "A LOT OF STORIES."]} />
        <div className="mt-16 grid gap-px border border-neutral-950 bg-neutral-950 md:grid-cols-3">
          {stats.map((stat, index) => (
            <FadeUp key={stat.label} delay={index * 0.08} className="bg-[#CCFF00] p-8 lg:p-10" testId={`stat-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}>
              <div className="text-6xl font-extrabold uppercase tracking-[-0.08em] sm:text-7xl"><Counter value={stat.value} /></div>
              <p className="mt-4 font-mono text-xs font-bold uppercase tracking-[0.28em]">{stat.label}</p>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function CreativeStatement() {
  return (
    <section className="relative overflow-hidden bg-[#F4F4F5] px-4 py-24 text-neutral-950 sm:px-6 lg:px-12 lg:py-36" data-testid="home-creative-statement">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.65fr] lg:items-center">
        <div>
          <FadeUp className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-neutral-500">03 / PROOF</FadeUp>
          <SectionHeading light className="mt-5" lines={["THE CRAZY PART?", "WE ACTUALLY CARE ABOUT THE NUMBERS."]} />
          <FadeUp delay={0.2} className="mt-10 max-w-xl text-lg leading-relaxed text-neutral-700">
            <p>Reach is great. Followers are great. Likes are great.</p>
            <p className="mt-8 text-4xl font-extrabold uppercase leading-none tracking-[-0.06em] text-neutral-950 sm:text-6xl">DID THE BUSINESS GROW?</p>
            <p className="mt-8 font-semibold text-neutral-950">That's the metric we care about.</p>
          </FadeUp>
        </div>
        <ImageReveal src={images.hotel} alt="Boutique hotel architecture representing hospitality growth" className="clip-notch aspect-[4/5]" />
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <SEO title="Crazecation — We Make Brands Grow" description="Crazecation is a growth partner helping ambitious brands grow through strategy, creativity, digital marketing, performance and technology." />
      <Hero />
      <Intro />
      <ServicesIntro />
      <Why />
      <Approach />
      <ClientsMarquee />
      <Numbers />
      <CreativeStatement />
      <CTASection lines={["GOT A BRAND?", "LET'S MAKE IT BIGGER."]} copy="Whether you're launching, scaling, repositioning or simply stuck — let's figure out what's next." button="LET'S TALK" />
    </>
  );
}
