import { useState } from "react";
import { ArrowRight, CheckCircle2, Mail, MessageCircle } from "lucide-react";
import { contactServices } from "../data/content";
import { FadeUp, PageHero, SEO } from "../components/site/Animated";

const CONTACT_EMAIL = "crazecation@gmail.com";
const WHATSAPP_NUMBER = "918209665356";

const initialForm = {
  name: "",
  brand: "",
  email: "",
  phone: "",
  service: "Brand Strategy",
  message: "",
};

function Field({ label, htmlFor, children }) {
  return (
    <div className="grid gap-3">
      <label htmlFor={htmlFor} className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-neutral-400">{label}</label>
      {children}
    </div>
  );
}

function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = (event) => {
    event.preventDefault();
    const subject = `New enquiry from ${form.name} — ${form.brand}`;
    const body = [
      `Name: ${form.name}`,
      `Brand / Company: ${form.brand}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone}`,
      `Needs help with: ${form.service}`,
      "",
      "About the brand:",
      form.message,
    ].join("\n");
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus("success");
  };

  if (status === "success") {
    return (
      <FadeUp className="flex min-h-[560px] flex-col items-start justify-center border border-[#CCFF00] bg-[#0A0A0A] p-8 lg:p-12" testId="contact-success-message">
        <CheckCircle2 className="mb-8 h-14 w-14 text-[#CCFF00]" />
        <h2 className="text-5xl font-extrabold uppercase tracking-[-0.06em] text-neutral-50 sm:text-7xl">WE GOT IT.</h2>
        <p className="mt-6 text-xl text-neutral-400">Your email draft is open — hit send and we'll get back to you soon.</p>
        <button
          data-testid="send-another-enquiry-button"
          type="button"
          onClick={() => { setForm(initialForm); setStatus("idle"); }}
          className="mt-10 rounded-full border border-neutral-700 px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-neutral-50 transition-colors duration-300 hover:border-[#CCFF00] hover:text-[#CCFF00]"
        >
          Send another enquiry
        </button>
      </FadeUp>
    );
  }

  return (
    <form onSubmit={submit} className="border border-neutral-800 bg-[#0A0A0A] p-6 sm:p-8 lg:p-10" data-testid="contact-enquiry-form">
      <div className="grid gap-8 sm:grid-cols-2">
        <Field label="YOUR NAME" htmlFor="name">
          <input data-testid="contact-name-input" id="name" name="name" value={form.name} onChange={update} required minLength="2" autoComplete="name" className="editorial-input" placeholder="Your name" />
        </Field>
        <Field label="BRAND / COMPANY" htmlFor="brand">
          <input data-testid="contact-brand-input" id="brand" name="brand" value={form.brand} onChange={update} required minLength="2" autoComplete="organization" className="editorial-input" placeholder="Brand or company" />
        </Field>
        <Field label="EMAIL" htmlFor="email">
          <input data-testid="contact-email-input" id="email" name="email" type="email" value={form.email} onChange={update} required autoComplete="email" className="editorial-input" placeholder="you@brand.com" />
        </Field>
        <Field label="PHONE" htmlFor="phone">
          <input data-testid="contact-phone-input" id="phone" name="phone" type="tel" value={form.phone} onChange={update} required minLength="5" autoComplete="tel" className="editorial-input" placeholder="+91" />
        </Field>
      </div>
      <div className="mt-8">
        <Field label="WHAT DO YOU NEED HELP WITH?" htmlFor="service">
          <select data-testid="contact-service-select" id="service" name="service" value={form.service} onChange={update} className="editorial-input">
            {contactServices.map((service) => <option key={service} value={service}>{service}</option>)}
          </select>
        </Field>
      </div>
      <div className="mt-8">
        <Field label="TELL US ABOUT YOUR BRAND" htmlFor="message">
          <textarea data-testid="contact-message-textarea" id="message" name="message" value={form.message} onChange={update} required minLength="10" rows="7" className="editorial-input resize-none" placeholder="Where are you now? Where do you want to go?" />
        </Field>
      </div>
      <button
        data-testid="contact-submit-button"
        type="submit"
        className="group mt-10 inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-[#CCFF00] px-8 text-sm font-extrabold uppercase tracking-[0.18em] text-neutral-950 transition-colors duration-300 hover:bg-neutral-50 sm:w-auto"
      >
        SEND IT
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
      </button>
    </form>
  );
}

export default function Contact() {
  return (
    <>
      <SEO title="Let's Talk — Crazecation" description="Get in touch with Crazecation to start your brand growth journey." />
      <PageHero
        eyebrow="CONTACT"
        lines={["LET'S TALK", "GROWTH."]}
        copy="Have a brand that's ready for its next move? Tell us a little about it."
      />
      <section className="bg-[#0A0A0A] px-4 py-20 sm:px-6 lg:px-12 lg:py-28" data-testid="contact-page-section">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.35fr_0.65fr]">
          <FadeUp>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-[#CCFF00]">START HERE</p>
            <h2 className="mt-5 text-4xl font-extrabold uppercase leading-[0.9] tracking-[-0.06em] text-neutral-50 sm:text-5xl">Give us the brief. Messy is fine.</h2>
            <div className="mt-10 border-l-2 border-[#CCFF00] pl-6 text-neutral-400">
              <p className="text-lg font-semibold text-neutral-50">NOT READY FOR A MEETING?</p>
              <p className="mt-4">That's okay.</p>
              <p className="mt-2">Tell us what you're working on and we'll take it from there.</p>
            </div>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row lg:flex-col">
              <a
                data-testid="contact-email-link"
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Let's talk growth")}`}
                className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#CCFF00] px-6 text-sm font-extrabold uppercase tracking-[0.16em] text-neutral-950 transition-colors duration-300 hover:bg-neutral-50"
              >
                <Mail className="h-4 w-4" /> EMAIL US
              </a>
              <a
                data-testid="contact-whatsapp-link"
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi Crazecation — let's talk growth.")}`}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-neutral-700 px-6 text-sm font-extrabold uppercase tracking-[0.16em] text-neutral-50 transition-colors duration-300 hover:border-[#CCFF00] hover:text-[#CCFF00]"
              >
                <MessageCircle className="h-4 w-4" /> WHATSAPP US
              </a>
            </div>
          </FadeUp>
          <FadeUp delay={0.12}>
            <ContactForm />
          </FadeUp>
        </div>
      </section>
    </>
  );
}
