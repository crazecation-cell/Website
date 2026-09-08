import { useCms } from "../data/CmsContext";
import { CTASection, FadeUp, ImageReveal, PageHero, SectionHeading, SEO } from "../components/site/Animated";

function Story() {
  return (
    <section className="bg-[#F4F4F5] px-4 py-24 text-neutral-950 sm:px-6 lg:px-12 lg:py-36" data-testid="about-story-section">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.35fr_0.65fr] lg:items-start">
        <FadeUp>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-neutral-500">01 / OUR STORY</p>
          <h2 className="mt-5 text-4xl font-extrabold uppercase leading-[0.9] tracking-[-0.06em] sm:text-6xl">CURIOUS MINDS. COMMERCIAL OUTCOMES.</h2>
        </FadeUp>
        <FadeUp delay={0.15} className="text-2xl leading-relaxed text-neutral-700 sm:text-3xl">
          <p>We bring strategy, creativity and performance under one roof to help brands grow.</p>
          <p className="mt-8">We're not interested in marketing for the sake of marketing.</p>
          <p className="mt-8 font-extrabold uppercase tracking-[-0.04em] text-neutral-950">We're interested in finding the opportunity, building the idea and making it happen.</p>
        </FadeUp>
      </div>
    </section>
  );
}

function Personality() {
  const { personality } = useCms();
  return (
    <section className="border-y border-neutral-800 bg-[#0A0A0A] px-4 py-24 sm:px-6 lg:px-12 lg:py-32" data-testid="about-personality-section">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="OUR PERSONALITY" lines={["FOUR THINGS.", "NO FLUFF."]} />
        <div className="mt-16 grid gap-px border border-neutral-800 bg-neutral-800 md:grid-cols-2 lg:grid-cols-4">
          {personality.map((item, index) => (
            <FadeUp key={item.title} delay={index * 0.07} className="group min-h-72 bg-[#0A0A0A] p-6 transition-colors duration-300 hover:bg-[#CCFF00]" testId={`personality-card-${index + 1}`}>
              <span className="font-mono text-xs tracking-[0.24em] text-[#CCFF00] group-hover:text-neutral-800">0{index + 1}</span>
              <h3 className="mt-20 text-3xl font-extrabold uppercase leading-none tracking-[-0.05em] text-neutral-50 group-hover:text-neutral-950">{item.title}</h3>
              <p className="mt-5 text-sm leading-relaxed text-neutral-400 group-hover:text-neutral-800">{item.text}</p>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function Belief() {
  return (
    <section className="relative overflow-hidden bg-[#0A0A0A] px-4 py-28 sm:px-6 lg:px-12 lg:py-40" data-testid="about-belief-section">
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-40 -translate-y-1/2 bg-[#CCFF00] opacity-10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl">
        <FadeUp>
          <h2 className="text-[clamp(3.5rem,9vw,9rem)] font-extrabold uppercase leading-[0.82] tracking-[-0.08em] text-neutral-50">
            <span className="block">GOOD BRANDS GET ATTENTION.</span>
            <span className="block text-neutral-600">GREAT BRANDS GET REMEMBERED.</span>
            <span className="block text-[#CCFF00]">GROWING BRANDS GET BOTH.</span>
          </h2>
        </FadeUp>
      </div>
    </section>
  );
}

function Approach() {
  const { images } = useCms();
  return (
    <section className="bg-[#F4F4F5] px-4 py-24 text-neutral-950 sm:px-6 lg:px-12 lg:py-36" data-testid="about-approach-section">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
        <ImageReveal src={images.studio} alt="Creative team directing a brand shoot" className="clip-notch aspect-[4/5]" />
        <div>
          <SectionHeading light eyebrow="OUR APPROACH" lines={["NO EGO.", "NO COOKIE-CUTTER STRATEGIES.", "JUST GOOD WORK."]} />
          <FadeUp delay={0.18} className="mt-8 max-w-xl text-lg leading-relaxed text-neutral-700">
            <p>Every brand is different.</p>
            <p className="mt-5">So we don't believe in copying what worked for someone else and hoping it works for you.</p>
            <p className="mt-5 font-semibold text-neutral-950">We look at your business, your audience, your market and your ambition — then build from there.</p>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

export default function About() {
  return (
    <>
      <SEO title="About Crazecation" description="A growth partner for ambitious brands combining strategy, creativity, and performance." />
      <PageHero
        eyebrow="ABOUT"
        lines={["WE'RE", "CRAZECATION."]}
        copy="A bunch of curious minds who believe brands shouldn't have to choose between being creative and being commercial."
      />
      <Story />
      <Personality />
      <Belief />
      <Approach />
      <CTASection lines={["LET'S DO", "SOMETHING CRAZY."]} copy="Have an idea? Have a problem? Have a brand that needs a push? We're listening." button="LET'S TALK" light />
    </>
  );
}
