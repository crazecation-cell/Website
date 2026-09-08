import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useCms } from "../data/CmsContext";
import { CTASection, FadeUp, ImageReveal, PageHero, SectionHeading, SEO } from "../components/site/Animated";

function CaseCard({ project, index }) {
  return (
    <FadeUp delay={index * 0.06} className="group border border-neutral-800 bg-[#0A0A0A] transition-colors duration-300 hover:border-[#CCFF00]" testId={`client-case-${index + 1}`}>
      <div className="relative overflow-hidden">
        <ImageReveal src={project.image} alt={`Editable visual placeholder for ${project.name}`} className="aspect-[16/11]" imageClassName="grayscale group-hover:grayscale-0" />
        <div className="absolute left-4 top-4 bg-[#CCFF00] px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-950">EDITABLE PLACEHOLDER</div>
        <ArrowUpRight className="absolute bottom-4 right-4 h-8 w-8 bg-neutral-950 p-1.5 text-[#CCFF00] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      <div className="p-6 lg:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-3xl font-extrabold uppercase tracking-[-0.05em] text-neutral-50">{project.name}</h2>
          <span className="font-mono text-xs uppercase tracking-[0.24em] text-[#CCFF00]">{project.industry}</span>
        </div>
        <div className="mt-8 grid gap-px border border-neutral-800 bg-neutral-800 sm:grid-cols-2">
          <div className="bg-[#0A0A0A] p-5">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#CCFF00]">THE BRAND</h3>
            <p className="mt-3 text-sm leading-relaxed text-neutral-400">{project.name} / {project.industry}</p>
          </div>
          <div className="bg-[#0A0A0A] p-5">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#CCFF00]">THE CHALLENGE</h3>
            <p className="mt-3 text-sm leading-relaxed text-neutral-400">{project.challenge}</p>
          </div>
          <div className="bg-[#0A0A0A] p-5">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#CCFF00]">THE CRAZECATION MOVE</h3>
            <p className="mt-3 text-sm leading-relaxed text-neutral-400">{project.services} {project.approach}</p>
          </div>
          <div className="bg-[#0A0A0A] p-5">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#CCFF00]">THE RESULT</h3>
            <p className="mt-3 text-sm leading-relaxed text-neutral-400">{project.result}</p>
          </div>
        </div>
        <p className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-neutral-500">{project.links}</p>
      </div>
    </FadeUp>
  );
}

export default function Clients() {
  const { clientFilters, clients } = useCms();
  const [active, setActive] = useState("ALL");
  const filtered = useMemo(() => active === "ALL" ? clients : clients.filter((item) => item.category === active), [active, clients]);

  return (
    <>
      <SEO title="Our Work — Crazecation" description="Explore client growth stories and case studies across hospitality, fashion, e-commerce, and services." />
      <PageHero
        eyebrow="OUR WORK"
        lines={["PEOPLE WE'VE", "BUILT WITH."]}
        copy="Every brand has a different problem. Different audience. Different market. Different ambition. We don't believe in one-size-fits-all marketing."
      />
      <section className="bg-[#0A0A0A] px-4 py-20 sm:px-6 lg:px-12 lg:py-28" data-testid="clients-case-studies-section">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading eyebrow="CASE STUDY SYSTEM" lines={["REAL STORIES GO HERE.", "NO INVENTED HIGHLIGHT REELS."]} />
            <p className="max-w-sm text-sm leading-relaxed text-neutral-500">These premium slots are ready for Crazecation's real client names, images, services, links and verified results.</p>
          </div>

          <div className="mb-12 flex flex-wrap gap-2" aria-label="Filter projects by industry" data-testid="clients-industry-filters">
            {clientFilters.map((filter) => (
              <button
                key={filter}
                data-testid={`client-filter-${filter.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                type="button"
                onClick={() => setActive(filter)}
                className={`rounded-full border px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.18em] transition-colors duration-300 ${active === filter ? "border-[#CCFF00] bg-[#CCFF00] text-neutral-950" : "border-neutral-800 text-neutral-400 hover:border-[#CCFF00] hover:text-[#CCFF00]"}`}
              >
                {filter}
              </button>
            ))}
          </div>

          {filtered.length > 0 ? (
            <div className="grid gap-8 lg:grid-cols-2">
              {filtered.map((project, index) => <CaseCard key={project.id} project={project} index={index} />)}
            </div>
          ) : (
            <div className="border border-dashed border-neutral-800 p-12 text-center" data-testid="clients-empty-state">
              <p className="text-2xl font-extrabold uppercase tracking-[-0.04em] text-neutral-50">No published projects in {active} yet.</p>
              <p className="mt-4 text-neutral-500">Add real client data to activate this category.</p>
            </div>
          )}
        </div>
      </section>
      <CTASection lines={["YOUR BRAND", "COULD BE NEXT."]} copy="Have a challenge worth solving? Let's talk." button="START A CONVERSATION" />
    </>
  );
}
