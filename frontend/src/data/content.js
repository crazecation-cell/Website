export const images = {
  fashion: "https://images.unsplash.com/photo-1760337741510-1a4661e036fa?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMGFnZW5jeSUyMGhpZ2glMjBmYXNoaW9uJTIwYXJjaGl0ZWN0dXJlJTIwYnJhbmQlMjBjYW1wYWlnbiUyMHN0dWRpb3xlbnwwfHx8fDE3ODgzNTExMzh8MA&ixlib=rb-4.1.0&q=85",
  studio: "https://images.unsplash.com/photo-1759308553474-ce2c768a6b7c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHw0fHxjcmVhdGl2ZSUyMGFnZW5jeSUyMGhpZ2glMjBmYXNoaW9uJTIwYXJjaGl0ZWN0dXJlJTIwYnJhbmQlMjBjYW1wYWlnbiUyMHN0dWRpb3xlbnwwfHx8fDE3ODgzNTExMzh8MA&ixlib=rb-4.1.0&q=85",
  hotel: "https://images.unsplash.com/photo-1781736363506-d3840bfcb138?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHw0fHxsdXh1cnklMjBib3V0aXF1ZSUyMGhvdGVsJTIwcmVzb3J0JTIwYXJjaGl0ZWN0dXJlJTIwZGVzaWdufGVufDB8fHx8MTc4ODM1MTE0NXww&ixlib=rb-4.1.0&q=85",
  product: "https://images.unsplash.com/photo-1773070309549-8123488410d7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxNzV8MHwxfHNlYXJjaHw0fHxtaW5pbWFsaXN0JTIwYnJhbmQlMjBwYWNrYWdpbmclMjBtb2Rlcm4lMjBwcm9kdWN0JTIwZGVzaWdufGVufDB8fHx8MTc4ODM1MTE0NXww&ixlib=rb-4.1.0&q=85",
  resort: "https://images.unsplash.com/photo-1650965171703-087486b3a1b0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBib3V0aXF1ZSUyMGhvdGVsJTIwcmVzb3J0JTIwYXJjaGl0ZWN0dXJlJTIwZGVzaWdufGVufDB8fHx8MTc4ODM1MTE0NXww&ixlib=rb-4.1.0&q=85",
  apparel: "https://images.unsplash.com/photo-1760337934036-83d1dd595378?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwyfHxjcmVhdGl2ZSUyMGFnZW5jeSUyMGhpZ2glMjBmYXNoaW9uJTIwYXJjaGl0ZWN0dXJlJTIwYnJhbmQlMjBjYW1wYWlnbiUyMHN0dWRpb3xlbnwwfHx8fDE3ODgzNTExMzh8MA&ixlib=rb-4.1.0&q=85",
  food: "https://images.unsplash.com/photo-1767721887917-ad186b3f5f2d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxNzV8MHwxfHNlYXJjaHwyfHxtaW5pbWFsaXN0JTIwYnJhbmQlMjBwYWNrYWdpbmclMjBtb2Rlcm4lMjBwcm9kdWN0JTIwZGVzaWdufGVufDB8fHx8MTc4ODM1MTE0NXww&ixlib=rb-4.1.0&q=85",
  care: "https://images.unsplash.com/photo-1786457166579-92da3f9a23b8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxNzV8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYnJhbmQlMjBwYWNrYWdpbmclMjBtb2Rlcm4lMjBwcm9kdWN0JTIwZGVzaWdufGVufDB8fHx8MTc4ODM1MTE0NXww&ixlib=rb-4.1.0&q=85",
};

export const navItems = [
  { label: "HOME", path: "/" },
  { label: "SERVICES", path: "/services" },
  { label: "CLIENTS", path: "/clients" },
  { label: "ABOUT", path: "/about" },
];

