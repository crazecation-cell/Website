import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { navItems } from "../../data/content";

export function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-md"
      initial={{ y: -72, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      data-testid="site-header"
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-12">
        <Link data-testid="brand-logo-link" to="/" className="group flex items-center gap-2 text-lg font-extrabold tracking-[-0.04em] text-neutral-50">
          <span>CRAZECATION</span>
          <span className="h-2 w-2 rounded-full bg-[#CCFF00] transition-transform duration-300 group-hover:scale-150" />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary navigation" data-testid="desktop-navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              data-testid={`nav-${item.label.toLowerCase()}-link`}
              to={item.path}
              className={({ isActive }) => `relative text-xs font-bold uppercase tracking-[0.22em] transition-colors duration-300 ${isActive ? "text-[#CCFF00]" : "text-neutral-400 hover:text-neutral-50"}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link
            data-testid="nav-lets-talk-button"
            to="/contact"
            className="group inline-flex items-center gap-2 rounded-full bg-[#CCFF00] px-5 py-3 text-xs font-extrabold uppercase tracking-[0.18em] text-neutral-950 transition-colors duration-300 hover:bg-neutral-50"
          >
            LET'S TALK
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>

        <button
          data-testid="mobile-menu-toggle"
          type="button"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-neutral-700 text-neutral-50 transition-colors duration-300 hover:border-[#CCFF00] hover:text-[#CCFF00] lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="border-t border-neutral-800 bg-neutral-950 px-4 py-6 lg:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            data-testid="mobile-navigation-panel"
          >
            <nav className="flex flex-col gap-2" aria-label="Mobile navigation">
              {navItems.map((item, index) => (
                <motion.div key={item.path} initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
                  <NavLink
                    data-testid={`mobile-nav-${item.label.toLowerCase()}-link`}
                    to={item.path}
                    className={({ isActive }) => `block border-b border-neutral-900 py-4 text-2xl font-extrabold uppercase tracking-[-0.04em] ${isActive ? "text-[#CCFF00]" : "text-neutral-50"}`}
                  >
                    {item.label}
                  </NavLink>
                </motion.div>
              ))}
              <Link
                data-testid="mobile-nav-lets-talk-button"
                to="/contact"
                className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#CCFF00] px-6 text-sm font-extrabold uppercase tracking-[0.16em] text-neutral-950"
              >
                LET'S TALK <ArrowRight className="h-4 w-4" />
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
