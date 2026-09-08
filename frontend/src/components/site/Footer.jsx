import { Link } from "react-router-dom";
import { navItems } from "../../data/content";
import { useCms } from "../../data/CmsContext";

export function Footer() {
  const { socialLinks } = useCms();
  return (
    <footer className="border-t border-neutral-800 bg-[#070707] px-4 py-14 text-neutral-50 sm:px-6 lg:px-12" data-testid="site-footer">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 border-b border-neutral-800 pb-12 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <Link data-testid="footer-brand-link" to="/" className="text-3xl font-extrabold uppercase tracking-[-0.06em]">
              CRAZECATION<span className="text-[#CCFF00]">.</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm uppercase tracking-[0.18em] text-neutral-400">WE MAKE BRANDS GROW.</p>
            <p className="mt-8 font-mono text-xs uppercase tracking-[0.24em] text-[#CCFF00]">Strategy. Creativity. Performance. Growth.</p>
          </div>
          <div>
            <h2 className="mb-5 font-mono text-xs uppercase tracking-[0.28em] text-neutral-500">Navigation</h2>
            <nav className="grid gap-3" aria-label="Footer navigation">
              {[...navItems, { label: "CONTACT", path: "/contact" }].map((item) => (
                <Link key={item.path} data-testid={`footer-${item.label.toLowerCase()}-link`} to={item.path} className="text-sm font-semibold uppercase tracking-[0.14em] text-neutral-300 transition-colors duration-300 hover:text-[#CCFF00]">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div>
            <h2 className="mb-5 font-mono text-xs uppercase tracking-[0.28em] text-neutral-500">Social</h2>
            <div className="grid gap-3">
              {socialLinks.map((item) => (
                <a key={item.label} data-testid={`footer-${item.label.toLowerCase()}-link`} href={item.url} target="_blank" rel="noreferrer" className="text-sm font-semibold uppercase tracking-[0.14em] text-neutral-300 transition-colors duration-300 hover:text-[#CCFF00]">
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 pt-8 text-xs uppercase tracking-[0.18em] text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Crazecation. All rights reserved.</p>
          <p>Built for ambitious brands.</p>
        </div>
      </div>
    </footer>
  );
}
