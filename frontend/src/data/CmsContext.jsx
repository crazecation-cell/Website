import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  approach as defaultApproach,
  clientFilters,
  contactServices as defaultContactServices,
  images as defaultImages,
  marqueeSlots as defaultMarqueeSlots,
  personality as defaultPersonality,
  placeholderCases,
  services as defaultServices,
  socialLinks as defaultSocialLinks,
  stats as defaultStats,
} from "./content";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const defaults = {
  images: defaultImages,
  stats: defaultStats,
  marqueeSlots: defaultMarqueeSlots,
  approach: defaultApproach,
  personality: defaultPersonality,
  contactServices: defaultContactServices,
  socialLinks: defaultSocialLinks,
  services: defaultServices,
  clients: placeholderCases,
  clientFilters,
  testimonials: [],
  cmsConfigured: false,
  cmsLoading: true,
};

const CmsContext = createContext(defaults);

function normalizeService(item) {
  return {
    ...item,
    image: item.image || item.image_url,
    premium: Boolean(item.premium || item.tag === "PREMIUM" || item.name === "GROWTH PARTNERSHIP"),
  };
}

function normalizeClient(item) {
  return {
    ...item,
    services: item.services || item.services_provided,
    image: item.image || item.image_url,
    links: item.links || [item.website_url, item.social_url].filter(Boolean).join(" / ") || "Add website / social links.",
  };
}

export function CmsProvider({ children }) {
  const [remote, setRemote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    fetch(`${API}/cms/public`)
      .then((response) => response.ok ? response.json() : null)
      .then((payload) => { if (!ignore) setRemote(payload); })
      .catch(() => { if (!ignore) setRemote(null); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, []);

  const value = useMemo(() => {
    const content = remote?.content || {};
    const home = content.home || {};
    const about = content.about || {};
    const site = content.site || {};
    return {
      images: home.images || defaultImages,
      stats: home.stats || defaultStats,
      marqueeSlots: home.marqueeSlots || defaultMarqueeSlots,
      approach: home.approach || defaultApproach,
      personality: about.personality || defaultPersonality,
      contactServices: site.contactServices || defaultContactServices,
      socialLinks: site.socialLinks || defaultSocialLinks,
      services: (remote?.services?.length ? remote.services : defaultServices).map(normalizeService),
      clients: (remote?.clients?.length ? remote.clients : placeholderCases).map(normalizeClient),
      clientFilters,
      testimonials: remote?.testimonials || [],
      siteContent: content,
      cmsConfigured: Boolean(remote?.configured),
      cmsLoading: loading,
    };
  }, [remote, loading]);

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}

export function useCms() {
  return useContext(CmsContext);
}