export const services = [
  {
    number: "01",
    name: "BRAND STRATEGY",
    short: "Find your position. Define your voice. Build your identity.",
    headline: ["KNOW WHERE YOU'RE GOING", "BEFORE YOU START MOVING."],
    body: "We help brands understand where they stand, where they can go and how to get there.",
    items: ["Brand Positioning", "Market Research", "Competitor Analysis", "Brand Voice", "Communication Strategy", "Go-To-Market Strategy"],
    image: images.product,
  },
  {
    number: "02",
    name: "SOCIAL MEDIA",
    short: "Turn your social presence into something people actually want to follow.",
    headline: ["DON'T JUST HAVE A SOCIAL MEDIA PAGE.", "BUILD A SOCIAL BRAND."],
    body: "We turn social channels into brands people recognize, follow and remember.",
    items: ["Social Media Strategy", "Content Strategy", "Content Creation", "Reels", "Community Management", "Social Media Growth", "Content Planning", "Performance Analysis"],
    image: images.studio,
  },
  {
    number: "03",
    name: "PERFORMANCE MARKETING",
    short: "Put your brand in front of the right people — and turn attention into action.",
    headline: ["ATTENTION IS GOOD.", "CONVERSIONS ARE BETTER."],
    body: "We build campaigns around intent, action and measurable business movement.",
    items: ["Meta Ads", "Google Ads", "Lead Generation", "E-commerce Advertising", "Retargeting", "Campaign Optimisation", "Performance Analytics"],
    image: images.care,
  },
  {
    number: "04",
    name: "CREATIVE & CONTENT",
    short: "Ideas, campaigns and content designed to make people stop, look and remember.",
    headline: ["IDEAS PEOPLE REMEMBER."],
    body: "We create campaigns and content that make people stop, look and remember.",
    items: ["Creative Campaigns", "Brand Films", "Reels", "Photography", "Graphic Design", "Copywriting", "Campaign Concepts", "Creative Direction"],
    image: images.fashion,
  },
  {
    number: "05",
    name: "WEBSITE DEVELOPMENT",
    short: "Modern websites built to communicate, convert and grow with your brand.",
    headline: ["YOUR WEBSITE IS YOUR DIGITAL STOREFRONT.", "MAKE IT COUNT."],
    body: "We design and develop modern, high-performing websites that don't just look good — they are built to communicate, convert and grow with your brand.",
    items: ["Business Websites", "Landing Pages", "E-commerce Websites", "UI/UX Design", "Conversion-Focused Design", "Website Development", "Website Optimisation"],
    image: images.product,
  },
  {
    number: "06",
    name: "INFLUENCER MARKETING",
    short: "Connect your brand with creators, communities and audiences that matter.",
    headline: ["PEOPLE TRUST PEOPLE."],
    body: "We connect brands with the right creators, communities and audiences to create authentic conversations around your brand.",
    items: ["Influencer Strategy", "Creator Discovery", "Campaign Planning", "Creator Management", "Campaign Execution", "Performance Tracking"],
    image: images.studio,
  },
  {
    number: "07",
    name: "DIGITAL GROWTH",
    short: "Build. Test. Optimise. Scale.",
    headline: ["BUILD.", "TEST.", "OPTIMISE.", "SCALE."],
    body: "We look at the entire digital journey — from discovery to conversion — and identify where your brand can grow.",
    items: ["Digital Strategy", "Customer Journey", "Conversion Optimisation", "Analytics", "Growth Strategy", "Digital Campaigns"],
    image: images.care,
  },
  {
    number: "08",
    name: "OTA MANAGEMENT",
    short: "A specialized growth service for hotels looking to improve their OTA visibility, performance and revenue.",
    headline: ["FOR HOTELS THAT WANT MORE", "THAN JUST BOOKINGS."],
    body: "We help hotels improve their OTA presence, visibility and revenue through smarter management and optimisation.",
    items: ["OTA Profile Optimisation", "Listing & Content Optimisation", "Pricing & Promotion Strategy", "Visibility Optimisation", "OTA Performance Monitoring", "Revenue Growth Strategy"],
    tag: "HOSPITALITY",
    image: images.hotel,
  },
  {
    number: "09",
    name: "GROWTH PARTNERSHIP",
    short: "Don't hire an agency. Add a growth team.",
    headline: ["DON'T HIRE AN AGENCY.", "ADD A GROWTH TEAM."],
    body: "For brands that want Crazecation to work as an extension of their business.",
    items: ["Strategy", "Marketing", "Creative", "Performance", "Growth"],
    premium: true,
    image: images.fashion,
  },
];

