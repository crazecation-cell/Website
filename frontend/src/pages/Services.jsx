import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { images, services } from "../data/content";
import { CTAButton } from "../components/site/Buttons";
import { CTASection, FadeUp, ImageReveal, PageHero, SectionHeading, SEO } from "../components/site/Animated";

function ServiceChapter({ service, index }) {
  const reversed = index % 2 === 1;
  const premium = service.premium;

  return (
    <section className={`border-b border-neutral-800 ${premium ? "bg-[#CCFF00] text-neutral-950" : "bg-[#0A0A0A] text-neutral-50"}`} data-testid={`service-section-${service.number}`}>
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-12 lg:py-32">
        <FadeUp className={reversed ? "lg:order-2" : ""}>
          <div className="mb-8 flex items-center gap-4">
            <span className={`font-mono text-sm tracking-[0.3em] ${premium ? "text-neutral-800" : "text-[#CCFF00]"}`}>{service.number}</span>
            {service.tag && <span className="bg-[#CCFF00] px-3 py-1 font-mono text-xs font-bold tracking-[0.2em] text-neutral-950">{service.tag}</span>}
          </div>
          <h2 className="text-4xl font-extrabold uppercase leading-[0.9] tracking-[-0.06em] sm:text-5xl lg:text-6xl">
            {service.headline.map((line) => <span className="block" key={line}>{line}</span>)}
          </h2>
          <p className={`mt-8 max-w-xl text-lg leading-relaxed ${premium ? "text-neutral-800" : "text-neutral-400"}`}>{service.body}</p>
          <ul className="mt-10 grid gap-px border border-current/20 bg-current/20 sm:grid-cols-2" data-testid={`service-${service.number}-capabilities`}>
            {service.items.map((item) => (
              <li key={item} className={`${premium ? "bg-[#CCFF00]" : "bg-[#0A0A0A]"} p-4 text-sm font-semibold uppercase tracking-[0.12em]`}>{item}</li>
            ))}
          </ul>
          {premium && (
            <Link data-testid="growth-partnership-build-button" to="/contact" className="group mt-10 inline-flex min-h-12 items-center gap-3 rounded-full bg-neutral-950 px-6 text-sm font-extrabold uppercase tracking-[0.16em] text-[#CCFF00] transition-colors duration-300 hover:bg-neutral-800">
              LET'S BUILD <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>
          )}
        </FadeUp>
        <FadeUp delay={0.15} className={reversed ? "lg:order-1" : ""}>
          <div className="relative">
            <ImageReveal src={service.image} alt={`${service.name} visual`} className={`aspect-[4/5] ${premium ? "border-[12px] border-neutral-950" : "clip-notch"}`} imageClassName={premium ? "grayscale" : ""} />
            <div className={`absolute -bottom-5 ${reversed ? "-right-3" : "-left-3"} px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.24em] ${premium ? "bg-neutral-950 text-[#CCFF00]" : "bg-[#CCFF00] text-neutral-950"}`}>
              {service.name}
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

function ServicesIndex() {
  return (
    <section className="border-b border-neutral-800 bg-[#121212] px-4 py-16 sm:px-6 lg:px-12" data-testid="services-index-section">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="THE SYSTEM" lines={["PICK A LANE.", "OR BUILD THE WHOLE ENGINE."]} />
        <div className="mt-12 grid gap-px border border-neutral-800 bg-neutral-800 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <a key={service.number} data-testid={`services-index-${service.number}-link`} href={`#service-${service.number}`} className="group bg-[#121212] p-5 transition-colors duration-300 hover:bg-[#CCFF00] hover:text-neutral-950">
              <span className="font-mono text-xs tracking-[0.24em] text-[#CCFF00] group-hover:text-neutral-800">{service.number}</span>
              <span className="mt-3 block text-xl font-extrabold uppercase tracking-[-0.04em]">{service.name}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function IndustriesBand() {
  return (
    <section className="overflow-hidden bg-[#F4F4F5] py-10 text-neutral-950" data-testid="services-industries-marquee">
      <div className="marquee">
        <div className="marquee-track fast">
          {Array.from({ length: 2 }).map((_, outer) => (
            <div key={outer} className="flex shrink-0 items-center">
              {["HOSPITALITY", "FASHION", "FOOD", "E-COMMERCE", "LIFESTYLE", "TECHNOLOGY", "SERVICES"].map((item) => (
                <span key={`${outer}-${item}`} className="mx-6 text-4xl font-extrabold uppercase tracking-[-0.06em] sm:text-6xl">{item}<span className="ml-12 text-[#CCFF00]">/</span></span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Services() {
  return (
    <>
      <SEO title="Services — Crazecation" description="From brand strategy and performance marketing to website development and specialized OTA management." />
      <PageHero
        eyebrow="SERVICES"
        lines={["WE TURN IDEAS", "INTO GROWTH."]}
        copy="From strategy and branding to websites, content and performance — we bring together everything a brand needs to build attention, create demand and grow."
      >
        <FadeUp delay={0.55} className="mt-10">
          <CTAButton to="/contact" testId="services-hero-talk-button">LET'S TALK</CTAButton>
        </FadeUp>
      </PageHero>
      <ServicesIndex />
      <IndustriesBand />
      <div>
        {services.map((service, index) => (
          <div id={`service-${service.number}`} key={service.number}>
            <ServiceChapter service={service} index={index} />
          </div>
        ))}
      </div>
      <section className="bg-[#0A0A0A] px-4 py-24 sm:px-6 lg:px-12" data-testid="services-strategy-note">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.35fr_1fr]">
          <FadeUp className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-[#CCFF00]">SPECIALIZED, NOT SILOED</FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="max-w-4xl text-3xl font-extrabold uppercase leading-[0.95] tracking-[-0.05em] text-neutral-50 sm:text-5xl">OTA Management is one sharp tool in a much bigger growth system.</h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-400">Hospitality is one of the industries we work with. The rest of the Crazecation engine stays industry-fluid: strategy, creativity, performance, content and technology.</p>
          </FadeUp>
        </div>
      </section>
      <CTASection lines={["WHAT'S YOUR", "NEXT MOVE?"]} copy="Tell us where your brand is today. We'll help you figure out where it could go." button="LET'S TALK" light />
      <img src={images.product} alt="Crazecation product and brand visual" className="hidden" />
    </>
  );
}