export const stats = [
  { value: "20+", label: "Brands" },
  { value: "Multiple", label: "Industries" },
  { value: "100%", label: "Obsessed With Growth" },
];

export const approach = [
  { number: "01", title: "THINK", text: "Understand the brand, the market, the customer and the opportunity." },
  { number: "02", title: "CREATE", text: "Turn insights into ideas people actually care about." },
  { number: "03", title: "EXECUTE", text: "Launch, test, optimise and keep moving." },
  { number: "04", title: "GROW", text: "Measure what matters. Double down on what works." },
];

export const personality = [
  { title: "WE'RE CURIOUS.", text: "We question everything." },
  { title: "WE'RE CREATIVE.", text: "We look for the idea others haven't." },
  { title: "WE'RE DATA-DRIVEN.", text: "We measure what matters." },
  { title: "WE'RE OBSESSED WITH GROWTH.", text: "Because that's ultimately why we're here." },
];

export const clientFilters = ["ALL", "HOSPITALITY", "FASHION", "LIFESTYLE", "FOOD", "E-COMMERCE", "SERVICES", "OTHER"];

export const placeholderCases = [
  {
    id: "case-slot-01",
    name: "CLIENT NAME",
    industry: "ADD INDUSTRY",
    category: null,
    challenge: "Replace this with the real business challenge.",
    services: "Add the services provided.",
    approach: "Add the Crazecation move.",
    result: "Add the verified result.",
    links: "Add website / social links.",
    image: images.resort,
  },
  {
    id: "case-slot-02",
    name: "CLIENT NAME",
    industry: "ADD INDUSTRY",
    category: null,
    challenge: "Replace this with the real business challenge.",
    services: "Add the services provided.",
    approach: "Add the Crazecation move.",
    result: "Add the verified result.",
    links: "Add website / social links.",
    image: images.apparel,
  },
  {
    id: "case-slot-03",
    name: "CLIENT NAME",
    industry: "ADD INDUSTRY",
    category: null,
    challenge: "Replace this with the real business challenge.",
    services: "Add the services provided.",
    approach: "Add the Crazecation move.",
    result: "Add the verified result.",
    links: "Add website / social links.",
    image: images.food,
  },
  {
    id: "case-slot-04",
    name: "CLIENT NAME",
    industry: "ADD INDUSTRY",
    category: null,
    challenge: "Replace this with the real business challenge.",
    services: "Add the services provided.",
    approach: "Add the Crazecation move.",
    result: "Add the verified result.",
    links: "Add website / social links.",
    image: images.care,
  },
];

export const marqueeSlots = ["CLIENT SLOT 01", "CLIENT SLOT 02", "CLIENT SLOT 03", "CLIENT SLOT 04", "CLIENT SLOT 05", "CLIENT SLOT 06"];

export const contactServices = [
  "Brand Strategy",
  "Social Media",
  "Performance Marketing",
  "Creative & Content",
  "Website Development",
  "Influencer Marketing",
  "Digital Growth",
  "OTA Management",
  "Complete Growth Partnership",
  "Something Else",
];

export const socialLinks = [
  { label: "Instagram", url: "https://instagram.com/" },
  { label: "LinkedIn", url: "https://linkedin.com/" },
  { label: "Facebook", url: "https://facebook.com/" },
];
